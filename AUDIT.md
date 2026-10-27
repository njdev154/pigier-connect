# Pigier Connect : rapport d'audit et plan d'évolution

Dépôt : https://github.com/njdev154/pigier-connect
Date : 27 octobre 2026

## 1. Résumé

La base HTML, CSS et JavaScript était saine : page unique bien découpée, menu mobile, recherche, FAQ et formulaire. Il n'était pas utile de passer à React ou Next.js. Cette version garde la même structure, le même logo et les mêmes couleurs, et travaille surtout le contenu, le mouvement et la fiabilité.

## 2. Problèmes trouvés dans la version précédente

| Problème | Impact | Correction |
| --- | --- | --- |
| Le formulaire affichait "Préinscription reçue" sans rien envoyer | Message faux pour le visiteur | La demande est préparée et envoyée sur WhatsApp, le message de succès dit exactement ce qui se passe |
| Le message "Aucune formation" restait caché (`style="display: none"` en dur) | Recherche vide sans retour | Attribut `hidden` piloté par le JS |
| Chiffres 92 %, 87 %, 1200+, 35+ inventés | Crédibilité | Remplacés par des chiffres publics vérifiables (voir section 3) |
| 7 "BTS" dont Marketing, qui n'existe pas en BTS chez Pigier | Information fausse | Catalogue officiel : 6 BTS, 9 Licences, 6 Masters |
| Accents manquants dans beaucoup de textes | Rendu peu soigné | Tous les textes corrigés |
| Emojis comme icônes de contact | Rendu différent selon les téléphones | Icônes SVG aux couleurs Pigier |
| Vidéos de 26 Mo, sans image d'attente | Page lente, cadres noirs | Vidéos compressées à 11 Mo, posters JPG, chargement à la demande |
| Bannières "démonstration" ajoutées par le script | Cassaient le design | Retirées |
| Champ de recherche sans libellé, boutons sans `type` | Accessibilité | Libellé caché, `type="button"` partout |
| Numéros de contact non cliquables | Friction sur mobile | Liens `tel:`, `mailto:` et `wa.me` |

## 3. Données utilisées et sources

| Donnée | Valeur | Source |
| --- | --- | --- |
| Implantation en Côte d'Ivoire | 1956 | pigierci.com/notre-histoire, AUF |
| Étudiants | 3 000+ | pigier.com, page campus Afrique |
| Réussite à l'examen national du BTS | plus de 70 % | pigierci.com/nos-filieres-et-parcours |
| Offre | 6 BTS, 9 Licences pro, 6 Masters pro | pigierci.com/nos-diplomes |
| Reconnaissance | Ministère de l'Enseignement Supérieur, CAMES | pigierci.com/nos-diplomes |
| Étapes historiques | 1970 Bac techno, 1987 BTS, 1994 Bac+3/+5, 2017 formation à distance | AUF |
| Campus Yopougon | annoncé pour la rentrée 2023-2024 | Pigier CI sur LinkedIn |
| Adresse et téléphones du campus | Ananeraie, proche Mamie Adjoua, CHU-Extension | pigierci.com/campus-abidjan-yopougon |

Les témoignages d'élèves et les vidéos d'événements viennent du projet d'origine. À revérifier chaque année : taux de réussite, numéros de téléphone et formations réellement ouvertes à Yopougon.

## 4. Motion design ajouté

Principe : chaque mouvement a un rôle (guider, confirmer, donner vie) et reste fluide sur un téléphone moyen.

| Zone | Animation | Technique |
| --- | --- | --- |
| Chargement | Emblème qui tourne, rideau qui remonte | `clip-path`, `@keyframes` |
| Titre du hero | Mots qui montent l'un après l'autre, soulignement jaune qui se dessine | Découpage en `span` en JS, `transition-delay` |
| Hero | Taches bleue et jaune qui flottent, emblème en rotation lente, parallaxe au scroll | `@keyframes`, `translate` en JS |
| Vidéo du hero | Cadre téléphone incliné vers la souris, pastilles flottantes | `perspective`, `rotateX/Y` |
| Bandeau | Filières qui défilent en boucle, pause au survol | `@keyframes marquee` |
| Toutes les sections | Apparition en fondu et glissement, en cascade | `IntersectionObserver`, `data-reveal`, `data-stagger` |
| Titres | Trait jaune qui s'allonge | `scaleX` |
| Chiffres | Compteurs qui montent | `requestAnimationFrame` |
| Cartes | Lumière jaune qui suit la souris, inclinaison de 4 degrés | variables CSS `--mx`, `--my` |
| Catalogue | Cartes qui se rétractent et réapparaissent au filtrage | classes `is-leaving`, `is-entering` |
| Frise | Ligne qui se remplit au scroll, points qui s'allument | `scaleY(var(--progress))` |
| Vidéos | Aperçu au survol, halo qui pulse, fenêtre qui surgit | `<dialog>`, `@keyframes pulse` |
| FAQ | Ouverture fluide, croix qui tourne | `grid-template-rows: 0fr` vers `1fr` |
| Formulaire | Secousse en cas d'erreur, rond de chargement, coche dessinée | `@keyframes shake`, `stroke-dashoffset` |
| Navigation | Header qui se cache à la descente, trait jaune qui glisse sous le lien actif | classes `is-hidden`, `translateX` |
| Boutons | Effet aimant, onde au clic | `pointermove`, élément `.ripple` |
| Retour en haut | Anneau jaune qui se remplit avec la lecture | `stroke-dashoffset` |

Garde-fous : les effets souris sont désactivés sur écran tactile, et tout est coupé si l'appareil demande moins d'animations.

## 5. Tests réalisés

- Ordinateur 1366 x 820 et mobile 390 x 844
- Filtres : Master affiche 6 cartes, "comptabilite" sans accent trouve 3 formations, recherche vide affiche le message
- Formulaire : 4 erreurs affichées si vide, numéro mis en forme automatiquement (07 00 00 00 00), lien WhatsApp pré-rempli correct
- FAQ, fenêtre vidéo, menu mobile, absence de débordement horizontal
- Aucune erreur JavaScript

## 6. Plan d'évolution

1. **Mettre en ligne cette version** sur GitHub Pages et tester sur 2 ou 3 vrais téléphones.
2. **Vérifier le numéro WhatsApp** des préinscriptions (constante en haut de `script.js`).
3. **Ajouter une section Actualités** alimentée par un fichier `actualites.json`, pour apprendre `fetch()`.
4. **Une page par formation** (programme, débouchés, conditions), reliée aux cartes du catalogue.
5. **Envoi réel du formulaire** par e-mail avec un service comme Formspree, en plus de WhatsApp.
6. **Mesurer la performance** avec Lighthouse et viser 90+ sur mobile.
7. Plus tard seulement : CMS pour les actualités, puis espace étudiant si le projet le justifie (données sensibles, sécurité à prévoir).
