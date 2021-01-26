const topology = require('fully-connected-topology')
const { stdin, exit, argv } = process;

class P2p {
    constructor(selfPort, peersPort) {
        this.selfIp = `127.0.0.1:${selfPort}`;
        this.peerIps = peersPort.map(peer => `127.0.0.1:${peer}`);
    }
}

module.exports.P2p = P2p;