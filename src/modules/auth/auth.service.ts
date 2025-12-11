import bcrypt from "bcryptjs"
import { pool } from "../../database/db"
import jwt from "jsonwebtoken"
export  const secret = 'KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

const signupUserIntoDB = async (payload: Record<string, unknown>) => {
    const { name, email, password, role,phone } = payload;

    console.log(password)
   

    const hashPassword = await bcrypt.hash(password as string, 12)
    const result = await pool.query(`
        INSERT INTO users(name,email,password,role,phone) VALUES($1,$2,$3,$4,$5) RETURNING *
        `, [name, email, hashPassword,role,phone])

    delete result.rows[0].password
    return result;
}


const loginUserIntoDB = async(email:string, password:string)=>{

        const user = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `,[email])

        const matchPassword = await bcrypt.compare(password, user.rows[0].password)
        
        if(user.rows.length === 0){
            throw new Error("User not found")
        }

        if(!matchPassword){
            throw new Error("Invalid Credentials")
        }
         
       const jwtPayload={
        id: user.rows[0].id,
        name:user.rows[0].name,
        email:user.rows[0].email,
        role:user.rows[0].role,
        phone:user.rows[0].phone
       } 

       
       const token = jwt.sign(jwtPayload,secret,{expiresIn:'7d'})
        delete user.rows[0].password;
        return {token, user: user.rows[0]};
}

export const authService={
    signupUserIntoDB,
    loginUserIntoDB
}