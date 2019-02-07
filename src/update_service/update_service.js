const nodeUrl = require('../eth-node-config'),
	async = require('async'),
	// request = require('request'),
	fs = require('fs'),
	Web3 = require('web3'),
	compiledContract = require('../truffle/build/contracts/BettingApp.json'),
	web3 = new Web3(nodeUrl.url),
	contractAddress = compiledContract.networks['300'].address,
	contractInstance = new web3.eth.Contract(compiledContract.abi, contractAddress);

updateAllData = () => {

	let coinbaseAddress = '';
	let data = {
		'updateTime': '',
		'coinbaseBalance': ''
	}

	async.series([

		updateData = (callback) => {
			web3.eth.getCoinbase().then(result => {
				coinbaseAddress = result;
				web3.eth.personal.unlockAccount(coinbaseAddress, 'koliko', 0).then((e) => {
					web3.eth.getBalance(coinbaseAddress, function (err, balance) {
						if (err) {
							console.error(err);
							callback(null, '');
						} else {
							data.coinbaseBalance = balance / 1000000000000000000;
							data.updateTime = new Date();
							callback(null, '');
						}
					});
				});
			});
		},

		distributeRewards = (callback) => {
			web3.eth.getBlock("latest", false, (error, result) => {
				console.log(result.gasLimit);
				contractInstance.methods.payWinnigBets(1).send({ from: coinbaseAddress, gas: 8720000 }).then(receipt => {
					console.log('Rewards distributed, gas spent: ' + receipt.gasUsed);
					callback(null, '');
				});
				// callback(null, '');
			});
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
			const json = JSON.stringify(data);
			fs.writeFile("data.json", json, function (err) {
				const logTime = new Date();
				console.log(logTime + ': Data saved.');
				setTimeout(updateAllData, 10000);
			});
		}
	});
}
updateAllData()