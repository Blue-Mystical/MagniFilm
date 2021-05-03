const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        Collection      = require('./models/collection'),
        Comment         = require('./models/comment'),
        User            = require('./models/user'),
        seedDB          =  require('./seeds');

mongoose.connect('mongodb://localhost/uCollectionV3');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static(__dirname + 'public'));
// seedDB();

app.use(require('express-session')({
    secret: 'secret is always secret.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.get('/', function(req, res){
    res.render('home.ejs');
});

app.get('/collection', function(req, res){
    Collection.find({}, function(err, allCollections){
        if(err){
            console.log(err);
        } else {
            res.render('collections/index.ejs', {collection: allCollections});
        }
    });
});

app.post('/collection', function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var newCollection = {name:name, image:image, desc: desc};
    Collection.create(newCollection, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect('/collection');
        }
    });
});

app.get('/collection/new', function(req,res){
    res.render('collections/new.ejs');
});

app.get("/collection/:id", function(req, res){
    Collection.findById(req.params.id).populate('comments').exec(function(err, foundCollection){
        if(err){
            console.log(err);
        } else {
            res.render("collections/show.ejs", {collection: foundCollection});
        }
    });
});

app.get('/collection/:id/comments/new',isLoggedIn, function(req, res){
    Collection.findById(req.params.id, function(err, foundCollection){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new.ejs", {collection: foundCollection});
        }
    });    
});

app.post('/collection/:id/comments', isLoggedIn, function(req, res){
    Collection.findById(req.params.id, function(err, foundCollection){
        if(err){
            console.log(err);
            res.redirect('/collection');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {
                    foundCollection.comments.push(comment);
                    foundCollection.save();
                    res.redirect('/collection/'+ foundCollection._id);
                }
            });
        }
    });
});

app.get('/register', function(req, res){
    res.render('register.ejs');
});

app.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/collection');
        });
    });
});



app.get('/login', function(req, res){
    res.render('login.ejs');
});

app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/collection',
        failureRedirect: '/login'
    }), function(res, res){       
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/collection');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.listen(3000, function(){
    console.log('uCollection is started.');
});    