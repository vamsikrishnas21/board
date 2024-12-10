import React from 'react';
import Whiteboard from '../whiteboard/Whiteboard';
import './style.css';

class Layout extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            color: "#000000",
            size: "5",
            username:"",
            users:[{}]
        }
       
    }
    changeColor(params) {
        this.setState({
            color: params.target.value
        })
    }
    changeSize(params) {
        this.setState({
            size: params.target.value
        })
    }
    render() {
        return (
            <div className="layout">         
               <center><h2>Distributed Whiteboard</h2></center>
               
                
            
                <div className="whiteboard-layout">
                    
                    <Whiteboard size={this.state.size}></Whiteboard>
                </div>

            </div>

        )
    }
}

export default Layout
