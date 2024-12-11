const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Redis = require('ioredis');
const AWS = require('aws-sdk');

const app = express();
const server = http.createServer(app);

const redisSubscriber = new Redis({
    host: '172.31.42.236', 
    port: 6379,
});

const redisPublisher = new Redis({
    host: '172.31.42.236', 
    port: 6379,
});

const io = new Server(server, {
    cors: {
        origin: ["http://18.175.138.149:3000", "http://13.40.98.216:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

AWS.config.update({ region: 'eu-west-2' });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'WhiteboardStates';

const saveStateToDynamoDB = async (data) => {
    const params = {
        TableName: TABLE_NAME,
        Item: {
            SessionID: 'global-session',
            WhiteboardData: data,
        },
    };
    try {
        await dynamoDB.put(params).promise();
        console.log('Canvas state saved to DynamoDB');
    } catch (error) {
        console.error('Error saving state to DynamoDB:', error);
    }
};

const getStateFromDynamoDB = async () => {
    const params = {
        TableName: TABLE_NAME,
        Key: { SessionID: 'global-session' },
    };
    try {
        const result = await dynamoDB.get(params).promise();
        if (result.Item && Array.isArray(result.Item.WhiteboardData)) {
            return result.Item.WhiteboardData;
        }
        console.error('Invalid data format in DynamoDB');
        return [];
    } catch (error) {
        console.error('Error retrieving state from DynamoDB:', error);
        return [];
    }
};

io.on('connection', async (socket) => {
    console.log('New WebSocket connection established');
    const currentState = await getStateFromDynamoDB();
    if (currentState && currentState.length > 0) {
        socket.emit('initCanvas', currentState);
    }

    socket.on('collabdata', async (data) => {
        console.log('Received drawing data:', data);
        socket.broadcast.emit('collabdata', data);
        redisPublisher.publish('whiteboard', JSON.stringify(data));
        const currentState = await getStateFromDynamoDB();
        const updatedState = [...currentState, data];
        await saveStateToDynamoDB(updatedState);
    });
});

redisSubscriber.subscribe('whiteboard');
redisSubscriber.on('message', async (channel, message) => {
    if (channel === 'whiteboard') {
        const data = JSON.parse(message);
        io.emit('collabdata', data);
        const currentState = await getStateFromDynamoDB();
        const updatedState = [...currentState, data];
        await saveStateToDynamoDB(updatedState);
    }
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
