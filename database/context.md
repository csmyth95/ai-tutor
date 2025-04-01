# Database

## TODO
1. Move to its own directory outside the backend

## Overview
Using Postgres for:
* User authentication (including JSON web tokens)
* Vector embeddings for user's summaries.

## Tables
1. Users - user information from registration for logging in and associating documents & session data.
2. jwt_keys - Session tokens for users to provide auth.
3. Documents - user's uploaded PDF information such as a reference to their S3 location, the summary & tags associated with the document.


## Postgres Extensions
* pgcryto - encrypting sensitive data at rest.
* pgjwt - JSON web token for session verification.
* pgvector - document embeddings for LLMs.

## Resources
* [Firebase](https://www.youtube.com/watch?v=3JW732GrMdg)