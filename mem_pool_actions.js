const fs = require('fs');
const { Transaction } = require('./Blockchain');

class MemPoolActions {
    writeTransaction(transaction, type) {
        console.log(`Writing data for ${type}..`);
        let memData = this.readTransaction();
        if (memData) {
            memData.push(transaction);
        } else {
            memData = [transaction];
        }
        fs.writeFileSync('./mem_pool.json', JSON.stringify(memData));
        console.log('Done writing.');
    }

    readTransaction() {
        let text = fs.readFileSync('./mem_pool.json');
        let arr = JSON.parse(text.toString());
        let transactions = [];
        if (arr.length) {
            arr.forEach(a => {
                transactions.push(new Transaction(a.fromAddress, a.toAddress, a.amount));
            });
            return transactions;
        }
    }

    clear() {
        fs.writeFileSync('./mem_pool.json', '[]');
    }
}

module.exports.MemPoolActions = MemPoolActions;