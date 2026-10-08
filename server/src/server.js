import 'dotenv/config';
import app from './app.js';
import { connectDb } from './config/db.js';

try {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required.');
  await connectDb();
  app.listen(process.env.PORT || 5000, () => console.info('Campus service API ready.'));
} catch (error) {
  console.error('Server startup failed:', error.message);
  process.exitCode = 1;
}
