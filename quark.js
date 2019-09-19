import QuarkChain from 'quarkchain-web3';
import Web3 from 'web3';
var quarkParam = require('./quark-param');
var ethereumjsUtil = require('ethereumjs-util');

var mainUrl = 'http://jrpc.mainnet.quarkchain.io:38391';

const mainnetNetworkId = '0x1';

var web3;
var myContractInstance;
var serverUrl = quarkParam.serverUrl;
var networkId = quarkParam.networkId;

var movieContractAddress = quarkParam.movieContractAddress;
//qkc address
var movieOwnerAddress = quarkParam.movieOwnerAddress; 
var movieOwnerPrivate = quarkParam.movieOwnerPrivate;


function init(){
  web3 = new Web3();
  QuarkChain.injectWeb3(web3, serverUrl);
  var MyContract = web3.qkc.contract(quarkParam.movieAbi);
  myContractInstance = MyContract.at(movieContractAddress);
}

function getRelation(id){

  return  myContractInstance.getRelation.call(1);
}

function issueContract(from,name,id){
  //qkc address
  return  myContractInstance.issueContract.sendTransaction(name,id,{from:from,fromFullShardKey: "0x00000001", toFullShardKey: "0x00000001"},        function(err, result){ 
          if(err){
             console.log("err:" + err);
          }
          if(result){
             console.log("result:" + result);
          }
      });
}

function callFunction(functionName, ...inputArgs){
   console.log(quarkParam.movieAbi);
   var abiMethods = quarkParam.movieAbi
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
   let networkId = 0;
   let gasTokenId = 0;  
   let transferTokenId = 0;
   let value = 0;
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
function test(){
  
  init();
  web3.qkc.setPrivateKey(movieOwnerPrivate);
  console.log(movieOwnerAddress);

  // get qkc balance
  var balance = getBalance(movieOwnerAddress);
  console.log(balance);  

  var ethAddress = getEthAddress(movieOwnerAddress);
  console.log(ethAddress);

  var qkcAddress = getQkcAddress(ethAddress);
  console.log(qkcAddress);

  var count = getTransactionCount(movieOwnerAddress);
  console.log(count);

  var relation = getRelation(1);
  console.log("getRelatoin:" + relation);

  var hex = issueContract(movieOwnerAddress,"hello",1);
  //console.log("issueContract:" + hex);

}


test()
//init();

//callFunction("issueContract","hello",1);

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
