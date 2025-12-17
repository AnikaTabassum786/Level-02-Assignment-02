import express, { Request, Response } from "express"
import { authRoute } from "./modules/auth/auth.route"
import { initDB } from "./database/db";
import { vehicleRoute } from "./modules/vehicle/vehicle.route";
import { userRoute } from "./modules/user/user.route";
import { bookingRoute } from "./modules/booking/booking.router";

const app = express()
app.use(express.json()); //middle ware

initDB()

app.get('/', (req:Request, res:Response)=>{
   res.status(200).json({
    message:"This is the root route",
    path:req.path
   })
})

app.use('/api/v1/auth', authRoute )
app.use('/api/v1/vehicles',vehicleRoute )
app.use('/api/v1/users',userRoute )
app.use('/api/v1/bookings', bookingRoute )



// app.listen(5000,()=>{
//     console.log("Assignment is running on post 5000")
// })

export default app