import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { executeQuery } from '../database/database.js';


const registerUser = async (userData) => {

    try {
        const res = await executeQuery("INSERT INTO users (email, password) values ($1, $2);", userData.email, userData.password);
    } catch (e) {
        return false;
    }
    return true;
};


const checkIfAlreadyExists = async (email) => {
    const res = await executeQuery("SELECT * FROM users WHERE email=$1;", email);
    if (res && res.rowCount > 0) {
        return res.rowsOfObjects()[0];
    } 
    return false;
};

export { 
    registerUser,
    checkIfAlreadyExists,
};
