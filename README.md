# Commencer avec SuperGym

## Outils Prérequis

Cette application web ne peut fonctionner qu'en mode développement. 🥲 C'est-à-dire qu'il vous faudra un IDE (environnement
de programmation) pour l'utiliser. J'ai utilisé WebStorm de Jetbrains pour la création de cette application.

Voici le lien pour télécharger WebStorm : ✨ https://www.jetbrains.com/webstorm/ ✨

Il vous faudra aussi installer npm : https://www.npmjs.com/package/download et Node.js : https://nodejs.org/en/download

## Installation de l'application

1) Télécharger le zip de l'application disponible sur GitHub et le dézipper où vous pourrez facilement le retrouver.
2) Ouvrir le dossier "supergym" via votre IDE (sur Webstorm : File>Open>supergym)
3) Configuration d'un lancement simple avec WebStorm (optionnel)
   ### Client :
   &nbsp;&nbsp;&nbsp; 3.1. A.
   A côté de l'icône de "bug", cliquer sur les 3 points verticaux puis sur "Edit".

   &nbsp;&nbsp;&nbsp; 3.1. B.
   Une nouvelle fenêtre va s'ouvrir. Cliquer sur l'icône "+" en haut à gauche puis sur npm dans la liste proposée.

   &nbsp;&nbsp;&nbsp; 3.1. C.
   La partie "Name" indique le nom du raccourci que vous allez créer. Vous pouvez indiquer "run-client" par exemple.

   &nbsp;&nbsp;&nbsp; 3.1. D.
   Dans la partie "package.json" veuillez indiquer le chemin absolu complet du fichier suivant : "supergym\client\package.json"

   &nbsp;&nbsp;&nbsp; 3.1. E.
   Dans la partie "Command" indiquer la commande "start"

   &nbsp;&nbsp;&nbsp; 3.1. F.
   Dans la partie "Node interpreter" indiquer le chemin du fichier "node.exe" (ex: "C:\nvm4w\nodejs\node.exe")

   &nbsp;&nbsp;&nbsp; 3.1. G.
   Dans la partie "Package manager" indiquer le chemin du fichier "node.exe" (ex: "C:\nvm4w\nodejs\npm.cmd")

   &nbsp;&nbsp;&nbsp; 3.1. H.
   Cliquer sur "Apply" puis "OK" pour sauvegarder la configuration

   ### Server :
   &nbsp;&nbsp;&nbsp; 3.2. A.
   Retourner dans le panneau d'ajout de configurations (étape 3.1. A)

   &nbsp;&nbsp;&nbsp; 3.1. B.
   Cliquer sur l'icône "+" en haut à gauche puis sur Node.js dans la liste proposée.

   &nbsp;&nbsp;&nbsp; 3.1. C.
   La partie "Name" indique le nom du raccourci que vous allez créer. Vous pouvez indiquer "run-server" par exemple.

   &nbsp;&nbsp;&nbsp; 3.1. D.
   Dans la partie "Node interpreter" veuillez indiquer le chemin absolu complet du fichier node.exe (ex: "C:\nvm4w\nodejs\node.exe")

   &nbsp;&nbsp;&nbsp; 3.1. E.
   Dans la partie "File" indiquer "server/server.js"

   &nbsp;&nbsp;&nbsp; 3.1. F.
   Dans la partie "Node interpreter" indiquer le chemin du fichier "node.exe" (ex: "C:\nvm4w\nodejs\node.exe")

   &nbsp;&nbsp;&nbsp; 3.1. G.
   Dans la partie "Package manager" indiquer le chemin du fichier "node.exe" (ex: "C:\nvm4w\nodejs\npm.cmd")

   &nbsp;&nbsp;&nbsp; 3.1. H.
   Cliquer sur "Apply" puis "OK" pour sauvegarder la configuration

## Lancement de l'application

Cliquer sur le panneau de "Run / Debug configuration" (à gauche du bouton de run) et lancer avec la fleche verte le server puis, de la même façon, lancer le client.

Félicitation vous avez lancé Supergym 🥳

## Utilisation de l'application
Vous pouvez ajouter des données dans l'application depuis l'interface graphique mais aussi depuis les fichiers json.

Have fun ! (❁´◡`❁)

   