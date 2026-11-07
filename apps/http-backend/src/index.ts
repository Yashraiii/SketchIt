import express from "express";
import cors from "cors";
import { roomRoute } from "./routes/room.route.js";
const PORT = process.env.PORT || 8080
const app = express();

app.use(cors());

app.use(express.json())


app.use('/api/room',roomRoute)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});