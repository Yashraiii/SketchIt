import express from "express";
import http from "http"
import { WebSocketServer } from 'ws';

const PORT = 8090
const app = express();

app.use(express.json())

app.get('/ws',(req,res)=>{
    res.send("Hello  fromt the webSocket server")
})
//create a webSocketServer
const server = http.createServer(app)

const wss = new WebSocketServer({server:server})

wss.on('connection',(ws)=>{
    console.log('client connected');
    ws.send('Welcome to the WebSocket server');
    ws.on('message',(data,isBinary)=>{
        wss.clients.forEach((client)=>{
            if(client.readyState===ws.OPEN){
                client.send(data,{
                    binary:isBinary
                });
            }
        })
    })
    ws.on('close',()=>{
        console.log('client disconnected');
    })
    ws.on('error',(err)=>{
        console.error('WebSocket error:', err);
    })
})