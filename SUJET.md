LIFAP5 - projet 2019-2020 : gestionnaire de QCM
===============================================

- [LIFAP5 - projet 2019-2020 : gestionnaire de QCM](#lifap5---projet-2019-2020--gestionnaire-de-qcm)
  - [Introduction](#introduction)
    - [Présentation du projet](#pr%c3%a9sentation-du-projet)
    - [Informations importantes](#informations-importantes)
    - [Versions du sujet](#versions-du-sujet)
  - [Gestionnaire de QCM : partie serveur](#gestionnaire-de-qcm--partie-serveur)
    - [Fonctionnalités de l'API rest](#fonctionnalit%c3%a9s-de-lapi-rest)
    - [Remarques importantes](#remarques-importantes)
  - [Gestionnaire de QCM : partie client](#gestionnaire-de-qcm--partie-client)
    - [Fonctionnalités](#fonctionnalit%c3%a9s)
      - [Fonctionnalités obligatoires](#fonctionnalit%c3%a9s-obligatoires)
      - [Fonctionnalités optionnelles (au choix)](#fonctionnalit%c3%a9s-optionnelles-au-choix)
    - [Jalons](#jalons)
  - [Modalités d'évaluation](#modalit%c3%a9s-d%c3%a9valuation)
    - [Soutenance](#soutenance)
    - [Critères d'évaluation](#crit%c3%a8res-d%c3%a9valuation)


Introduction
------------

### Présentation du projet

L'objectif de ce projet est de mettre en pratique ce qui a été vu dans l'UE LIFAP5 à travers la réalisation de la partie client, entièrement en JavaScript dans le navigateur et sans serveur, d'une _application minimaliste de gestion de QCM. 

On souhaite réaliser une application de gestion de QCM, appelés par la suite _quizzes_, ici simplifié pour les besoins pédagogiques. L'intégralité du [serveur REST](https://lifap5.univ-lyon1.fr/api-docs/) (_backend_) ainsi qu'une [version de départ du client](https://lifap5.univ-lyon1.fr/client/) vous sont fournis.

_Votre tâche consiste à ajouter des fonctionnalités au client pour pouvoir répondre aux QCMs existant, en créer de nouveau, les éditer, consulter les réponses etc._

### Informations importantes

 *  _Le calendrier initial n'est pas à ce jour modifié par les dispositions prises pour COVID-19, le face-à-face pédagogique restant assuré à distance d'ici la reprise des activités universitaires en présentiel_
 * _Le projet est à réaliser en monôme ou en binôme constitué au sein du même groupe de TD._
 * _Le serveur <https://lifap5.univ-lyon1.fr> est en ligne, sa page d'accueil contient toutes les informations utiles._
 
### Versions du sujet

* 21/03/20 : version initiale


Gestionnaire de QCM : partie serveur
------------------------------------

Cette partie est entièrement réalisée par l'équipe pédagogique. Le serveur <https://lifap5.univ-lyon1.fr> est en production, accessible publiquement sur internet. Le code du serveur contenant ainsi que l'intégralité des ressources associées sont publiquement accessible sur [GitHub](https://github.com/romulusFR/lifap5-backend-2019-2020#readme)


**Si vous constatez _des bugs ou des fonctionnalités manquantes_, utilisez [le gestionnaire de ticket](https://github.com/romulusFR/lifap5-backend-2019-2020/issues). Les _issues_ et a fortiori les _pull requests_ pertinentes seront favorablement valorisées dans l'évaluation.**

### Fonctionnalités de l'API rest

En plus de l'entité utilisateur, l'application est constituée de _quatre concepts métiers_ représentés [sur le schéma de base de données](https://github.com/romulusFR/lifap5-backend-2019-2020/blob/master/database/schema.png) de l'application :

* les _quizzes_ : un ensemble de questions, chaque _quiz_ a un propriétaire (_owner_id_) qui est le seul à pouvoir le modifier et consulter les réponses. 
* les _questions_ : chaque question est décrite par une phrase (_sentence_) est est composée d'un ensemble de _propositions_
* les _propositions_ : qui sont les réponses possibles à une question, une proposition à un contenu (son texte) et peut être correcte ou pas (attribut _correct_)
* les _answers_ : les réponses faites par les utilisateurs aux questions. Chaque utilisateur ne peut donner qu'une seule réponse à chaque question en choisissant la proposition qu'il considère correcte

Les différents _routes_ du serveur permettent de lire, modifier et supprimer ces différentes entités.

* **L'ensemble des fonctionnalités proposées par le serveur est documenté <https://lifap5.univ-lyon1.fr/api-docs/>.**
* **C'est votre _référence principale_ pour comprendre et utiliser le serveur.**

### Remarques importantes

* Une partie de l'API est accessible [sans authentification](https://lifap5.univ-lyon1.fr/api-docs/#/public) mais la majorité des fonctionnalités n'est accessible qu'aux utilisateurs disposant d'une _clef d'API_ (header HTTP _X-API-KEY_ et attribut _api_key_ dans la base).
  * **Chaque étudiant-e dispose d'une clef d'API _propre_ qui est indiquée dans <https://tomuss.univ-lyon1.fr/>**
  * Le projet de départ montre comment utiliser cette clef d'API.
* **Le contenu de la base de données est remis à zéro tous les jours à 13:37.**

Gestionnaire de QCM : partie client
------------------------------------

Un [projet de départ de la partie client](https://lifap5.univ-lyon1.fr/client/) vous est fournie. Elle ne permet que de donner les informations de l'utilisateur authentifié et de lister les _quizzes_. **Le projet consiste à la compléter avec une partie des fonctionnalités suivantes**

Le projet de départ de départ est réalisé avec la bibliothèque <https://materializecss.com/>, qui est une alternative plus légère (et plus simple) à <https://getbootstrap.com/> utilisée en LIFIHM. Les icônes utilisées sont celles de <https://material.io/resources/icons/>. Le projet de départ n'utilise aucune bibliothèque ou framework autre que ce que propose un navigateur à jour. **Votre réalisation devra se plier à ses contraintes**.

### Fonctionnalités

**NB: non définitif**

#### Fonctionnalités obligatoires

**Vous devez en réaliser _toutes ces fonctionnalités_ pour avoir la note maximale**

- Être connecté et afficher le nom de l'utilisateur connecté: il faut pour cela remplir la champ `xApiKey` de l'objet `state` déclaré dans `js/modeles.js`. Comprendre le fonctionnement permettant le mise à jour de l'état (dans `js/modeles.js`) et la modification du comportement du bouton "utilisateur" (dans `js/vues.js`).
- Afficher les questions d'un quizz: lorsque l'on clique sur un quizz, la fonction `clickQuiz` (définie dans `js/vues.js`) est appelée. Elle appelle `renderCurrentQuizz` qui va changer l'affichage du div HTML `id-all-quizzes-main`. Modifier ces fonctions de façon à afficher les questions du quizz au lieu de "Ici les détails pour le quizz xxyyzz". Il faudra pour cela récupérer les questions du quizz à afficher via un appel au serveur.
- Répondre à un quizz: modifier l'affichage précédent de façon à pouvoir répondre au quizz, c'est à dire pouvoir cocher la réponse choisie à chaque question, puis pouvoir cliquer sur un bouton "Répondre" qui enverra les réponses au serveur.
- Afficher les quizzes de l'utilisateur connecté: reprendre la fonctionnalité d'affichage de tous les quizz et l'adapter pour afficher les quizzes de l'utilisateur connecté dans l'onglet "MES QUIZZES".
- Créer un quizz: ajouter un formulaire permettant de saisir les informations d'un nouveau quizz dans l'onglet "MES QUIZZES". Ajouter un bouton "Créer" qu déclenchera l'ajout du quizz sur le serveur et le rafraîchissement de la liste des quizzes.
- Ajouter une question: Dans l'affichage d'un quizz, si c'est un quizz de l'utilisateur, ajouter un formulaire d'ajout de question. Ce formulaire permettra de saisir deux propositions possibles pour la question. Sa validation déclenchera l'ajout de la question sur le serveur.

#### Fonctionnalités optionnelles (au choix)

**Vous devez en réaliser _au moins une fonctionnalités dans chaque bloc_ pour avoir la note maximale**

Bloc 1:
- Mettre à jour un quizz: changer la description et le titre d'un quizz. Ajouter un bouton "Modifier" qui va faire apparaître un formulaire de modification. Gérer ce formulaire pour mettre à jour les données sur le serveur.
- Mettre à jour l'énoncé une question: changer la phrase (`sentence`) d'énoncé. Ajouter un bouton "Modifier" qui va faire apparaître un formulaire de modification. Gérer ce formulaire pour mettre à jour les données sur le serveur.

Bloc 2:
- Permettre d'ajouter / de supprimer une proposition à une question: ajouter par exemple un bouton de suppression à côté de chaque question et un formulaire d'ajout de proposition. 
- Modifier une proposition existante: ajouter un bouton qui remplace le texte de la proposition par un formulaire dont la validation met à jour la proposition.

Bloc 3:
- Lister les quizzes auxquels on a répondu: compléter l'onglet "MES RÉPONSES" de manière similaire à "MES QUIZZES", mais pour les quizzes auxquelles l'utilisateur a déjà répondu.
- Chercher un quizz: changer le comportement de façon à ce que l'onglet "TOUS LES QUIZZES" n'affiche que les quizzs renvoyés par la recherche indiquée dans le formulaire de recherche en haut de la page.

Bloc 4:
- Modifier les réponses à un quizz auquel on a déjà répondu: Lorsque l'on a déjà répondu à un quizz, modifier le formulaire de réponse de façon à ce que le contenu du formulaire soit pré-rempli avec les réponses de l'utilisateur.
- Se passer du bouton "Répondre" dans le formulaire de réponse: à chaque fois qu'une case est cochée, mettre directement à jour le serveur avec la réponse choisie par l'utilisateur.



### Jalons

Le calendrier est le suivant. Sauf prolongement des dispositions sur COVID-19, la soutenance est prévue en présentiel, un ordre de passage sera fixé sur <https://tomuss.univ-lyon1.fr/>

* 30/03/20 : initialisation projet
  * découverte du serveur
  * prise en main du client de départ
  * mise en place de l'environnement de travail sur <https://forge.univ-lyon1.fr>
* 06/04/20 - première séance de soutien projet 
  * communication des choix de binômes
  * développement des premières fonctionnalités (lecture)
* 20/04/20 - deuxième séance de soutien projet 
  * développement des autres fonctionnalités (écritures)
  * enregistrement de l'ordre de passage
* 04/05/20 - **soutenances projet**
  * démonstration de 5 minutes suivies de 5 minutes de question
  * dépôt du code et du tableau de synthèse


Modalités d'évaluation
---------------------
**NB: non définitif**

Une archive zip contiendra tous vos fichiers `html`, `js` et les fichiers statiques (e.g., images) utilisés ainsi que **le fichier `README.md`** dument complété (voir l'archive zip de départ).

### Soutenance

Pour la soutenance, vous préparez une courte présentation du projet qui doit montrer l'ensemble des fonctionnalités réalisées.

**Arrivez 5 minutes en avance et préparer votre poste de travail avec votre éditeur et votre navigateur prêts à commence la démonstration**.


### Critères d'évaluation



Lors de la soutenance vous serez évalués avec le barème (prévisionnel) suivant :

* /8 _fonctionnalités obligatoires_ :
    * -1 point par fonctionnalité manquante, -0.5 par fonctionnalité mal réalisée.
* /8 _fonctionnalités optionnelles_, une fonctionnalité attendue par catégorie
    * -2 par catégorie manquante, -1 par fonctionnalité mal réalisée,
* /4 _qualité logicielle_ : commentaires, structure du projet, outillage (linting, tests, mise en forme), élégance et simplicité du code
* /2 _bonus contributions_ : pour les utilisateurs qui ont posé des _issues_ ou des _pull requests_ pertinentes sur GitHub


**Quelques rendus sélectionnés seront proposés à leurs auteurs à être rendus publics**