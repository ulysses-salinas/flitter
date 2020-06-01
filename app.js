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
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.flitter)


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
    
    const ctoken = cryptr.encrypt(token)
    const ctokenSecret = cryptr.encrypt(tokenSecret)
     db.newTweeter(profile, ctoken, ctokenSecret)
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


// INDEX
app.get('/', function (req, res) {
    res.render('index', {  })
})

// GET TWEETLIST
app.get('/tweetlist', function (req, res){
    console.log(req.user)
    const flitterUser = req.user.twitterid
    db.getTweets(flitterUser)
    .then((theTweets) => {

       // console.log(theTweets)
        res.render('tweet_list.hbs', {
            tweets: theTweets
        })
    })
})

// POST NEWTWEET
app.post('/tweetlist', function (req, res){
var T = new Twit({
    consumer_key:         process.env.consumer_key,
    consumer_secret:      process.env.consumer_secret,
    access_token:         cryptr.decrypt(req.user.token),
    access_token_secret:   cryptr.decrypt(req.user.tokensecret),
    timeout_ms:           60*1000,  
    strictSSL:            true,    
  })
    const flitterUser = req.user
    const tweet = req.body.tweet
    T.post('statuses/update', {status:tweet},
    function(err, data, response){console.log(data)})
    if (validate.validTweet(tweet)){
        db.tweetNLoad(flitterUser.twitterid, tweet)
        .then((theTweets) => { 
            res.render('tweet_list.hbs', {  
                tweets: theTweets.rows  
        })     
    })
        .catch(() => {
            res.status(500).send('Something went wrong!')
        })
    } else {
        res.status(400).send('Tweet no good...')
    }
    })

//PASSPORT AUTHORIZATION
app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
passport.authenticate('twitter', { session: true}),
(req, res) => {
    res.redirect('/tweetlist');
})

// GET/delete:tweetid 
app.get('/delete/:tweetid', function (req, res){
    const flitterUser = req.user
    db.deleteNLoad(flitterUser.twitterid, parseInt(req.params.tweetid))
    .then((results) => {
        res.render('tweet_list.hbs', {
            tweets: results.rows
        })
    })
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