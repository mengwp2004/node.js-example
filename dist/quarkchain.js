import QuarkChain from 'quarkchain-web3';
import Web3 from 'web3';

const web3 = new Web3();

QuarkChain.injectWeb3(web3, 'http://jrpc.devnet.quarkchain.io:38391');

const mainnetNetworkId = '0x1';
const devnetNetworkId = '0xff';

var a = "0x852B1B9d845Fcf6198aF3347b622B71225C6F09600063312";
console.log(a);
var balance = web3.qkc.getBalance(a);
console.log(balance); // instanceof BigNumber
console.log(balance.toString(10)); // '1000000000000'
console.log(balance.toNumber()); // 1000000000000

// Needed in nodejs environment, otherwise would require MetaMask.
/*web3.qkc.setPrivateKey('0xdf311ea55c9d9b4baa7dc3cac123e54a06c9389279ee3b461fb61b9d060fcee8');
const fullShardKey = '0x0005Fc90';
console.log('eth address', web3.qkc.address);


var result = QuarkChain.getQkcAddressFromEthAddress( web3.qkc.address);
console.log(result);
web3.qkc.getBalance(result,console.log);

const tx = {
  gas: `0x${(30000).toString(16)}`,
  // Minimum gas price: 10gwei
  gasPrice: '0x2540be400',
  data: '0x',
  to: '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf0005Fc90',
  value: '0x0',
  networkId: devnetNetworkId,
  fromFullShardKey: fullShardKey,
  toFullShardKey: fullShardKey,
  transferTokenId: '0x8bb0',
  gasTokenId: '0x8bb0',
};

// Should be able to find tx ID in console.
web3.qkc.sendTransaction(tx, console.log);
*/