#!/bin/bash
set -e

until psql --dbname "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@:5432/$POSTGRES_DB" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

psql -v ON_ERROR_STOP=1 --dbname "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@:5432/$POSTGRES_DB" <<-EOSQL
CREATE ROLE $DB_API_USER WITH LOGIN PASSWORD '$DB_API_PASS';
ALTER ROLE $DB_API_USER CREATEDB;
EOSQL

psql -v ON_ERROR_STOP=1 --dbname "postgresql://$DB_API_USER:$DB_API_PASS@:5432/$POSTGRES_DB" <<-EOSQL
CREATE DATABASE $DB_API_DB;
EOSQL

psql -v ON_ERROR_STOP=1 --dbname "postgresql://$DB_API_USER:$DB_API_PASS@:5432/$DB_API_DB" <<-EOSQL
CREATE TABLE users
(
    id uuid PRIMARY KEY,
    last_seen_ts TIMESTAMP WITH TIME ZONE,
    username VARCHAR(64)
);

CREATE TABLE series
(
    id SERIAL PRIMARY KEY, 
    name VARCHAR(64) NOT NULL, 
    create_ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE card
(
    id uuid PRIMARY KEY, 
    name VARCHAR(64) NOT NULL, 
    description text NOT NULL, 
    img text NOT NULL, 
    rarity integer NOT NULL, 
    artist VARCHAR(64) NOT NULL, 
    shiny boolean NOT NULL, 
    series integer NOT NULL,
    CONSTRAINT fk_series FOREIGN KEY(series) REFERENCES series(id) ON DELETE CASCADE
);

CREATE TABLE collection 
(
    user_id UUID NOT NULL, 
    card_id UUID NOT NULL, 
    quantity integer NOT NULL, 
    acquire_ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, 
    CONSTRAINT fk_card FOREIGN KEY(card_id) REFERENCES card(id) ON DELETE CASCADE, 
    CONSTRAINT pk_collection PRIMARY KEY (user_id, card_id)
);
EOSQL