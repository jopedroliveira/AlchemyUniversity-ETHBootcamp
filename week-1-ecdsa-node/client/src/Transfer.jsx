import { useState } from "react";
import { toHex, utf8ToBytes} from "ethereum-cryptography/utils"
import { keccak256 } from "ethereum-cryptography/keccak";
import { sign } from "ethereum-cryptography/secp256k1";

import server from "./server";

function Transfer({ privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  
  async function transfer(evt) {
    evt.preventDefault();
    
    const data = { amount: parseInt(sendAmount), destination: recipient }
    const transactionHash = keccak256(utf8ToBytes(toString(data)))
    const [signature, recoveryBit] = await sign(transactionHash, privateKey, { recovered: true })
    
    
    try {
      const { data: { balance } } = await server.post(`send`, {
        data,
        transactionHash: toHex(transactionHash),
        signature: toHex(signature),
        recoveryBit,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}/>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address removing the initial 0x"
          value={recipient}
          onChange={setValue(setRecipient)} />
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
