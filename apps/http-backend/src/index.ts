import express from "express";
import { Request,Response } from "express";
const PORT = 8080;
const app = express();
app.use(express.json())


app.get('/',(req,res)=>{
    res.send("Hello from the server");
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});