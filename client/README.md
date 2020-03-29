LIFAP5 - projet 2019-2020 : gestionnaire de QCM
===============================================

* URL de votre dépôt <https://forge.univ-lyon1.fr>
* NOM Prénom numet #1
* NOM Prénom numet #2
* Nom de votre application (optionnel)

**NOTA BENE : la liste des fonctionnalités n'est pas encore définitive**

Fonctionnalités obligatoires
----------------------------

_*_Vous devez réaliser _toutes ces fonctionnalités_ pour avoir la note maximale_*_. Cocher celles réalisées :

* [ ] **Modifier l'utilisateur connecté** : il faut pour cela remplir la champ `xApiKey` de l'objet `state` déclaré dans `js/modeles.js`. Comprendre le fonctionnement permettant le mise à jour de l'état (dans `js/modeles.js`) et la modification du comportement du bouton "utilisateur" (dans `js/vues.js`). Ensuite, il faut permettre de choisir l'utilisateur avec lequel on se connecte et se délogguer le cas échéant.
* [ ] **Afficher les questions et les propositions d'un quiz** : lorsque l'on clique sur un quiz, la fonction `clickQuiz` (définie dans `js/vues.js`) est appelée. Elle appelle `renderCurrentQuizz` qui va changer l'affichage du div HTML `id-all-quizzes-main`. Modifier ces fonctions de façon à afficher les questions (et leurs propositions de réponses) du quiz au lieu de "Ici les détails pour le quiz _xxyyzz_".
* [ ] **Répondre à un quiz**: modifier l'affichage précédent de façon à pouvoir répondre au quiz, c'est-à-dire pouvoir cocher la réponse choisie à chaque question, puis cliquer sur un bouton "Répondre" qui enverra les réponses au serveur.
* [ ] **Afficher les quiz de l'utilisateur connecté et des réponses déjà données** : reprendre la fonctionnalité d'affichage de tous les quiz et l'adapter pour afficher les quiz de l'utilisateur connecté dans l'onglet "MES QUIZ". Similairement, remplir l'onglet "MES REPONSES" pour afficher les quiz auxquels l'utilisateur connecté a répondu
* [ ] **Créer un quiz pour l'utilisateur connecté** : ajouter un formulaire permettant de saisir les informations d'un nouveau quiz dans l'onglet "MES QUIZ". Ajouter un bouton "Créer" qu déclenchera l'ajout du quiz sur le serveur et le rafraîchissement de la liste des quiz. Permettre d'ajouter aux quiz de l'utilisateur connecté un formulaire d'ajout de question. Ce formulaire permettra de saisir les propositions possibles pour la question. Sa validation déclenchera l'ajout de la question sur le serveur.

Fonctionnalités optionnelles (au choix)
---------------------------------------


*Vous devez réaliser _au moins trois catégories de fonctionnalités_ pour avoir la note maximale*. Cocher celles réalisées :

* [ ] Catégorie **modifications de quiz et de leurs questions**
  - Mettre à jour un quiz : changer la description et le titre d'un quiz. Ajouter un bouton "Modifier" qui va faire apparaître un formulaire de modification. Gérer ce formulaire pour mettre à jour les données sur le serveur.
  - Mettre à jour l'énoncé une question: changer la phrase (`sentence`) d'énoncé et permettre d'ajouter / de supprimer une proposition à une question : ajouter par exemple un bouton de suppression à côté de chaque question et un formulaire d'ajout de proposition (NB, le serveur ne propose pas de route permettant de manipuler les propositions, tout passe par l'API des questions)

* [ ] Catégorie **affichage des quiz**
  - Permettre de choisir le nombre de résultats, le critère de tri des quiz ainsi que l'ordre (croissant ou décroissant) de l'affichage
  - Gérer la pagination pour afficher la liste des pages existantes avec le [composant pagination](https://materializecss.com/pagination.html) de Materialize.

* [ ] Catégorie **calcul des notes des quiz**
  - Dans l'onglet "MES QUIZ", afficher pour chacun des quiz de l'utilisateur la listes des répondants à ce quiz ainsi que la note obtenue, en comptant le nombre de réponses correctes répondues à chacune des questions (on supposera que toutes les questions ont le même poids).
  - Dans la liste des répondant d'un quiz, colorer différement les quiz qui sont complets (le répondant a répondu à toutes les questions) et les partiels

* [ ] Catégorie **gestion des réponses**
  - Modifier les réponses à un quiz auquel on a déjà répondu: Lorsque l'on a déjà répondu à un quiz, modifier le formulaire de réponse de façon à ce que le contenu du formulaire soit pré-rempli avec les réponses de l'utilisateur.
  - Se passer du bouton "Répondre" dans le formulaire de réponse: à chaque fois qu'une case est cochée, mettre directement à jour le serveur avec la réponse choisie par l'utilisateur.

* [ ] Catégorie **simplification IHM, suppression "MES QUIZ"**
  - Supprimer l'onglet "MES QUIZ" et intégrer ses fonctionnalités à l' onglet "TOUS LES QUIZ" en faisant en sorte que si le quiz affiché appartient à l'utilisateur connecté, les fonctionnalités de création (et modifications le cas échéant) sont accessibles.

* [ ] Catégorie **formulaire de recherche**
  - Le formulaire de recherche en haut de la page permet de recherche en texte plein sur tous les champ de texte des quiz, des questions et des propositions. Changer le comportement de l'onglet "TOUS LES QUIZ" mette en surbrillance les éléments au 

* [ ] Catégorie **mise à jour dynamique**
  - Gérer la mise à jour dynamique de la liste des quiz avec avec le _websocket_ fourni par le fichier [`websocket.js`](./js/websocket.js). La fonction fournie `installWebSocket(callbackOnMessage)` prend un paramètre un callback qui devra lancer le rafraichissement de votre interface lors d'une mise à jour sur le serveur.

Remarques additionnelles
------------------------

 Ici, commentaires ou remarques à destination des enseignants
