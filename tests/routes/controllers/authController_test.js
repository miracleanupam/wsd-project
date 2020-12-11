import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { assert, assertEquals, assertMatch, assertStringIncludes } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import app from "../../../app.js";
import { executeQuery } from '../../../database/database.js';

//Deno.test('test registration controller function', async () => {
//    let tClient = await superoak(app);
//    await tClient.get('/auth/register').expect("this is controller");
//});


Deno.test('test registration controller', async () => {
    let tClient = await superoak(app);
    const res = await tClient.get('/auth/register');
    assertStringIncludes(res.text, `<h1>Register!</h1>\n<form method="POST">\n    <label for="email">Email: </label>\n    <input type="email" name="email" value="" />\n    <label for="password">Password: </label>\n    <input type="password" name="password" />\n    <label for="verification">Confirm Password: </label>\n    <input type="password" name="verification" />\n    <input type="submit" value="Submit!" />\n</form>`);
});

Deno.test('test registration controller function returns the registration form', async () => {
    let tClient = await superoak(app);
    const res = await tClient.get('/auth/register');
    assertStringIncludes(res.text, `<h1>Register!</h1>\n<form method="POST">\n    <label for="email">Email: </label>\n    <input type="email" name="email" value="" />\n    <label for="password">Password: </label>\n    <input type="password" name="password" />\n    <label for="verification">Confirm Password: </label>\n    <input type="password" name="verification" />\n    <input type="submit" value="Submit!" />\n</form>`);
});

Deno.test('test post request with incorrect data registration controller returns validation errors', async () => {
    let tClient = await superoak(app);
    let res = await tClient.post('/auth/register').send('email=random@email.com&password=random');
    assertStringIncludes(res.text, "<li>Passwords must match</li>");
    tClient = await superoak(app);
    res = await tClient.post('/auth/register').send('email=randomemailcom&password=random&verification=random');
    assertStringIncludes(res.text, "<li>email is not a valid email address</li>");
    // :TODO test for other validation errors
});

//Deno.test('test post request with correct data to registration controller registers a user', async () => {
//    let tClient = await superoak(app);
//    await tClient.post('/auth/register').send('email=random@email.com&password=password&verification=password');
//    
//    const res = await executeQuery('select count(*) from users where email=$1;', 'random@email.com');
//    assert(res.rowsOfObjects()[0].count === 1);
//});


Deno.test('test login controller function returns the login form', async () => {
    let tClient = await superoak(app);
    const res = await tClient.get('/auth/login');

    assertStringIncludes(res.text, `<form method="POST">
        <label for="email">Email: </label>
        <input type="email" name="email" />
        <label for="password">Password: </label>
        <input type="password" name="password" />
        <input type="submit" value="Submit!" />
    </form>`
    );
});

Deno.test('test logout controller function', async () => {
    let tClient = await superoak(app);
    const res = await tClient.get('/auth/logout');
    assertEquals(res.statusCode, 200);
});
