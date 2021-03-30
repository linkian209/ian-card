require('dotenv').config();
const {Client} = require('pg');

var super_opts = {
    user: process.env.DB_SUPER_USER,
    password: process.env.DB_SUPER_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_SUPER_DB
};

var api_opts_super = {
    user: process.env.DB_API_USER,
    password: process.env.DB_API_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_SUPER_DB
};

var api_opts = {
    user: process.env.DB_API_USER,
    password: process.env.DB_API_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_API_DB
};

var user_table_create =  'CREATE TABLE users (' +
                            'id uuid PRIMARY KEY, ' +
                            'last_seen_ts TIMESTAMP WITH TIME ZONE, ' +
                            'username VARCHAR(64)' +
                          ')';

var card_table_create = 'CREATE TABLE card (' +
                            'id uuid PRIMARY KEY, ' +
                            'name VARCHAR(64) NOT NULL, ' +
                            'description text NOT NULL, ' +
                            'img text NOT NULL, ' +
                            'rarity integer NOT NULL, ' +
                            'artist VARCHAR(64) NOT NULL, ' +
                            'shiny boolean NOT NULL, ' +
                            'series integer NOT NULL, ' +
                            'CONSTRAINT fk_series FOREIGN KEY(series) REFERENCES series(id) ON DELETE CASCADE' +
                        ')';

var collection_table_create = 'CREATE TABLE collection (' +
                                'user_id UUID NOT NULL, ' +
                                'card_id UUID NOT NULL, ' +
                                'quantity integer NOT NULL, ' +
                                'acquire_ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, ' +
                                'CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, ' +
                                'CONSTRAINT fk_card FOREIGN KEY(card_id) REFERENCES card(id) ON DELETE CASCADE, ' +
                                'CONSTRAINT pk_collection PRIMARY KEY (user_id, card_id)'
                              ')';

var series_table_create = 'CREATE TABLE series (' +
                            'id SERIAL PRIMARY KEY, ' +
                            'name VARCHAR(64) NOT NULL, ' +
                            'create_ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' +
                          ')';

// This whole operation will take place in a series of callbacks

// Start off by making the user
const client = new Client(super_opts);
client.connect(err => {
    if(err)
    {
        console.log("Error connecting to DB! Check config!");
        return;
    }

    client.query(
        'CREATE ROLE ' + process.env.DB_API_USER + ' WITH LOGIN PASSWORD \'' + process.env.DB_API_PASS + '\'',
        (err, results) => {
            if(err)
            {
                console.log("Error Creating Role! " + err.message);
            }

            // Now give the user permissions to make the DB
            client.query(
                'ALTER ROLE ' + process.env.DB_API_USER + ' CREATEDB',
                (err, results) => {
                    if(err)
                    {
                        console.log("Error altering role! " + err.message);
                    }

                    // Now connect to the user role
                    client.end()
                    const api_super_client = new Client(api_opts_super);
                    api_super_client.connect(err => {
                        if(err)
                        {
                            console.log("Error connecting to api user! Check config! " + err.message);
                            return;
                        }

                        // Now let's create the DB
                        api_super_client.query(
                            'CREATE DATABASE ' + process.env.DB_API_DB,
                            (err, results) => {
                                if(err)
                                {
                                    console.log("Error creating database! " + err.message);
                                }

                                // Now connect to the db and make tables
                                api_super_client.end();
                                const api_client = new Client(api_opts);
                                api_client.connect(err => {
                                    if(err)
                                    {
                                        console.log("Cannot connect to new DB! Check config! " + err.message);
                                        return;
                                    }

                                    // Now make the user table
                                    api_client.query(
                                        user_table_create,
                                        (err, results) => {
                                            if(err)
                                            {
                                                console.log("Error creating users table! " + err.message);
                                            }

                                            // Now make the series table
                                            api_client.query(
                                                series_table_create,
                                                (err, results) => {
                                                    if(err)
                                                    {
                                                        console.log("Error making the series table " + err.message);
                                                    }

                                                    // Make card table
                                                    api_client.query(
                                                        card_table_create,
                                                        (err, results) => {
                                                            if(err)
                                                            {
                                                                console.log("Error making card table! " + err.message);
                                                            }

                                                            // Now make series table
                                                            api_client.query(
                                                                collection_table_create,
                                                                (err, results) => {
                                                                    if(err)
                                                                    {
                                                                        console.log("Error making collection table! " + err.message);
                                                                    }                
                                                                    
                                                                    // Done!
                                                                    console.log("DB Creation done.");

                                                                    api_client.end();
                                                                    return;
                                                                }
                                                            );
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                });
                            }
                        );
                    });
                }
            );
        }
    );
});