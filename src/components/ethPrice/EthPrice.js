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
            fetch('https://apiv2.bitcoinaverage.com/indices/global/ticker/ETHUSD')  
            .then(data => data.json())
            .then(data => {
               this.setState({ price: data['last'], hourlyPercentChange: data['changes']['percent']['hour'] });
            }); 
        }, 1000)
    }

    render() {
        return (
            <div className="signin-wrapper">
              <h1>Ethereum Price:</h1>
              <p>ETH/USD</p>
              <h2>${this.state.price}</h2>
              <h1>{this.state.hourlyPercentChange}%</h1> 
              <p>Chg.24h</p>       
            </div>          
        );
    }
}

export default EthPrice;