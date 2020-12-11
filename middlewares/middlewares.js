import { send } from '../deps.js';

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
      console.error(e);
    console.error(e);
  }
}

const requestTimingMiddleware = async({ request, session }, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  const cUser = await session.get('user')
}

const serveStaticFilesMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
  
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  
  } else {
    await next();
  }
}

const authMiddleware = async ({ request, response, session }, next) => {
    if (request.url.pathname === '/') {
        await next();
    } else if (request.url.pathname.startsWith('/api')) {
        if (session && await session.get('authenticated')) {
            await next();
        } else if (request.url.pathname.startsWith('/api/auth')) {
            await next();
        } else {
            response.status = 401;
        } 
    } else if (request.url.pathname.startsWith('/auth')) {
        await next();
    } else if (request.url.pathname.startsWith('/static')) {
        await next();
    }else {
        if (session && await session.get('authenticated')) {
            await next();
        } else {
            response.redirect('/auth/login');
        } 
    }
};

export { 
    errorMiddleware,
    requestTimingMiddleware,
    serveStaticFilesMiddleware,
    authMiddleware,
};
