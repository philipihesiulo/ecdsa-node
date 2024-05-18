const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { sha256 } = require("ethereum-cryptography/sha256");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const secp = secp256k1;

function generateAddress() {
    const privateKey = toHex(secp.utils.randomPrivateKey());
    const longPublicKey = toHex(secp.getPublicKey(privateKey));
    const publicKey = longPublicKey.slice(-20);
    return { privateKey, publicKey };
}

function generateAddressFromSignature(messageHash, signature) {
    const { r, s, recovery } = signature;

    const sig = new secp.Signature(BigInt(r), BigInt(s), recovery);
    const publicKey = sig.recoverPublicKey(messageHash).toHex();

    return publicKey.slice(-20);
}

module.exports = { generateAddress, generateAddressFromSignature };
