import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import compiledContract from './truffle/build/contracts/BettingApp.json';
import Signup from './components/signup/Signup';
import Signin from './components/signin/Signin';

/**
 * Create web3 instance
 */
const web3 = new Web3("http://localhost:8545");

/**
 * Unlock coinbase address
 */
web3.eth.getCoinbase().then(result => {
  const coinbaseAddress = result;
  web3.eth.personal.unlockAccount(coinbaseAddress, 'koliko', 0).then(console.log('Coinbase address unlocked'));
});

/**
 * Get address from compiled contract
 */
const contractAddress = compiledContract.networks['300'].address;

/**
 * Get contract balance
 */
web3.eth.getBalance(contractAddress, function (err, balance) {
  if (err) {
    console.error(err);
  } else {
    console.log('Contract address: ' + contractAddress);
    console.log('Contract balance: ' + balance);
  }
});

/**
 * Create contract instance
 */
const contractInstance = new web3.eth.Contract(compiledContract.abi, contractAddress);
console.log(contractInstance);

/**
 * List all accounts with their balance
 */
// web3.eth.getAccounts().then(result => {
//   result.forEach(address => {
//     web3.eth.getBalance(address).then(balance => {
//       console.log('Address: ' + address + ', balance: ' + web3.utils.fromWei(balance, 'ether') + ' ether');
//     });
//   });
// });

class App extends Component {
  state = {
    showSignup: true,
    showSignin: true
  }

  render() {
    let signup = null;
    if (this.state.showSignup) {
      signup = (<Signup />);
    }

    let signin = null;
    if (this.state.showSignin) {
      signin = (<Signin />);
    }

    return (
      <div className="App">
        {signup}
        {signin}
      </div>
    );
  }
}

export default App;
