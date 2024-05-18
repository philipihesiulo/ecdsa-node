class Database {
    constructor(connection) {
        this.db = connection;
    }

    createAccountsTable() {
        return new Promise((resolve, reject) => {
            const query =
                "CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY AUTOINCREMENT,  address TEXT NOT NULL UNIQUE, balance INTEGER NOT NULL);";
            const queryParams = [];
            this.db.run(query, queryParams, (error) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                return resolve("Success");
            });
        });
    }

    getBalance(address) {
        return new Promise((resolve, reject) => {
            const query = "SELECT balance FROM accounts WHERE address = ?;";
            const queryParams = [address];
            this.db.get(query, queryParams, function (error, row) {
                if (error) {
                    return reject(new Error(error));
                } else if (!row) {
                    return reject(new Error("Address doesn't exist!"));
                }
                return resolve(row.balance);
            });
        });
    }

    getAllBalances() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM accounts;", function (error, rows) {
                if (error) {
                    return reject(error);
                } else if (rows.length === 0) {
                    return reject(new Error("No accounts exits"));
                }
                return resolve(rows);
            });
        });
    }

    addAccount(address, initialBalance) {
        return new Promise((resolve, reject) => {
            const query =
                "INSERT INTO accounts (address, balance) VALUES (?, ?);";
            const queryParams = [address, initialBalance];
            this.db.run(query, queryParams, function (error) {
                if (error) {
                    return reject(error);
                }
                return resolve("Success");
            });
        });
    }

    updateBalance(address, balance) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE accounts SET balance  = ? WHERE address = ?;";
            const queryParams = [balance, address];
            this.db.run(query, queryParams, function (error) {
                if (error) {
                    return reject(error);
                }
                return resolve("Success");
            });
        });
    }
}

module.exports = Database;
