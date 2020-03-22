LIFAP5 - projet 2019-2020 : documentation de développement
==========================================================


TODO
----

* [X] déploiement "auto" prod et pm2
* [X] negotiation de contenus application/json et text/html
* [ ] gérer le cache pour les fichiers statiques via nginx
* [ ] rendre l'application auto déploiante sur le serveur postgres (crée le schéma s'il n'existe pas)



Gestion d'erreur Node.JS
------------------------

* <https://github.com/goldbergyoni/nodebestpractices#2-error-handling-practices>
* <https://www.joyent.com/node-js/production/design/errors>
* <https://blog.insiderattack.net/error-management-in-node-js-applications-e43198b71663>

Tooling
-------

Utilise VSCode, eslint (avec ses plugins) et prettier.

* Pour prettier et son intéraction avec eslint <https://stackoverflow.com/questions/44690308/whats-the-difference-between-prettier-eslint-eslint-plugin-prettier-and-eslint>

Notifications PG
----------------

 * <https://www.postgresql.org/docs/12/sql-notify.html>
 * <https://node-postgres.com/api/client#events>
   * option `keepAlive` non documentée <https://github.com/brianc/node-postgres/search?q=keepALive&unscoped_q=keepALive>
   * c'est celle des Stram Node <https://nodejs.org/api/net.html#net_socket_setkeepalive_enable_initialdelay>
 * <https://tapoueh.org/blog/2018/07/postgresql-listen-notify/>
 * <https://github.com/andywer/pg-listen>