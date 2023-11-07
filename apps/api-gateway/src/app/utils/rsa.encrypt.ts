import * as crypto from 'crypto';
import * as fs from 'fs';
import 'dotenv/config';
import { CreateTransactionDto } from '../modules/transaction/dto/create-transaction.dto';

export function createKey() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

  const exportedPublicKeyBuffer = publicKey.export({
    type: 'pkcs1',
    format: 'pem',
  });
  fs.writeFileSync('public.pem', exportedPublicKeyBuffer, {
    encoding: 'utf-8',
  });

  const exportedPrivateKeyBuffer = privateKey.export({
    type: 'pkcs1',
    format: 'pem',
  });
  fs.writeFileSync('private.pem', exportedPrivateKeyBuffer, {
    encoding: 'utf-8',
  });
}

export function encrypt(dataToEncrypt: any) {
  const publicKey = Buffer.from(
    fs.readFileSync('public.pem', { encoding: 'utf-8' })
  );

  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(JSON.stringify(dataToEncrypt))
  );

  fs.writeFileSync('encrypted_data.txt', encryptedData.toString('base64'), {
    encoding: 'utf-8',
  });
  return encryptedData.toString('base64');
}

export function decrypt(encryptedData: string) {
  const privateKey = fs.readFileSync('private.pem', { encoding: 'utf-8' });

  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      // In order to decrypt the data, we need to specify the
      // same hashing function and padding scheme that we used to
      // encrypt the data in the previous step
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(encryptedData, 'base64')
  );
  console.log(decryptedData.toString('utf-8'));
  return decryptedData.toString('utf-8');
}

export function hash(secret: string) {
  return crypto.createHash('sha256').update(secret).digest('hex');
}
