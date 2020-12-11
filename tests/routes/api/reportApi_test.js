import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { assertEquals, assertMatch } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import app from '../../../app.js';
//import executeQuery from '../../../database/database.js';

Deno.test('random test', () => {
    assertEquals(4, 4);
});

Deno.test('test morning report with api returns 200', async () => {
    let tClient = await superoak(app);
    let res = await tClient.post('/api/auth/login').send('email=hector@aol.com&password=hector');
    tClient = await superoak(app);
    res = await tClient.post('/api/report-morning').set('Cookie', res.headers['set-cookie'].split(';')[0]).send("sleep_hours=4&sleep_quality=4&mood=4&report_for='2020-12-11'");
    assertEquals(200, res.statusCode);
});

Deno.test('test repeated morning report with api returns 200', async () => {
    let tClient = await superoak(app);
    let res = await tClient.post('/api/auth/login').send('email=hector@aol.com&password=hector');
    tClient = await superoak(app);
    res = await tClient.post('/api/report-morning').set('Cookie', res.headers['set-cookie'].split(';')[0]).send("sleep_hours=4&sleep_quality=4&mood=4&report_for='2020-12-11'");
    assertEquals(200, res.statusCode);
});


Deno.test('test add mornign report with with api with invalid data returns 400', async () => {
    let tClient = await superoak(app);
    let res = await tClient.post('/api/auth/login').send('email=hector@aol.com&password=hector');
    tClient = await superoak(app);
    await tClient.post('/api/report-morning').set('Cookie', res.headers['set-cookie'].split(';')[0]).send("sleep_hours=4&sleep_quality=4&mood=4").expect(400);
});


Deno.test('test adding data for same morning report with api updates the data', async () => {
    let tClient = await superoak(app);
    let res = await tClient.post('/api/auth/login').send('email=hector@aol.com&password=hector');
    tClient = await superoak(app);
    await tClient.post('/api/report-morning').set('Cookie', res.headers['set-cookie'].split(';')[0]).send("sleep_hours=5&sleep_quality=5&mood=5&report_for='2020-12-11'").expect(200);
});


Deno.test('test eveningmorning report with api returns 200', async () => {
    let tClient = await superoak(app);
    let res = await tClient.post('/api/auth/login').send('email=hector@aol.com&password=hector');
    tClient = await superoak(app);
    res = await tClient.post('/api/report-evening').set('Cookie', res.headers['set-cookie'].split(';')[0]).send("sports_hours=3&study_hours=2&eating_quality=3&mood=4&report_for='2020-12-11'");
    assertEquals(200, res.statusCode);
});


Deno.test('test add evening report with with api with invalid data returns 400', async () => {
    let tClient = await superoak(app);
    let res = await tClient.post('/api/auth/login').send('email=hector@aol.com&password=hector');
    tClient = await superoak(app);
    await tClient.post('/api/report-evening').set('Cookie', res.headers['set-cookie'].split(';')[0]).send("sleep_hours=4&sleep_quality=4&mood=4").expect(400);
});


Deno.test('test adding data for same morning report with api updates the data', async () => {
    let tClient = await superoak(app);
    let res = await tClient.post('/api/auth/login').send('email=hector@aol.com&password=hector');
    tClient = await superoak(app);
    await tClient.post('/api/report-evening').set('Cookie', res.headers['set-cookie'].split(';')[0]).send("sports_hours=3&study_hours=2&eating_quality=3&mood=4&report_for='2020-12-11'");
});


Deno.test('test getLastWeekSummary for user with no data', async () => {
    let tClient = await superoak(app);
    let res = await tClient.post('/api/auth/login').send('email=krishna@shrestha.com&password=shrestha');
    tClient = await superoak(app);

    res = await tClient.get('/api/summary-last-week').set('Cookie', res.headers['set-cookie'].split(';')[0]).send();
    assertEquals(200, res.statusCode);
    assertEquals(null, res.body.avg_sports);
    assertEquals(null, res.body.avg_study);
    assertEquals(null, res.body.avg_sleep);
    assertEquals(null, res.body.avg_sleep_quality);
    assertEquals(null, res.body.avg_eating);
    assertEquals("0", res.body.avg_mood);
});

Deno.test('test getLastMonthSummary for user with no data', async () => {
    let tClient = await superoak(app);
    let res = await tClient.post('/api/auth/login').send('email=krishna@shrestha.com&password=shrestha');
    tClient = await superoak(app);

    res = await tClient.get('/api/summary-last-month').set('Cookie', res.headers['set-cookie'].split(';')[0]).send();
    assertEquals(200, res.statusCode);
    assertEquals(null, res.body.avg_sports);
    assertEquals(null, res.body.avg_study);
    assertEquals(null, res.body.avg_sleep);
    assertEquals(null, res.body.avg_sleep_quality);
    assertEquals(null, res.body.avg_eating);
    assertEquals("0", res.body.avg_mood);
});

Deno.test('test getSummary of a day for user with no data', async () => {
    let tClient = await superoak(app);
    let res = await tClient.post('/api/auth/login').send('email=krishna@shrestha.com&password=shrestha');
    tClient = await superoak(app);
    res = await tClient.get('/api/summary/2020/12/11').set('Cookie', res.headers['set-cookie'].split(';')[0]).send();
    assertEquals(400, res.statusCode);
    assertEquals(null, res.body);
});
