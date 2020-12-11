import * as authService from '../../services/authServices.js';
import { validate, required, lengthBetween, isEmail, minLength } from "https://deno.land/x/validasaur@v0.15.0/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";


const validationRules = {
        email: [required, minLength(6), isEmail],
        // name: [required, lengthBetween(5,20)],
        password: [required, minLength(6)],
    };


const userRegistration = async ({ request, response }) => {

    const body = request.body();
    const docs = await body.value;

    const data = {
        password: docs.get('password'),
        email: docs.get('email')
    };

    const [passes, errors] = await validate(data, validationRules);
    if (passes) {
        const hash = await bcrypt.hash(data.password);
        data.password = hash;
        const res = await authService.registerUser(data);

        if (!res) {
            response.status = 500;
            response.body = 'Something went wrong';
            return;
        } else {
            response.status = 200;
            response.body = 'Success';
            return;
        } 
    } 
    response.status = 400;
    response.body = errors;
    return;

};

const userLogin = async ({ request, response, session }) => {

    const body = request.body();
    const docs = await body.value;

    const res = await authService.checkIfAlreadyExists(docs.get('email'));
    if (!res) {
        response.body = "Unauthorized";
        response.status = 401;
        return;
    }
    
    const passwordIsCorrect = await bcrypt.compare(docs.get('password'), res.password);
    if (!passwordIsCorrect) {
        response.body = "Unauthorized";
        response.status = 401;
        return;
    }
    await session.set('authenticated', true);
    await session.set('user', {
        id: res.id,
        email: res.email
    });
    response.body = "Success";
    response.status = 200;

};

const userLogout = async ({ request, response, session }) => {
    await session.set('authenticated', null);
    await session.set('user', null);

    response.body = 'Success';
};

export {
    userRegistration,
    userLogin,
    userLogout,
};
