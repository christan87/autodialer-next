// Import the built-in crypto module from Node.js
const crypto = require('crypto');

// Generate a random secret key
// crypto.randomBytes(64) generates a buffer of 64 random bytes.
// .toString('hex') converts the buffer to a hexadecimal string.
const secret = crypto.randomBytes(64).toString('hex');
// Log the secret key to the console. In a real application, you would want to store this securely and not log it.
console.log('Secret:', secret);

// Generate a private signing key
// crypto.generateKeyPairSync('rsa', { modulusLength: 2048 }) generates a new RSA key pair synchronously.
// 'rsa' is the type of key to generate.
// modulusLength: 2048 specifies that the key should be 2048 bits long.
const { privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,  // the length of your key in bits
});
// privateKey.export({ type: 'pkcs1', format: 'pem' }) exports the private key in PKCS #1 PEM format.
// 'pkcs1' is the type of the key.
// 'pem' is the format to export the key in.
console.log('Private Key:', privateKey.export({
  type: 'pkcs1',
  format: 'pem',
}));