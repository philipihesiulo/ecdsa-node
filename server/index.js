const { generateAddress, generateAddressFromSignature } = require("./generate");

//const JSONBig = require("json-bigint");

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const Database = require("./database");

const connection = new sqlite3.Database("./data.db");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const db = new Database(connection);
db.createAccountsTable();

app.get("/balance/:address", async (req, res) => {
    const { address } = req.params;
    const balance = (await db.getBalance(address)) || 0;
    res.send({ balance });
});

app.post("/account/", (req, res) => {
    const { privateKey, publicKey } = generateAddress();
    const initialBalance = 25;
    db.addAccount(publicKey, initialBalance).then(
        (message) => {
            res.send({
                address: publicKey,
                privateKey,
                initialBalance,
                message,
            });
        },
        (error) => {
            res.send({ message: error.message });
        }
    );
});

app.post("/send", async (req, res) => {
    const { message, messageHash, signature } = JSON.parse(
        req.body.transaction
    );

    const { recipient, amount } = message;
    const sender = generateAddressFromSignature(messageHash, signature);
    const senderBalance = await db.getBalance(sender);
    const reciepentBalance = await db.getBalance(recipient);

    if (senderBalance < amount) {
        res.status(400).send({ message: "Not enough funds!" });
    } else if (sender == recipient) {
        res.status(400).send({ message: "You can't send funds to  yourself!" });
    } else {
        await db.updateBalance(sender, senderBalance - amount);
        await db.updateBalance(recipient, reciepentBalance + amount);
        res.send({ balance: await db.getBalance(sender) });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
