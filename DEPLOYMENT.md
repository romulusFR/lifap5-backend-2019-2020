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

**TBD**

```bash
 sudo -u postgres -s
 cd /etc/postgresql/12/main
 cp pg_hba.conf pg_hba.conf.back
 cp postgresql.conf postgresql.conf.back
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
```



Configuration nginx
-------------------

```bash
# on va configurer nginx en reverse proxy
cd /etc/nginx/sites-available/
sudo mv default default.back


# puis créer les deux fichiers de configuration ci-dessous
# [...]
```

Pour le fichier `/etc/nginx/sites-available/default`
```nginx
# Load balancing / server declaration
upstream nodejs {
    zone nodejs 64k;
    server localhost:3000;
}

# HTTP front for node
server {
    listen       80;
    server_name  _;

    location / {
       include /etc/nginx/conf.d/proxy_set_header.inc;
       proxy_pass http://nodejs;
    }
}
```

Pour le fichier `/etc/nginx/conf.d/proxy_set_header.inc`
```nginx
proxy_set_header X-Forwarded-By $server_addr:$server_port;
proxy_set_header X-Forwarded-For $remote_addr;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header Host $host;
```

A ce stade on a une 502 sur le port 80 car l'application n'est pas lancée


Configration Node.js
--------------------

 **TBD**


Lancement de l'application Node.js
----------------------------------

**TBD**

