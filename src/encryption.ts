import * as bcrypt from "bcryptjs";

/**
 * Encrypt data and get hash value
 * @param {*} data Data to encrypt
 * @param {*} callback Handler function (has 2 parameters: err, hash)
 */
export function crypt(data, callback){
    bcrypt.genSalt(10, (err, salt) => {
        if (err) callback(err, null);
        else bcrypt.hash(data, salt, callback);
    })
}

/**
 * Check if the provided data match the saved hash
 * @param {*} data Data to test
 * @param {*} hash Hash value of original data
 * @param {*} callback Handler function (has 2 parameters: err, match)
 */
export const compare = bcrypt.compare;