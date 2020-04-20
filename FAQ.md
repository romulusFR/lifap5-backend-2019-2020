LIFAP5 - projet 2019-2020 : foire aux questions
===============================================

Questions fréquemment posées sur le projet <https://chat-info.univ-lyon1.fr/channel/lifap5>

* **Comment on accède/crée les propriétés `dataset`** ?
  * Les propriétés dans `dataset.nom` des objets JS reflètent les attributs de la forme `data-nom` des  éléments <https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/dataset> HTML, voir par exemple <https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes>.


* **Après `getElementsByName` ou `querySelectorAll` je n'ai pas de tableau, comment faire ?**
  * Effectivement, une <https://developer.mozilla.org/en-US/docs/Web/API/NodeList> n'est pas un _vrai_ tableau, il n'implémente qu'une partie de l'API de `Array`. La méthode <https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach> existe, pour le reste, soit on itère sur <https://developer.mozilla.org/en-US/docs/Web/API/NodeList/entries> ou alors on converti en tableau avec <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from>

* **J'ai des erreurs _503 Service Unavailable_**
  * Vous attégniez la fréquence max autorisée du nombre de requêtes/seconde, voir [les informations importantes](./SUJET.md#informations-importantes)