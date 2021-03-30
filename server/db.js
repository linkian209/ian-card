const Pool = require("pg").Pool;
require('dotenv').config();
const random = require('random');

const pool = new Pool({
    user: process.env.DB_API_USER,
    password: process.env.DB_API_PASS,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_API_DB
});

/* User Routes */
const getUserById = (req, res) => {
    const id = req.params.id;

    if(id === null)
    {
        res.sendStatus(400);
        return;
    }

    pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            res.status(200).json(results.rows[0]);
        }
    );
}

const getUserByName = (req, res) => {
    const username = req.params.username;
    
    if(username === null)
    {
        res.sendStatus(400);
        return;
    }

    pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            res.status(200).json(results.rows[0]);
        }
    );
}

const newUser = (req, res) => {
    const id = req.body.id;
    const username = req.body.username === null ? '' : req.body.username;

    if(id === null)
    {
        res.sendStatus(400);
        return;
    }

    pool.query(
        'INSERT INTO users (id, username, last_seen_ts) VALUES ($1, $2, current_timestamp)',
        [id, username],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            res.status(201).json({id: id, username: username});
        }
    );
};

const updateUser = (req, res) => {
    const id = req.params.id;
    const username = (req.body.username !== undefined ? req.body.username : null);

    if(id === null)
    {
        res.sendStatus(400);
        return;
    }

    pool.query(
        'UPDATE users SET username = $1, last_seen_ts = current_timestamp WHERE id = $2',
        [username, id],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            res.status(201).json({id: id,  username: username});
        }
    );
}

const deleteUser = (req, res) => {
    const id = req.params.id;

    if(id === null)
    {
        res.sendStatus(400);
        return;
    }

    pool.query(
      'DELETE FROM users WHERE id = $1',
      [id],
      (error, results) => {
          if(error)
          {
            console.log(error);
            res.sendStatus(500);
            return;
          }

          res.sendStatus(201);
      }  
    );
}

/* Collection Routes */
const getCollectionByUser = (req, res) => {
    const user_id = req.params.id;

    if(user_id === null)
    {
        res.sendStatus(400);
        return;
    }

    pool.query(
      'SELECT * FROM collection WHERE user_id = $1',
      [user_id],
      (error, results) => {
          if(error)
          {
            console.log(error);
            res.sendStatus(500);
            return;
          }

          res.status(200).json(results.rows);
      }  
    );
}

const getAllCardsByUser = (req, res)  => {
    const user_id = req.params.id;

    if(user_id === null)
    {
        res.sendStatus(400);
    }

    // First lets get all the cards and quantities owned by user
    pool.query(
        'SELECT card.*, collection.quantity, collection.acquire_ts FROM card, collection WHERE collection.user_id = $1 AND card.id = collection.card_id',
        [user_id],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }
            var cards = results.rows;
            var retval = cards.map((x) => {
                let {quantity, acquire_ts, ...card} = x
                return({card: card, quantity: quantity, acquire_ts: acquire_ts});
            });
            res.status(201).json(retval);
        }
    );
}

const getCollectionByUserCard = (req, res) => {
    const user_id = req.params.id;
    const card_id = req.params.card;

    if(user_id === null || card_id === null)
    {
        res.sendStatus(400);
        return;
    }

    pool.query(
        'SELECT * FROM collection WHERE user_id = $1 AND card_id = $2',
        [user_id, card_id],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }
            res.status(200).json(results.rows[0]);
        }
    )
}

const addToCollection = (req, res) => {
    const user_id = req.params.id;
    const card_id = req.body.card_id;
    const quantity = req.body.quantity;

    if(user_id === null || card_id === null || quantity === null)
    {
        res.sendStatus(400);
        return;
    }

    pool.query(
        'INSERT INTO collection (user_id, card_id, quantity) VALUES ($1, $2, $3)',
        [user_id, card_id, quantity],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            res.status(201).json({
                user_id: user_id,
                card_id: card_id,
                quantity: quantity
            });
        }
    );
}

const addOrUpdateCardInCollection = (req, res) => {
    const user_id = req.params.id;
    const card_id = req.body.card_id;
    const quantity = req.body.quantity;

    if(user_id === null || card_id === null || quantity === null)
    {
        res.sendStatus(400);
        return;
    }

    pool.query(
        'INSERT INTO collection (user_id, card_id, quantity) ' +
        'VALUES($1, $2, $3) ' +
        'ON CONFLICT (user_id, card_id) DO ' +
        'UPDATE SET quantity = collection.quantity + EXCLUDED.quantity, acquire_ts = CURRENT_TIMESTAMP',
        [user_id, card_id, quantity],
        (error, results) =>
        {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            res.sendStatus(201);
        }
    )
}

const updateCollection = (req, res) => {
    const user_id = req.params.id;
    const card_id = req.params.card;
    const quantity = req.body.quantity;

    if(user_id === null || card_id === null || quantity === null)
    {
        res.sendStatus(400);
        return;
    }

    pool.query(
        'UPDATE collection SET quantity = $1, acquire_ts = CURRENT_TIMESTAMP WHERE user_id = $2 AND card_id = $3',
        [quantity, user_id, card_id],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            res.status(201).json({user_id: user_id, card_id: card_id, quantity: quantity});
        }
    );
}

const deleteCollection = (req, res) => {
    const user_id = req.params.id;

    if(user_id === null)
    {
        res.sendStatus(400);
    }

    pool.query(
        'DELETE FROM collection WHERE user_id = $1',
        [user_id],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            res.sendStatus(201);
        }
    );
}

const removeCardFromCollection = (req, res) => {
    const user_id = req.params.id;
    const card_id = req.params.card;

    if(user_id === null || card_id === null)
    {
        res.sendStatus(400);
        return;
    }

    pool.query(
        'DELETE FROM collection WHERE user_id = $1 AND card_id = $2',
        [user_id, card_id],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            res.sendStatus(201);
        }
    );
}

/* Card Routes */
const getAllCards = (req, res) => {
    pool.query(
        'SELECT * FROM card',
        [],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            res.status(200).json(results.rows);
        }
    );
}

const getCard = (req, res) => {
    const id = req.params.id;

    if(id === null)
    {
        res.sendStatus(400);
        return;
    }

    pool.query(
        'SELECT * FROM card WHERE id = $1',
        [id],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            res.status(200).json(results.rows[0]);
        }
    );
}

const newCard = (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;
    const img = req.body.img;
    const rarity = req.body.rarity;
    const artist = req.body.artist;
    const shiny = req.body.shiny;
    const series = req.body.series;

    if(id === null || name === null || description === null || img === null ||
       rarity === null || artist === null || shiny === null || series === null)
    {
        res.sendStatus(400);
    }

    pool.query(
        'INSERT INTO card (id, name, description, img, rarity, artist, shiny, series) ' +
        'VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        [id, name, description, img, rarity, artist, shiny, series],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            res.sendStatus(201);
        }
    );
}

const getRandomCard = (req, res) => {
    // Our algorithm for determining a random card is as follows:
    // 1. Get all seris and pick a set, favoring the most recent series
    // 2. Pick a rarity from the set, using weighted average
    // 3. Pick a card from that rarity from that set

    pool.query(
        'SELECT id, create_ts FROM series',
        (error, results) => {
            // If there are no series, return
            // Should only be a problem in startup
            if(results.rows.length === 0)
            {
                res.sendStatus(404);
                return;
            }

            // Sort by timestamp
            var series = results.rows.sort((a,b) => {
                if(a.create_ts > b.create_ts)
                {
                    return 1;
                }
                if(a.create_ts < b.create_ts)
                {
                    return -1;
                }
                return 0;
            });

            // Lets pick the series
            var num_series = series.length;
            var total_weight = 0;
            var random_choice = -1;
            var series = series.map((value, idx) => {
                // This makes the most recent set weight = 1/3
                total_weight += (idx == 0 ? Math.ceil(num_series / 2) : 1);
                value['weight'] = total_weight;
                return value;
            }).reduce((result, cur_item) => {
                if(random_choice == -1)
                {
                    random_choice = random.int(0, total_weight | 0);
                }

                if(result == -1)
                {
                    if(cur_item.weight >= random_choice)
                    {
                        result = cur_item.id;
                    }
                }

                return result;
            }, -1);

            // Now lets get all rarities from this set
            pool.query(
                'SELECT DISTINCT rarity, series FROM card WHERE series = $1',
                [series],
                (error, results) => {
                    if(error)
                    {
                        console.log(error);
                        res.sendStatus(500);
                        return;
                    }

                    // Make sure we actually have cards
                    if(results.rows.length === 0)
                    {
                        res.sendStatus(404);
                        return;
                    }

                    var total_weight = 0;
                    var random_choice = -1;
                    var rarity = results.rows.map((value) => {
                        // This makes the most recent set weight = 1/3
                        total_weight += 100 / value.rarity;
                        value['weight'] = total_weight;
                        return value;
                    }).reduce((result, cur_item) => {
                        if(random_choice == -1)
                        {
                            random_choice = random.int(0, total_weight | 0);
                        }
        
                        if(result == -1)
                        {
                            if(cur_item.weight >= random_choice)
                            {
                                result = cur_item.rarity;
                            }
                        }
        
                        return result;
                    }, -1);
                
                    // Now lets get a random card from this rarity
                    pool.query(
                        'SELECT * FROM card WHERE rarity = $1 AND series = $2',
                        [rarity, results.rows[0].series],
                        (error, results) => {
                            if(error)
                            {
                                console.log(error);
                                res.sendStatus(500);
                                return;
                            }
                            var ret_idx = (results.rows.length > 1 ? random.int(0, results.rows.length - 1) : 0);
                            res.status(200).json(results.rows[ret_idx]);
                        }
                    );
                }
            );
        }
    );
}

/* Series Routes */
const getAllSeries = (req, res) => {
    pool.query(
        'SELECT * FROM series',
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }
            res.status(200).json(results.rows);
        }
    );
}

const newSeries = (req, res) => {
    const name = req.body.name;

    if(name === null)
    {
        res.sendStatus(400);
    }

    pool.query(
      'INSERT INTO series(name) VALUES ($1)',
      [name],
      (error, results) => {
          if(error)
          {
            console.log(error);
            res.sendStatus(500);
            return;
          }

          res.sendStatus(201);
      }  
    );
}

const getSeriesById = (req, res) => {
    const id = req.params.id;

    if(id === null)
    {
        res.sendStatus(400);
    }

    pool.query(
        'SELECT * FROM series WHERE id = $1',
        [id],
        (error, results) => {
            if(error)
            {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            res.status(200).json(results.rows[0]);
        }
    );
}

module.exports = {
    /* User Functions */
    getUserById,
    getUserByName,
    newUser,
    updateUser,
    deleteUser,
    /* Collection Functions */
    getCollectionByUser,
    getAllCardsByUser,
    getCollectionByUserCard,
    addOrUpdateCardInCollection,
    addToCollection,
    updateCollection,
    deleteCollection,
    removeCardFromCollection,
    /* Card Functions */
    getAllCards,
    getCard,
    newCard,
    getRandomCard,
    /* Series Functions */
    getAllSeries,
    newSeries,
    getSeriesById
};