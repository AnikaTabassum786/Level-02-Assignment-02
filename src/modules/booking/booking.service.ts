import { pool } from "../../database/db";

const createBookingIntoDB = async (payload: Record<string, unknown>) => {

    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const resultOfVehicle = await pool.query(
        `SELECT vehicle_name,daily_rent_price,availability_status FROM vehicles WHERE ID =$1`, [vehicle_id]
    )

    if (resultOfVehicle.rows.length === 0) {
        throw new Error("Vehicle not found")
    }
    if (resultOfVehicle.rows[0].availability_status !== 'available') {
        throw new Error("Vehicle is not available now")
    }
    const { daily_rent_price } = resultOfVehicle.rows[0]

    const startDate = new Date(rent_start_date as string);
    const endDate = new Date(rent_end_date as string);

    if (startDate >= endDate) {
        throw new Error("End date must be greater than start day")
    }

    const duration = endDate.getTime() - startDate.getTime();
    const numberOfDays = Math.ceil(duration / (1000 * 60 * 60 * 24))

    const total_price = numberOfDays * (Number(daily_rent_price));


    const resultOfBooking = await pool.query
        (
            `INSERT INTO bookings(vehicle_id,customer_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,'active') RETURNING *`,
            [vehicle_id, customer_id, rent_start_date, rent_end_date, total_price]
        )

    const booking = resultOfBooking.rows[0]

    const result = await pool.query(
        `
        SELECT
        bookings.id,bookings.customer_id,bookings.vehicle_id,bookings.rent_start_date,
        bookings.rent_end_date,bookings.total_price,bookings.status, vehicles.vehicle_name,
        vehicles.daily_rent_price 
        from bookings 
        JOIN vehicles ON 
        bookings.vehicle_id = vehicles.id
        WHERE bookings.id = $1
        `, [booking.id]
    )

    const updateVehicleStatus = await pool.query(`UPDATE vehicles SET availability_status= 'booked'
    WHERE id = $1 RETURNING availability_status`, [vehicle_id])



    const info = result.rows[0]
    const statusInfo =updateVehicleStatus.rows[0]

    return {
        id: info.id,
        customer_id: info.customer_id,
        vehicle_id: info.vehicle_id,
        rent_start_date: info.rent_start_date,
        rent_end_date: info.rent_end_date,
        total_price: info.total_price,
        status: info.status,
        vehicle: {
            vehicle_name: info.vehicle_name,
            daily_rent_price: info.daily_rent_price,
            // availability_status:statusInfo.availability_status
        }


    }

}

const getAllBookingFromDB = async () => {

    const result = await pool.query(`
        SELECT
        bookings.id,bookings.customer_id,bookings.vehicle_id,bookings.rent_start_date,
        bookings.rent_end_date,bookings.total_price,bookings.status,
        users.name,users.email,
        vehicles.vehicle_name,vehicles.registration_number  
        from bookings 
        JOIN vehicles ON 
        bookings.vehicle_id = vehicles.id
        JOIN users ON
        bookings.customer_id = users.id 
        
            `)

    const info = result.rows.map(row => ({
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        customer: {
            name: row.name,
            email: row.email
        },
        vehicle: {
            vehicle_name: row.vehicle_name,
            registration_number: row.registration_number
        }
    }))

    return info
}

const getOwnBookingFromDB = async (loginId: number) => {
    const result = await pool.query(`
        SELECT
        bookings.id,bookings.vehicle_id,bookings.rent_start_date,
        bookings.rent_end_date,bookings.total_price,bookings.status,
        vehicles.vehicle_name,vehicles.registration_number,vehicles.type  
        from bookings 
        JOIN vehicles ON 
        bookings.vehicle_id = vehicles.id
        WHERE bookings.customer_id =$1
        `, [loginId])

    const info = result.rows.map(row => ({
        id: row.id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        vehicle: {
            vehicle_name: row.vehicle_name,
            registration_number: row.registration_number,
            type: row.type
        }
    }))

    return info
}

const updateBookingByAdminIntoDB=async(status:string, bookingId:string)=>{

   const result = await pool.query(`UPDATE bookings SET status = 'cancelled'
    WHERE id = $1 RETURNING *
    `,[bookingId])

    return result
}

export const bookingService = {
    createBookingIntoDB,
    getAllBookingFromDB,
    getOwnBookingFromDB,
    updateBookingByAdminIntoDB
}