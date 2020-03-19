#!/bin/bash

#https://stackoverflow.com/questions/59895/how-to-get-the-source-directory-of-a-bash-script-from-within-the-script-itself
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo Running in \'"$DIR"\'

PGPORT=5433
PGHOST=localhost
PGUSER=lifap5

CMD="psql -X -U $PGUSER -h $PGHOST -p $PGPORT"

eval ${CMD} -f $DIR/schema.sql
eval ${CMD} -f $DIR/views.sql
eval ${CMD} -f $DIR/sample-users.sql
eval ${CMD} -f $DIR/sample.sql

