const express = require('express');
const app = express();


app.get("/",(req,res)=>{
    res.send("Hello there!!!");
});


const PORT   = 5000 || process.env.PORT;
app.listen(PORT, ()=>  console.log("App is running at port "+PORT));