# Use the official PostgreSQL slim image
FROM postgres:16-alpine

# Create a step for installing extensions (to be added later)
# TODO Add extensions. Do these just need to be defined when calling the db?
RUN true

# Default config - can be overridden via environment variables
# TODO Replace with secrets from the env. Only keep for local testing for now.
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=muinteoirai

# Expose default Postgres port
EXPOSE 5432

# Use default entrypoint from base image
