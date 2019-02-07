import React, { Component } from 'react';
import nodeUrl from '../../eth-node-config.json';
import Web3 from 'web3';
import compiledContract from '../../truffle/build/contracts/BettingApp.json';


/**
 * Create web3 instance
 */
const web3 = new Web3(nodeUrl.url);

/**
 * Get address from compiled contract
 */
const contractAddress = compiledContract.networks['300'].address;

/**
 * Create contract instance
 */
const contractInstance = new web3.eth.Contract(compiledContract.abi, contractAddress);

/**
 * Get coinbase address
 */
let coinbaseAddress = '';
web3.eth.getCoinbase().then(result => {
    coinbaseAddress = result;
});

class Timer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            time: 0,
            timeStart: 0,
            timeEnd: 0,
            timeRemaining: 1200000
        };

        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        //this.countDown = this.countDown.bind(this);
    }

    format(timeRemaining) {
        let seconds = timeRemaining % 60;
        let minutes = Math.floor(timeRemaining / 60000);
        minutes = minutes.toString().length === 1 ? "0" + minutes : minutes;
        seconds = seconds.toString().length === 1 ? "0" + seconds : seconds;
        return minutes + ':' + seconds;
    }

    startTimer = () => {
        this.setState({
            timeStart: new Date(Date.now()).toLocaleString(),
            timeEnd: new Date(Date.now() + 1800000).toLocaleString(),
        })
        this.timer = setInterval(() => this.setState({
            time: new Date(Date.now()).toLocaleString()
        }), 1000);
        this.timer = setInterval(() => {
            const newCount = this.state.timeRemaining - 1;
            this.setState(
                {timeRemaining: newCount >= 0 ? newCount : 0}
            );
        }, 1000);
    }

    stopTimer = () => {
        clearInterval(this.timer)
    }

    render() {
        return(
            <div className="signin-wrapper">
            <br></br>
                <h1>Clock: {this.state.time}</h1>
                <div className="row">
                    <div className="col-sm-3">
                        <button className="betup" onClick={this.startTimer}>Start</button>
                        <button className="betdown" onClick={this.stopTimer}>Stop</button>
                    </div>
                    <div className="col-sm-3">
                        <h2>Time remaining: {this.format(this.state.timeRemaining)}</h2>
                    </div>
                </div>
                <h1>Round stared at: {this.state.timeStart}</h1>
                <h1>Round will be finished at: {this.state.timeEnd}</h1>
            </div>
        )
    }
}

export default Timer;