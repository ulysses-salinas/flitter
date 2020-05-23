const express = require('express')
//const db = require('./lib/db') THIS IS COMMENTED OUT AS IT IS NEEDED BUT DOES NOT EXIST YET
const session = require('express-session')
//const validate = require('./lib/validate') JUST A REMINDER THAT WE MIGHT NEED VALIDATION
const passport = require('passport')
const Strategy = require('passport-twitter').Strategy

const Twit = require('twit')
require('dotenv').config()
/*
//TWITTER API CREDENTIALS
var T = new Twit({
    consumer_key:         process.env.consumer_key,
    consumer_secret:      process.env.consumer_secret,
    access_token:         process.env.access_token,
    access_token_secret:  process.env.access_token_secret,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid.
  })
  */
 //EXPRESS STUFF
const app = express()
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true}))

/*
//PASSPORT - AUTHENTICATION & COOKIES
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
    User.findById(id).then((user) => {
        cb(null, user)
    })  
})

passport.use(new Strategy({
    consumerKey: process.env.consumer_key,
    consumerSecret: process.env.consumer_secret,
    callbackURL:"http://192.168.1.101:5000/welcome"
},
function(token, tokenSecret, profile, cb){
        db.newTweeter(profile)
        console.log("Hey, it's ", profile.username)
       cb(null, profile)
}
));
 
//SESSION
app.use(session({secret:process.env.access_token, resave: true, saveUninitialized: true}))
*/




//PORT
const port = 5000


//HANDLEBARS
app.set('view engine', 'hbs')

//INDEX PAGE SUBJECT TO CHANGE ONCE TEMPLATING FILES ARE AVAILABLE
app.get('/', function (req, res) {
   



})

/*
//WELCOME PAGE - LEAVING THIS HERE IN CASE WE WANT TO INCORPORATE THE TWITTER API
app.get('/welcome', passport.authenticate('twitter'), function (req, res){ 
    var params = { 
        user_id: req.user.id, 
        count: 5 //THIS PROBABLY DOES NOT HAVE TO BE THERE
    }
//get user by paramters value current value is 'getID'			
T.get('users/lookup',params,getID);
function getID(err, data, response) {
var userID = data

    res.render('welcome.hbs', {
        user: userID
    })
    console.log(req.user)
};
})
*/




/*
//PASSPORT AUTHORIZATION
app.get('/auth/twitter',
  passport.authenticate('twitter'));

 app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
  failureRedirect: '/login' }));
*/

//EXPRESS APP STARTUP
const startExpressApp = () => {
    app.listen(port, () => {
        console.log('express is listening on port', + port)
    })
}

// BOOTUP FAILED
const bootupSequenceFailed = (err) => {
    console.error('Unable to connect to database:', err)
    console.error('Goodbye!')
    process.exit(1)
}

/*
//DATABASE CONNECTION 
db.connect()
.then(startExpressApp)
.catch(bootupSequenceFailed)
*/