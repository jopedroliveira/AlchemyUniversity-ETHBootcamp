const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak")

for (let i = 0; i < 3; i++) {
  const privatekey = secp.utils.randomPrivateKey()
  console.log("privateKey:", toHex(privatekey))

  const publicKey = secp.getPublicKey(privatekey)
  console.log("publicKey:", toHex(publicKey))

  const address = keccak256(publicKey.slice(1)).slice(-20)
  console.log("address:", toHex(address))
}


// server side
// const secp = require("ethereum-cryptography/secp256k1");
// async function recoverKey(message, signature, recoveryBit) {
//   const msgHash = hashMessage(message)
//   const recoveredPublicKey = secp.recoverPublicKey(msgHash, signature, recoveryBit)
//   return recoveredPublicKey
// }

// client side
// const secp = require("ethereum-cryptography/secp256k1");
// const hashMessage = require('./hashMessage');

// const PRIVATE_KEY = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";

// async function signMessage(msg) {
//     const msgHash = hashMessage(msg)
//     const signedMsg = await secp.sign(msgHash, PRIVATE_KEY, { recovered: true})
//     return signedMsg
// }
// const { keccak256 } = require("ethereum-cryptography/keccak");
// const { utf8ToBytes } = require("ethereum-cryptography/utils");

// function hashMessage(message) {
//     return keccak256(utf8ToBytes(message))
// }
