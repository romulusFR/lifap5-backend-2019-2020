LIFAP5 - projet 2019-2020 : foire aux questions
===============================================

Questions fréquemment posées sur le projet <https://chat-info.univ-lyon1.fr/channel/lifap5>

* **Comment on accède/crée les propriétés `dataset`** ?
  * Les propriétés dans `dataset.nom` des objets JS reflètent les attributs de la forme `data-nom` des  éléments <https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/dataset> HTML, voir par exemple <https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes>.


* **Après `getElementsByName` ou `querySelectorAll` je n'ai pas de tableau, comment faire ?**
  * Effectivement, une [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) n'est pas un _vrai_ tableau, il n'implémente qu'une partie de l'API de `Array`. La méthode [forEach](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach) existe, pour le reste, soit on itère sur [NodeList.entries](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/entries) ou alors on converti en tableau avec [Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)

* **J'ai des erreurs _503 Service Unavailable_**
  * Vous attégniez la fréquence max autorisée du nombre de requêtes/seconde, voir [les informations importantes](./SUJET.md#remarques-importantes)

* **J'ai une erreur _403 Forbidden_ quand j'envoie les réponses à certains quizz**
  * Vérifiez que le quizz n'est pas fermé : chaque quizz a une propriété `open` qui indique s'il autorise les réponses ou pas

* **Comment gérer un projet sur le GitLab <https://forge.univ-lyon1.fr/>**
  * Voir cours 4 et TD 4 de LIFAP4 <https://perso.liris.cnrs.fr/alexandre.meyer/public_html/www/doku.php?id=lifap4>

* **J'utilise materialize, et mes radio buttons / checkboxes ne s'affichent pas**
  * Si le HTML de vos [radio buttons](https://materializecss.com/radio-buttons.html) / [checkboxes](https://materializecss.com/checkboxes.html) est bien inséré dans la page, mais que vous ne les voyez pas s'afficher, il est probable que vous ne respectiez pas rigoureusement la [syntaxe](https://materializecss.com/radio-buttons.html) [préconisée](https://materializecss.com/checkboxes.html) par materialize : vérifiez bien que vous n'avez pas oublié un `<span>`, inversé deux tags, etc. ; tout est important