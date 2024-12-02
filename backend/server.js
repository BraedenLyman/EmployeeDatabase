const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../backend/database');
const app = express();

app.use(bodyParser.json());
app.use(cors());

//get all employees in the database
app.get('/api', (req, res) => {
    db.all('SELECT * FROM employees', [], (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

//PUT new collection of employees
app.put('/api', (req, res) => {
    const newEmployee = req.body;
    db.serialize(() => {
        db.run('DELETE FROM employees');
        const stmt = db.prepare('INSERT INTO employees (fName, lName, age, sex) VALUES (?, ?, ?, ?)');
        newEmployee.forEach(emp => stmt.run(emp.fName, emp.lName, emp.age, emp.sex));
        stmt.finalize();
    });
    res.json({ status: 'REPLACE COLLECTION SUCCESSFUL' });
});

//POST new employee to current collection
app.post('/api', (req, res) => {
    const { fName, lName, age, sex } = req.body;
    db.run(
        'INSERT INTO employees (fName, lName, age, sex) VALUES (?, ?, ?, ?)',
        [fName, lName, age, sex],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ status: 'CREATE ENTRY SUCCESSFUL' })
        }
    );
});

//DELETE collection of employees
app.delete('/api', (req, res) => {
    db.run('DELETE FROM employees', [], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ status: 'DELETE COLLECTION SUCCESSFUL' });
    });
});

//GET employee by id
app.get('/api/:id', (req, res) => {
    db.get('SELECT * FROM employees WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).send(err);
        res.json(row);
    });
});

//PUT update employee by id
app.put('/api/:id', (req, res) => {
    const id = req.params.id;
    const { fName, lName, age, sex } = req.body;
    console.log(`Updating employee with ID: ${id}`);
    db.run(
        'UPDATE employees SET fName = ?, lName = ?, age = ?, sex = ? WHERE id = ?',
        [fName, lName, age, sex, id],
        function (err) {
            if (err) {
                console.error('SQL Error:', err.message);
                return res.status(500).json({ error: 'Error updating employee' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json({ status: 'UPDATE ITEM SUCCESSFUL' });
        }
    );
});

//DELETE employee by id
app.delete('/api/:id', (req, res) => {
    db.run('DELETE FROM employees WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ status: 'DELETE ITEM SUCCESSFUL'});
    });
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));