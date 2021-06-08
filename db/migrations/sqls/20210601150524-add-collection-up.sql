CREATE TABLE IF NOT EXISTS collection 
(
    user_id UUID NOT NULL, 
    card_id UUID NOT NULL, 
    quantity integer NOT NULL, 
    acquire_ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, 
    CONSTRAINT fk_card FOREIGN KEY(card_id) REFERENCES card(id) ON DELETE CASCADE, 
    CONSTRAINT pk_collection PRIMARY KEY (user_id, card_id)
);
