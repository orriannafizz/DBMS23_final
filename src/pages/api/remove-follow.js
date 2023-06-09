import mysql from 'mysql2/promise';
import { authOptions } from '/src/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(404).json({
      success: false,
      message: 'You must be logged in',
    });
    return;
  }

  if (req.method === 'POST') {
    const body = req.body;
    // const UserID = body['UserID'];
    const UserID = parseInt(session.user.id);
    const LifterID = body['LifterID'];

    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'dbms23_final',
      });
      // DELETE 即使沒有找到符合的也不會拋錯誤（affect 0 row） -> 考慮是否要加入錯誤機制
      const query = `
        DELETE FROM Follow
        WHERE UserID=${UserID} AND LifterID=${LifterID}
      `;
      const [data] = await connection.execute(query);
      connection.end();

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
  } else {
    res.status(405).send({
      success: false,
      message: 'Only POST requests allowed',
    });
  }
}
