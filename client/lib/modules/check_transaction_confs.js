const requiredConfirmations = 12;

var updateTransaction = function(oldDocument, transaction, receipt){
  if(transaction&&receipt){
    var actualFee = transaction.gasPrice.times(new BigNumber(receipt.gasUsed)).toString(10);
    Transactions.update({_id: oldDocument._id},
                      {$set: {
                        blockNumber:transaction.blockNumber,
                        blockHash: transaction.blockHash,
                        transactionIndex: transaction.transactionIndex,
                        fee: actualFee
                      }});
    console.log("Transactions Collection were Updated");
  }else{
    console.log("NOT UPDATED");
  }
};

CheckTransactionConfirmations = function(tx){
  var confCount = 0;
  //最新ブロック
  var filter = web3.eth.filter('latest');

  //最新ブロックを監視。新しいブロックが採掘されれば、コールバック関数内で指定された処理を行う。
  filter.watch(function(e, blockHash){
  //filter.watch(callback)
  //callback内の処理を行う
    if(!e){
      console.log("Received New Block");
      confCount++;

      //transaction collection から最新状態を取得
      //transaction collection から削除されていればwatchを停止
      tx = Transactions.findOne(tx._id);
      if(!tx){
        filter.stopWatching();
        return;
      }
      //transactionを取得
      web3.eth.getTransaction(tx.transactionHash, function(e, transaction){
        //ブロックに含まれているtransactionを取得
        web3.eth.getTransactionReceipt(tx.transactionHash, function(e, receipt){
          window.transaction = transaction;
          window.receipt = receipt;
          if(!e){
            //発信したトランザクションを含むブロックが相当の期間採掘されない場合は、
            //当該トランザクションがEthereumネットワークに受け入れられなかったとして、
            //Walletのトランザクションの歴から削除する。
            //ここで「相当の期間」として、requiredConfirmationsに指定された値の２倍としている。
            if(!receipt || !transaction){
              if(confCount > requiredConfirmations*2){
                Transactions.remove(tx._id);
                filter.watching();
                return;
              }else{
                return;
              }
              //transactionが発掘された時
              //その情報でtransactionsコレクションを更新
            }else if(transaction.blockNumber){
              if(transaction.blockNumber!==tx.blockNumber){
                updateTransaction(tx, transaction, receipt);
              }
              //transactionのブロックナンバーからブロックを取得し、
              //そのブロックのハッシュ値とトランザクションがもつブロックのハッシュ値
              //が等しくない時、このトランザクションを含むブロックは
              //正規のブロックではない walletの履歴から削除
              web3.eth.getBlock(transaction.blockNumber, function(e, block){
                if(block.hash!==transaction.blockHash){
                  Transactions.remove(tx._id);
                  filter.stopWatching();
                  return;
                }
              });
              var confirmations = (EthBlocks.latest.number+1) - tx.blockNumber;
              if(confirmations > requiredConfirmations){
                console.log("Confrimed Enough. Stop Watching txHash: " + tx.transactionHash);
                filter.stopWatching();
              }
            }
          }
        });
      });
    }
  });
};
