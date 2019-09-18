import QuarkChain from 'quarkchain-web3';
import Web3 from 'web3';
var ethereumjsUtil = require('ethereumjs-util');

var mainUrl = 'http://jrpc.mainnet.quarkchain.io:38391';
var testUrl =  'http://jrpc.devnet.quarkchain.io:38391';

const mainnetNetworkId = '0x1';
const devnetNetworkId = '0xff';


var movieAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "id",
				"type": "uint32"
			}
		],
		"name": "issueContract",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "id",
				"type": "uint32"
			},
			{
				"indexed": false,
				"name": "issued",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "",
				"type": "address"
			}
		],
		"name": "IssueContract",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "id",
				"type": "uint32"
			}
		],
		"name": "getRelation",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "watchAddress",
				"type": "address"
			},
			{
				"name": "admireAddress",
				"type": "address"
			},
			{
				"name": "commentAddress",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];


var watchAbi = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "user",
				"type": "address"
			}
		],
		"name": "getWatchRecord",
		"outputs": [
			{
				"name": "begin",
				"type": "uint64"
			},
			{
				"name": "end",
				"type": "uint64"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getMoiveInfo",
		"outputs": [
			{
				"name": "id",
				"type": "uint32"
			},
			{
				"name": "name",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getWatchStat",
		"outputs": [
			{
				"name": "",
				"type": "uint32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "user",
				"type": "address"
			},
			{
				"name": "begin",
				"type": "uint64"
			},
			{
				"name": "end",
				"type": "uint64"
			}
		],
		"name": "putWatchRecord",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "id",
				"type": "uint32"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "master",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "begin",
				"type": "uint64"
			},
			{
				"indexed": false,
				"name": "end",
				"type": "uint64"
			}
		],
		"name": "PutWatchRecord",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	}
];



var web3;
var myContractInstance;

var movieAddress = '0x30D1b3468bFe0b52dAd139d14236996470F2E8150001fCE7';

function init(){
  web3 = new Web3();
  QuarkChain.injectWeb3(web3, testUrl);
  var MyContract = web3.qkc.contract(movieAbi);
  myContractInstance = MyContract.at(movieAddress);
}

function getRelation(id){

  return  myContractInstance.getRelation.call(1);
}

function issueContract(from,name,id){
  //qkc address
  return  myContractInstance.issueContract.sendTransaction(name,id,{from:from});
}

function callFunction(functionName, ...inputArgs){
   var abiMethods = movieAbi
          .filter(i => i.name && i.type === "function")
          .sort((a, b) => a.name.localeCompare(b.name));
   const method = abiMethods.find(i => i.name === functionName); 
   const sha3 = ethereumjsUtil.sha3;
   let inputs = method.inputs;
   const inputTypes = inputs.map(i => i.type);
   let typeNames = inputTypes.join();
   console.log(typeNames);
   const funcFullName = method.name + "(" + typeNames + ")";
   const funcSig = sha3(funcFullName).toString("hex").slice(0, 8);
   console.log(funcFullName);
   console.log(funcSig);
   //let inuputArgs = args;
   const args = [];
   for (let i = 0; i < inputs.length; ++i) {
          const arg = inputArgs[i];
          if (arg) {
            const t = inputs[i].type;
            if (t.indexOf("[") !== -1 && t.indexOf("]") !== -1) {
              args.push(arg.split(",").map(a => a.trim()));
            } else if (t === "bool") {
              args.push(JSON.parse(arg));
            } else {
              args.push(arg);
            }
          } else {
            args.push("");
          }
   }
   console.log(inputArgs);
   //console.log(web3.SolidityCoder);
   const encodedFuncCall = "0x" + funcSig +
   web3.SolidityCoder.encodeParams(inputTypes, args);
   const fromBuffer = ethereumjsUtil.toBuffer(a);
   const fromFullShardKey = "0x" + fromBuffer.subarray(20).toString("hex");
   const toBuffer = ethereumjsUtil.toBuffer(movieAddress);
   const toFullShardKey = "0x" + toBuffer.subarray(20).toString("hex");
   console.log("encodedFuncCall:" + encodedFuncCall + ", fromFullShardKey:" + fromFullShardKey);
  
   let nonce = getTransactionCount(a); 
   let gasLimit = 4300000;

   let gasPriceGwei = 10; 
   let networkId = ;
   let gasTokenId = ;  
   let transferTokenId = ;
   const rawTx = {
          nonce: nonce,
          to: "0x" + toBuffer.subarray(0, 20).toString("hex"),
          gasPrice: "0x" + (Number(gasPriceGwei) * 1e9).toString(16),
          gas: "0x" + (gasLimit ? Number(gasLimit) : 1000000).toString(16),
          data: encodedFuncCall,
          value: "0x" + value.toString(16),
          fromFullShardKey,
          toFullShardKey,
          networkId: `0x${networkId.toString(16)}`,
          gasTokenId: `0x${gasTokenId.toString(16)}`,
          transferTokenId: `0x${transferTokenId.toString(16)}`,
   };

   const tx = new ethereumjs.Tx(rawTx);
   if (this.key) {
            tx.sign(ethereumjs.Util.toBuffer(this.key));
   } /*else {
            try {
              var sig = await this.metaMaskSignTyped(tx);
              tx.version = '0x01';
              rawTx.version = '0x01'; // show version
              Object.assign(tx, this.decodeSignature(sig));
            } catch (error) {
              return;
            }
   }*/
   


 
}

function getBalance(a){
  return web3.qkc.getBalance(a).toNumber();
}

function getEthAddress(a){
  return QuarkChain.getEthAddressFromQkcAddress(a);
}

function getQkcAddress(q){
  return QuarkChain.getQkcAddressFromEthAddress(q);
}


function getTransactionCount(a){
  return web3.qkc.getTransactionCount(a).toString(16);
}

function sendTransaction(transactionObject){

}
//qkc address
var a = "0x710807457D58C3673C07FCa3171592E74e9749440001fCE7"; 
var aPrivate = "0x93fc0babe95cb8767af5d4da6617a62522bcd841162705a6e02706f08bede062";

function test(){
  
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

  //var hex = issueContract(a,"hello",1);
  //console.log("issueContract:" + hex);

  callFunction("issueContract");
}


//test()
init();
callFunction("issueContract","hello",1);

function getData(){
  console.log("get data from quark!");
  return getBalance(a);

}

function putData(){
  return "put data from quark!";
}


exports.default = {
  getData,
  putData
};

module.exports = exports['default'];
