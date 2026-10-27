import dotenv from "dotenv";
dotenv.config();
import {AddCanvasData, DeleteRoom, JoinRoom, RoomInput } from "@repo/common/types";
import { prisma } from "@repo/db/client";
import { nanoid } from "nanoid";
import { PrismaClient } from "../../../../packages/db/generated/prisma/client.js";
const makeSlug = async (nanoId: string) => {
  const a =
    nanoId.slice(0, 3) + "-" + nanoId.slice(3, 6) + "-" + nanoId.slice(6, 9);
  return a;
};
const createRoomService = async({userId,name}:RoomInput)=>{
    const slug = await makeSlug(nanoid(12))
    const addRoom = await prisma.workspace.create({
        data:{
            name:name,
            slug:slug,
            users:{
                connect:{
                    id:userId
                }
            }
            
        }
    })
    return addRoom
}

const getRoomsService = async(userId:string)=>{
    //get all rooms by a particular userid 
    const rooms = await prisma.workspace.findMany({
        where:{
            users:{
                some:{
                    id:userId
                }
            }
        },
        orderBy:{
            createdAt:"desc"
        },
        select:{
            id:true,
            name:true,
            slug:true,
            createdAt:true,
            _count:{
                select:{
                    users:true
                }
            }
        }
    })
    return rooms.map((room)=>({
        id : room.id,
        slug : room.slug,
        name: room.name,
        updatedAt : room.createdAt,
        isShared: room._count.users > 1,
    }))

}
const joinRoomService = async({userId,slug}:JoinRoom)=>{
    try{
        const isRoom = await prisma.workspace.update({
            where:{
                slug
            },
            data:{
                users:{
                    connect:{
                        id:userId
                    }
                }
            }
        })
        return isRoom

    }
    catch(error){
        throw new Error("WorkSpace does not exist")
    }
}

const deleteRoomService = async({roomId,userId}:DeleteRoom)=>{
    try{
        const workspace = await prisma.workspace.delete({
            where:{
                id:roomId
            },
            include:{
                users:{
                    select:{
                        id:true
                    }
                }
            }
        })
        return workspace
    }
    catch(error){
        throw new Error("Not able to delete workspace")
    }
}
const saveCanvasDataService  = async({roomId,userId,canvasData}:AddCanvasData)=>{
    try{
        const workspace = await prisma.workspace.findUnique({
            where:{
                slug:roomId
            }
        })
        const pageData = await prisma.canvas.upsert({
            where: {
                workspaceId: workspace?.id || ""
            },
            update:{
                data:canvasData,
                userId
            },
            create:{
                workspaceId: workspace?.id || "",
                userId:userId,
                data:canvasData
                
            }
        })
        return canvasData
    }
    catch(error){
        throw new Error("Something went wrong")
    }
}
const getcanvasService = async(workspaceId:string)=>{
    try{
        const canvasData = await prisma.canvas.findUnique({
            where:{
                id:workspaceId
            }
        })
        return canvasData
    }
    catch(error){
        throw new Error("Not able to fetch data")
    }
}


export {createRoomService,
    getRoomsService,
    joinRoomService,
    deleteRoomService,
    getcanvasService,
    saveCanvasDataService}