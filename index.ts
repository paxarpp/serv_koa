const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

const port = 3000;

app.use(async (ctx, next) => {
  await next();
  const time = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${time}`)
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

router
  .get('/', async (ctx, next) => {
    ctx.body = `
    <h1>Hello</h1>
    <p>тестовый сервер</p>
    <p>для получения пользователей</p>
    `;
  })
  .get('/users', async (ctx, next) => {
    await next();
    ctx.body = users;
  })
  .get('/user/:id', async (ctx, next) => {
    const user = await users.find(u => u.id === ctx.params.id)
    next();
    if (user) {
      ctx.body = user;
    } else {
      ctx.assert(ctx.state.user, 404, 'User not found');
    }
  });

app.on('error', async (error, ctx) => {
  console.log(`server error`, error, ctx)
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port);

let users = [
  {
    name: '111',
    id: '1',
  },
  {
    name: '222',
    id: '2',
  },
  {
    name: '333',
    id: '3',
  }
]