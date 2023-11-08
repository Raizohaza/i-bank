import * as crypto from 'crypto';
import * as fs from 'fs';
export function hash(secret: string) {
  return crypto.createHash('sha256').update(secret).digest('hex');
}

export function defaultHash(time, url) {
  const secret = process.env['X_SECRET'];
  console.log({ time, url, secret });
  const hashToken = hash(url + time + secret);
  return hashToken;
}
