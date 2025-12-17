import { Request, Response } from "express"
import { vehicleService } from "./vehicle.service.js";
// import { vehicleService } from "./vehicle.service"

const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.createVehicleIntoDB(req.body)
    const result = vehicle.rows[0];
    result.daily_rent_price = Number(result.daily_rent_price)
    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result
    })
  }
  catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

const getAllVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicleIntoDB();
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: result.rows
      })
    }

    else {
      return res.status(200).json({
        success: true,
        message: "Vehicles retrieved successfully",
        data: result.rows
      })
    }
  }
  catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }
}

const getSingleVehicle = async (req: Request, res: Response) => {
  try {

    const result = await vehicleService.getSingleVehicleIntoDB(req.params.vehicleId as string);

    if (!result) {

      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
        data: result
      })
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result
    })
  }

  catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const updateVehicle = async (req: Request, res: Response) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body
  try {
    const result = await vehicleService.updateVehicleIntoDB(vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.vehicleId as string)
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
       
      })
    }
    else {
      return res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
        data:result
      })
    }
  }
  catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.deleteVehicleFromDB(req.params.vehicleId as string);
    if (  result.statement === "NOT_FOUND" ) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      })
    }
   if(result.statement === "BOOKED" ){
      return res.status(400).json({
        success: false,
        message: "Vehicle is already booked"
      })
    }

    if(result.statement === "DELETED" ){
      return res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully"
      })
    }
    
  }
 
  catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


export const vehicleController = {
  createVehicle,
  getAllVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle
}