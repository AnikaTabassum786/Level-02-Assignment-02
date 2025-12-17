import { Request, Response } from "express"
import { bookingService } from "./booking.service.js"
// import { bookingService } from "./booking.service"

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingService.createBookingIntoDB(req.body)
        return res.status(200).json({
            success: true,
            message: "Booking created successfully",
            data: result
        })
    }
    catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const getAllBooking = async (req: Request, res: Response) => {
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

const getOwnBooking = async (req: Request, res: Response) => {

    try {
        const loginUser = req.user;
        const result = await bookingService.getOwnBookingFromDB(loginUser?.id)

        if (result.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No bookings yet",
                data: result
            })
        }
        return res.status(200).json({
            success: true,
            message: "Your bookings retrieved successfully",
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

const updateBookingStatusByAdmin = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        if(status !== 'returned'){
           return res.status(400).json({
            success: false,
            message: "Admin can mark booking as returned",
        })
        }

        const result = await bookingService.updateBookingByAdminIntoDB( req.params.bookingId as string)

        return res.status(200).json({
            success: true,
            message: "Booking marked as returned. Vehicle is now available",
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

const updateBookingStatusByCustomer= async(req: Request, res: Response)=>{
     try {
        const { status } = req.body;
        if(status !== 'cancelled'){
           return res.status(400).json({
            success: false,
            message: "Customer can mark booking as cancelled",
        })
        }

        const result = await bookingService.updateBookingByCustomerIntoDB( req.params.bookingId as string)

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
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

export const bookingController = {
    createBooking,
    getAllBooking,
    getOwnBooking,
    updateBookingStatusByAdmin,
    updateBookingStatusByCustomer
}

