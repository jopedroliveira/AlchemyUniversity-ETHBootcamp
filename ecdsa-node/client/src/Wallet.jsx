import server from "./server";
import { getPublicKey } from "ethereum-cryptography/secp256k1"
import { toHex } from "ethereum-cryptography/utils"
import { keccak256 } from "ethereum-cryptography/keccak";

function getAddress(privateKey) {
  const publicKey = getPublicKey(privateKey)
  const address = keccak256(publicKey.slice(1)).slice(-20)
  return '0x' + toHex(address)
}

function Wallet({ privateKey, setPrivateKey, balance, setBalance }) {
  const address = privateKey ? getAddress(privateKey) : ''

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    
    if (privateKey) {
      const address = getAddress(privateKey)
      const { data: { balance } } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Wallet Address
        <input placeholder="Type your private key" value={address} onChange={onChange}></input>
      </label>
      <p>Private key is not stored and is only used to sign your transaction</p>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
