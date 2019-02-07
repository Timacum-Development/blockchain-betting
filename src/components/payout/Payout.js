import React, { Component } from 'react';
import nodeUrl from '../../eth-node-config.json';
import Web3 from 'web3';
import compiledContract from '../../truffle/build/contracts/BettingApp.json';
//import arrayOfUsers from '../dashboard/Dashboard';


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

class Payout extends Component {

    payOut = () => {
        this.props.view();
        sessionStorage.clear();
    }

    PayUp = () => {
        console.log("Kuca je na racunu na pocetku runde imala: ");
        web3.eth.getBalance(coinbaseAddress).then(balance => {
            console.log('Address: ' + coinbaseAddress + ', balance: ' + web3.utils.fromWei(balance, 'ether') + ' ether');
        });
        contractInstance.methods.payWinnigBets(1).call().then(receipt => {
            if(receipt) {
                alert('Congratulations');
            } else {
                alert('Error');
            }
        })
    }
    PayDown = () => {
        console.log("Kuca je na racunu na pocetku runde imala: ");
        web3.eth.getBalance(coinbaseAddress).then(balance => {
            console.log('Address: ' + coinbaseAddress + ', balance: ' + web3.utils.fromWei(balance, 'ether') + ' ether');
        });
        contractInstance.methods.payWinnigBets(2).call().then(receipt => {
            if(receipt) {
                alert('Congratulations');
            } else {
                alert('Error');
            }
        })
    }
    PrintStats = () => {
        alert("Statistika je u konzoli");
        console.log("Kuca na racunu ima: ");
        web3.eth.getBalance(coinbaseAddress).then(balance => {
            console.log('Address: ' + coinbaseAddress + ', balance: ' + web3.utils.fromWei(balance, 'ether') + ' ether');
        });
        console.log("Nova stanja na racunima: ");
        // console log all players after each bet (just for test)
        global.arrayOfUsers.forEach(address => {
            web3.eth.getBalance(address).then(balance => {
                console.log('Address: ' + address + ', balance: ' + web3.utils.fromWei(balance, 'ether') + ' ether');
            });
        })
    }
    render() {
        return (
            <div className="signin-wrapper">
            <br></br>
            <h1>Test buttons za funkciju za isplatu</h1>
            <br></br>
            <div className="row">
                <div className="col-sm-3">
                    <button className="betup" onClick={this.PayUp}>Pay up</button>
                </div>
                <div className="col-sm-3">
                    <button className="betup" onClick={this.PayDown}>Pay down</button>
                </div>
                <div className="col-sm-3">
                    <button className="betup" onClick={this.PrintStats}>Print Stats</button>
                </div>
            </div>
            </div>
        );
    }
}

export default Payout;