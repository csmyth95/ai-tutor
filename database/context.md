# Database
## Overview
Using Postgres for:
* User authentication (including JSON web tokens)
* Vector embeddings for user's summaries.

## Tables
1. Users - user information from registration for logging in and associating documents & session data.
2. jwt_keys - Session tokens for users to provide auth.
3. Documents - user's uploaded PDF information such as a reference to their S3 location, the summary & tags associated with the document.

## Connect to Postgres Docker
* `docker exec -it ai-tutor-postgres-1 sh`

## [pgAdmin](https://www.pgadmin.org/)
Followed guide: https://github.com/docker/awesome-compose/tree/master/postgresql-pgadmin

* Once started, navigate to: `http://localhost:5050/`
* Use creds from local.env
* Add Postgres database to pgAdmin.


## Postgres Extensions
* pgcryto - encrypting sensitive data at rest.
* pgjwt - JSON web token for session verification.
* pgvector - document embeddings for LLMs.
