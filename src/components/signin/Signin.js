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

class Signin extends Component {

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

    signIn = () => {
        // check if there is empty field
        if (this.state.inputUsername === '' || this.state.inputPassword === '') {
            alert('Username or password field is empty');
            return;
        }
        // log in user 
        contractInstance.methods.logIn(this.state.inputUsername, this.state.inputPassword).call().then(receipt => {
            if (receipt) {
                alert('Logged in')
            } else {
                alert('Wrong username or password');
            }
        });
    }

    render() {
        return (
            <div className="signin-wrapper">
                <input onChange={this.updateUsername} type="text" />
                <input onChange={this.updatePassword} type="password" />
                <button onClick={this.signIn}>Sign in</button>
            </div>
        );
    }
}

export default Signin;