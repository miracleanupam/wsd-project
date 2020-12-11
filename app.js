import { Application, Session } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from './middlewares/middlewares.js';
import { viewEngine, engineFactory, adapterFactory } from "./deps.js";
import { oakCors } from "https://deno.land/x/cors@v1.2.1/mod.ts";

let port = 7777;
if (Deno.args.length > 0) {
    const lastArgument = Deno.args[Deno.args.length - 1];
    port = Number(lastArgument);
}

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session, { maxAge: 60*60*24*7 } ));

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views"
}));

app.use(middleware.errorMiddleware);
app.use(middleware.authMiddleware);
app.use(middleware.requestTimingMiddleware);
app.use(middleware.serveStaticFilesMiddleware);

app.use(oakCors());
app.use(router.routes());


if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: port });
}

      
export default app;
