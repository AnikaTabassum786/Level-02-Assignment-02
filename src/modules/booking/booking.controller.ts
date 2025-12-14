import { Request, Response } from "express"
import { bookingService } from "./booking.service"

const createBooking = async(req:Request, res:Response)=>{
   try{
      const result = await bookingService.createBookingIntoDB(req.body)
      return res.status(200).json({
           success:true,
           message:"Booking created successfully",
           data: result
      })
   }
   catch(error:any){
    return res.status(500).json({
        success:true,
        message:error.message
    })
   }
}


const getAllBooking = async(req:Request, res:Response) => {
      try {
           const result = await bookingService.getAllBookingFromDB();
           return res.status(200).json({
               success: true,
               message: "Bookings retrieved successfully",
               data: result
           })
       }
       catch (err: any) {
           return res.status(500).json({
               success: false,
               message: err.message
           })
       }
   }

export const bookingController={
createBooking,
getAllBooking,
}

