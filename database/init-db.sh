# a executer en temps qu'utilisateur postgres
# sudo -u postgres -s

createuser --no-createdb --echo --pwprompt lifap5
createdb --echo --owner lifap5 lifap5 

psql --dbname lifap5 -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
psql --dbname lifap5 -c 'CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";'