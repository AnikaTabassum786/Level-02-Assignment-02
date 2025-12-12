import express, { Request, Response } from "express"
import { authRoute } from "./modules/auth/auth.route"
import { initDB } from "./database/db";
import { vehicleRoute } from "./modules/vehicle/vehicle.route";

const app = express()
app.use(express.json()); //middle ware

initDB()

app.use('/api/v1/auth', authRoute )
app.use('/api/v1/vehicles',vehicleRoute )

app.get('/', (req:Request, res:Response)=>{
   res.status(200).json({
    message:"This is the root route",
    path:req.path
   })
})

app.listen(5000,()=>{
    console.log("Assignment is running on post 5000")
})