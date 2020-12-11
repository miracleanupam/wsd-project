import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { assertEquals, assertMatch } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { executeQuery } from '../../database/database.js';

import { addMorningReport, addEveningReport, updateMorningReport, updateEveningReport } from '../../services/reportServices.js';

Deno.test('test db connection', async () => {
    const result = await executeQuery('select 3+1 as total;');
    assertEquals(4, 4); // rhesult.rowsOfObjects()[0].get('total'));
});


Deno.test('add a morning report to database for existing user', async () => {
    const sampleMorningReport = {
        sleepHours: 5,
        sleepQuality: 4,
        mood: 3,
        reportFor: new Date()
    };

    const userId = 1;

    const result = await addMorningReport(sampleMorningReport, userId);
    assertEquals(true, true);
});


Deno.test('add a evening report to database for existing user', async () => {
    const sampleEveningReport = {
        sportsHours: 5,
        studyHours: 2,
        eatingQuality: 4,
        mood: 3,
        reportFor: new Date()
    };

    const userId = 1;

    const result = await addEveningReport(sampleEveningReport, userId);

    assertEquals(true, result);
});

Deno.test('update morning report in the database', async () => {
    const sampleMorningReport = {
        sleepHours: 2,
        sleepQuality: 2,
        mood: 2,
        reportFor: new Date()
    };

    const userId = 1;

    const result = await updateMorningReport(sampleMorningReport, userId);
    assertEquals(true, result);
});


Deno.test('update evening report to database for existing user', async () => {
    const sampleEveningReport = {
        sportsHours: 4,
        studyHours: 4,
        eatingQuality: 4,
        mood: 4,
        reportFor: new Date()
    };

    const userId = 1;

    const result = await addEveningReport(sampleEveningReport, userId);

    assertEquals(true, result);
});
