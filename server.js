require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3001;

// initalize sequelize with session store
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Requiring our models for syncing
const db = require('./models');

app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, for instance)

app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new SequelizeStore({
    db: db.sequelize
  }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 * 7 }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

require('./config/passport')(app);

// Add routes
app.use(routes);

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log(`🌎 ==> Server now on port ${PORT}!`);
  });
});