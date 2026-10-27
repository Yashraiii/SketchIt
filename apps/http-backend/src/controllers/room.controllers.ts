import { addCanvasDataSchema, deleteRoomSchema, joinRoomSchema, roomSchema } from "@repo/common/types"
import { Request,Response } from "express"
import { createRoomService, deleteRoomService, getcanvasService, getRoomsService, joinRoomService, saveCanvasDataService } from "../service/room.service.js"
import { readSync } from "node:fs"

const CreateRoomController = async(req:Request,res:Response)=>{
    //validate the data
    const parsedData = roomSchema.safeParse({
        ...req.body,
        userId: req.user?.sub
    })
    if(!parsedData.success){
        return res.status(500).json({
            message:"Invalid request data",
            errors:parsedData.error
        })
    }
    try{
        const roomData = await createRoomService(parsedData.data)
        return res.status(200).json({
            message:"Room created successfully",
            data:roomData
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Something went wrong"
        })
    }

}
const JoinRoomController = async(req:Request,res:Response)=>{
    //validate
    const parsedData = joinRoomSchema.safeParse({
        slug:req.body.slug,
        userId:req.user?.sub
    })
    if(!parsedData.success){
        return res.status(500).json({
            message:"Invalid request data",
            errors:parsedData.error
        })
        
    }
    try{
        const data = await joinRoomService(parsedData.data);
        return res.status(200).json({
            message:"Room joined successfully"
        })

    }
    catch{
        return res.status(500).json({
            message:"Something went wrong"
        })
    }
}

const GetRoomsConttroller = async(req:Request,res:Response)=>{
    try{
        if(!req.user?.sub){
            return
        }
        const userId:string = req.user?.sub;
        const results = await getRoomsService(userId);
        return res.status(200).json({
            message:"Got all rooms successfully",
            data:results
        })

    }
    catch{
        return res.status(500).json({
            message:"Unable to  get rooms"
        })
    }
}

const DeleteRoomController = async(req:Request,res:Response)=>{
    const parsedData = deleteRoomSchema.safeParse({
        roomId:req.body.roomId,
        userId:req.user?.sub
    })
    if(!parsedData.success){
        return res.status(500).json({
            message:"Invalid request data",
            errors: parsedData.error
        })
    }
    try{
        const data = await deleteRoomService(parsedData.data);
        return res.status(200).json({
            message:"Room deleted successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Something went wrong"
        })
    }
}
const SaveCanvasDataController = async(req:Request,res:Response)=>{
    const userId = req.user?.sub
    //validate data
    const parsedData = addCanvasDataSchema.safeParse({
        roomId:req.body.roomId,
        userId,
        canvasData:req.body.canvasData
    })
    if(!parsedData.success){
        return res.status(500).json({
            message:"Invalid request data"
        })
    }
    try{
        const saveData = await saveCanvasDataService(parsedData.data)
        return res.status(200).json({
            message:"Canvas Data saved successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Something went wrong"
        })
    }
}
const GetCanvasDataController = async(req:Request,res:Response)=>{
    const slug = (req.query.slug || req.params.slug) as string;

    if (!slug) {
        return res.status(400).json({ message: "Slug is required" });
    }
    try{
        const savedData = await getcanvasService(slug);
        return res.status(200).json({
            message:"Data Fetched Successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Something went wrong"
        })
    }
}
export{
    CreateRoomController,
    JoinRoomController,
    GetRoomsConttroller,
    DeleteRoomController,
    GetCanvasDataController
}
