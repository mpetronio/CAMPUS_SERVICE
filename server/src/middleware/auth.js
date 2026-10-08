import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

function sendUnauthorized(res) {
  return res.status(401).json({
    success: false,
    error: {
      code: 'UNAUTHORIZED',
      message: 'Authentication is required.',
    },
  });
}

export async function authenticate(req, res, next) {
  const authorization = req.get('Authorization');
  const match = typeof authorization === 'string'
    ? /^Bearer\s+(\S+)$/i.exec(authorization)
    : null;

  if (!match) {
    return sendUnauthorized(res);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new Error('JWT_SECRET is not configured.'));
  }

  let payload;
  try {
    payload = jwt.verify(match[1], secret);
  } catch {
    return sendUnauthorized(res);
  }

  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof payload.sub !== 'string' ||
    !mongoose.isValidObjectId(payload.sub)
  ) {
    return sendUnauthorized(res);
  }

  let user;
  try {
    user = await User.findById(payload.sub).select('-passwordHash');
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return sendUnauthorized(res);
  }

  req.user = user;
  return next();
}

export { authenticate as protect };
