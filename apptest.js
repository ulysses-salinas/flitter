const express = require('express')
const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const testData = require('./testdata.json');
//console.log(testData);

const port = 7878

// set the template engine
app.set('view engine', 'hbs')


app.get('/', function (req,res){
    res.render('index', {  })
});

app.get('/user/:twitterid', function (req,res){
    // logic to query the database using the twitterid
    res.render('tweet_list', { tweetData: testData })
 
});

app.post('//newtweet/:twitterid', function (req,res){
    // logic to write the new tweet to the daabase
    //then render tweet_list again with the updated list
});

app.delete("/delete/:tweetid", function (req, res) {
    //logic to delete the specific tweet from the database (using the tweet id)
    //then render tweet_list again with the updated list
});



app.listen(port, function () {
    console.log("Server is ALIVE! At port: " + port);
});



