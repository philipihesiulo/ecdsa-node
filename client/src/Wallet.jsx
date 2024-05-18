import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";

const secp = secp256k1;

function Wallet({
    address,
    setAddress,
    balance,
    setBalance,
    privateKey,
    setPrivateKey,
}) {
    async function onChange(evt) {
        const privateKey = evt.target.value;
        const address = toHex(secp.getPublicKey(privateKey)).slice(-20);
        setPrivateKey(privateKey);
        setAddress(address);
        if (address) {
            const {
                data: { balance },
            } = await server.get(`balance/${address}`);
            setBalance(balance);
        } else {
            setBalance(0);
        }
    }

    return (
        <div className="container wallet">
            <h1>Your Wallet</h1>

            <label>
                Wallet Private Key
                <input
                    placeholder="Input the Private Key for your wallet"
                    value={privateKey}
                    onChange={onChange}
                ></input>
            </label>
            <div>Address: {address}</div>

            <div className="balance">Balance: {balance}</div>
        </div>
    );
}

export default Wallet;
