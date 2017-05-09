import * as React from "react";
import { render } from "react-dom";
import { Board } from "./Board";
import { RestartBtn } from "./RestartBtn";
import { GameStateBar } from "./GameStateBar";
import { GameState } from "./constants";

class App extends React.Component<{}, {}> {
    render() {
        return (
            <div className="app"> 
                <Board /> 
                <div>
                    <span className="description t1"> Player(X) </span>                
                    <span className="description t2"> Computer(O) </span>
                </div>
                <RestartBtn />     
                <GameStateBar />           
            </div> 
        )
    }
}

render(
    <App />, document.getElementById("content")
);
