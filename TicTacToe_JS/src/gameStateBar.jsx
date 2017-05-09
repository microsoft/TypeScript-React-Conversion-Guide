import React from "react";

export class GameStateBar extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {gameState: ""};
    }
    
    handleGameStateChange(e) {
        this.setState({gameState: e.detail});
    }
  
    handleRestart(e) {
        this.setState({gameState: ""});
    }

    componentDidMount() {
        window.addEventListener("gameStateChange", e => this.handleGameStateChange(e));
        window.addEventListener("restart", e => this.handleRestart(e));
    }

    componentWillUnmount() {
        window.removeEventListener("gameStateChange", e => this.handleGameStateChange(e));
        window.removeEventListener("restart", e => this.handleRestart(e));
    }
    
    render() {
        return (
            <div className="gameStateBar"> {this.state.gameState} </div> 
        )
    }
}   
