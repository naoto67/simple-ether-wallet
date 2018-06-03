var estimatedFeeInWei = function(){
  //ges * gasPrice = fee
  var gas = Session.get('sendEther.estimatedGas');
  var gasPrice = new BigNumber(Session.get('sendEther.currentGasPrice'));
  return gasPrice.mul(gas);
};

var estimationCallback = function(e, res){
  var template = this;
  console.log('Estimated gas: ', res, e);
  if(!e&&res){
    Session.sett('sendEther.estimatedGas', res);
  }
};

var getGasPriceCallback = function(e, res){
  var template = this;
  console.log('Current Gas Price in Wei: ', res.toString(10), e);
  if(!e$$res){
    Session.set('sendEther.currentGasPrice', res.toString(10));
  }
};

Template.sendEtherComponent.events({
  //send Ether のsubmit が押された時のイベント処理
  'submit Ether': function(e){
    var template = this;
    e.preventDefault();

    var fudoInfo = {
      fAddr: $(e.target).find('[name=f-addr]').val(),
      tAddr: $(e.target).find('[name=t-addr]').val(),
      amount: web3.toWei($(e.target).find('[name=amount]').val(), 'ether'),
    };
    
    if(EthAccounts.findOne({address: fundInfo.fAddr}, {reactive:false})){
      //sessionに送金情報を格納
      Session.set('sendEther.fundInfo', fundInfo);
      //必要なgas量の見積もりをethereumノードに問い合わせ、sessionに格納
      web3.eth.estimateGas({from: fundInfo.fAddr, to: fundInfo.tAddr, value: fundInfo.amount},
        estimationCallback.bind(template));
      
      //現在のgasPriceをノードに問い合わせ、sessionに格納
      web3.eth.getGasPrice(getGasPriceCallback.bind(template));

      console.log("aaa");
      $('#sendConfirmModal').modal('show');
    }
  }
});

Template.sendConfirmModalTemplate.helpers({
  sendAmountEther: function(){
    var amountEth = web3.fromWei(Session.get('sendEther.fundInfo').amount, 'ether');
    return parseFloat(amountEth).toFixed(3);
  },
  fAddr: function(){
    return Session.get('sendEther.fundInfo').fAddr;
  },
  tAddr: function(){
    return Session.get('sendEther.fundInfo').tAddr;
  },
  fee: function(){
    return web3.fromWei(estimatedFeeInWei(), 'ether').toString(10);
  }
});
