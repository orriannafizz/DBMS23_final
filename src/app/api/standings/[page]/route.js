import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request, context) {
  const page = parseInt(context.params.page);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "dbms23_final",
  });
  
  try {
    const query = `
      SELECT * FROM TotalData TD
      JOIN (
        SELECT LifterID, MAX(TotalKg) AS TotalKg FROM TotalData
        GROUP BY LifterID
      ) AS BTD ON TD.LifterID = BTD.LifterID AND TD.TotalKg = BTD.TotalKg`
     + " LIMIT " + (50 * page).toString() + ", 50";
    const values = [];
    const [data] = await connection.execute(query, values);
    connection.end();
    return NextResponse.json({
      "success": true,
      "message": "Success",
      "data": data,
    });
  } catch (error) {
    return NextResponse.json({
      "success": false,
      "message": "Error executing SQL statement",
      "error": error,
    });
  }

}