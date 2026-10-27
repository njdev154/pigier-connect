/* Interactions simples et accessibles du site Pigier Connect */

const burgerBtn = document.querySelector("#burger-btn");
const nav = document.querySelector(".nav");

// Menu mobile : état lisible au clavier et fermeture avec Echap
if (burgerBtn && nav) {
  burgerBtn.setAttribute("aria-expanded", "false");
  if (!nav.id) nav.id = "site-navigation";
  burgerBtn.setAttribute("aria-controls", nav.id);

  const closeMenu = () => {
    nav.classList.remove("open");
    burgerBtn.setAttribute("aria-expanded", "false");
  };

  burgerBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    burgerBtn.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      burgerBtn.focus();
    }
  });
}

// Le formulaire reste une démonstration tant qu aucun service ne le reçoit
const contactForm = document.querySelector("#contact-form");
const contactSuccess = document.querySelector("#contact-success");

if (contactForm) {
  const notice = document.createElement("p");
  notice.className = "demo-notice";
  notice.textContent = "Mode démonstration : aucune demande réelle n’est envoyée ni enregistrée.";
  notice.setAttribute("role", "note");
  contactForm.insertAdjacentElement("beforebegin", notice);

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const nameField = document.querySelector("#nom");
    const successName = document.querySelector("#success-nom");
    if (nameField && successName) successName.textContent = nameField.value.trim();

    contactForm.hidden = true;
    contactForm.style.display = "none";
    if (contactSuccess) {
      contactSuccess.hidden = false;
      contactSuccess.style.display = "block";
      contactSuccess.setAttribute("role", "status");
      contactSuccess.setAttribute("aria-live", "polite");
      const message = document.createElement("p");
      message.className = "demo-notice";
      message.textContent = "Simulation uniquement : vos informations n’ont pas été transmises à Pigier.";
      contactSuccess.append(message);
    }
  });
}

// FAQ : synchronise le bouton et sa réponse pour les lecteurs d écran
const faqButtons = document.querySelectorAll(".faq-question");
faqButtons.forEach((button, index) => {
  const answer = button.parentElement?.querySelector(".faq-answer");
  if (!answer) return;
  if (!answer.id) answer.id = `faq-answer-${index + 1}`;
  button.setAttribute("aria-controls", answer.id);
  button.setAttribute("aria-expanded", String(button.parentElement.classList.contains("open")));

  button.addEventListener("click", () => {
    const isOpen = button.parentElement.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

// Recherche des formations, avec prise en charge des accents français
const searchInput = document.querySelector("#formation-search");
const formationCards = document.querySelectorAll("#formations-grid .card");
const noResults = document.querySelector("#no-results");
const normalizeText = (value) => value.toLocaleLowerCase("fr").normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");

if (searchInput) {
  searchInput.setAttribute("aria-label", "Rechercher une formation");
  searchInput.addEventListener("input", () => {
    const query = normalizeText(searchInput.value.trim());
    let visibleCount = 0;
    formationCards.forEach((card) => {
      const text = normalizeText(card.dataset.title || card.textContent);
      const matches = text.includes(query);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    if (noResults) {
      noResults.hidden = visibleCount !== 0;
      noResults.setAttribute("role", "status");
    }
  });
}

// Apparition au défilement : léger mouvement dans les couleurs du site
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".section h2, .section-intro, .cards-4 .card, .cards-3 .card, .event-videos .video-card, .stat-card");

if ("IntersectionObserver" in window && !reducedMotion) {
  revealItems.forEach((item) => item.classList.add("reveal"));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Les chiffres de démonstration montent une fois à l arrivée sur les résultats
const results = document.querySelector("#resultats");
const statNumbers = results?.querySelectorAll(".stat-number");

if (results && statNumbers?.length) {
  const note = document.createElement("p");
  note.className = "demo-notice stats-demo-note";
  note.textContent = "Chiffres fictifs utilisés pour la démonstration du site.";
  results.querySelector(".container")?.append(note);

  const animateStats = () => statNumbers.forEach((element) => {
    if (element.dataset.animated === "true") return;
    element.dataset.animated = "true";
    const original = element.textContent.trim();
    const target = Number(original.replace(/[^0-9]/g, ""));
    if (!Number.isFinite(target)) return;
    const suffix = original.replace(/[0-9.,\\s]/g, "");
    const start = performance.now();
    const duration = 1200;

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased).toLocaleString("fr-FR")}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
      else element.textContent = original;
    };
    requestAnimationFrame(update);
  });

  if ("IntersectionObserver" in window && !reducedMotion) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        animateStats();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    statsObserver.observe(results);
  } else {
    animateStats();
  }
}

// Navigation : souligne le lien de la section visible
const navLinks = [...document.querySelectorAll(".nav a[href^=\"#\"]")];
const navSections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window && navSections.length && !reducedMotion) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-25% 0px -60% 0px" });
  navSections.forEach((section) => sectionObserver.observe(section));
}

// Les vidéos restent au contrôle du visiteur : aucune lecture automatique.
