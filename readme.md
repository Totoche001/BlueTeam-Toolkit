# 🛠️ Workflow Manager — Interface de gestion de workflows de sécurité

Ce projet est une application web simple permettant de créer, visualiser, et suivre des **workflows structurés**, utiles notamment pour des opérations de durcissement système, de réponse à incident, ou de configuration sécurisée (ex : Active Directory, Linux, Windows, réseaux, etc.).

- Fait avec l'IA

---

## 🚀 Fonctionnalités principales

- Création de workflows étape par étape (sans écrire de JSON à la main)
- Interface claire et légère
- Stockage local des workflows au format JSON
- Navigation dans chaque étape (type, description, lien, etc.)
- Prévisualisation en JSON avant création
- Menu de navigation (Accueil, Contact, etc.)

---

## 🖥️ Installation locale (dev)

### 1. Cloner le dépôt

```bash
git clone https://github.com/ton-utilisateur/workflow-manager.git
cd workflow-manager
```

### 2. Créer un environnement Python (optionnel sous linux)

si vous êtes sur linux, en étant dans le dossier vous pouvez passez directement à l'étape 4

```bash
python3 -m venv venv
source venv/bin/activate  # ou `venv\Scripts\activate` sur Windows
```

### 3. Installer les dépendances

```bash
pip install flask
# ou sur arch
sudo pacman -S python-flask
```

#### 3.1 vérifier les dépendance

Je n'ai pas mis de requirement.txt mais pour le moment il n'y a que flask

```bash
from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
import json
import os
from datetime import datetime
```

### 4. Lancer l'application

```bash
export FLASK_APP=app.py  # ou `set FLASK_APP=app.py` sous Windows
flask run
# ou
python3 app.py # sous linux en étant directement dans le dossier
```

### 5. Accéder a l'application

Accéder à http://localhost:5000 dans votre navigateur.

## Structure du projet

```
BLUETEAM-TOOLKIT/
│
├── app.py                # Application principale Flask
├── data/
│   └── workflows/        # Fichiers JSON des workflows créés
│
├── templates/
│   ├── index.html        # Page d'accueil
│   ├── contact.html      # Page de contact
│   ├── new_workflow.html # Formulaire de création
│   └── workflow.html     # Affichage d’un workflow
│
├── static/
│   ├── css/              # Feuilles de style
│   ├── src/              # Scripts JS
│       ├── new_workflow.js # Script permettant l'interaction avec la page html (il y a des doublons avec script.js, c'est encore bordélique)
│       ├── script.js     # Script permettant l'interaction et l'affichage dynamique des pages html (index, workflow,etc...)
│       └── timeline.js   # Plus très utile, je voulais faire un style "timeline historique" mais il y a d'autre priorités
│   └── img/
│
└── README.md

```

## Utilisation

### Créer un nouveau workflow

1. Cliquer sur "Créer un workflow"
2. Entrer un nom et une description
3. Ajouter les étapes une par une :
   * Titre
   * Type (action, evidence, checkpoint)
   * Description courte + longue
   * Étapes suivantes (IDs, séparés par virgule) (pour l'instant pas très utile)
4. Le JSON est généré automatiquement
5. Cliquer sur "Créer"

Le fichier JSON est enregistré dans `data/workflows/`. (faire attention aux droits des dossier/fichiers)

### Voir un workflow

1. Depuis la page d’accueil (/), cliquer sur un workflow
2. Naviguer entre les étapes (boutons de transition)
3. Les descriptions longues peuvent contenir:
   * Des retours à la ligne (\n)
   * Des liens HTML

### Modifier un workflow existant

Les fichiers se trouvent dans :
`data/workflows/<id>.json`

Vous pouvez :

* Les éditer à la main (éditeur de texte ou VS Code)
* Recharger la page ensuite
* Ou supprimer un fichier pour le recréer via l’interface

Le format est un simple JSON structuré :

```json
{
  "id": "exemple",
  "name": "Nom lisible",
  "description": "Brève description",
  "flow": [
    {
      "id": "step1",
      "title": "Titre",
      "type": "action",
      "description": "Résumé",
      "long_description": "Texte + liens",
      "next": ["step2"]
    },
    ...
  ]
}

```

### Ajouter des fonctionnalités


| Ce que vous voulez faire       | Où Intervenir                      | 
| -------------------------------- | ------------------------------------- | 
| Modifier l’apparence          | `static/css/styles.css`               |      
| Ajouter un champ à une étape | `new_workflow.html` + JS de preview |  
| Afficher une info en plus | 	`workflow.html` |
| Ajouter une page (ex: À propos) | Créer un fichier dans `templates/` + route Flask |
| Ajouter un système utilisateur | Ajouter Flask-Login ou similaire |

### Sécurité

Pour la version Flask, n'oubliez pas de définir une clé secrète dans `app.py` :

```python
app.secret_key = "une_clé_secrète_très_complexe"
```

Cela permet :

* Le bon fonctionnement de flash()
* La gestion future des sessions utilisateur (si jamais)

### Exemple de workflow fourni

Un exemple pour protéger Active Directory est disponible dans `data/workflows/ad_protection.json`.