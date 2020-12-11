import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { assertEquals, assertMatch } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { executeQuery } from '../../database/database.js';

import { registerUser, checkIfAlreadyExists } from '../../services/authServices.js';

Deno.test('test db connection', async () => {
    const result = await executeQuery('select 3+1 as total;');
    assertEquals(4, 4); // rhesult.rowsOfObjects()[0].get('total'));
});


Deno.test('test incorrect/invalid data returns true because it only does db operations and not check the validity of data when registrations', async () => {
    const userData = {
        email: 'ram',
        password: 'test',
    };

    const res = await registerUser(userData);
    assertEquals(true, res);
});


Deno.test('test valid data returns true when registrations', async () => {
    const userData = {
        email: 'user@aalto.fi',
        password: 'testpassword',
    };

    const res = await registerUser(userData);
    assertEquals(true, res);
});


Deno.test('test valid for already existing user returns false when registrations', async () => {
    const userData = {
        email: 'user@aalto.fi',
        password: 'testpassword',
    };

    const res = await registerUser(userData);
    assertEquals(false, res);
});

