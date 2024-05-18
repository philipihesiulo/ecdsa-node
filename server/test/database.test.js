const sqlite3 = require("sqlite3").verbose();
const Database = require("../database");
const connection = new sqlite3.Database("./test/test_data.db");
//const {connectDB, getBalance, getAllBalances, addAccount, updateBalance} = require('../database');
const db = new Database(connection);

describe("Check Database Functions", () => {
    const testAddress = "20x34";
    const testBalance = 20;
    it("Should return success on creation of accounts table", () => {
        db.createAccountsTable().then((data) => {
            expect(data).toBe("Success");
        });
    });

    it("Should create an account with success if address is unique", () => {
        db.getBalance(testAddress).then(null, (error) => {
            if (error) {
                db.addAccount(testAddress, testBalance).then((data) => {
                    expect(data).toBe("Success");
                });
            }
        });
    });

    it("Should return an error if address doesn't exist while getting balance", () => {
        expect(db.getBalance("Wrong Address")).rejects.toThrow(Error);
    });

    it("Should return an Integer for valid account balance", () => {
        db.getBalance(testAddress).then((balance) => {
            expect(typeof balance).toBe("number");
        });
    });

    it("Should set a new address balance", () => {
        const sentBalance = Math.floor(Math.random() * 101);
        db.updateBalance(testAddress, sentBalance).then(async (data) => {
            const currentBalance = await db.getBalance(testAddress);
            expect(currentBalance).toBe(sentBalance);
        }, null);
    });
});
