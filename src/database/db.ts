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
        role VARCHAR(100)
        )
        `
    )
    console.log("Database Connected")
}

