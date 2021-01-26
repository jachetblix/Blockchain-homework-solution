const { Node } = require("./node");
const { Transaction } = require('./Blockchain');
const { BloomFilter } = require('bloom-filters');
const { MerkleTree } = require('./merkletree');
const { stdin, exit, argv } = process;
const { P2p } = require('./p2p');
const SHA256 = require('crypto-js/sha256');
const topology = require('fully-connected-topology');

class Wallet extends Node {
    constructor(srcPort,destPort) {
        super();
        this.transactions = [];
        this.bereshitTransaction('wallet');
        this.connection = new P2p(srcPort, destPort);
        this.bloomFilter = new BloomFilter(10,4);
        this.bloomFilter.add(this.address);
        this.options = [
            "1.Send zuzim: address amount",
            "2.Verify: transactionId",
            "3.Balance"

        ]
    }

    init() {
        this.connection.topology = topology(this.connection.selfIp, this.connection.peerIps).
            on('connection', (fullNode,peer) => {
            this.sendBloomFilter(fullNode);
            this.printMain();

            stdin.on('data',data => {
                let args = data.toString().trim().split(' ');
                if(args[0] === '1'){
                    this.sendZuzim(args[1],args[2]);
                } else if(args[0] === '2'){
                    let transactionId = args[1];
                    fullNode.write(JSON.stringify({verify:transactionId}))
                } else if(args[0] === '3'){
                    fullNode.write(JSON.stringify({balance:this.address}))
                }
            })

            fullNode.on('data',data => {
                this.verify(JSON.parse(data))
            })
        });
    }

    sendBloomFilter(fullNode){
        let filterJson = this.bloomFilter.saveAsJSON();
        fullNode.write(JSON.stringify({bloom:filterJson}));
    }

    sendZuzim(toAddress, amount) {
        const t = new Transaction(this.address, toAddress, amount)
        t.signTransaction(this.key);
        this.transactions.push(t.calculateHash());
        this.mActions.writeTransaction(t, 'wallet');
    }

    verify(data) {
        let proof = data.proof;
        let root  = data.root;
        let verification = SHA256(JSON.stringify(proof[1])).toString();
        if(verification === root){
            console.log(`transaction is verified`);
            return true;
        } else {
            console.log(`transaction is NOT verified`);
            return false;
        }
    }


} 

module.exports.Wallet = Wallet;