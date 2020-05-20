const createFlitterTweetsTableQuery = `
    create table FlitterTweets  (
	twitterid bigint references FlitterUsers(twitterid),
	tweet TEXT,
	ftime timestamptz,
	mtime timestamptz default current_timestamp
);`

const dropFlitterTweetsTableQuery = `drop table list;`

exports.up = function(knex) {
    return knex.raw(createFlitterTweetsTableQuery)
};

exports.down = function(knex) {
    return knex.raw(dropFlitterTweetsTableQuery)
};
