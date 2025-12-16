import { Request, Response } from "express";
import { authService } from "./auth.service";

const signupUser = async(req:Request, res:Response)=>{
   try{
      const result = await authService.signupUserIntoDB(req.body)
      return res.status(201).json({
           success:true,
           message:"User registered successfully",
           data: result.rows[0]
      })
   }
   catch(error:any){
    return res.status(400).json({
        success:false,
        message:error.message
    })
   }
}

const loginUser = async(req:Request, res:Response)=>{
   try{
      const result = await authService.loginUserIntoDB(req.body.email,req.body.password)
      return res.status(200).json({
           success:true,
           message:"Login successful",
           data: result
      })
   }
   catch(error:any){
    return res.status(401).json({
        success:false,
        message:error.message
    })
   }
}

export const authController={
    signupUser,
    loginUser
}