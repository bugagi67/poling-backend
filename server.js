const http = require("http");
const Koa = require("koa");
const { koaBody } = require("koa-body");
const cors = require("koa-cors");
const { faker } = require("@faker-js/faker");
const Router = require("@koa/router");

const app = new Koa();
const router = new Router();

const unreadMessage = {
  status: "ok",
  timestamp: 1553400000,
  messages: [],
};

function createRandomUser() {
  unreadMessage.messages.push({
    id: faker.string.uuid(),
    from: faker.internet.email(),
    subject: faker.person.fullName(),
    body: faker.lorem.text(),
    received: faker.date.recent({ days: 10 }).getTime(),
  });
}

const getRandomNumber = () => {
  return Math.round(Math.random() * (6 - 1) + 1);
};

const addMessage = (count) => {
  for (let i = 1; i <= count; i++) {
    createRandomUser();
  }
};

setInterval(() => {
  unreadMessage.messages = [];
  addMessage(getRandomNumber());
  console.log(unreadMessage);
}, 15000)


app.use(
  cors({
    origin: "*",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(
  koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
  })
);

router.get("/messages/unread", (ctx) => {
  ctx.response.body = unreadMessage;
  ctx.response.status = 200;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 9000;
const server = http.createServer(app.callback()).listen(port);
