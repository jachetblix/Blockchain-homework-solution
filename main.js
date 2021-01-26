const {Wallet} = require('./wallet');
const {FullNode} = require('./full_node.js');
const { stdin, exit, argv } = process;
const {MemPoolActions} = require('./mem_pool_actions');
const mActions = new MemPoolActions();

// const params = {
//     isNode: argv[2] === 'node',
//     selfPort: argv[3],
//     peers: argv.slice(4, argv.length)
// };

// let current;
// if (params.isNode) {
//     mActions.clear();
//     current = new FullNode(params.selfPort, params.peers);
// } else if (!params.isNode) {
//     current = new Wallet(params.selfPort, params.peers);
// }

// current.init();

// console.log('Wired up');

// let f = new FullNode()
// let w = new Wallet()



const {
    Blockchain,
    Block,
    Transaction
} = require('./Blockchain.js');

const { sign } = require('crypto');


let b1=new Blockchain()
let b2=new Blockchain()
let b3=new Blockchain()
let b4 = new Blockchain()

console.log('\n balance of Bob ', b1.getBalanceOfAddress('Bob'))
console.log('\n balance of John ', b2.getBalanceOfAddress('John'))
console.log('\n balance of David ', b3.getBalanceOfAddress('David'))
console.log('\n balance of William ', b4.getBalanceOfAddress('William'))

b1.addTransaction(new Transaction('John', 'Bob', 1000))
b1.addTransaction(new Transaction('David', 'Bob', 1000))
b1.addTransaction(new Transaction('William', 'Bob', 300))

b2.addTransaction(new Transaction('Bob', 'John', 1200))
b2.addTransaction(new Transaction('David', 'John', 500))
b2.addTransaction(new Transaction('William', 'John', 600))

b3.addTransaction(new Transaction('Bob', 'David', 600))
b3.addTransaction(new Transaction('John', 'David', 800))
b3.addTransaction(new Transaction('William', 'David', 900))

b4.addTransaction(new Transaction('Bob', 'William', 700))
b4.addTransaction(new Transaction('John', 'William', 800))
b4.addTransaction(new Transaction('David', 'William', 800))


console.log('Start Mining block 1 for Bob .....')
b1.minePendingTransactions('Bob')

console.log('Start Mining block 1 for John .....')
b2.minePendingTransactions('John')

console.log('Start Mining block 1 for David .....')
b3.minePendingTransactions('David')

console.log('Start Mining block 1 for William .....')
b4.minePendingTransactions('William')


// console.log('\n balance if Bob ', b4.getBalanceOfAddress('Bob'))
// console.log('\n balance if B ', b.getBalanceOfAddress('B'))
// console.log('\n balance if B1 ', b1.getBalanceOfAddress('B1'))
// console.log('\n balance if B2 ', b2.getBalanceOfAddress('B2'))

//console.log('Start Mining again....')

//b4.addTransaction(new Transaction('Bob', 'address1', 50))

//b4.minePendingTransactions('Bob')



console.log(JSON.stringify(b1, null, 4))
console.log(JSON.stringify(b2, null, 4))
console.log(JSON.stringify(b3, null, 4))
console.log(JSON.stringify(b4, null, 4))

console.log('\n balance of Bob ', b1.getBalanceOfAddress('Bob'))
console.log('\n balance of John ', b2.getBalanceOfAddress('John'))
console.log('\n balance of David ', b3.getBalanceOfAddress('David'))
console.log('\n balance of William ', b4.getBalanceOfAddress('William'))