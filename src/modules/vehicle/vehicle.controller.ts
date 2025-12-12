import { Request, Response } from "express"
import { vehicleService } from "./vehicle.service"

const createVehicle = async(req:Request, res:Response)=>{
   try{
      const result = await vehicleService.createVehicleIntoDB(req.body)
      return res.status(200).json({
           success:true,
           message:"Vehicle created successfully",
           data: result.rows[0]
      })
   }
   catch(error:any){
    return res.status(500).json({
        success:true,
        message:error.message
    })
   }
}

const getAllUser = async (req: Request, res: Response) => {
   try{
    const result = await vehicleService.getAllVehicleIntoDB();
        return res.status(201).json({
            success:true,
            message:"User Created Successfully",
            data:result
        })
   }
   catch(err:any){
     return res.status(500).json({
        success:false,
        message:err.message
      })
   }
}
export const vehicleController={
createVehicle,
getAllUser
}