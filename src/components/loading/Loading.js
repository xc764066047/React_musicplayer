import React,{Component} from 'react';
import './Loading.css';

class Loading extends Component{
    render(){
        return(
            <figure>
                <div className="dot white"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </figure>
        );
    }
}

export default Loading;