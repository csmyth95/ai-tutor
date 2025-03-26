CREATE EXTENSION IF NOT EXISTS pgjwt;

CREATE TABLE jwt_keys (
    id SERIAL PRIMARY KEY,
    kid VARCHAR(255) NOT NULL UNIQUE,
    key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- TODO Sign a token on the server
SELECT
    sign(
        '{"sub":"12345667890","email":"user@example.com","admin":true}',
        'secret'
    )

SELECT * FROM
    verify('someToken', 'secret');