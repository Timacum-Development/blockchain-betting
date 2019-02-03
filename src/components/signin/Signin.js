import React, { Component } from 'react';
import Web3 from 'web3';
import compiledContract from '../../truffle/build/contracts/BettingApp.json';

/**
 * Create web3 instance
 */
const web3 = new Web3("http://37.220.78.36:8546");

/**
 * Get address from compiled contract
 */
const contractAddress = compiledContract.networks['300'].address;

/**
 * Create contract instance
 */
const contractInstance = new web3.eth.Contract(compiledContract.abi, contractAddress);
global.loggedInAddress = null;

class Signin extends Component {

    state = {
        inputUsername: '',
        inputPassword: ''
    }

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
                sessionStorage.setItem('username', this.state.inputUsername);
                sessionStorage.setItem('password', this.state.inputPassword);
                alert('Successfully logged in');
            } else {
                sessionStorage.setItem('username', '');
                sessionStorage.setItem('password', '');
                alert('Wrong username or password');
            }
        });
        // get logged in user's address
        contractInstance.methods.getUserLoggedInAddress(this.state.inputUsername, this.state.inputPassword).call()
        .then(receipt => {
            if(receipt) {
                console.log("Ulogovan sam adresom " + receipt);
                global.loggedInAddress = receipt;
            }
        })
    }
    render() {
        return (
            <div className="signin-wrapper">
              <h1>Already have an account</h1>
              <p>Insert username and password to sign in.</p>
                <input onChange={this.updateUsername} className="usernamesi" type="text" placeholder="Username"/>
                <div>
                  <p className="usernamesi-help">Please enter your username.</p>
                </div>
                <input onChange={this.updatePassword} className="passwordsi" type="password" placeholder="Password"/>
                 <div>
                  <p className="passwordsi-help">Please enter your password.</p>
                </div>
                <button type="submit" onClick={this.signIn}>Sign in</button>
                
            </div>
        );
    }
}

export default Signin;