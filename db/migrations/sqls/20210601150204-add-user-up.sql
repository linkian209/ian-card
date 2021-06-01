CREATE TABLE users
(
    id uuid PRIMARY KEY,
    last_seen_ts TIMESTAMP WITH TIME ZONE,
    username VARCHAR(64)
);
