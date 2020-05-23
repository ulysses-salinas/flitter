const createFlitterTweetsTableQuery = `
    create table Flitter_Tweets  (
    twitterid bigint references Flitter_Users(twitterid),
    tweetid serial PRIMARY KEY,
    tweet TEXT,
    deleted BOOLEAN DEFAULT false,
	ftime timestamptz,
	mtime timestamptz default current_timestamp
);`

const dropFlitterTweetsTableQuery = `drop table Flitter_Tweets;`

exports.up = function(knex) {
    return knex.raw(createFlitterTweetsTableQuery)
};

exports.down = function(knex) {
    return knex.raw(dropFlitterTweetsTableQuery)
};


