import React, { Component } from 'react';
import Web3 from 'web3';
import compiledContract from '../../truffle/build/contracts/BettingApp.json';

/**
 * Create web3 instance
 */
const web3 = new Web3("http://localhost:8545");

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
        
    };

    render() {
        return (
            <div className="dashboard-wrapper">
                <button>Bet up</button>
                <button>Bet down</button>
            </div>
        );
    }
}

export default Dashboard;