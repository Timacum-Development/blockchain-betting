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

class Signout extends Component {

    signOut = () => {
        this.props.view()

        // TO DO : logout user from system
    }

    render() {
        return (
            <div> 
                <button type="submit" onClick={this.signOut}>Sign out</button>
            </div>
        );
    }
}

export default Signout;