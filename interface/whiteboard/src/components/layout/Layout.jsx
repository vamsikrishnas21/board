import React from 'react';
import Whiteboard from '../whiteboard/Whiteboard';
import './style.css';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: "#000000",
            size: "5",
        };
        this.changeColor = this.changeColor.bind(this);
        this.changeSize = this.changeSize.bind(this);
    }
    
    changeColor(event) {
        this.setState({ color: event.target.value });
    }

    changeSize(event) {
        this.setState({ size: event.target.value });
    }

    renderBrushSizeOptions() {
        return [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(size => (
            <option key={size} value={size}>{size}</option>
        ));
    }

    render() {
        return (
            <div className="layout">
                <center><h2>Whiteboard</h2></center>
                <div className="tools-section">
                    <div className="brushsize-container">
                        Brush Size : &nbsp;
                        <select value={this.state.size} onChange={this.changeSize}>
                            {this.renderBrushSizeOptions()}
                        </select>
                    </div>
                    <div className="color-picker-container">
                        Brush Color : &nbsp;
                        <input type="color" value={this.state.color} onChange={this.changeColor} />
                    </div>
                </div>
                <div className="whiteboard-layout">
                    <Whiteboard color={this.state.color} size={this.state.size} />
                </div>
            </div>
        );
    }
}

export default Layout;
