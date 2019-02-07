import React, { Component } from 'react';

class EthPrice extends Component {

    state = {
        price: '',
        hourlyPercentChange: ''
    }

/**
 * After all the elements of the page is rendered correctly, this method is called by React itself to either fetch the data from An External API or perform some unique operations which need the JSX elements.
 // https://apiv2.bitcoinaverage.com/indices/global/ticker/ETHUSD  // https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD
 */
    componentDidMount(){        
        setInterval( () => {
            fetch('https://cors-anywhere.herokuapp.com/' +'https://api.bittrex.com/api/v1.1/public/getticker?market=USD-ETH')  
            .then(data => data.json())
            .then(data => {
               this.setState({ price: data.result.Last});
            }); 
        }, 1000)
    }

    render() {
        return (
        <div className="ethPrice-wrapper col">
            <div className="row">
                <div className="col">
                <h1>Ethereum Price</h1>
                <p>ETH/USD</p>
                <h2>${this.state.price}</h2>     
                </div>          
            </div>
            <div className="row">
                <div className="col">
                    <canvas id="myChart" width="100%" height="30%"></canvas>
                </div>
            </div>
        </div>
        );
    }
}

export default EthPrice;