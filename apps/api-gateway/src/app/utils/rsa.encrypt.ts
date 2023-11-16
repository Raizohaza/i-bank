import * as crypto from 'crypto';
import * as fs from 'fs';
import 'dotenv/config';

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
    Buffer.from(JSON.stringify(dataToEncrypt))
  );

  return encryptedData;
}

export function abineEncrypt(dataToEncrypt: any, publicKey: crypto.KeyLike) {
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(JSON.stringify(dataToEncrypt))
  );

  return encryptedData.toString('base64');
}

export function decrypt(encryptedData: string) {
  const privateKey = fs.readFileSync('private.pem', { encoding: 'utf-8' });

  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(encryptedData, 'base64')
  );
  return decryptedData;
}

export function hash(secret: string) {
  return crypto.createHash('sha256').update(secret).digest('hex');
}

export function signature(data) {
  const privateKey = fs.readFileSync('private.pem', { encoding: 'utf-8' });
  return crypto.sign('sha256', data, {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  });
}

export function isVerified(data) {
  const publicKey = Buffer.from(
    fs.readFileSync('public.pem', { encoding: 'utf-8' })
  );

  return crypto.verify(
    'sha256',
    Buffer.from(data),
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    },
    signature(data)
  );
}

export function isVerifiedWithSign({
  data,
  sign,
  publicKey,
}: {
  data: Buffer;
  sign: Buffer;
  publicKey: Buffer;
}) {
  return crypto.verify(
    'sha256',
    data,
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    },
    sign
  );
}
