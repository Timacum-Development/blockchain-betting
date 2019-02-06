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


class Dashboard extends Component {
    
    state = {
        inputValue: ''
    }
    
    // update value state
    updateValue = (e) => {
        this.setState({
            inputValue: e.target.value
        });
    }

    BetUp = () => {
        // check if there is empty field
        if (this.state.inputValue === '') {
            alert('Value field is empty');
            return;
        }
        // check if user is logged in
        if((global.loggedInAddress === '0x0000000000000000000000000000000000000000') || (global.loggedInAddress === '') || (global.loggedInAddress === null)) {
            alert('You are not logged in');
            return;
        }
        // place bet 
        contractInstance.methods.purchaseBet(1).send({from: global.loggedInAddress, value: web3.utils.toWei(this.state.inputValue, "ether"), gas: 200000}).then(receipt => {
            if (receipt) {
                console.log("Kladim se na keca sa adrese " + global.loggedInAddress);
                sessionStorage.setItem('type', this.state.inputUsername);
                alert('Bet accepted');
            } else {
                sessionStorage.setItem('type', '');
                alert('Bet rejected');
            }
        });
    }
    BetDown = () => {
            // check if there is empty field
            if (this.state.inputValue === '') {
                alert('Value field is empty');
                return;
            }
            // check if user is logged in
            if((global.loggedInAddress === '0x0000000000000000000000000000000000000000') || (global.loggedInAddress === '') || (global.loggedInAddress === null)) {
                alert('You are not logged in');
                return;
            }
            // place bet TODO bad contract
            contractInstance.methods.purchaseBet(2).send({from:global.loggedInAddress , value:web3.utils.toWei(this.state.inputValue, "ether"), gas: 200000}).then(receipt => {
                if (receipt) {
                    console.log("Kladim se na dvojku sa adrese " + global.loggedInAddress);
                    sessionStorage.setItem('type', this.state.inputUsername);
                    alert('Bet accepted');
                } else {
                    sessionStorage.setItem('type', '');
                    alert('Bet rejected');
                }
            });
    }
    render() {
        return (
            <div className="dashboard-wrapper">
                <div className="row">
                    <div className="col">
                    <canvas id="myChart" width="400" height="400"></canvas>
                    </div>
                </div>
                <div className="row"> </div>
                <div className="row">
                    <div className="col-sm-6">
                    <input onChange={this.updateValue} type="text" placeholder="Bet value (ETH)"/>   
                    </div>
                    <div className="col-sm-3">
                        <button className="betup" onClick={this.BetUp}>Bet up</button>
                    </div>
                    <div className="col-sm-3">
                        <button className="betdown" onClick={this.BetDown}>Bet down</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;