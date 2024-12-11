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
               <center><h2>Whiteboard</h2></center>
               <center><h4>Real-time collaborative whiteboard: Draw and type simultaneously with instant updates across all connected users.</h4></center>
                <div className="tools-section">
                    <div className="brushsize-container">
                        Brush Size : &nbsp;
                        <select value={this.state.size} onChange={this.changeSize.bind(this)}>
                           <option>1</option>
                           <option>5</option>
                           <option>10</option>
                           <option>15</option>
                           <option>20</option>
                           <option>25</option>
                           <option>30</option>
                           <option>35</option>
                           <option>40</option>
                           <option>45</option>
                           <option>50</option>
                           <option>55</option>

                        </select>
                    </div>
                    
                </div>
            
                <div className="whiteboard-layout">
                    
                    <Whiteboard size={this.state.size}></Whiteboard>
                </div>

            </div>

        )
    }
}

export default Layout
