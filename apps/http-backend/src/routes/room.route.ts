import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { CreateRoomController, DeleteRoomController, GetRoomsConttroller, 
JoinRoomController,GetCanvasDataController,SaveCanvasDataController } from "../controllers/room.controllers.js";



const roomRoute:Router = Router()
roomRoute.use(authMiddleware)

roomRoute.post('/room',CreateRoomController)
roomRoute.post('/room/join',JoinRoomController)
roomRoute.get('/rooms',GetRoomsConttroller)
roomRoute.delete('/room',DeleteRoomController)
roomRoute.get('/canvas/get', GetCanvasDataController);
roomRoute.post('/canvas/save', SaveCanvasDataController);

export {roomRoute}