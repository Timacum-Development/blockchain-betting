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

class Signup extends Component {

    state = {
        inputUsername: '',
        inputPassword: ''
    };

    // update username state
    updateUsername = (e) => {
        this.setState({
            inputUsername: e.target.value
        });
    }

    // update password state
    updatePassword = (e) => {
        this.setState({
            inputPassword: e.target.value
        });
    }

    /**
     * Create new account
     */
    createNewAccount = () => {
        web3.eth.personal.newAccount("koliko").then(address => {
            const newAddress = address;
            web3.eth.personal.unlockAccount(address, "koliko", 0).then(() => {
                web3.eth.sendTransaction({ from: coinbaseAddress, to: newAddress, value: web3.utils.toWei("5", "ether") }).then(receipt => {
                    console.log('Created new address, gas spent: ' + receipt.gasUsed);
                    contractInstance.methods.createNewAddress(newAddress, "koliko").send({ from: coinbaseAddress, gas: 5000000 }).then(receipt => {
                        console.log('New address is now available, gas spent: ' + receipt.gasUsed);
                    });
                });
            });
        });
    }

    signUp = () => {
        // check if there is empty field
        if (this.state.inputUsername === '' || this.state.inputPassword === '') {
            alert('Username or password field is empty');
            return;
        }
        // check if username exist
        contractInstance.methods.checkIfUserExist(this.state.inputUsername).call().then(receipt => {
            if (!receipt) {
                // check if there is available address
                contractInstance.methods.getAvailableAddresses().call().then((receipt) => {
                    if (receipt > 0) {
                        console.log('There is available address for new accounts, number of available addresses is: ' + receipt);
                        // register user
                        contractInstance.methods.registerUser(this.state.inputUsername, "koliko").send({ from: coinbaseAddress, gas: 5000000 }).then((receipt) => {
                            console.log('User successfully registred, gas spent: ' + receipt.gasUsed);
                            // create new account that will be available for new users
                            this.createNewAccount();
                        });
                    } else {
                        console.log('Currently there are no available addresses, please try again later.');
                        // create new account that will be available for new users
                        this.createNewAccount();
                    }
                });
            } else {
                console.log('Username already exists.');
            }
        });
    }

    render() {
        return (
            <div className="signup-wrapper">
                <input onChange={this.updateUsername} type="text"/>
                <input onChange={this.updatePassword} type="password"/>
                <button onClick={this.signUp}>Sign up</button>
            </div>
        );
    }
}

export default Signup;