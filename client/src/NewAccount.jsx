import { useState } from "react";
import server from "./server";

function NewAccount() {
    const [newAccount, setNewAcount] = useState({
        address: "",
        privateKey: "",
        initialBalance: "",
        message: "",
    });
    async function onRequest(evt) {
        server.post(`account`).then((response) => {
            setNewAcount(response.data);
        });
    }

    const { address, privateKey, initialBalance, message } = newAccount;

    return (
        <div className="container wallet">
            <h1>Create New Wallet</h1>
            <input
                type="submit"
                className="button"
                value="Request New Account"
                onClick={onRequest}
            />

            <div className="">Address: {address}</div>
            <div className="">Private Key: {privateKey}</div>
            <div className="">Balance: {initialBalance}</div>
            <div className="">Status: {message}</div>
        </div>
    );
}

export default NewAccount;
