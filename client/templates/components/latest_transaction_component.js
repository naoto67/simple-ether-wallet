Template.latestTransactionComponent.helpers({
  items: function(){
    selector = {};
    return Transactions.find(selector, {sort: {timestamp: -1}, limit: 5}).fetch();
  },
});

Template.transactionItem.helpers({
  txDateTime: function(){
    return unix2datetime(this.timestamp);
  },
  from: function(){
    return this.fAddr;
  },
  to: function(){
    return this.tAddr;
  },
  amountInEther: function(){
    var amountEth = web3.fromWei(this.amount, "ether");
    return parseFloat(amountEth).toFixed(3);
  },
  confirmationCount: function(){
    var count = 0;
    if(this.blockNumber) count = EthBlocks.latest.number - this.blockNumber +1;
    if(count > 50) count = "50+";
    return count;
  }
});
