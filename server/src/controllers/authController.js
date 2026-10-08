import { asyncHandler } from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import { serializeUser } from '../utils/serializers.js';
import { signToken } from '../utils/token.js';
import { comparePassword } from '../utils/passwordUtils.js';
import { ApiError } from '../utils/ApiError.js';

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== 'string' ||
    !email.trim() ||
    typeof password !== 'string' ||
    !password
  ) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Email and password are required.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  res.status(200).json({
    success: true,
    data: {
      user: serializeUser(user),
      token: signToken(user),
    },
  });
});
