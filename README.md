# RTS Favorite Teams & Athletes Feature

## Description

Dans le cadre des Hackdays 2025 de la RTS, ce projet a pour objectif de créer une nouvelle fonctionnalité pour l'application RTS : une page de favoris. Cette page permettra aux utilisateurs de suivre leurs équipes sportives et athlètes favoris, et de retrouver facilement tous les contenus associés (résultats sportifs, événements en direct, articles) sur une page dédiée.

## Fonctionnalités

- **Ajout aux favoris** : Les utilisateurs pourront ajouter leurs équipes ou sportifs préférés à leur liste de favoris.
- **Page dédiée** : Une nouvelle page regroupera toutes les informations concernant les équipes et athlètes favoris de l'utilisateur.
  - **Résultats sportifs** : Affichage des résultats récents liés aux favoris.
  - **Lives** : Accès direct aux événements en direct concernant les favoris.
  - **Articles** : Mise en avant des articles pertinents sur les équipes/athlètes favoris.
- **Personnalisation** : La page se mettra à jour automatiquement en fonction des équipes/athlètes sélectionnés comme favoris par l'utilisateur.

## Figma

 [Maquettes](https://www.figma.com/design/Ho4O2S6fI04IZkE7X6nGjy/Hackdays?node-id=1-2&t=EzMWhnHK0DN0Ye8R-1)

## Docker

Ce projet nécessite docker et utilise docker compose pour manager le frontend et le backend

- **Démarrage de compose** : ```docker compose up --build```
- **Arret** : CTRL + C