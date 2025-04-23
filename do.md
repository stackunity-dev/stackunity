- Objectif: crée un ARIA section
- Pouvoir ajouter des ARIA a chaque element qui en a besoin (interactifs donc)
- dans la section ARIA pouvoir selectionner l'éléement et appliquez ca 
- etre simple direct en anglais, pas de commenatires
- faire un auto complete pour role et le reste en champ libre : 
iste complète des rôles ARIA
Rôles de repère (Landmark Roles)

banner - Zone de contenu principal en haut de la page (souvent l'en-tête)
complementary - Contenu complémentaire au contenu principal
contentinfo - Informations sur le document parent (souvent le pied de page)
form - Section contenant des éléments de formulaire
main - Contenu principal du document
navigation - Collection de liens de navigation
region - Section importante du document qui mérite d'être exposée
search - Section dédiée à la recherche

Rôles de structure de document

application - Région déclarée comme application web plutôt que document
article - Section de contenu qui forme une composition indépendante
cell - Cellule dans un tableau ou une grille
columnheader - Cellule d'en-tête contenant des informations d'en-tête pour une colonne
definition - Définition d'un terme ou concept
directory - Liste de références, comme une table des matières
document - Région contenant du contenu de document
feed - Région dynamique contenant des articles qui s'ajoutent
figure - Contenu perceptible référencé dans le document principal
group - Ensemble d'éléments liés mais pas listés
heading - En-tête pour une section de la page
img - Conteneur pour du contenu présenté comme une image
list - Liste d'items
listitem - Item dans une liste
math - Contenu représentant une expression mathématique
none - Élément à retirer de l'arbre d'accessibilité
note - Section contenant des informations supplémentaires
presentation (ou none) - Élément présenté uniquement visuellement
row - Ligne de cellules dans un tableau ou une grille
rowgroup - Groupe de lignes dans un tableau
rowheader - Cellule d'en-tête contenant des informations d'en-tête pour une ligne
separator - Diviseur qui sépare et distingue des sections de contenu
table - Structure de données tabulaires
term - Mot ou phrase avec une définition correspondante
toolbar - Collection d'éléments d'interface utilisateur fréquemment utilisés
tooltip - Bulle d'information contextuelle

Rôles de widgets composites

combobox - Liste déroulante combinée avec un champ de saisie
grid - Grille interactive similaire à un tableau
listbox - Liste d'options où l'utilisateur peut sélectionner un ou plusieurs items
menu - Liste d'options pour l'utilisateur
menubar - Barre de menus présentant des options
radiogroup - Groupe de boutons radio
tablist - Liste d'éléments à onglets qui peuvent être activés
tree - Structure hiérarchique qui peut être développée ou réduite
treegrid - Grille dont les lignes peuvent être développées et réduites

Rôles de widgets

alert - Message important, généralement pour informer d'un changement
alertdialog - Boîte de dialogue d'alerte ou de confirmation
button - Élément cliquable qui déclenche une action
checkbox - Case à cocher qui peut être cochée, décochée ou en état indéterminé
dialog - Fenêtre de dialogue ou fenêtre modale
gridcell - Cellule dans une grille interactive
link - Référence interactive à une ressource
log - Zone de contenu dynamique qui affiche de nouvelles informations
marquee - Contenu non essentiel qui se déplace, défile ou est mis à jour
menuitem - Option dans un menu
menuitemcheckbox - Case à cocher dans un menu
menuitemradio - Bouton radio dans un menu
option - Option sélectionnable dans un widget de sélection
progressbar - Élément qui indique la progression d'une opération
radio - Bouton radio (option dans un groupe d'options mutuellement exclusives)
scrollbar - Barre de défilement
searchbox - Champ de texte spécifique à la recherche
slider - Contrôle permettant de sélectionner une valeur dans une plage
spinbutton - Entrée avec des boutons pour sélectionner une valeur dans une plage
status - Conteneur dont le contenu est mis à jour en réponse à une action
switch - Bouton à deux états (on/off)
tab - Onglet dans une liste d'onglets
tabpanel - Conteneur associé à un élément d'onglet
textbox - Champ de saisie de texte
timer - Zone de contenu contenant un compteur ou une horloge
treeitem - Option dans une structure d'arborescence

Rôles de fenêtre

dialog - Boîte de dialogue ou fenêtre d'un niveau d'importance moyen
alertdialog - Boîte de dialogue de niveau d'importance élevé nécessitant une réponse

Rôles abstraits (ne doivent pas être utilisés directement)

command - Forme d'action pouvant être déclenchée par l'utilisateur
composite - Widget qui contient des éléments navigables enfants
input - Élément générique d'entrée de données
landmark - Région importante d'une page
range - Entrée représentant une valeur dans une plage
roletype - Base pour tous les rôles ARIA
section - Structure générique rendant le contenu visible
sectionhead - Structure qui étiquette ou résume une section
select - Forme de widget permettant la sélection
structure - Document ou structure d'interface utilisateur
widget - Élément d'interface utilisateur interactif