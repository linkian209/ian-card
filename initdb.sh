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