const Koa = require('koa');
const Router = require('koa-router');
let users = require('./src/UserDb.ts');
const app = new Koa();
const router = new Router();

const port = 3000;

// middleware logger
app.use(async (ctx, next) => {
  await next();
  const time = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${time}`)
});
// middleware response-Time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

router
  .get('/', async ctx => {
    ctx.body = `
    <h1>Hello</h1>
    <p>тестовый сервер</p>
    <p>для получения пользователей</p>
    `;
  })
  .get('/users', async ctx => {
    ctx.body = {data: users, error: ''};
  })
  .get('/user/:id', async ctx => {
    const user = await users.find(u => u.id === ctx.params.id)
    if (user) {
      ctx.body = {data: user, error: ''};
    } else {
      ctx.body = {data: {}, error: 'User not found'};
    }
  });

app.on('error', async (error, ctx) => {
  console.log(`server error`, error, ctx)
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port);
