import bcrypt from 'bcryptjs';

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
const BCRYPT_COST_FACTOR = 12;

export async function hashPassword(plainPassword) {
  if (typeof plainPassword !== 'string' || plainPassword.length === 0) {
    throw new TypeError('Password must be a non-empty string.');
  }

  if (BCRYPT_HASH_PATTERN.test(plainPassword)) {
    return plainPassword;
  }

  return bcrypt.hash(plainPassword, BCRYPT_COST_FACTOR);
}

export async function comparePassword(plainPassword, hashedPassword) {
  if (typeof plainPassword !== 'string' || typeof hashedPassword !== 'string') {
    return false;
  }

  return bcrypt.compare(plainPassword, hashedPassword);
}
