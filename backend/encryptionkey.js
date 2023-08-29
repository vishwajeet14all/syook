const crypto = require('crypto');
const passphrase = 'saleem';
const key = crypto.pbkdf2Sync(passphrase, 'salt', 100000, 32, 'sha256');
module.exports=key