# Database
## Overview
Using Postgres for:
* User authentication (including JSON web tokens)
* Vector embeddings for user's summaries.

## Tables
1. Users - user information from registration for logging in and associating documents & session data.
2. jwt_keys - Session tokens for users to provide auth.
3. Documents - user's uploaded PDF information such as a reference to their S3 location, the summary & tags associated with the document.

## Docker Commands
* `docker exec -it ai-tutor-postgres-1 sh`
* Check logs: `docker logs ai-tutor-postgres-1`


## Postgres Extensions of Interest
* pgcryto - encrypting sensitive data at rest.
* pgjwt - JSON web token for session verification.
* pgvector - document embeddings for LLMs.
