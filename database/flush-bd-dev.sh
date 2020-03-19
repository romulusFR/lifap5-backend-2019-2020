#!/bin/bash

PGPORT=5433
PGHOST=localhost
PGUSER=lifap5

psql -U "$PGUSER" -h "$PGHOST" -p "$PGPORT" -f ./schema.sql
psql -U "$PGUSER" -h "$PGHOST" -p "$PGPORT" -f ./views.sql
psql -U "$PGUSER" -h "$PGHOST" -p "$PGPORT" -f ./sample-users.sql
psql -U "$PGUSER" -h "$PGHOST" -p "$PGPORT" -f ./sample.sql

