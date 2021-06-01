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
