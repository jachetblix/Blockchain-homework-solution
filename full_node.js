const {Node} = require("./node");
const { BloomFilter } = require('bloom-filters');
const { Blockchain } = require('./Blockchain');
const { stdin, exit, argv } = process;
const topology = require('fully-connected-topology');

class FullNode extends Node{
    constructor() {
        super();
        this.blockchain = new Blockchain();
        this.bereshitTransaction('full_node');
        this.bloomFilters = [];
        this.peers = {};
        this.options = [
            '1.mine'
        ]
    }

    init(){
        topology("127.0.0.1:4000",["127.0.0.1:4001"])
            .on('connection',(socket,peer) => {
                console.log(`peer connected: ${peer} \n`)
                this.peers[peer] = socket;
                this.printMain()
                socket.on('data',data => {
                        let parse = JSON.parse(data);
                        let strings = Object.keys(parse);
                        if (strings[0] === 'verify') {
                            let latestBlock = this.blockchain.getLatestBlock();
                            let proof = latestBlock.merkleTree.transactionProof(parse.verify);
                            socket.write(JSON.stringify({root:latestBlock.merkleTree.root,proof:proof}))
                        } else if(strings[0] === 'bloom'){
                            this.receiveBloomFilter(peer, parse.bloom)
                        } else if(strings[0] === 'balance'){
                            let balanceOfAddress = this.blockchain.getBalanceOfAddress(parse.balance);
                            console.log(`the balance for address:${parse.balance} is ${balanceOfAddress}`);
                        }
                    });

                stdin.on('data',data => {
                    let args = data.toString().trim().split(' ');
                    if(args[0] === '1'){
                        this.mine()
                    }
                })
            })
    }

    mine() {
        let transactions = this.mActions.readTransaction();
        if(transactions.length !== 3){
            console.log("Not enough transactions to start mining")
            return;
        }
        for(const transaction of transactions){
            this.blockchain.pendingTransactions.push(transaction);
        }
        this.blockchain.minePendingTransactions(this.address);
        let latestBlock = this.blockchain.getLatestBlock();

        transactions.forEach(tx => console.log(`done with transaction ${tx.calculateHash()} with amount ${tx.amount}`))
        this.filterBloomFilters(transactions,latestBlock);
        this.mActions.clear();
    }

    receiveBloomFilter(peer,bloomFilter){
        let bloomFilter1 = BloomFilter.fromJSON(bloomFilter);
        this.bloomFilters.push({'peer':peer,'bloomFilter': bloomFilter1});
    }

    filterBloomFilters(transactions,latestBlock) {
        for(const filter of this.bloomFilters){
            for(const tx of transactions){
                if(filter.bloomFilter.has(tx.toAddress)){
                    let socket = this.peers[filter.peer];
                    let proof = latestBlock.merkleTree.transactionProof(tx.calculateHash());
                    socket.write(JSON.stringify({root:latestBlock.merkleTree.root,proof:proof}))

                }
            }

        }
    }

    sendData(transaction,peer){

    }

}

module.exports.FullNode = FullNode  ;