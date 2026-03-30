import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  return response.status(200).json({ 
    status: 'ok', 
    message: 'API working!',
    env: {
      dbHost: process.env.DB_HOST ? 'set' : 'not set',
      dbName: process.env.DB_NAME ? 'set' : 'not set',
      jwtSecret: process.env.JWT_SECRET ? 'set' : 'not set',
    }
  });
}
