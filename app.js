const seedDB = require('./seeds');

var express          = require('express'),
    app              = express(),
    bodyParser       = require('body-parser'),
    mongoose         = require('mongoose'),
    passport         = require('passport'),
    LocalStrategy    = require('passport-local'),
    flash            = require('express-flash'),
    sass             = require('node-sass-middleware'),
    methodOverride   = require('method-override'),

    User             = require('./models/user');

var movieRoutes      = require('./routes/movie'),
    homeRoutes       = require('./routes/home'),
    reviewRoutes     = require('./routes/review'),
    theatreRoutes    = require('./routes/theatre'),
    userRoutes       = require('./routes/user');

app.use(sass({
    src: __dirname + '/sass',
    dest:__dirname + '/public/stylesheet',
    outputStyle: 'compressed',
    prefix: '/stylesheet',
    debug: false
}));

mongoose.connect('mongodb://localhost/MagniFilm');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(methodOverride('_method'));
app.use(express.static('public'));
//app.use(express.static(__dirname + 'public'));
app.use(express.static('./public'));
app.use(flash())

seedDB();

app.use(require('express-session')({
    secret: 'a secret.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) {
    res.locals.currentUser = req.user;
    next();
});

// --

app.use('/movies', movieRoutes);
app.use('/movies/:id/reviews', reviewRoutes);
app.use('/theatres', theatreRoutes);
app.use('/', userRoutes);
app.use('/', homeRoutes);

// --

app.listen(3000, function() {
    console.log('MagniFilm server has been opened.');
});