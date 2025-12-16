import { Pool } from "pg"

export const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_Ahv6ard4ywgJ@ep-dark-sea-a4a8b2tt-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
})

export const initDB = async () => {
    await pool.query(
        `
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(100) CHECK(role IN('admin','customer'))
        )
        `
    )

    await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(250) NOT NULL,
    type VARCHAR(20) CHECK(type IN ('car', 'bike', 'van','SUV')),
    registration_number VARCHAR(250)  NOT NULL UNIQUE, 
    daily_rent_price INTEGER NOT NULL CHECK(daily_rent_price>0),
    availability_status VARCHAR(20) CHECK(availability_status IN ('available', 'booked'))

)`)   

    await pool.query(`
        
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id  INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE  NOT NULL,
        rent_end_date DATE  NOT NULL CHECK (rent_end_date > rent_start_date),
        total_price NUMERIC NOT NULL CHECK (total_price>0),
        status VARCHAR(20) CHECK(status IN ('active', 'cancelled', 'returned'))
        )
        `)
    // console.log("Database Connected")
}

