// =============================================
// Pigier Yopougon — Script du menu mobile
// =============================================

const burgerBtn = document.querySelector("#burger-btn");
const nav = document.querySelector(".nav");

if (burgerBtn) {
  burgerBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

// Ferme le menu automatiquement quand on clique sur un lien
// (utile car les liens du menu pointent vers des sections de la page)
document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

// --- Formulaire de préinscription ---
// Sans backend, on affiche une confirmation à l'écran plutôt que
// d'envoyer réellement les données (voir commentaire dans le HTML).
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault(); // on empêche le rechargement de la page

    const nom = document.querySelector("#nom").value;

    contactForm.style.display = "none";
    document.querySelector("#contact-success").style.display = "block";
    document.querySelector("#success-nom").textContent = nom;
  });
}

// --- FAQ déroulante ---
// Chaque clic sur une question ouvre/ferme sa réponse juste en dessous.
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    item.classList.toggle("open");
  });
});

// --- Filtre de recherche des formations ---
// À chaque frappe, on compare le texte tapé au titre de chaque carte
// (data-title) et on cache celles qui ne correspondent pas.
const searchInput = document.querySelector("#formation-search");
const formationCards = document.querySelectorAll("#formations-grid .card");
const noResults = document.querySelector("#no-results");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    formationCards.forEach((card) => {
      const title = card.dataset.title.toLowerCase();
      const match = title.includes(query);
      card.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    noResults.style.display = visibleCount === 0 ? "block" : "none";
  });
}

// --- Vidéos des événements : lecture automatique au survol ---
// Les vidéos ayant l'attribut data-hover-play se lancent quand la
// souris passe dessus, et se remettent en pause au départ de la souris.
document.querySelectorAll("[data-hover-play]").forEach((video) => {
  video.addEventListener("mouseenter", () => {
    video.play();
  });

  video.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});
