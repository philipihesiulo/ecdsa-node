import { secp256k1 as secp } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

import { useState } from "react";
import server from "./server";

function Transfer({ setBalance, privateKey }) {
    const [sendAmount, setSendAmount] = useState("");
    const [recipient, setRecipient] = useState("");

    const setValue = (setter) => (evt) => setter(evt.target.value);

    async function transfer(evt) {
        evt.preventDefault();

        const message = {
            recipient,
            amount: Number(sendAmount),
        };

        const messageHash = toHex(
            keccak256(utf8ToBytes(JSON.stringify(message)))
        );

        const address = secp.getPublicKey(privateKey);
        const signature = await secp.sign(messageHash, privateKey);

        const transaction = JSON.stringify(
            {
                message,
                messageHash,
                signature,
            },
            (key, value) => {
                if (typeof value == "bigint") {
                    return value.toString();
                }
                return value;
            }
        );

        try {
            const {
                data: { balance },
            } = await server.post(`send`, { transaction });
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
                    onChange={setValue(setSendAmount)}
                ></input>
            </label>

            <label>
                Recipient
                <input
                    placeholder="Type an address, for example: 0x2"
                    value={recipient}
                    onChange={setValue(setRecipient)}
                ></input>
            </label>

            <input type="submit" className="button" value="Transfer" />
        </form>
    );
}

export default Transfer;
