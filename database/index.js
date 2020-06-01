const knexLib = require('knex')
const dbCfg = require('../knexfile')

let conn = null


function connect () {
    return new Promise(function (resolve, reject){
        conn = knexLib(dbCfg.development)
        conn.raw(`SELECT 1 + 1 AS test`)
        .then((result) => {
            if (result.rows.length === 1 && result.rows[0].test === 2) {
                console.log('Database connection established!')
                resolve()
            } else {
                reject('Database was unable to connect')
            }
        })
        .catch((err) => {
            reject(err)
        })
    })
}

//===============================================================================================
// THIS QUERY AND FUNCTION WILL INSERT DATA INITIALLY DISTRIBUTED BY PASSPORT-TWITTER 
const createFlitterUser = `INSERT INTO flitter_users (twitterid, username, displayname, photoimage, token, tokensecret)
VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT ON CONSTRAINT flitter_users_pkey DO NOTHING
RETURNING *`


function newTweeter (flitterUser, token, tokensecret){
   flitterUser.token = token
   flitterUser.tokensecret = tokensecret
    return conn.raw(createFlitterUser, [flitterUser.id, flitterUser.username, flitterUser.displayName, flitterUser.photos[0].value, flitterUser.token, flitterUser.tokensecret])
  .then((results) => {
      return results.rows[0]
  })
    
}
//===============================================================================================

// THIS QUERY AND FUNCTION ESTALISH REQ.USER ACROSS ALL ENDPOINTS
const findTweeter = `SELECT * FROM flitter_users WHERE twitterid = ?`

function currentFlitterUser (tweeterid){
    return conn.raw(findTweeter, [tweeterid])
    .then((results) => {
        return results.rows[0]
    })
}

//===================================================================================================

// THIS QUERY AND FUNCTION CREATES A NEW TWEET

const createTweetQuery = ` 
INSERT INTO flitter_tweets (twitterid, tweet)
VALUES (?, ?)
RETURNING *
`

function createTweet (flitterId, tweet) {
    return conn.raw(createTweetQuery, [flitterId, tweet])
    .then((result) => {
        return result.rows[0]
        
    })
}
//===============================================================================
function tweetNLoad ( flitterId, tweet) {
    return new Promise(function (resolve, reject){
        conn.raw(createTweetQuery, [flitterId, tweet])
        .then((result) => {
           
        conn.raw(findTweets, [result.rows[0].twitterid])
        .then((theTweets) => {
            
            theTweets.tweets = result.rows
            resolve(theTweets)
            
        })
        .catch(() => {
            reject("Query Failed")
        })
    })
    .catch(() => {
        reject('Something went wrong!')
    })
})
}
   
    


//===============================================================================================


// THIS QUERY AND FUNCTION GETS THE TWEETS FROM THE MATCHED FOREIGN KEY AND WHERE DELETED IS FALSE

const findTweets = `
SELECT * FROM flitter_users 
JOIN flitter_tweets ON flitter_users.twitterid  = flitter_tweets.twitterid 
WHERE flitter_users.twitterid = ? AND deleted = FALSE
ORDER BY tweetid DESC
`

function getTweets (flitterUser){
    return conn.raw(findTweets, [flitterUser])
        .then((result) => {
                return result.rows
          })
    }


//=================================================================
 
// THIS QUERY AND FUNCTION CHANGES THE BOOLEAN STATE OF DELETED ON A GIVEN TWEETID

const deleteTweet = `UPDATE flitter_tweets SET deleted = TRUE WHERE tweetid = ? AND twitterid = ? RETURNING *`
const getTweet = 'SELECT * FROM flitter_tweets WHERE tweetid =?'


     
function deleteNLoad (flitterId, tweetID){
    return new Promise(function (resolve, reject){
        conn.raw(getTweet, [tweetID])
        .then((result) => {
           
            conn.raw(deleteTweet, [result.rows[0].tweetid, result.rows[0].twitterid])
            .then((result) => {
                conn.raw(findTweets, [result.rows[0].twitterid])
                .then((theTweets) => {
                    theTweets.tweets = result.rows
                    resolve(theTweets)
                })
            
      .catch(() => {
        reject('Something went wrong')
      })
    })
    .catch(() => {
        console.log('Something went wrong')
      })
    })
    })
}
  
 


module.exports = {
    connect:connect,
    newTweeter:newTweeter,
    currentFlitterUser:currentFlitterUser,
    createTweet:createTweet,
    getTweets:getTweets,
    tweetNLoad:tweetNLoad,
    deleteNLoad:deleteNLoad
   
}