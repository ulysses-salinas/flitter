const express = require('express')
const db = require('./database/index') 
const session = require('express-session')
const validate = require('./database/validate') 
const passport = require('passport')
const Strategy = require('passport-twitter').Strategy
const cookieSession = require('cookie-session')
const Twit = require('twit')
require('dotenv').config()
const cors = require('cors')

//TWITTER API CREDENTIALS
var T = new Twit({
    consumer_key:         process.env.consumer_key,
    consumer_secret:      process.env.consumer_secret,
    access_token:         process.env.access_token,
    access_token_secret:  process.env.access_token_secret,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid.
  })
  
 //EXPRESS
const app = express()
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true}))

//COOKIES
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys:[process.env.cookie_key]
}))

//PASSPORT STRATEGY
passport.use(new Strategy({
    consumerKey: process.env.consumer_key,
    consumerSecret: process.env.consumer_secret,
    callbackURL:process.env.callback_URL
},
function(token, tokenSecret, profile, cb){
        db.newTweeter(profile)
       
        console.log("Hey, it's ", profile.username)
        
       cb(null, profile)
}

));

app.use(cors())

 
// EXPRESS SESSION
app.use(session({secret:process.env.access_token, resave: true, saveUninitialized: true}))

//PASSPORT - AUTHENTICATION & COOKIES
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
    db.currentFlitterUser(id).then((user) => {
    cb(null, user)
    })
    })  



//PORT
const port = 5000


//HANDLEBARS
app.set('view engine', 'hbs')

//INDEX PAGE SUBJECT TO CHANGE ONCE TEMPLATING FILES ARE AVAILABLE
/*app.param('twitterid', function (req, res, next, twitterid){
    // database logic (twitterid)
    .then((tweeter) => {
        req.tweeter = req.tweeter || {}
        req.tweeter.id === tweeter
        next()
    })
    .catch(() => {
        res.status(404).send('Tweeter not found')
    })
})
*/

// INDEX
app.get('/', function (req, res) {
    res.render('index', {  })
})


// GET TWEETLIST
app.get('/tweetlist', function (req, res){
    const flitterUser = req.user.twitterid
    db.getTweets(flitterUser)
    .then((theTweets) => {
        console.log(theTweets)
        res.render('tweet_list.hbs', {
            tweets: theTweets
        })
    })
})

// POST NEWTWEET
app.post('/newtweet', function (req, res){
    const flitterUser = req.user
    const tweet = req.body.tweet
    if (validate.validTweet(tweet)){
        db.createTweet(flitterUser.twitterid, tweet)
        .then(function (newTweet) {
            res.render('new_tweet.hbs', {    //=========== this is a template we can really utilize
                user: flitterUser,
                tweet: newTweet
             }) 
             console.log(newTweet)
             console.log(flitterUser)
        })
        .catch(() => {
            res.status(500).send('Something went wrong!')
        })
    } else {
        res.status(400).send('Tweet no good...')
    }
})

// GET/delete:tweetid since PUT is not an available method?
app.get('/delete/:tweetid', function (req, res){
       
        db.deletedTweet(parseInt(req.params.tweetid))
        res.send('deleted_tweet.hbs') //======================== this is a template we can really utilize
})

//PASSPORT AUTHORIZATION
app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
passport.authenticate('twitter', { session: true}),
(req, res) => {
    res.redirect('/tweetlist');
})



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


//DATABASE CONNECTION 
db.connect()
.then(startExpressApp)
.catch(bootupSequenceFailed)