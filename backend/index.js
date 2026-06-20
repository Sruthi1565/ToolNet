require('dotenv').config(); // Load environment variables

const express=require('express')
const app=express()
const cors = require('cors');
const port=process.env.PORT || 5000
const host=process.env.HOST;
const mongoDB=require("./db");
const path = require('path');
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(cors({
    origin: clientUrl, // Allow requests from the configured frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  }));

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin",clientUrl);
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
app.use('/api/requests',require("./Routes/Requests"));
app.use('/api',require("./Routes/MyTools"));
app.use('/api',require("./Routes/UpdateProfile"));
const startServer = () => {
    console.log(`app listening on ${host || '0.0.0.0'}:${port}`)
};

if (host) {
    app.listen(port, host, startServer)
} else {
    app.listen(port, startServer)
}
