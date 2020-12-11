import * as authService from '../../services/authServices.js';
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { validate, required, isNumber, isInt, lengthBetween, isEmail, minLength, numberBetween } from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

const validationRules = {
        email: [required, minLength(6), isEmail],
        // name: [required, lengthBetween(5,20)],
        password: [required, minLength(6)],
    };


let registrationData = {
    email: '',
};

const showRegistrationForm = async ({ render }) => {
    registrationData = { email: '' };
    render('./register.ejs', { errors: [], userEmail: null, registrationData: registrationData });
};

const registerUser = async ({ request, response, render }) => {

    const body = request.body();
    const docs = await body.value;

    const data = {
        password: docs.get('password'),
        email: docs.get('email'),
        verification: docs.get('verification'),
    };

    registrationData = { email: '' };

    if (data.password !== data.verification) {
        registrationData = { email: docs.get('email') };
        render('./register.ejs', { errors: { password: ['Passwords must match'] }, userEmail: null, registrationData: registrationData });
        return;
    }

    const [passes, errors] = await validate(data, validationRules);

    if (passes) {
        const alreadyExistCheck = await authService.checkIfAlreadyExists(data.email);

        if (alreadyExistCheck) {
            registrationData = { email: docs.get('email') };
            render('./register.ejs', { errors: { email: ['Email not available'] }, userEmail: null, registrationData: registrationData });
            return;
        }

        const hash = await bcrypt.hash(data.password);
        data.password = hash;

        const res = await authService.registerUser(data);

        if (!res) {
            registrationData = { email: docs.get('email') };
            render('./register.ejs', { errors: errors, userEmail: null, registrationData: registrationData });
        } else {
            response.status = 302;
            response.redirect('/');
        }
    } else {
        registrationData = { email: docs.get('email') };
        render('./register.ejs', { errors: errors, userEmail: null, registrationData: registrationData });
    }
};


const showLoginForm = async ({ request, response, render }) => {
    render('./login.ejs', { errors: {}, userEmail: null });
};

const loginUser = async ({ request, response, render, session }) => {

    const body = request.body();
    const docs = await body.value;

    const alreadyExistCheck = await authService.checkIfAlreadyExists(docs.get('email'));
    if (!alreadyExistCheck) {
        render('./login.ejs', { errors: { unauthorized: ['Invalid username or password'] }, userEmail: null });
        return;
    }

    const passwordIsCorrect = await bcrypt.compare(docs.get('password'), alreadyExistCheck.password);
    if (!passwordIsCorrect) {
        render('./login.ejs', { errors: { unauthorized: ['Invalid username or password'] }, userEmail: null });
        return;
    }
    await session.set('authenticated', true);
    await session.set('user', {
        id: alreadyExistCheck.id,
        email: alreadyExistCheck.email
    });
    response.redirect('/');
};

const logoutUser = async ({ request, response, session, render }) => {
    await session.set('authenticated', null);
    await session.set('user', null);

    response.redirect('/');
};

export {
    showRegistrationForm,
    registerUser,
    showLoginForm,
    loginUser,
    logoutUser,
};
