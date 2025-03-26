CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- TODO Where to add this SQL to insert? backend service? GraphQL client? Need to define each component's responsibilities
INSERT INTO users (email, password)
VALUES (
    email,
    crypt(password, gen_salt('bf', 10))
);


-- Verify creds example
SELECT id, email
FROM users
WHERE email = 'user@example.com'
    AND password = crypt('myPassword', password)