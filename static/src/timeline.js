document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.getElementById("timeline");

  if (!WORKFLOW_DATA || !WORKFLOW_DATA.flow || !timeline) return;


  WORKFLOW_DATA.flow.forEach(step => {
    const div = document.createElement("div");
    div.classList.add("timeline-step");
    if (step.optional) div.classList.add("optional");

    const title = document.createElement("h3");
    title.textContent = step.title || step.id;


    const desc = document.createElement("p");
    desc.textContent = step.description || "Pas de description.";

    div.appendChild(title);
    div.appendChild(desc);

    if (step.next && step.next.length > 0) {
      const next = document.createElement("div");
      next.classList.add("timeline-next");
      next.innerHTML = "Étape suivante : ";

      step.next.forEach(targetId => {
        const link = document.createElement("a");
        link.href = `#${targetId}`;
        link.textContent = targetId;
        next.appendChild(link);
      });

      div.appendChild(next);
    }

    div.id = step.id;
    timeline.appendChild(div);
  });
});
