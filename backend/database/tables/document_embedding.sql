-- TODO Add for vector embeddings

-- TODO Create table


ALTER TABLE document_embedding ENABLE ROW LEVEL SECURITY;

-- Built in Postgres feature
CREATE POLICY user_documents_policy
ON document_embedding
FOR SELECT USING 
    (user_id = current_setting('jwt.claims.sub', true));