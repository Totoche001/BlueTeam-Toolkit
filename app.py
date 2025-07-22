from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
import json
import os
from datetime import datetime
# Ce site web n'est executable qu'en local si la clé secrete est indispensable pour que flask fonctionne, Ce n'est pas une information "secrète" dont un pirate a besoin pour avoir accès à ces données (sauf si vous executer ce site dans un vrai serveur)
app = Flask(__name__)
app.secret_key = "7b3393e305aabe6b7cd4415b2215f90bf362d381866a8a6e3734e1568cc7dac0"
WORKFLOWS_DIR = "data/workflows"
os.makedirs(WORKFLOWS_DIR, exist_ok=True)

@app.context_processor
def inject_static():
    def static_url(path):
        return url_for('static', filename=path)
    return dict(static_url=static_url)


# Charger tous les workflows

def load_workflows():
    workflows = []
    for filename in os.listdir(WORKFLOWS_DIR):
        if filename.endswith(".json"):
            with open(os.path.join(WORKFLOWS_DIR, filename), "r") as f:
                data = json.load(f)
                workflows.append(data)
    return workflows

# Charger un seul workflow

def load_workflow(workflow_id):
    path = os.path.join(WORKFLOWS_DIR, f"{workflow_id}.json")
    if not os.path.exists(path):
        return None
    with open(path, "r") as f:
        return json.load(f)

# Page d'accueil : liste des workflows

@app.route("/")
def index():
    workflows = load_workflows()
    return render_template("index.html", workflows=workflows)

# Afficher un workflow spécifique

@app.route("/workflow/<workflow_id>")
def view_workflow(workflow_id):
    workflow = load_workflow(workflow_id)
    if not workflow:
        return "Workflow not found", 404
    return render_template("workflow.html", workflow=workflow)

# Sauvegarder un workflow modifié

@app.route("/workflow/<workflow_id>/save", methods=["POST"])
def save_workflow(workflow_id):
    data = request.get_json()
    data["id"] = workflow_id
    path = os.path.join(WORKFLOWS_DIR, f"{workflow_id}.json")
    with open(path, "w") as f:
        json.dump(data, f, indent=4)
    return jsonify({"status": "ok"})

# Créer un nouveau workflow

@app.route("/new", methods=["GET", "POST"])
def new_workflow():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        description = request.form.get("description", "").strip()
        created_by = "admin"  # ou utilisateur courant si gestion d'utilisateurs
        today = datetime.now().strftime("%Y-%m-%d")

        steps_raw = request.form.get("steps", "")
        try:
            steps = json.loads(steps_raw)
        except json.JSONDecodeError:
            flash("Erreur dans le format des étapes (JSON invalide).", "error")
            return redirect(url_for("new_workflow"))

        workflow_id = name.lower().replace(" ", "_")
        workflow = {
            "id": workflow_id,
            "name": name,
            "version": "1.0",
            "description": description,
            "tags": [],
            "meta": {
                "created_by": created_by,
                "created_at": today
            },
            "flow": steps
        }

        save_path = os.path.join("data", "workflows", f"{workflow_id}.json")
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        with open(save_path, "w", encoding="utf-8") as f:
            json.dump(workflow, f, indent=2, ensure_ascii=False)

        flash("Workflow créé avec succès !", "success")
        return redirect(url_for("index"))

    return render_template("new_workflow.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")


if __name__ == "__main__":
    app.run(debug=True)
