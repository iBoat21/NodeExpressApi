const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
const app = express()

app.use(bodyParser.json())

let users =[]
let counter = 1


//db promise
app.get('/testdb',(req,res)=>{
    mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'testphp',
        port: 3306
    }).then((conn)=>{
        conn
        .query('SELECT * FROM employee')
        .then((results)=>{
            res.json(results[0])
        })
        .catch((error)=>{
            console.log('Error Fetching employees: ',error.msg);
            res.status(500).json({error: 'Error fetching employee'})
        })

    })
})

app.get('/testNewdb', async (reg,res)=>{
    try {
        const conn = await mysql.createConnection({
            host:'localhost',
            user:'root',
            password:'',
            database:'testphp',
            port: 3306
        })
        const results = await conn.query('SELECT * FROM employee')
        res.json(results[0])
    } catch (error) {
         console.log('Error Fetching employees: ',error.msg);
            res.status(500).json({error: 'Error fetching employee'})
    }

})


app.get('/users',(req,res)=>{
    res.json(users)
})

app.post('/user',(req,res)=>{
    let user = req.body
    user.id = counter
    counter += 1

    users.push(user)
    res.json({
        msg:"add data ok",
        user:user
    })
})

app.get('/users',(req,res)=>{
    const filterUsers = users.map(user=>{
        return{
            id:user.id,
            firstName:user.firstName,
            lastName:user.lastName,
            fullname:user.firstName+' '+user.lastName
        }
    })
    res.json(filterUsers)
})

app.get('/users/:id',(req,res)=>{
    let id = req.params.id
    let selectedIndex = users.findIndex(user => user.id == id)
    res.json(users[selectedIndex])
})

app.patch('/user/:id',(req,res)=>{
    let id = req.params.id
    let updateUser = req.body
    let selectedIndex = users.findIndex(user => user.id == id)

    //users[selectedIndex] = updateUser

    if(updateUser.firstName){
        users[selectedIndex].firstName = updateUser.firstName
    }
    if(updateUser.lastName){
        users[selectedIndex].lastName = updateUser.lastName
    }

    res.json({
        msg:'update complete',
        data:{
            user: updateUser,
            indexUpdate: selectedIndex
        }
    })
})

app.delete('/users/:id',(req,res)=>{
    let id = req.params.id
    let selectedIndex = users.findIndex(user => user.id == id)

    users.splice(selectedIndex, 1)       

    res.json({
        msg:'delete complete',
        indexDelete: selectedIndex
    })
})

const port = 8000
app.listen(port,(req,res)=>{
    console.log('http server run on',+ port);
})