const {recoverPublicKey, verify } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0xc26fbaadec0fefc0e1c43f7dc3a16bb35d63bc33": 100,
  "0xfba168dd4ffa944c4d124552a21e6547bf77cb9c": 50,
  "0xfc5ebdba90b39499252579932482ce3e1487cf68": 75,
};

// todo: move to utils.js
function recoverKey(transactionHash, signature, recoveryBit) {
  return recoverPublicKey(transactionHash, signature, recoveryBit)
}

// todo: move to utils.js
function getAddress(publicKey) {
  return "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20))
}

// todo: move to utils.js
function isTransactionValid(data, transactionHash) {
  return toHex(keccak256(utf8ToBytes(data))) === transactionHash
}

// todo: move to utils.js
function isSignatureValid(signature, transactionHash, publicKey){
  return verify(signature, transactionHash, publicKey);
}


app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { data, transactionHash, signature, recoveryBit } = req.body;
  
  if (!isTransactionValid(toString(data), transactionHash))
    return res.status(400).send({ message: 'Invalid hash' });    

  const publicKey = recoverKey(transactionHash, signature, recoveryBit)
  
  if (!isSignatureValid(signature, transactionHash, publicKey))
    return res.status(400).send({ message: 'Invalid signature' });  

  const originAddress = getAddress(publicKey)
  const destinationAddress = data.destination

  setInitialBalance(originAddress);
  setInitialBalance(destinationAddress);

  if (balances[originAddress] < data.amount) {
    return res.status(400).send({ message: 'Not enough funds' });  
    
  }
  
  balances[originAddress] -= data.amount;
  balances[destinationAddress] += data.amount;
  res.send({ balance: balances[originAddress] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
