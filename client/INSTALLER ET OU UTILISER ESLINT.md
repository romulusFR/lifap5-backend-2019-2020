
# LIFAP5 - projet 2019-2020 : guide d'installation et d'utilisation de ESLint

Guide d'installation et d'utilisation de ESLint sous Linux et Windows.

- [LIFAP5 - projet 2019-2020 : guide d'installation et d'utilisation de ESLint](#lifap5---projet-2019-2020---guide-d-installation-et-d-utilisation-de-eslint)
  - [Installation de Node.JS](#installation-de-nodejs)
    - [Installation pour Ubuntu](#installation-pour-ubuntu)
    - [Installation pour Windows](#installation-pour-windows)
    - [Installation pour Linux](#installation-pour-linux)
  - [Vérification de l'installation](#v%c3%a9rification-de-linstallation)
  - [Installation de ESLint en local](#installation-de-eslint-en-local)
  - [Lancement de ESLint](#lancement-de-eslint)

## Installation de Node.JS

### Installation pour Ubuntu

```bash
# update générale
sudo apt update
sudo apt upgrade

# installation Node.JS 14.x
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y nodejs gcc g++ make
```

### Installation pour Windows

Un installateur pour windows peut être trouvé à ce lien: <https://nodejs.org/en/download/current/>

### Installation pour Linux

En utilisant votre package manager préféré vous devez installer le package `nodejs` (il est aussi recommandé d'installer les packages suivants: `gcc g++ make`)

Sinon vous pouvez télécharger Nodejs à ce lien: <https://nodejs.org/en/download/current/>

## Vérification de l'installation

On vérifie que tout fonctionne

```bash
npm -v
# 6.14.4
node -v
# v14.0.0
```

## Installation de ESLint en local

Dans votre terminal préféré, pour windows ou linux:

En utilisant le `package.json` fournis dans ce dossier (recommandée):

```bash
npm install -D
```

Alternativement, si vous êtes une personne rebelle, vous pouvez l'installer sans passer par le `package.json` fournis à l'aide de cette commande:

```bash
npm install -D eslint eslint-config-prettier eslint-plugin-promise eslint-plugin-import eslint-config-airbnb-base
```

## Lancement de ESLint

Pour utiliser ESLint vous pouvez installer une extension sur éditeur de texte préféré  
        Par exemple pour vscode:  
Eslint <https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint>

Je ne veux pas installer d'extension ou bien, je suis un/une rebelle, cli 4 the win !  
    Directement dans votre terminal préféré vous utiliser cette commande pour passer ESLint sur tout les fichier js:

- Pour linux :

```bash
.\node_modules\eslint\bin\eslint.js ./js/
```

- Pour Windows :

```powershell
node .\node_modules\eslint\bin\eslint.js ./js/
```

J'ai plein d'erreur, est-ce que je code si mal que ça ?

- Il y a plus de chances que vous fassiez fonctionner ESLint sur le js de materialize, deux solutions s'offrent à vous :
  - 1ère solution: Utiliser le `.eslintignore` fourni pour ignorer le js de materialize
  - 2ème solution: Changer le `./js/` de la commande en quelque chose de plus précis pour ne pas prendre le js de materialize dedans

Attention si vous utilisez le repo backend, installer eslint dans un sous-dossier peut poser problème avec les dépendances, voir <https://github.com/microsoft/vscode-eslint/issues/696>

J'ai le dossier `node_modules` dans mon répertoire git, qu'est-ce que je peux en faire ?  

- Il faut l'ignorer à l'aide du fichier `.gitignore` pour ne pas en prendre compte dans le répertoire git, il faut donc créer le fichier `.gitignore` s'il n'existe pas et ajouter une ligne dedans avec `node_modules/`
