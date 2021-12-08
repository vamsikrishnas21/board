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

              


          
               <h3 className="name-midile">Explain Everything Online Whiteboard</h3>
                <div class="tools-section">
                    <div className="color-picker-container">
                        Select Brush Color : &nbsp;
                        <input type="color" value={this.state.color} onChange={this.changeColor.bind(this)} />
                    </div>
<br />
                    <div className="brushsize-container">
                        Select Brush Size : &nbsp;
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

                <div class="whiteboard-layout">
                    <Whiteboard color={this.state.color} size={this.state.size}></Whiteboard>
                </div>

            </div>

        )
    }
}

export default Layout