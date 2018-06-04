Template.blockStatusComponent.helpers({
  latestBlockNum: function(){
    return EthBlocks.latest.number;
  },
  latestBlockHash: function(){
    return EthBlocks.latest.hash;
  },
  latestBlockMiner: function(){
    return EthBlocks.latest.miner;
  },
  latestBlockDatetime: function(){
    return unix2datetime(EthBlocks.latest.timestamp);
  }
});

