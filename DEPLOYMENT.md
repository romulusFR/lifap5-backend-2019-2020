LIFAP5 - projet 2019-2020 : documentation de déploiement
========================================================

On donne ici des informations sur le développement et le déploiement de l'application.


Installation générale
---------------------

### Pour des versions à jour de nginx, PostgresSQL et Node.JS.

```bash
# update générale
sudo apt update
sudo apt upgrade

# installation nginx
sudo add-apt-repository ppa:nginx/stable
sudo apt update
sudo apt-get install -y nginx nginx-doc

#  installation postgres-12
sudo echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" | sudo tee  /etc/apt/sources.list.d/pgdg.list > /dev/null
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt install -y postgresql-12 postgresql-contrib-12 postgresql-doc-12

# installation Node.JS 13.x
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y nodejs gcc g++ make
```

### Vérifications 

```bash
nginx -v
# nginx version: nginx/1.16.1

sudo -u postgres psql -Xqt -c "select version();"
# PostgreSQL 12.2 (Ubuntu 12.2-2.pgdg18.04+1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 7.4.0-1ubuntu1~18.04.1) 7.4.0, 64-bit

npm -v
# 6.13.7
node -v
# v13.10.1
```

###  Clone du dépôt public

```bash
# installation de git
sudo apt install -y git
git clone https://github.com/romulusFR/lifap5-backend-2019-2020.git
cd lifap5-backend-2019-2020/
```

###  Creation du compte non privilegié `lifap5`

```bash
sudo useradd --user-group --create-home --shell /bin/bash --groups ubuntu lifap5
# on génère le mot de passe
sudo passwd lifap5
# ici la saisie

# on teste le password 
su lifap5 
```


Configuration PostgreSQL
------------------------

On va sauvegarder la configuration et mettre la notre :

* accès ssl et authentif scram-sha-256
* logging
* tuning des paramètres mémoire

```bash
sudo -u postgres cp /etc/postgresql/12/main/pg_hba.conf \
                    /etc/postgresql/12/main/pg_hba.conf.back
sudo -u postgres cp /etc/postgresql/12/main/postgresql.conf \
                    /etc/postgresql/12/main/postgresql.conf.back

cd ~/lifap5-backend-2019-2020/database
sudo -u postgres cp pg_hba.conf /etc/postgresql/12/main/pg_hba.conf
sudo -u postgres cp postgresql.conf /etc/postgresql/12/main/postgresql.conf

sudo service postgresql restart
```

Exécuter le script [`database/init-db.sh`](database/init-db.sh) en tant que `postgres`.
 
```bash
 # /!\ avec l'utilisateur postgres /!\
 sudo -u postgres -s
 cd ~/lifap5-backend-2019-2020/database
 init-db.sh
 # saisir le mot de passe 2 fois
 exit

# on configure le fichier ~/.pgpass
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
 psql -U lifap5 -h localhost -f ./database/views.sql
 psql -U lifap5 -h localhost -f ./database/sample-users.sql
 psql -U lifap5 -h localhost -f ./database/sample.sql
```

Configuration Node.js
--------------------

Un point à assurer  <https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally>

```bash
 mkdir ~/.npm-global
 npm config set prefix '~/.npm-global'
 export PATH=~/.npm-global/bin:$PATH
 source ~/.profile
```

Lancement de l'application Node.JS
----------------------------------

`npm install --production` dans le dossier du dépot pour installer toutes les dépendances (sauf celles de test)

Pour le lancement, on utilise <https://pm2.keymetrics.io/>

* configuration dans le fichier `ecosystem.config.js`
* pour lancer en mode cluster et daemon `npx pm2 start`
* pour suivre
  * `npx pm2 ls` pour lister les processus
  * `npx pm2 monit lifap5` pour accéder au dashboard de suivi
  * `npx pm2 stop lifap5` pour arrêter
  * `npx pm2 del lifap5` pour supprimer du gestionnaire
  * `npx pm2 kill` pour tuer le daemon

On préfixera tout par `sudo -u lifap5` pour limiter les droits.

```bash
cd /home/ubuntu/lifap5-backend-2019-2020
sudo -u lifap5 npx pm2 start
```

Un alias `alias pm2='sudo -u lifap5 npx pm2'` est crée dans la `~/.bashrc`.

Pour mettre à jour la version sur la prod, il suffit de faire `git pull` pour la branche master et pm2 rechargera automatiquement l'application.

Configuration nginx
-------------------

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

# sudo openssl dhparam -out /etc/nginx/dhparam.pem 4096

```bash
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
cd /home/ubuntu/lifap5-backend-2019-2020/nginx
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
