import mongoose from 'mongoose';

export async function connectDb() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required.');
  return mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
}
