const express=require('express')
const app=express()
const cors = require('cors');
const port=5000
const mongoDB=require("./db");
const path = require('path');
require('dotenv').config(); // Load environment variables

const nodemailer = require('nodemailer');

app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  }));
app.use(cors());  

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    next();
})

mongoDB();
app.get('/',(req,res)=>{
    res.send('Hello World')
})
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api',require("./Routes/CreateUser"));
app.use('/api',require("./Routes/BrowseTools"));
app.use('/api',require("./Routes/CreateTool"));
app.use('/api',require("./Routes/Rent"));
app.use('/api',require("./Routes/CheckOut"));
app.use('/api/orders',require("./Routes/Orders"));
app.use('/api',require("./Routes/MyTools"));
app.use('/api',require("./Routes/UpdateProfile"));
app.listen(port,()=>{
    console.log(`app listening on port ${port}`)
})