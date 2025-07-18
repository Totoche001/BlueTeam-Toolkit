// Gestion mode clair/sombre
(function () {
    const toggleBtn = document.getElementById('theme-toggle');

    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark');
            toggleBtn.textContent = '☀️';
        } else {
            document.body.classList.remove('dark');
            toggleBtn.textContent = '🌙';
        }
        localStorage.setItem('theme', theme);
    }

    // Initialisation thème
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    toggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });
})();


// Mini-map & navigation
(function () {
    const minimapSteps = document.querySelectorAll('#minimap .minimap-step');
    const steps = document.querySelectorAll('.step');

    function clearActive() {
        minimapSteps.forEach(s => s.classList.remove('active'));
    }

    function activateStep(id) {
        clearActive();
        const el = [...minimapSteps].find(s => s.dataset.stepId === id);
        if (el) el.classList.add('active');
    }

    minimapSteps.forEach(el => {
        el.addEventListener('click', () => {
            const id = el.dataset.stepId;
            const targetStep = document.getElementById('step-' + id);

            if (targetStep) {
                targetStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
                activateStep(id);
            } else {
                console.warn(`Élément avec l'ID 'step-${id}' introuvable.`);
            }
        });
    });


    // Highlight active step on scroll
    window.addEventListener('scroll', () => {
        let current = null;
        for (let step of steps) {
            const rect = step.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 3 && rect.bottom >= 0) {
                current = step.id.replace('step-', '');
            }
        }
        if (current) activateStep(current);
    });

    // Initial activation
    if (minimapSteps.length) activateStep(minimapSteps[0].dataset.stepId);
})();


// Mode édition simple
(function () {
    const editBtn = document.getElementById('edit-toggle');
    const saveBtn = document.getElementById('save-btn');
    const steps = document.querySelectorAll('.step');
    const addStepBtn = document.getElementById('add-step-btn');

    let editing = false;

    function toggleEditing(on) {
        editing = on;
        steps.forEach(step => {
            step.querySelector('.step-label').contentEditable = on;
            step.querySelector('.step-desc').contentEditable = on;
            step.querySelector('.remove-step-btn').style.display = on ? 'inline-block' : 'none';
            // next links editing handled below
        });
        addStepBtn.style.display = on ? 'inline-block' : 'none';
        saveBtn.style.display = on ? 'inline-block' : 'none';
        editBtn.textContent = on ? 'Annuler' : 'Modifier';
    }


    if (editBtn) {
        editBtn.addEventListener('click', () => {
            toggleEditing(!editing);
        });
    }

    // Supprimer une étape
    steps.forEach(step => {
        const btn = step.querySelector('.remove-step-btn');
        btn.addEventListener('click', () => {
            if (confirm('Supprimer cette étape ?')) {
                step.remove();
            }
        });
    });

    // Ajouter étape
    if (addStepBtn) {
        addStepBtn.addEventListener('click', () => {
            const main = document.getElementById('workflow-main');
            const newId = prompt('ID unique de la nouvelle étape (ex: step4)');
            if (!newId) return alert('ID invalide');

            // Création élément étape
            const section = document.createElement('section');
            section.className = 'step';
            section.id = 'step-' + newId;

            section.innerHTML = `
      <h2 contenteditable="true" class="step-label">Nouvelle étape</h2>
      <p contenteditable="true" class="step-desc">Description...</p>
      <div class="step-next"><strong>Étapes suivantes :</strong> <span>Fin</span></div>
      <button class="remove-step-btn" style="display:inline-block;">Supprimer étape</button>
    `;
            main.insertBefore(section, addStepBtn);

            // Ajout écouteur suppression
            section.querySelector('.remove-step-btn').addEventListener('click', () => {
                if (confirm('Supprimer cette étape ?')) {
                    section.remove();
                }
            });

            // Ajouter dans minimap aussi (optionnel, pour l'instant on recommande recharger la page)
            alert('Étape ajoutée localement. Sauvegardez pour appliquer. Rechargez la page après sauvegarde.');

        });
    }

    // Sauvegarde (à adapter côté serveur)
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Extraction des données modifiées
            const newFlow = [];
            document.querySelectorAll('.step').forEach(section => {
                const id = section.id.replace('step-', '');
                const label = section.querySelector('.step-label').textContent.trim();
                const desc = section.querySelector('.step-desc').textContent.trim();
                // Ici next non modifiable par l’instant, ou à rajouter plus tard.
                newFlow.push({ id, label, description: desc, next: [] });
            });

            // Envoi AJAX vers serveur
            fetch(window.location.href, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flow: newFlow })
            })
                .then(r => {
                    if (r.ok) {
                        alert('Workflow sauvegardé');
                        location.reload();
                    } else {
                        alert('Erreur lors de la sauvegarde');
                    }
                })
                .catch(e => {
                    alert('Erreur réseau');
                    console.error(e);
                });
        });
    }

})();
