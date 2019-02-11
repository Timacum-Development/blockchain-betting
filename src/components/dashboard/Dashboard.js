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

global.arrayOfUsers = [];

class Dashboard extends Component {
  constructor(dashboardProps) {
    super(dashboardProps)  
    this.state = {
        inputValue: '',
        disablebutton: false
    }
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
        // unlock user's address
        web3.eth.personal.unlockAccount(global.loggedInAddress, 'koliko', 0).then(console.log("Otkljucana adresa " + global.loggedInAddress + " YOU CAN NOW BET!"));
        //disable click on elements until bet accepted
        this.setState({
            disablebutton: !this.state.disablebutton
        });
        // place bet 
        contractInstance.methods.purchaseBet(1).send({from: global.loggedInAddress, value: web3.utils.toWei(this.state.inputValue, "ether"), gas: 300000}).then(receipt => {
            if (receipt) {
                console.log("Kladim se na keca sa adrese " + global.loggedInAddress);
                global.arrayOfUsers.push(global.loggedInAddress);
                sessionStorage.setItem('type', this.state.inputValue);
                //disable click on elements until bet accepted
                this.setState({
                    disablebutton: !this.state.disablebutton
                });
                alert('Bet accepted');
            } else {
                sessionStorage.setItem('type', '');
                //disable click on elements until bet accepted
                this.setState({
                    disablebutton: !this.state.disablebutton
                });
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
            // unlock user's address
            web3.eth.personal.unlockAccount(global.loggedInAddress, 'koliko', 0).then(console.log("Otkljucana adresa " + global.loggedInAddress + " YOU CAN NOW BET!"));
            //disable click on elements until bet accepted
            this.setState({
                disablebutton: !this.state.disablebutton
            });
            // place bet 
            contractInstance.methods.purchaseBet(2).send({from:global.loggedInAddress , value:web3.utils.toWei(this.state.inputValue, "ether"), gas: 300000}).then(receipt => { 
                if (receipt) {
                    console.log("Kladim se na dvojku sa adrese " + global.loggedInAddress);
                    global.arrayOfUsers.push(global.loggedInAddress);
                    sessionStorage.setItem('type', this.state.inputValue);
                    this.setState({
                        disablebutton: !this.state.disablebutton
                    });
                    alert('Bet accepted');
                } 
                else {
                    sessionStorage.setItem('type', '');
                    this.setState({
                        disablebutton: !this.state.disablebutton
                    });
                    alert('Bet rejected');
                }
            });
    }
    render() {
        return (
            <div className="dashboard-wrapper">
                <div className="row">
                    <div className="col-sm-6">
                    <input onChange={this.updateValue} type="text" placeholder="Bet value (ETH)"/>   
                    </div>
                    <div className="col-sm-3">
                        <button disabled={this.state.disablebutton} className="betup" onClick={this.BetUp}>Bet up</button>
                    </div>
                    <div className="col-sm-3">
                        <button disabled={this.state.disablebutton} className="betdown" onClick={this.BetDown}>Bet down</button>
                    </div>
                </div>
                {
                    this.state.disablebutton?
                    <div className="loading-wrapper">
                    <div className="row">
                        <div className="col-sm-6 column-in-center">
                            <h2>Accepting bet...</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-2 column-in-center">
                            <div className="loader"></div>
                        </div>
                    </div>
                    </div>
                :null
                }
            </div>
        );
    }
}

export default Dashboard;