# Database
## Overview
Using Postgres for:
* User authentication (including JSON web tokens)
* Vector embeddings for user's summaries.

## Tables
1. Users - user information from registration for logging in and associating documents & session data.
2. jwt_keys - Session tokens for users to provide auth.

## Postgres Extensions
* pgcryto
* pgjwt

## Resources
* [Firebase](https://www.youtube.com/watch?v=3JW732GrMdg)