var express = require('express')
var passport = require('passport')
var util = require('util')
var FacebookStrategy = require('passport-facebook').Strategy
var logger = require('morgan')
var session = require('express-session')
var sessionStore = require('sessionstore');
var bodyParser = require("body-parser")
var cookieParser = require("cookie-parser")
var methodOverride = require('method-override');
var port = process.env.PORT || 3000
var io = require('socket.io')(http);
var http = require('http').Server(app);
var markers = [];
var server = require('http').createServer(app);
var passportStrategy = require('../utils/passport-strategy');

var FACEBOOK_APP_ID = 
var FACEBOOK_APP_SECRET = 

passport.use(passportStrategy.facebook);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var sessionData = session({
  store: sessionStore.createSessionStore(),
  secret: "your_secret",
  cookie: { maxAge: 2628000000 },
  resave: true,
  saveUninitialized: true
});

io.use(function(socket, next){
  sessionData(socket.request, socket.request.res, next);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    process.nextTick(function () {
      
      return done(null, profile);
    });
  }
));




var app = express();

  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(sessionData);
  app.use(logger());
  app.use(cookieParser());
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(session({ secret: 'keyboard cat' }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});


app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
  });


app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/mapjs', function(req, res){
  res.sendFile(__dirname + '/public/map.js');
});

io.on('connection', function(socket){
    console.log('a user connected');
  
    socket.on('marker', function(data) {
      data.socketId = socket.id;
      
      markers[socket.id] = data;

  
  console.log('marker latitude: ' + data.lat + ', marker longitude:' + data.lng);
    socket.broadcast.emit('show-marker', data);
    });

});

app.listen(port, function(){
  console.log('five minute catch up is on port 3000');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

module.exports = server;