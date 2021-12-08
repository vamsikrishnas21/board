import React from 'react';
import io from 'socket.io-client';
import './style.css';
class Whiteboard extends React.Component{
    timeout;
    socket = io.connect("http://localhost:3000");
    collabctx;
    constructor(props){
        super(props);
        this.socket.on("collabdata", function(data){
            var image = new Image();
            var collabcanvas = document.querySelector('#whiteboard');
            var collabctx = collabcanvas.getContext('2d');
            image.onload = function(){
                collabctx.drawImage(image, 0, 0);
            };
            image.src = data;
        })
    
    }
    componentDidMount(){
        this.drawOnBoard();
    }
    componentWillReceiveProps(newProps) {
        this.collabctx.strokeStyle = newProps.color;
        this.collabctx.lineWidth = newProps.size;
    }
    
    drawOnBoard(){
        var collabcanvas = document.querySelector('#whiteboard');
        var collabtxt = collabcanvas.getContext("2d");
        var mouseX=0;
        var mouseY=0;
    this.collabctx = collabcanvas.getContext('2d');
        var collabctx = this.collabctx;
    var draw = document.querySelector('#sketch');
    var draw_style = getComputedStyle(draw);
    collabcanvas.width = parseInt(draw_style.getPropertyValue('width'));
    collabcanvas.height = parseInt(draw_style.getPropertyValue('height'));

    var mouse = {x: 0, y: 0};
    var l_mouse = {x: 0, y: 0};
    var initialX = 0;

    collabcanvas.addEventListener('mousemove',function(e) {
        l_mouse.x = mouse.x;
        l_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    }, false);
    var undoWords=[];
    var previousChars=[];
    function currentState(){
        undoWords.push(collabcanvas.toDataURL());
    }
    currentState();
    function del(){
        undoWords.pop();
        var imageData = undoWords[undoWords.length-1];
        var image = new Image();
        image.src = imageData;
        image.onload=function(){
            collabtxt.clearRect(0,0,collabcanvas.width,collabcanvas.height);
            collabtxt.drawImage(image,0,0,collabcanvas.width,collabcanvas.height,0,0,collabcanvas.width,collabcanvas.height);
        };
    }
    collabcanvas.addEventListener("click", function(e){
        mouseX=e.pageX - collabcanvas.offsetLeft;
        mouseY=e.pageY - collabcanvas.offsetTop;
        initialX=mouseX;
        previousChars=[];
        return false
    }, false);

    document.addEventListener("keydown", function(e){
        collabtxt.font = "18px Arial";
        if(e.keyCode === 8){
            del();
        var previousChar=previousChars[previousChars.lenght-1];
        mouseX -= collabtxt.measureText(previousChar).width;
        previousChars.pop();
        }
        else if(e.keyCode===13){
            mouseX=initialX;
            mouseY+=20;
        }
        else{
        collabtxt.fillText(e.key, mouseX, mouseY);
        mouseX += collabtxt.measureText(e.key).width;
        currentState();
        previousChars.push();
        }      
    }, false);
    collabctx.lineWidth = this.props.size;
    collabctx.lineJoin = 'round';
    collabctx.lineCap = 'round';
    collabctx.strokeStyle = this.props.color;

    collabcanvas.addEventListener('mousedown', function(e) {
        collabcanvas.addEventListener('mousemove', onPaint, false);
    }, false);

    collabcanvas.addEventListener('mouseup', function() {
        collabcanvas.removeEventListener('mousemove', onPaint, false);
    }, false);

    var rt = this;
    var onPaint = function() {
        collabctx.beginPath();
        collabctx.moveTo(l_mouse.x, l_mouse.y);
        collabctx.lineTo(mouse.x, mouse.y);
        collabctx.closePath();
        collabctx.stroke();
        if(rt.timeout !== undefined) clearTimeout(rt.timeout);
        rt.timeout = setTimeout(function(){
            var base64ImageData = collabcanvas.toDataURL("image/png");
            rt.socket.emit("collabdata", base64ImageData);
            rt.socket.emit()
        },1000)
    };
    
    }
    render(){
        return(
            <div class="sketch" id="sketch">
                <canvas className="whiteboard" id="whiteboard">
                 </canvas>
            </div>
            
            
        )
    }
}
export default Whiteboard