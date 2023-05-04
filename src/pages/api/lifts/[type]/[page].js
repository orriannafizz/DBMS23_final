import mysql from 'mysql2/promise'

export default async function handler(req, res) {
  const query = req.query
  const type = query['type']
  const page = parseInt(query['page'])

  if (type !== 'squat' && type !== 'bench' && type !== 'deadlift') {
    // error
    res.status(404).send({
      success: false,
      message: 'type should be squat | bench | deadlift',
    })
    return
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'dbms23_final',
    })
    const query = `
      SELECT *, GREATEST(${type}1Kg, ${type}2Kg, ${type}3Kg) AS SquatBest
      FROM ${type}Data
      ORDER BY SquatBest DESC`
      + " LIMIT " + (50 * page).toString() + ", 50"
    const [data] = await connection.execute(query)
    connection.end()

    res.status(200).json({
      success: true,
      message: 'Success',
      data: data,
    })

  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Error executing SQL statement',
      error: error,
    })
  }
}