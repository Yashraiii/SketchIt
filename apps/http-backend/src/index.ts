import express from "express";
import { Request,Response } from "express";
import { roomRoute } from "./routes/room.route.js";
const PORT = 8080;
const app = express();
app.use(express.json())


app.use('/api/room',roomRoute)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});