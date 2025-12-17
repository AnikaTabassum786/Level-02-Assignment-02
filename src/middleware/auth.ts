import { NextFunction, Request, Response } from "express"
import jwt ,{JwtPayload}from "jsonwebtoken"
import { pool } from "../database/db.js";
import { secret } from "../modules/auth/auth.service.js";

// import { secret } from "../modules/auth/auth.service";
// import { pool } from "../database/db";

const auth =(...roles:('admin'|'customer')[])=>{//const a = [1,2,3,4...] //{...a} this is rest operator
  
  // console.log(roles);
    return async(req:Request,res:Response, next:NextFunction) =>{
        const authentication  = req.headers.authorization;
        
        // console.log(authentication);
        if(!authentication){
         throw new Error("You are not authorized")
        }

        const token = authentication.split(" ")[1];

        if(!token){
          throw new Error("Invalid Token")
        }
        
        const decoded = jwt.verify(token,secret) as JwtPayload
        // console.log(decoded)

        const user = await pool.query(
          `SELECT * FROM users WHERE id=$1`,[decoded.id]
        )

        if(user.rows.length === 0){
             throw new Error("User Not Found!")
        }
        req.user = decoded;
        // console.log(req.user.email,req.user.role,req.user.id)

        if(roles.length && !roles.includes(decoded.role)){
          throw new Error("You Are Unauthorized")
        }
        next();
    }
}
export default auth





