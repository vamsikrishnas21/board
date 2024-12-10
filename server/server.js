const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const AWS = require('aws-sdk');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

AWS.config.update({ region: 'eu-west-2' }); 
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'WhiteboardStates';

let currentDrawing = null;

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
        console.log('State saved to DynamoDB');
    } catch (error) {
        console.error('Error saving state:', error);
    }
};

const getStateFromDynamoDB = async () => {
    const params = {
        TableName: TABLE_NAME,
        Key: { SessionID: 'global-session' },
    };
    console.log('Fetching state from DynamoDB with params:', params);
    try {
        const result = await dynamoDB.get(params).promise();
        console.log('State retrieved:', result);
        return result.Item ? result.Item.WhiteboardData : null;
    } catch (error) {
        console.error('Error retrieving state:', error);
        return null;
    }
};

io.on('connection', async (socket) => {
    console.log('Connection established');
    const state = await getStateFromDynamoDB();
    if (state) {
        socket.emit('collabdata', state);
    }

    socket.on('collabdata', (data) => {
        currentDrawing = data; 
        saveStateToDynamoDB(data); 
        socket.broadcast.emit('collabdata', data); 
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
