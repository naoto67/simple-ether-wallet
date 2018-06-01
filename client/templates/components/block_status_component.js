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

unix2datetime = function(unixtime){
  var date = new Date(unixtime * 1000);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour  = ( date.getHours()   < 10 ) ? '0' + date.getHours()   : date.getHours();
  var min   = ( date.getMinutes() < 10 ) ? '0' + date.getMinutes() : date.getMinutes();
  var sec   = ( date.getSeconds() < 10 ) ? '0' + date.getSeconds() : date.getSeconds();
  var datetimeString = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec ;
  return datetimeString;
};
