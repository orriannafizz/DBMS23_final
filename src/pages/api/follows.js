import mysql from 'mysql2/promise';
import { authOptions } from '/src/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // maybe 改成不要 return false，而是 return data without "isFollow" make more sense?
  if (!session) {
    res.status(404).json({
      success: false,
      message: 'You must be logged in',
    });
    return;
  }

  console.log(session);

  const id = parseInt(session.user.id);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'dbms23_final',
    });
    // console.log(id);
    const query = `
      SELECT Lifters.LifterID, Lifters.Name
      FROM Follow, Lifters
      WHERE UserID = ${id}
      AND Follow.LifterID = Lifters.LifterID
    `;
    const [data] = await connection.execute(query);
    connection.end();
    // console.log(data);
    res.status(200).json({
      success: true,
      message: 'Success',
      data: data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Error executing SQL statement',
      error: error,
    });
  }
}
