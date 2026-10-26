
import express from 'express';
import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { createRemoteJWKSet, jwtVerify } from 'jose';



const PORT=8090

const app = express();

app.use(express.json())

const Server = http.createServer(app)
interface MessagePayload {
  type: string;
  roomId: string;
  payloadData: any; // Can be a string OR an object now
}
const wss: WebSocketServer = new WebSocketServer({server:Server})
const rooms = new Map<string, Set<WebSocket>>()
const currentState = new Map<string,string>()

const JWKS = createRemoteJWKSet(
    new URL(`${process.env.AUTH_URL}/api/auth/jwks`)
);
wss.on("connection",async(ws,request)=>{
    ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    });
    const url = request.url;
    if(!url){
        ws.close(4003,"Url Missing");
        return
    }
    //authentication
    try{
        const queryParams = new URLSearchParams(url.split("?")[1]);
        const token = queryParams.get("token") || "";
    
        const { payload } = await jwtVerify(token, JWKS);

        const userId = payload.sub;

        if (!userId) {
            ws.close(4003, "User identity missing");
            return;
        }
        ws.send(JSON.stringify({ type: "connection:ready" }));

    }
    catch(error){
        ws.close(4003,"Authemtication Failded")
        return;
    }
    //commmunication layer
    ws.on('message',(data)=>{
        let parsedData: MessagePayload;
        try{
            parsedData = JSON.parse(data.toString())
        }
        catch{
            return
        }
        const{type,roomId,payloadData} = parsedData
        switch(type){
            case "join_room":
                if(!rooms.has(roomId)){
                    rooms.set(roomId,new Set<WebSocket>)
                }
                rooms.get(roomId)?.add(ws)
                const roomJoinedData = {
                    type: "roomJoined",
                    roomId,
                    payloadData: true,
                };
                ws.send(JSON.stringify(roomJoinedData));
                const cachedData = currentState.get(roomId);
                if(cachedData){
                    ws.send(cachedData)
                }
                break
            case 'leave_room': {
                const clients = rooms.get(roomId);

                if (clients) {
                    clients.delete(ws);

                    if (clients.size === 0) {
                        rooms.delete(roomId);
                    }
                }

                break;
            }
            case 'page-sync':
                //broadcast message to all clients
                const instance = rooms.get(roomId);
                if(instance!=null && instance.has(ws)){
                    const rawData = data.toString()
                    currentState.set(roomId,rawData)
                    instance.forEach((clients)=>{
                        if(clients!=ws && clients.readyState===WebSocket.OPEN){
                            clients.send(rawData)
                        }
                    })
                }
            break
        }

    }) 

    ws.on("close",()=>{
        rooms.forEach((clients,id)=>{
            clients.delete(ws);
            if(clients.size==0){
                rooms.delete(id);
            }
        })
    });
})
Server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
