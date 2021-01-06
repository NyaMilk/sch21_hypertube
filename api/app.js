const express = require('express');
require("./config/passport-setup");
const passport = require("passport");
const cors = require("cors");
const keys = require("./config/keys");
const app = express();
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const imageRoutes = require('./routes/image.routes');
const authRoutes = require('./routes/oauth.routes');
const registerRoutes = require('./routes/register.routes');
const userRoutes = require('./routes/user.routes');
const moviesRoutes = require('./routes/movies.routes');
const streamRoutes = require('./routes/stream.routes');
// const torrentRoutes = require('./routes/torrent.routes');
const cron = require('./cron/cron');

cron.job.start();

app.use(
  cookieSession({
    name: "session",
    keys: [keys.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  })
);

app.use('/api/image', imageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/user', userRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/stream', streamRoutes);

app.listen(keys.apiPort, () => console.log('App on ' + keys.apiPort));

const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer);

require('./routes/socket.routes')(io);

httpServer.listen(keys.socketPort, () => console.log('Socket on ' + keys.socketPort));