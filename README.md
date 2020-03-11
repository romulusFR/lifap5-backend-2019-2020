LIFAP5 - projet 2019-2020 : backend
===================================

Ce dépôt est celui du projet 2019-2020 (Printemps) de l'unité d'enseignement [LIFAP5 "Programmation fonctionnelle pour le WEB"](https://perso.liris.cnrs.fr/romuald.thion/dokuwiki/doku.php?id=enseignement:lifap5:start) en licence 2 informatique UCBL. Ce dépôt contient :

* le sujet du projet,
* la spécification de l'API du serveur,
* le [code du serveur Node.JS](./app.js),
* la [base de données PostgreSQL](./database/schema.png) ([schéma SQL](./database/schema.sql))
* le [guide d'installation et de déploiement](./DEPLOYMENT.md)
  * NB: pour le développement local, la partie nginx n'est pas nécessaire
* les tests,


Le serveur est réalisé en Node.js/Express/PostgreSQL.

TODO
----

* [X] déploiement "auto" prod et pm2
* [X] negotiation de contenus application/json et text/html
* [ ] gérer le cache pour les fichiers statiques via nginx
* [ ] rendre l'application auto déploiante sur le serveur postgres (crée le schéma s'il n'existe pas)


Tooling
-------

Utilise VSCode, eslint (avec ses plugins) et prettier.

* Pour prettier et son intéraction avec eslint <https://stackoverflow.com/questions/44690308/whats-the-difference-between-prettier-eslint-eslint-plugin-prettier-and-eslint>

Licence
-------

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/fr/"><img alt="Licence Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/3.0/fr/88x31.png" /></a><br />Ce(tte) œuvre est mise à disposition selon les termes de la <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/fr/">Licence Creative Commons Attribution - Pas d’Utilisation Commerciale - Partage dans les Mêmes Conditions 3.0 France</a>.

