LIFAP5 - projet 2019-2020 : guide d'installation et de déploiement
==================================================================

Guide d'installation et de déploiement de l'application sous Linux Ubuntu.

- [LIFAP5 - projet 2019-2020 : guide d'installation et de déploiement](#lifap5---projet-2019-2020--guide-dinstallation-et-de-d%c3%a9ploiement)
  - [Installation pour le développement](#installation-pour-le-d%c3%a9veloppement)
    - [Installation de PostgresSQL et Node.JS.](#installation-de-postgressql-et-nodejs)
    - [Configuration Node.JS](#configuration-nodejs)
    - [Configuration PostgreSQL](#configuration-postgresql)
    - [Lancement de l'application](#lancement-de-lapplication)
  - [Déploiement en production](#d%c3%a9ploiement-en-production)
    - [Installation nginx](#installation-nginx)
    - [Creation du compte non privilegié `lifap5`](#creation-du-compte-non-privilegi%c3%a9-lifap5)
    - [Configuration nginx](#configuration-nginx)
    - [Configuration PostgreSQL](#configuration-postgresql-1)
    - [Lancement de l'application Node.JS via PM2](#lancement-de-lapplication-nodejs-via-pm2)
    - [Crontab pour remise à zéro de la base](#crontab-pour-remise-%c3%a0-z%c3%a9ro-de-la-base)


Installation pour le développement
-------------------------------------------

### Installation de PostgresSQL et Node.JS.

```bash
# update générale
sudo apt update
sudo apt upgrade

#  installation postgres-12
sudo echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" | sudo tee  /etc/apt/sources.list.d/pgdg.list > /dev/null
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt install -y postgresql-12 postgresql-contrib-12 postgresql-doc-12

# installation Node.JS 13.x
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y nodejs gcc g++ make

# installation de git
sudo apt install -y git
```

On vérifie que tout fonctionne

```bash
sudo -u postgres psql -Xqt -c "select version();"
# PostgreSQL 12.2 (Ubuntu 12.2-2.pgdg18.04+1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 7.4.0-1ubuntu1~18.04.1) 7.4.0, 64-bit
npm -v
# 6.13.7
node -v
# v13.10.1
git --version
# git version 2.17.1
```


### Configuration Node.JS

Un point à assurer  <https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally>

```bash
 mkdir ~/.npm-global
 npm config set prefix '~/.npm-global'
 export PATH=~/.npm-global/bin:$PATH
 source ~/.profile
```



### Configuration PostgreSQL


Exécuter le script [`system/postgresql/init-db.sh`](system/postgresql/init-db.sh) en tant que `postgres`.
 
```bash
 # /!\ avec l'utilisateur postgres /!\
 sudo -u postgres -s
 cd ~/lifap5-backend-2019-2020/system/postgresql
 init-db.sh
 # saisir 2 fois le mot de passe de l'utilisateur lifap5
 exit

# on configure le fichier ~/.pgpass avec le mot de passe saisi (ici LEPASSWORD)
 echo localhost:5432:lifap5:lifap5:LEPASSWORD > ~/.pgpas
 chmod 600  ~/.pgpass

# on va récupérer un .sqlrc
 rm -f ~/.psql_history
 mkdir -p ~/.psql_history/
 curl 'https://forge.univ-lyon1.fr/bd-pedago/bd-pedago/-/raw/master/.psqlrc' > ~.psqlrc

# maintenant on peut se logguer depuis le compte ubuntu
 psql -U lifap5 -h localhost
# ou via la socket unix en authentif peer
 sudo -u lifap5 psql
```

Pour créer le schéma puis peupler

```bash
 psql -U lifap5 -h localhost -f ./database/schema.sql
 psql -U lifap5 -h localhost -f ./database/triggers.sql
 psql -U lifap5 -h localhost -f ./database/views.sql 
 psql -U lifap5 -h localhost -f ./database/sample-users.sql
 psql -U lifap5 -h localhost -f ./database/sample.sql
```

Pour tester

```sql
select quiz_id, title, owner_id,
       question_id, question.content, optional, weight,
       proposition_id, proposition.content, correct
from quiz left join question using (quiz_id)
          left join proposition using(quiz_id, question_id)
order by quiz_id, question_id, proposition_id;
```


### Lancement de l'application


```bash
# clone du dépôt public
git clone https://github.com/romulusFR/lifap5-backend-2019-2020.git
cd lifap5-backend-2019-2020/

# pour installer toutes les dépendances
npm install
```

Maintenant, il ne reste que la création d'un fichier `.env` comme ci-dessous, à adapter à votre configuration
```ini
PG_HOST=localhost
PG_PORT=5432
PG_USER=lifap5
PG_PASS=pwdlifap5
PG_DNAME=lifap5
PG_SCHEMA=lifap5

PAGE_LIMIT=50
DEV_CONSOLE_DEBUG_LVL=silly
NODE_PORT=3000
NODE_ENV=development
```

Pour lancer en mode développement, l'application doit être accessible à <http://localhost:3000>

```bash
npm start
```


Déploiement en production
-------------------------

Cette partie n'est utile que pour un déploiement sur un serveur de production (public), pas pouir le développement

### Installation nginx

```bash
# installation nginx
sudo add-apt-repository ppa:nginx/stable
sudo apt update
sudo apt-get install -y nginx nginx-doc

nginx -v
# nginx version: nginx/1.16.1

```

### Creation du compte non privilegié `lifap5`

```bash
sudo useradd --user-group --create-home --shell /bin/bash --groups ubuntu lifap5
# on génère le mot de passe
sudo passwd lifap5
# ici la saisie

# on teste le password 
su lifap5 
```


### Configuration nginx

On va commencer par [le certbot de Let's encrypt](https://certbot.eff.org/lets-encrypt/ubuntubionic-other)

```bash
sudo apt install -y software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt update
sudo apt install -y certbot python-certbot-nginx

# on va configurer nginx en reverse proxy
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.back
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.back

sudo certbot --nginx
# répondre intéractivement
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.certbot
```

Là, on a la rediretion 80 vers 443 et un HTTPS de qualité B sur <https://www.ssllabs.com/ssltest/analyze.html?d=lifap5.univ-lyon1.fr>
On va maitenant durcir la configuration TLS et configurer les redirections vers Node.JS

```bash
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
cd /home/ubuntu/lifap5-backend-2019-2020/system/nginx

sudo cp ssl-params.conf /etc/nginx/snippets/
sudo cp nginx.conf /etc/nginx/
sudo cp proxy-params.conf /etc/nginx/snippets/
sudo cp default.conf /etc/nginx/sites-available/default

sudo systemctl restart nginx
#sudo nginx -t -s reload

#on peut tester avec openssl que tls1.3 est bien supporté
openssl s_client -connect lifap5:443 -tls1_3
```

A ce stade on a une 502 sur le port 80 si l'application n'est pas lancée.

### Configuration PostgreSQL


On va sauvegarder la configuration et mettre la notre :

* accès ssl et authentif scram-sha-256
* logging
* tuning des paramètres mémoire

```bash
sudo -u postgres cp /etc/postgresql/12/main/pg_hba.conf \
                    /etc/postgresql/12/main/pg_hba.conf.back
sudo -u postgres cp /etc/postgresql/12/main/postgresql.conf \
                    /etc/postgresql/12/main/postgresql.conf.back

cd ~/lifap5-backend-2019-2020/system/postgresql
sudo -u postgres cp pg_hba.conf /etc/postgresql/12/main/pg_hba.conf
sudo -u postgres cp postgresql.conf /etc/postgresql/12/main/postgresql.conf

sudo service postgresql restart
```

### Lancement de l'application Node.JS via PM2

`npm install --production` dans le dossier du dépôt pour installer toutes les dépendances (sauf celles de test) si pas déjà fait.
Modifier le fichier `.env` avec la config de prod et l'environnement production.
```ini
NODE_ENV=production
```

Pour le lancement, on utilise <https://pm2.keymetrics.io/>

* configuration dans le fichier `ecosystem.config.js`
* pour lancer en mode cluster et daemon `npx pm2 start`
* pour suivre
  * `npx pm2 ls` pour lister les processus
  * `npx pm2 monit lifap5` pour accéder au dashboard de suivi
  * `npx pm2 stop lifap5` pour arrêter
  * `npx pm2 del lifap5` pour supprimer du gestionnaire
  * `npx pm2 kill` pour tuer le daemon

On préfixera tout par `sudo -u lifap5` pour limiter les droits avec l'utilisateur précédment crée.

```bash
cd /home/ubuntu/lifap5-backend-2019-2020
sudo -u lifap5 npx pm2 start
```

Un alias `alias pm2='sudo -u lifap5 npx pm2'` est crée dans la `~/.bashrc`.

Pour mettre à jour la version sur la prod, il suffit de faire `git pull` pour la branche master et pm2 rechargera automatiquement l'application.


### Crontab pour remise à zéro de la base

Ajouter avec `crontab -e`, ici remise à zéro à 13:37 chaque jour <https://crontab.guru/#37_13_*_*_*>

```bash
crontab -e

# ajouter
# 37 13 * * * psql -X -U lifap5 -h localhost -f /home/ubuntu/lifap5-backend-2019-2020/database/sample.sql
```