(function(){
  const stepsList = document.getElementById('steps-list');
  const addStepBtn = document.getElementById('add-step-btn');

  function createStepInput(index) {
    const div = document.createElement('div');
    div.className = 'step-input';
    div.innerHTML = `
      <fieldset>
        <legend>Étape ${index + 1}</legend>
        <label>Label : <input type="text" name="steps[${index}][label]" required></label><br/>
        <label>Description : <textarea name="steps[${index}][description]" rows="2"></textarea></label><br/>
        <label>ID unique : <input type="text" name="steps[${index}][id]" required pattern="[a-zA-Z0-9_-]+" title="Caractères alphanumériques, - et _"></label><br/>
        <label>Optionnelle : <input type="checkbox" name="steps[${index}][optional]"></label>
        <button type="button" class="remove-step-btn">Supprimer</button>
      </fieldset>
    `;
    return div;
  }

  function refreshIndices(){
    [...stepsList.children].forEach((div,i) => {
      const legend = div.querySelector('legend');
      if(legend) legend.textContent = `Étape ${i+1}`;
      // Update input names
      div.querySelectorAll('input,textarea').forEach(input => {
        const name = input.name;
        const newName = name.replace(/steps\[\d+\]/, `steps[${i}]`);
        input.name = newName;
      });
    });
  }

  addStepBtn.addEventListener('click', () => {
    const newStep = createStepInput(stepsList.children.length);
    stepsList.appendChild(newStep);
    attachRemoveListeners();
  });

  function attachRemoveListeners() {
    stepsList.querySelectorAll('.remove-step-btn').forEach(btn => {
      btn.onclick = () => {
        btn.closest('.step-input').remove();
        refreshIndices();
      };
    });
  }

  attachRemoveListeners();

  // Prévisualisation simple (optionnel)
  const form = document.getElementById('workflow-form');
  form.addEventListener('submit', e => {
    // Validation déjà HTML5
  });

})();
