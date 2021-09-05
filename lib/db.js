const path = require('path')
const envPath = path.resolve(process.cwd(), '.env.local')

//console.log({ envPath })

require('dotenv').config({ path: envPath })

const mysql = require('mysql2/promise')

export const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT,
})

export async function query(q, values) {
  try {
    const [rows, fields]= await (await db).execute(q, values)
    return [rows, fields]
  } catch (e) {
    throw Error(e.message)
  }
}

//TODO: make reset database script, make a get run or get run+tank(s) api, 