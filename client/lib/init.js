//webインスタンスの生成
web3 = new Web3();

//PRC settings
if(!web3.currentProvider)
  web3.setProvider(new web3.providers.HttpProvider("http://localhost:3030"));

//Eth Account init
EthAccounts.init();

//Eth Block init
EthBlocks.init();

