const express=require('express')
const mongoose=require('mongoose')
const bodyParser = require("body-parser");
const ejs = require("ejs");
const userRouter=require('./routers/userRouter')

const app=express()
const port=3000

const uri = 'mongodb://localhost:27017/antakshariDB';
mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true });
const db = mongoose.connection;

db.on("error", (err) => {
    console.log(err);
});

db.once("open",() => {
    console.log("database connected");
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json())
app.use('/', userRouter)

app.use('/',express.static(__dirname + "/public"));

app.listen(port,()=>{
    console.log('Server is up on the port '+port+" !")
})