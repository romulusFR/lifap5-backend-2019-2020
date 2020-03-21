LIFAP5 - projet 2019-2020 : backend
===================================

Ce dépôt est celui du projet 2019-2020 (Printemps) de l'unité d'enseignement [LIFAP5 "Programmation fonctionnelle pour le WEB"](https://perso.liris.cnrs.fr/romuald.thion/dokuwiki/doku.php?id=enseignement:lifap5:start) en licence 2 informatique UCBL. Ce dépôt contient :

* le [sujet du projet](SUJET.md),
* la [spécification de l'API du serveur](https://lifap5.univ-lyon1.fr/api-docs),
* le [code de l'application](./app.js) réalisée avec Node.js et le framework Express,
* la [base de données PostgreSQL](./database/schema.png), le dossier contient 
  * [le schéma SQL](./database/schema.sql)
  * [un jeu d'essai d'utilisateurs](./database/sample-users.sql)
  * [un jeu d'essai de qcm](./database/sample.sql)
  * le [dossier `database`](./database/) contient aussi les fichiers de configuration
* le [guide d'installation et de déploiement](./DEPLOYMENT.md)
  * NB: pour le développement local, la partie nginx n'est pas nécessaire
* le [client de départ](./client/)

**L'application est déployée sur le serveur <https://lifap5.univ-lyon1.fr/>**



Licence
-------

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/fr/"><img alt="Licence Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/3.0/fr/88x31.png" /></a><br />Ce(tte) œuvre est mise à disposition selon les termes de la <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/fr/">Licence Creative Commons Attribution - Pas d’Utilisation Commerciale - Partage dans les Mêmes Conditions 3.0 France</a>.

