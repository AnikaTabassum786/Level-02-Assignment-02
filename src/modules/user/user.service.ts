import { pool } from "../../database/db"

const getAllUserFromDB = async () => {
    const result = await pool.query(`SELECT id,name,email,phone,role FROM users`)
    return result
}

const deleteUserFromDB = async (userId: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id =$1`, [userId]);
    return result;
}

const updateUserIntoDB = async (name: string, email: string, phone: string, role: string, userId: string) => {
    const userEmail = (email as string).toLowerCase();
    const result = await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`, [name, userEmail, phone, role, userId])

    if(result.rows.length === 0){
        return null
    }
    return result
}


export const userService = {
    getAllUserFromDB,
    deleteUserFromDB,
    updateUserIntoDB

}