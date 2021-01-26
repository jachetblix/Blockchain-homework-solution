const {MemPoolActions} = require('./mem_pool_actions');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { Transaction } = require('./Blockchain');

class Node {
    constructor() {
        const keyPair = ec.genKeyPair();
        this.key = ec.keyFromPrivate(keyPair.getPrivate());
        this.address = keyPair.getPublic('hex');
        this.mActions = new MemPoolActions();
        this.options = [
            "1.Mine: ",
            "2.Balance: ",
            "2.Transaction: "
        ];

        console.log("My public address:" + this.address);
    }

    init() {

    }

    bereshitTransaction(type) {
        const t = new Transaction(null, this.address, 1000);
        this.mActions.writeTransaction(t, type);
    }

    printMain() {
        console.log("<-----options----->");
        this.options.forEach(o => console.log(o))
    }
}

module.exports.Node = Node;
