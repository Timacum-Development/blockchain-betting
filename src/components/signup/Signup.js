import React, { Component } from 'react';
import Web3 from 'web3';
import compiledContract from '../../truffle/build/contracts/BettingApp.json';

/**
 * Create web3 instance
 */
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

/**
 * Get address from compiled contract
 */
const contractAddress = compiledContract.networks['300'].address;

/**
 * Create contract instance
 */
const contractInstance = new web3.eth.Contract(compiledContract.abi, contractAddress);

web3.eth.getCoinbase().then(result => {
    const coinbaseAddress = result;
    contractInstance.methods.registerUser("velja", "koliko").send({ from: coinbaseAddress }).then((response) => {
        console.log(response);
        contractInstance.methods.createNewAddress("0xa7b59Cdbc3ff3a0B74a6417AC89E64EC22CcC73a", "koliko").send({ from: coinbaseAddress }).then(console.log);
        contractInstance.methods.getAvailableAddresses().call().then((response) => {
           console.log(response);
        });
    });
});

class Signup extends Component {

    /**
     * Sign up
     */
    signUp = () => {
        web3.eth.personal.newAccount("koliko").then(address => {
            const newAddress = address;
            web3.eth.getCoinbase().then(result => {
                const coinbaseAddress = result;
                web3.eth.personal.unlockAccount(coinbaseAddress, "koliko", 15).then(() => {
                    web3.eth.personal.unlockAccount(address, "koliko", 15).then(() => {
                        web3.eth.sendTransaction({ from: coinbaseAddress, to: newAddress, value: web3.utils.toWei("5", "ether") }).then(receipt => {
                            console.log(receipt);
                            contractInstance.methods.createNewAddress(newAddress, "koliko").call().then((response) => {
                                console.log(response);
                            });
                        });
                    });
                });
            });
        });
    }

    render() {
        return (
            <div className="signup-wrapper">
                <input type="text"/>
                <input type="text"/>
                <button onClick={this.signUp}>Sign up</button>
            </div>
        );
    }
}

export default Signup;