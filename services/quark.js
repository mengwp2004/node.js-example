'use strict';

var _quarkchainWeb = require('quarkchain-web3');

var _quarkchainWeb2 = _interopRequireDefault(_quarkchainWeb);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mainUrl = 'http://jrpc.mainnet.quarkchain.io:38391';
var testUrl = 'http://jrpc.devnet.quarkchain.io:38391';

const mainnetNetworkId = '0x1';
const devnetNetworkId = '0xff';

var movieAbi = [{
	"constant": false,
	"inputs": [{
		"name": "name",
		"type": "string"
	}, {
		"name": "id",
		"type": "uint32"
	}],
	"name": "issueContract",
	"outputs": [{
		"name": "",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"name": "newOwner",
		"type": "address"
	}],
	"name": "transferOwnership",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"name": "name",
		"type": "string"
	}, {
		"indexed": false,
		"name": "id",
		"type": "uint32"
	}, {
		"indexed": false,
		"name": "issued",
		"type": "bool"
	}, {
		"indexed": false,
		"name": "",
		"type": "address"
	}, {
		"indexed": false,
		"name": "",
		"type": "address"
	}, {
		"indexed": false,
		"name": "",
		"type": "address"
	}],
	"name": "IssueContract",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"name": "previousOwner",
		"type": "address"
	}, {
		"indexed": true,
		"name": "newOwner",
		"type": "address"
	}],
	"name": "OwnershipTransferred",
	"type": "event"
}, {
	"constant": true,
	"inputs": [{
		"name": "id",
		"type": "uint32"
	}],
	"name": "getRelation",
	"outputs": [{
		"name": "name",
		"type": "string"
	}, {
		"name": "watchAddress",
		"type": "address"
	}, {
		"name": "admireAddress",
		"type": "address"
	}, {
		"name": "commentAddress",
		"type": "address"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "owner",
	"outputs": [{
		"name": "",
		"type": "address"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}];

var watchAbi = [{
	"constant": true,
	"inputs": [{
		"name": "user",
		"type": "address"
	}],
	"name": "getWatchRecord",
	"outputs": [{
		"name": "begin",
		"type": "uint64"
	}, {
		"name": "end",
		"type": "uint64"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "getMoiveInfo",
	"outputs": [{
		"name": "id",
		"type": "uint32"
	}, {
		"name": "name",
		"type": "string"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "owner",
	"outputs": [{
		"name": "",
		"type": "address"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "getWatchStat",
	"outputs": [{
		"name": "",
		"type": "uint32"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"name": "user",
		"type": "address"
	}, {
		"name": "begin",
		"type": "uint64"
	}, {
		"name": "end",
		"type": "uint64"
	}],
	"name": "putWatchRecord",
	"outputs": [{
		"name": "",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"name": "newOwner",
		"type": "address"
	}],
	"name": "transferOwnership",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"name": "id",
		"type": "uint32"
	}, {
		"name": "name",
		"type": "string"
	}, {
		"name": "master",
		"type": "address"
	}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "constructor"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"name": "user",
		"type": "address"
	}, {
		"indexed": false,
		"name": "begin",
		"type": "uint64"
	}, {
		"indexed": false,
		"name": "end",
		"type": "uint64"
	}],
	"name": "PutWatchRecord",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"name": "previousOwner",
		"type": "address"
	}, {
		"indexed": true,
		"name": "newOwner",
		"type": "address"
	}],
	"name": "OwnershipTransferred",
	"type": "event"
}];

var web3;
var myContractInstance;

var movieAddress = '0x30D1b3468bFe0b52dAd139d14236996470F2E8150001fCE7';

function init() {
	web3 = new _web2.default();
	_quarkchainWeb2.default.injectWeb3(web3, testUrl);
	var MyContract = web3.qkc.contract(movieAbi);
	myContractInstance = MyContract.at(movieAddress);
}

function getRelation(id) {

	return myContractInstance.getRelation.call(1);
}

function issueContract(from, name, id) {
	//qkc address
	return myContractInstance.issueContract.sendTransaction(name, id, { from: from });
}

function getBalance(a) {
	return web3.qkc.getBalance(a).toNumber();
}

function getEthAddress(a) {
	return _quarkchainWeb2.default.getEthAddressFromQkcAddress(a);
}

function getQkcAddress(q) {
	return _quarkchainWeb2.default.getQkcAddressFromEthAddress(q);
}

function getTransactionCount(a) {
	return web3.qkc.getTransactionCount(a).toString(16);
}

function sendTransaction(transactionObject) {}
//qkc address
var a = "0x710807457D58C3673C07FCa3171592E74e9749440001fCE7";
var aPrivate = "0x93fc0babe95cb8767af5d4da6617a62522bcd841162705a6e02706f08bede062";

function test() {

	init();
	web3.qkc.setPrivateKey(aPrivate);
	console.log(a);

	// get qkc balance
	var balance = getBalance(a);
	console.log(balance);

	var ethAddress = getEthAddress(a);
	console.log(ethAddress);

	var qkcAddress = getQkcAddress(ethAddress);
	console.log(qkcAddress);

	var count = getTransactionCount(a);
	console.log(count);

	var relation = getRelation(1);
	console.log("getRelatoin:" + relation);

	var hex = issueContract(a, "hello", 1);
	console.log("issueContract:" + hex);
}

//test()
init();

function getData() {
	console.log("get data from quark!");
	return getBalance(a);
}

function putData() {
	return "put data from quark!";
}

exports.default = {
	getData,
	putData
};

module.exports = exports['default'];