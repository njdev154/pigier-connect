# Pigier Connect

Site vitrine et portail de préinscription pour **Pigier Yopougon**, en HTML, CSS et JavaScript, sans framework.

Version en ligne : https://njdev154.github.io/pigier-connect/

## Ce que fait le site

- Écran de chargement avec l'emblème Pigier, puis titre qui apparaît mot par mot
- Vidéo du campus dans un cadre téléphone qui s'incline vers la souris
- Bandeau défilant des filières
- Chiffres clés animés : 1956, 3 000+ étudiants, 70 %+ de réussite au BTS, 21 diplômes
- Catalogue de 21 formations (6 BTS, 9 Licences, 6 Masters) avec filtres par niveau et recherche sans accents
- Frise chronologique dont la ligne se remplit au défilement
- Témoignages d'élèves et vidéos d'événements (aperçu au survol, lecture dans une fenêtre)
- FAQ en accordéon
- Formulaire de préinscription validé en direct, qui prépare la demande sur WhatsApp
- Carte Google Maps du campus

## Technologies

- HTML5 et CSS3 (Grid, Flexbox, `clamp()`, variables CSS)
- JavaScript simple : `IntersectionObserver` pour les apparitions, `requestAnimationFrame` pour le scroll
- Polices Google Fonts : Poppins (titres) et Lato (texte)
- Couleurs Pigier : bleu `#0a3d91`, jaune `#f7a600`, fonds crème `#fffdf3` et `#fff8dc`

## Structure

```
index.html            Page unique du site
styles.css            Styles et animations, rangés par section
script.js             Interactions, en 15 parties numérotées et commentées
logo2.png             Logo Pigier
images/embleme.png    Emblème Pigier (chargement, filigranes)
images/poster*.jpg    Images affichées avant la lecture des vidéos
video/                Vidéos compressées (11 Mo au lieu de 26 Mo)
AUDIT.md              Rapport d'audit et plan d'évolution
```

## Réglages utiles

- **Numéro WhatsApp des préinscriptions** : constante `WHATSAPP_NUMBER` en haut de `script.js`
- **Couleurs** : bloc `:root` en haut de `styles.css`
- **Ajouter une formation** : copier un bloc `<article class="formation">` dans `index.html` et mettre `data-level="bts"`, `"licence"` ou `"master"`. Les compteurs des filtres se mettent à jour seuls.

## Accessibilité

- Navigation complète au clavier, contour de focus jaune visible
- Lien "Aller au contenu" pour les lecteurs d'écran
- Si l'appareil demande moins d'animations (`prefers-reduced-motion`), tout s'affiche sans mouvement et la vidéo ne démarre pas toute seule

## Sources des informations

- Offre de formation : https://www.pigierci.com/nos-diplomes
- Taux de réussite au BTS, LMD, certification Microsoft : https://pigierci.com/nos-filieres-et-parcours
- Contacts et adresse du campus : https://pigierci.com/campus-abidjan-yopougon
- Histoire (1956, 1970, 1987, 1994, 2017) : https://www.auf.org/membre/pigier-cote-divoire/
- 3 000+ étudiants : https://www.pigier.com/decouvre-nos-campus-en-afrique

---
Conçu et développé par N'Goran Junior Charmel Privat.
