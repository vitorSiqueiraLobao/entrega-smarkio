const express = require('express')
const cors = require('cors')
const app = express()
const pool = require('./db')

app.use(express.json())
app.use(cors())

//get full history

app.get("/history/full",async (req, res)=>{
    try{
        const fullHistory = await pool.query("SELECT * FROM history ORDER BY city_id DESC")
        res.json(fullHistory.rows)
    }catch(e){
        console.error(e)
    }
})
//get top 5 search's

app.get("/history/top",async (req, res)=>{
    try{
        console.log(req.params)
        const history = await pool.query(`select city_name, count(*) as ct from history group by 1 order by ct DESC limit 5`)
        res.send(history.rows)
    }catch(e){
        console.error(e)
    }
})

//get a history item
app.get("/history/:id",async (req, res)=>{
    try{
        const history = await pool.query(`SELECT * FROM history WHERE city_id = ${req.params.id}`)
        res.send(history.rows)
    }catch(e){
        console.error(e)
    }
})

//create a history item

app.post("/history",async (req, res)=>{
    try{
        const newHistoryItem = await pool.query(
            `INSERT INTO history (city_name) VALUES ('${req.body.city_name}') RETURNING *`
            )
        res.send(newHistoryItem)
    }catch(e){
        console.error(e)
    }
})

//delete a history item

app.delete("/history/:id",async (req, res)=>{
    try{
        const deletedItem = await (await (pool.query(`DELETE FROM history WHERE city_id = ${req.params.id}`))).rows[0]
        res.send(deletedItem)
    }catch(e){
        console.error(e)
    }
})

app.listen(5000,()=>{
    console.log('listening on port 5000')
})