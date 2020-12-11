import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { assertMatch } from "https://deno.land/std@0.78.0/testing/asserts.ts";

import app from '../../app.js';

Deno.test('test errorMiddleware returns', async () => {
    const testClient = await superoak(app);
    await testClient.get('/api/doesnotexists')
            .expect(404);
});

Deno.test('test serveStaticFilesMiddlware', async () => {
    const testClient = await superoak(app);
    await testClient.get('/static/somefile')
            .expect(404);
});

Deno.test('test a url that exists', async () => {
    const testClient = await superoak(app);
    await testClient.get('/')
                .expect(200);
});
