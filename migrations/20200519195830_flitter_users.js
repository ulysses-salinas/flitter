const createFlitterUserTableQuery = `
    create table FlitterUsers  (
	twitterid bigint primary key,
	username text unique,
    displayname text unique,
    photoimage text,
	ftime timestamptz,
	mtime timestamptz default current_timestamp
);`

const dropFlitterUserTableQuery = `drop table list;`

exports.up = function(knex) {
    return knex.raw(createFlitterUserTableQuery)
};

exports.down = function(knex) {
    return knex.raw(dropFlitterUserTableQuery)
};


