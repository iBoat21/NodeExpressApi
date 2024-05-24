const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
const app = express()
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

let conn = null

const connectMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'testphp',
        port: 3306
    })
}

// Get all users func
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM employee')
    res.json(results[0])
})

// POST user into db
app.post('/users', async (req, res) => {
    try {
        let employee = req.body
        const results = await conn.query('INSERT INTO employee SET ?', employee)
        res.json({
            msg: 'insert success',
            data: results[0]
        })
    } catch (error) {
        console.log('error', error.msg);
        res.status(500).json({
            msg: 'something wrong',
        })
    }
    // console.log('results',results);
})

//get user by id
app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('SELECT * FROM employee WHERE id = ?', id)

        if (results[0].length == 0) {
            throw { statusCode: 404, msg: 'Not Found Kub' }

        }
        res.json(results[0][0])
        // }else{
        //     res.status(404).json({
        //          msg : 'not found'
        //      })
        // }
    } catch (error) {
        console.log('error', error.msg);
        let statusCode = error.statusCode || 500
        res.status(500).json({
            msg: 'something wrong',
            error: error.msg
        })
    }
})

//update user by name and id
app.put('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        let employee = req.body
        const results = await conn.query('UPDATE employee SET ? WHERE id = ?', [employee, id])
        res.json({
            msg: 'update success',
            data: results[0]
        })
    } catch (error) {
        console.log('error', error.msg);
        res.status(500).json({
            msg: 'something wrong'
        })
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('DELETE from employee WHERE id = ?', id)
        res.json({
            msg: 'delete success',
            data: results[0]
        })
    } catch (error) {
        console.log('error', error.msg);
        res.status(500).json({
            msg: 'something wrong'
        })
    }
})

const port = 8000
app.listen(port, async (req, res) => {
    await connectMySQL()
    console.log('http server run on port', port,);
})