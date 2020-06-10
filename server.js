const express = require('express');
const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");

const server = express();

server.use(express.json());

server.use("/api/users", logger, userRouter);
server.use("/api/posts", postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});


//custom middleware
function logger(req, res, next) {
  const time = new Date.toISOString();

  console.log(`${time} ${req.ip} ${req.method} ${req.url}`);
  next()
}

module.exports = server;
