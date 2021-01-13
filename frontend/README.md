
<h1 align="center">
  ODAMAP 
</h1>
<p align="center">
  ...stands for "Open-Dashboard-And-MAP"
</p>


---------

<p align="center">
  A generic and customizable map/dashboard solution for open data visualisation
</p>

----------

#### Documentation

Check our [documentation website](https://etalab.github.io/dashboard-aides-entreprises/)


----------

#### Version : v.2.xxx (beta)

- Check the [versions logs here](./VERSIONS.md)

----------

#### Co-authors:

- Julien Paris
- Geoffrey Aldebert
- Nicolas Boeuf
- Alexandre Bulté

#### Team (in alphabetical order):

- Geoffrey Aldebert
- Nicolas Boeuf
- Alexandre Bulte
- Mathilde Hoang
- Julien Paris
- Mario Restuccia

----------

## Site:

- **live / prod** : https://barometre-resultats.data.gouv.fr/

-----------


## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for production and launch server
npm run build
npm run start

# generate static project
npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

----------

## Linting

<br>

#### Linting with `standard`

You can launch`standard` to underline some errors :

```bash
npx standard
```

to fix what can be fixed

```bash
npx standard --fix
```

<br>

#### Linting with `lint`

You can launch `lint` to avoid some other errors :

```bash
npm run lint
```

or `lintfix` to fix what can be fixed

```bash
npm run lintfix
```

---------

## Deploy on Netlify

#### Build settings

- Repository : `github.com/etalab/barometre-resultatts`
- Build command : `npm run build`
- Publish directory : `dist`

#### Deploy contexts

- Production branch : `master`
- ( ou : Production branch : `preprod` )


---------

## Configuration de l'application ODAMAP

#### Variables d'environnement :

- éditer/créer un fichier `.env` sur le modèle du fichier [`.envExample`](.envExample)

#### configuration de l'app / UI-UX / routes / navbar ...: 

- éditer le fichier [`configs/dev/appConfigUIUX.js`](./configs/dev/appConfigUIUX.js) : 
- éditer le fichier [`configs/dev/appConfigRoutes.js`](./configs/dev/appConfigRoutes.js) : 


#### configuration de l'app / data: 

- éditer le fichier [`configs/dev/appConfigData.js`](./configs/dev/appConfigData.js) : 

#### configuration de l'app / carte: 

- éditer le fichier [`configs/dev/mapboxVectorStyles.js`](./configs/dev/mapboxVectorStyles.js) : 

#### configuration de l'app / vues données :

- éditer le fichier [`configs/dev/appConfigMap.js`](./configs/dev/appConfigMap.js) : 
- éditer le fichier [`configs/dev/appConfigData.js`](./configs/dev/appConfigData.js) : 
- éditer le fichier [`configs/dev/appConfigNumbers.js`](./configs/dev/appConfigNumbers.js) : 
- éditer le fichier [`configs/dev/appConfigGlobalButtons.js`](./configs/dev/appConfigGlobalButtons.js) : 
- éditer le fichier [`configs/dev/appConfigTexts.js`](./configs/dev/appConfigTexts.js) : 
- éditer le fichier [`configs/dev/appConfigTables.js`](./configs/dev/appConfigTables.js) : 
- éditer le fichier [`configs/dev/appConfigRawData.js`](./configs/dev/appConfigRawData.js) : 

#### langues : 

- voir le dossier [`/locales`](./locales/) pour les fichiers de traduction


---------------

### ce qu’il n’y a pas encore :

- settings pour connexion à une API de backend, mais sketché pour quand même ;
- footer “officiel” + liens ;
- ...

### ce qu’il y a dedans :

- meilleure gestion du zoom et des largeurs de cercles en fonction du niveau de zoom ;
- minivues pour les dom-tom en dessous ou à côté de la carte principale ;
- responsive a minima (chart puis carte sur mobile) ;
- interaction avec les régions et/ou les départements -> change les chiffres dans les autres composants ;
- chargement des données json et geojson, ventilées soit dans le store soit uniquement dans la carte.. ;
- bouton de switch ‘calques’ pour intéragir soit avec le calque région ou le calque départements (pas destiné à rester obligatoirement) ;
- totaux par région/departement (et au lancement au niveau national) du montant des aides et du nombre d’aides ;
- design a minima avec des couleurs piquées chez Jérôme ;
- code le plus factorisé et générique possible (enfin autant que j’ai pu) pour pouvoir ajouter / dupliquer des composants et/ou changer des sources, ... j’ai tenté de faire une “souche” qui pourrait servir autant aux données DVF qu’aux aides aux entreprises qu’aux fonds de carte écolos...
- le mapping des données avec les variables de l’appli se font via les différents fichiers de configuration dans le dossier /config
- switch de la carte en 1er + chiffres clés en version mobile ;
- wording et CSS ;
- tiles Etalab (bug relou de mon wrapper mapbox pour charger le style ?!!!) ;
- repasse sur l’UX (notamment sur l’usage de la barre de gauche par exemple) ;
- pages/url de textes statiques pour afficher des infos ;
- scrolling uniquement sur la colonne de gauche pour pouvoir ajouter d’autres charts en dessous de la première ;
- revenir aux chiffres nationaux (réinitialiser) ;



-----------

### stack :

- vuejs / nuxt / axios / dotenv /
- vuetify
- i18n /
- mapboxGL.js / vue-mapbox / Apexcharts / vue-apexCharts / turf
déploiement : SPA mais plusieurs urls possibles pour afficher des pages / netlify (sur mon compte Netlify pour le moment mais assez simple à déployer)

----------

[branch_front]: https://github.com/etalab/barometre-resultats/tree/master/frontend
