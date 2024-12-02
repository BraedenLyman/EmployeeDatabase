/**
 * "StAuth10244: I Braeden Lyman, 000370695 certify that this material is my original work. 
 *  No other person's work has been used without due acknowledgement. 
 *  I have not made my work available to anyone else."
 */
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('employee.db');

db.serialize(() => {
    // create Employee table
    db.run(`CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        fName TEXT,
        lName TEXT,
        age INTEGER,
        sex TEXT
    )`)

    // Insert initial items
    const insertStmt = db.prepare(`INSERT INTO employees (fName, lName, age, sex) VALUES (?, ?, ?, ?)`);
    insertStmt.run( 'Braeden', 'Lyman', 27, 'M' );
    insertStmt.run( 'Alex', 'Lyman', 25, 'F' );
    insertStmt.run( 'Justin', 'Burns', 20, 'M');
    insertStmt.run( 'Olivia', 'Amberson', 30, 'F');
    insertStmt.run( 'Jackson', 'Smith', 19, 'O');
    insertStmt.finalize();
})

module.exports = db;