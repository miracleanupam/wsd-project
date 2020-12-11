import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { assertEquals, assertMatch } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import app from '../../../app.js';

Deno.test('random test', () => {
    assertEquals(4, 4);
});

Deno.test('test userRegistration function with invalid data returns 400', async () => {
    const tClient = await superoak(app);
    const res = await tClient.post('/api/auth/register').send('email=anupamaalto.fi&password=testpassword');
    assertEquals(400, res.status);
});

Deno.test('test userRegistration function with valid data returns Success as response body', async () => {
    const tClient = await superoak(app);
    const res = await tClient.post('/api/auth/register').send('email=anupama@alto.fi&password=testpassword').expect("Success");
});

Deno.test('test userLogin function with incorrect data returns 401', async () => {
    const tClient = await superoak(app);
    const res = await tClient.post('/api/auth/login').send('email=anupamaalto.fi&password=testpassword').expect(401);
});

Deno.test('test userLogin function with correct data returns Success as response body', async () => {
    const tClient = await superoak(app);
    const res = await tClient.post('/api/auth/login').send('email=hector@aol.com&password=hector').expect("Success");
});

Deno.test('test userLogout function returns Success', async () => {
    const tClient = await superoak(app);
    const res = await tClient.get('/api/auth/logout').expect('Success');
});
