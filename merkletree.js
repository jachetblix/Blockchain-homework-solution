const SHA256 = require('crypto-js/sha256');

class MerkleTree {

  constructor (data) {
    const leaves = data.map(x => x.calculateHash())
    this._levels = [leaves].concat(this._derive(leaves))
  }

  transactionProof(transaction){
    let indexOf = this.leaves.indexOf(transaction);
    return this.proof(indexOf);
  }

  proof (index) {
    let proof = [];

    for (let i = 0; i < this.depth; i++) {
      let level = this.levels[i];
      let width = level.length;
      if (!(index === width - 1 && width % 2 === 1)) {
        const left = (index % 2) ? level[index - 1] : level[index];
        const right = (index % 2) ? level[index] : level[index + 1];
        proof.push([left, right]);
      }
      index = Math.floor(index / 2);
    }

    return proof
  }

  _derive (data) {
    let level = [];
    for (let i = 0; i < data.length; i += 2) {
      const left = data[i];
      const right = (i + 1 === data.length)
        ? left
        : data[i + 1];
      const node = JSON.stringify([left, right]);
      level.push(SHA256(node).toString());
    }
    if (level.length > 1) {
      return [level].concat(this._derive(level));
    } else {
      return [level];
    }
  }

  get root () {
    return this.levels[this.levels.length - 1][0];
  }

  get depth () {
    return this.levels.length;
  }

  get levels () {
    return this._levels;
  }

  get leaves () {
    return this.levels[0];
  }
}

module.exports.MerkleTree = MerkleTree;