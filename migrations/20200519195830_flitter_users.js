const createFlitterUserTableQuery = `
    create table Flitter_Users  (
	twitterid bigint primary key,
	username text unique,
    displayname text unique,
    photoimage text,
	ftime timestamptz,
	mtime timestamptz default current_timestamp
);`

const dropFlitterUserTableQuery = `drop table Flitter_Users;`

exports.up = function(knex) {
    return knex.raw(createFlitterUserTableQuery)
};

exports.down = function(knex) {
    return knex.raw(dropFlitterUserTableQuery)
};


