const nodeUrl = require('../eth-node-config'),
	async = require('async'),
	request = require('request'),
	fs = require('fs'),
	Web3 = require('web3'),
	compiledContract = require('../truffle/build/contracts/BettingApp.json'),
	web3 = new Web3(nodeUrl.url),
	contractAddress = compiledContract.networks['300'].address,
	contractInstance = new web3.eth.Contract(compiledContract.abi, contractAddress);

let coinbaseAddress = '';
let currentTime = {
	'hour': '',
	'minute': '',
	'second': ''
}
let lastPayoutTime = '';
let betPriceSet = false;
let ethData = {
	'currentEthPrice': '',
	'betEthPrice': ''
}

main = () => {

	async.series([

		/**
		 * Update current time
		 */
		updateTime = (callback) => {
			const time = new Date();
			currentTime.hour = time.getHours();
			currentTime.minute = time.getMinutes();
			currentTime.second = time.getSeconds();
			callback(null, '');
		},

		/**
		 * Get current ETH price and set the bet price
		 */
		getEthPrice = (callback) => {
			request({
				url: "https://api.bittrex.com/api/v1.1/public/getticker?market=USD-ETH",
				json: true
			}, function (error, response, data) {
				if (!error && response.statusCode === 200) {
					if (typeof data !== 'undefined') {
						ethData.currentEthPrice = data.result.Last;
						if ((currentTime.minute == 2 || currentTime.minute == 32) && !betPriceSet) {
							ethData.betEthPrice = data.result.Last;
							betPriceSet = true;
						}
						console.log('Betting against ETH price: ' + ethData.betEthPrice + ' | Current ETH price: ' + ethData.currentEthPrice);
					}
					callback(null, '');
				} else {
					callback(null, '');
				}
			});
		},

		/**
		 * Get coinbase address
		 */
		getCoinbaseAddress = (callback) => {
			web3.eth.getCoinbase().then(result => {
				coinbaseAddress = result;
				callback(null, '');
			});
		},

		/**
		 * Distribute rewards on time
		 */
		distributeRewards = (callback) => {
			if ((currentTime.minute == 0 || currentTime.minute == 30) && lastPayoutTime != currentTime.hour + ':' + currentTime.minute) {
				contractInstance.methods.payWinnigBets(1).send({ from: coinbaseAddress, gas: 500000 }).then(receipt => {
					console.log('Rewards distributed, gas spent: ' + receipt.gasUsed);
					lastPayoutTime = currentTime.hour + ':' + currentTime.minute;
					betPriceSet = false;
					callback(null, '');
				});
			} else {
				console.log('Rewards are not paid out, current time is: ' + currentTime.hour + ':' + currentTime.minute + ':' + currentTime.second);
				callback(null, '');
			}
		}

	], (error, result) => {
		if (error) {
			console.log(' ');
			console.log('Something went wrong :(');
			console.log('-----------------------');
			const errorTime = new Date();
			console.log(errorTime + ': ' + error);
			console.log('-----------------------');
			console.log('');
		} else {
			const json = JSON.stringify(ethData);
			fs.writeFile("ethData.json", json, function (err) {
				const logTime = new Date();
				// console.log(logTime + ': Data saved.');
				setTimeout(main, 10000);
			});
		}
	});
}
main()