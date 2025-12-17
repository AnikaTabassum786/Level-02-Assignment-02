import { isStatement } from "typescript";
import { pool } from "../../database/db.js";
// import { pool } from "../../database/db";

const createVehicleIntoDB = async (payload: Record<string, unknown>) => {

    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    const result = await pool.query(`
        INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *
        `, [vehicle_name, type, registration_number, daily_rent_price, availability_status])


    return result;
}

const getAllVehicleIntoDB = async () => {
    const result = await pool.query(`
        SELECT * FROM vehicles 
        `)

    result.rows = result.rows.map(vehicle => ({
        ...vehicle,
        daily_rent_price: Number(vehicle.daily_rent_price),
    }))


    return result;
}

const getSingleVehicleIntoDB = async (vehicleId: string) => {
    const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId])
    if (vehicle.rows.length === 0) {
        return null
    }
    const result = vehicle.rows[0]
    result.daily_rent_price = Number(result.daily_rent_price)
    return result;
}

const updateVehicleIntoDB = async (vehicle_name: string, type: string, registration_number: string, daily_rent_price: number, availability_status: string, vehicleId: string) => {
    const vehicle = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4 ,availability_status=$5 WHERE id=$6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status, vehicleId])
    if (vehicle.rows.length === 0) {
        return null
    }
    const result = vehicle.rows[0]
    result.daily_rent_price = Number(result.daily_rent_price)
    return result
}


const deleteVehicleFromDB = async (vehicleId: string) => {
    const result = await pool.query(`SELECT availability_status FROM vehicles WHERE id = $1 `, [vehicleId]);

    if (result.rows.length === 0) {
        return {statement: "NOT_FOUND"}
    }
    if (result.rows[0].availability_status !== 'available') {
        return { statement: "BOOKED" }
    }

    await pool.query(`DELETE FROM vehicles WHERE id = $1`,[vehicleId])
    return  { statement: "DELETED" };
}

export const vehicleService = {
    createVehicleIntoDB,
    getAllVehicleIntoDB,
    getSingleVehicleIntoDB,
    updateVehicleIntoDB,
    deleteVehicleFromDB
}