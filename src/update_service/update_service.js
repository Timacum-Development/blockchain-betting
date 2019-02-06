// import Web3 from 'web3';
// import compiledContract from './truffle/build/contracts/BettingApp.json';
const nodeUrl = require('../eth-node-config');
const Web3 = require('web3');
const compiledContract = require('../truffle/build/contracts/BettingApp.json');
const web3 = new Web3(nodeUrl.url),
	contractAddress = compiledContract.networks['300'].address,
	// async = require('async'),
	// request = require('request'),
	fs = require('fs');

updateAllData = () => {

	let data = {
		'updateTime': '',
		'coinbaseBalance': ''
	}
	web3.eth.getCoinbase().then(result => {
		const coinbaseAddress = result;
		console.log('Coinbase: ' + coinbaseAddress);
		// web3.eth.personal.unlockAccount('0x6a7ab1c46b4beb1761e0b2e981c22ea555ada4ca', 'koliko', 0).then((e) => {
		// 	console.log(e);
		// 	setTimeout(updateAllData, 5000);
		// });
	});
		
	// web3.eth.personal.unlockAccount('0x6a7ab1c46b4beb1761e0b2e981c22ea555ada4ca', 'koliko', 0).then((e) => {
	// 	console.log(e);
	// 	data.updateTime = new Date();
	// 	const json = JSON.stringify(data);
	// 	fs.writeFile("gpu_data.json", json, function (err) {
	// 		const logTime = new Date();
	// 		console.log(logTime + ': Data saved.');
	// 	});
	// 	setTimeout(updateAllData, 5000);
	// });

	// async.series([

		// updateData = () => {
			
			// web3.eth.getCoinbase().then(result => {
			// 	const coinbaseAddress = result;
			// 	web3.eth.personal.unlockAccount(coinbaseAddress, 'koliko', 0).then((e) => {
			// 		console.log(e);
			// 		// data.coinbaseBalance = 'velja';
			// 		// web3.eth.getBalance(contractAddress, function (err, balance) {
			// 		// 	if (err) {
			// 		// 		console.error(err);
			// 		// 		callback(null, '');
			// 		// 	} else {
			// 		// 		// console.log('Contract address: ' + contractAddress);
			// 		// 		// console.log('Contract balance: ' + balance);
			// 		// 		data.coinbaseBalance = balance;
			// 		// 		callback(null, '');
			// 		// 	}
			// 		// });
			// 		callback(null, '');
			// 	});
			// });
		// },

	// ], (error, result) => {
	// 	if (error) {
	// 		console.log(' ');
	// 		console.log('Something went wrong :(');
	// 		console.log('-----------------------');
	// 		const errorTime = new Date();
	// 		console.log(errorTime + ': ' + error);
	// 		console.log('-----------------------');
	// 		console.log('');
	// 	} else {
	// 		const json = JSON.stringify(data);
	// 		fs.writeFile("gpu_data.json", json, function (err) {
	// 			const logTime = new Date();
	// 			console.log(logTime + ': Data saved.');
	// 		});
	// 	}
	// 	setTimeout(updateAllData, 5000);
	// });
}
updateAllData()