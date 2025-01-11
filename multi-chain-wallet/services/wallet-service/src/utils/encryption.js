import crypto from "crypto";

const algorithm = 'aes-256-gcm';
const ivLength = 16;
const saltLength = 64;
const tagLength = 16;
const keyLength = 32;
const iterations = 100000;

async function encrypt(text) {
  const salt = crypto.randomBytes(saltLength);
  const iv = crypto.randomBytes(ivLength);

  const key = crypto.pbkdf2Sync(
    process.env.ENCRYPTION_KEY,
    salt,
    iterations,
    keyLength,
    'sha512'
  );

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  return Buffer.concat([
    salt,
    iv,
    tag,
    Buffer.from(encrypted, 'hex')
  ]).toString('base64');
}

async function decrypt(encryptedText) {
  const buffer = Buffer.from(encryptedText, 'base64');
  
  const salt = buffer.slice(0, saltLength);
  const iv = buffer.slice(saltLength, saltLength + ivLength);
  const tag = buffer.slice(saltLength + ivLength, saltLength + ivLength + tagLength);
  const encrypted = buffer.slice(saltLength + ivLength + tagLength);

  const key = crypto.pbkdf2Sync(
    process.env.ENCRYPTION_KEY,
    salt,
    iterations,
    keyLength,
    'sha512'
  );

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

export {
  encrypt,
  decrypt
};
