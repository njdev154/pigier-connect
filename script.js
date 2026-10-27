/* ============================================================
   PIGIER YOPOUGON - interactions et animations
   Un seul fichier, découpé en petites parties numérotées.
   Chaque partie vérifie que ses éléments existent avant d'agir.
============================================================ */

// Numéro WhatsApp qui reçoit les préinscriptions (format international, sans +)
const WHATSAPP_NUMBER = "2250708334539";

// true si l'utilisateur a demandé moins d'animations dans son système
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// true sur ordinateur (souris), false sur téléphone (tactile)
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- 1. Ecran de chargement ---------- */
// On retire le rideau quand tout est chargé (ou après 2,5 s maximum)
const loader = document.querySelector("#loader");
const hideLoader = () => {
  if (!loader || loader.classList.contains("is-done")) return;
  loader.classList.add("is-done");
  document.body.classList.remove("is-loading");
  startHero();
};
window.addEventListener("load", () => setTimeout(hideLoader, reducedMotion ? 0 : 500));
setTimeout(hideLoader, 2500);

/* ---------- 2. Titre du hero découpé mot par mot ---------- */
// Chaque mot est enveloppé dans deux span pour l'effet "monte depuis une ligne"
const splitTitle = document.querySelector(".split-title");
if (splitTitle) {
  let index = 0;
  const wrapWords = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part.trim()) {
            fragment.append(part);
            return;
          }
          const word = document.createElement("span");
          word.className = "word";
          word.innerHTML = `<span style="--i:${index++}">${part}</span>`;
          fragment.append(word);
        });
        child.replaceWith(fragment);
      } else {
        wrapWords(child); // descend dans <span class="highlight">
      }
    });
  };
  splitTitle.setAttribute("aria-label", splitTitle.textContent.trim());
  wrapWords(splitTitle);
}

// Lancé à la fin du chargement : le titre et le haut de page apparaissent
function startHero() {
  splitTitle?.classList.add("is-visible");
  document.querySelectorAll(".hero [data-reveal]").forEach((item, i) => {
    item.style.setProperty("--delay", `${300 + i * 110}ms`);
    item.classList.add("is-visible");
  });
}

/* ---------- 3. Bandeau défilant ---------- */
// On duplique le contenu pour que la boucle soit continue
const marqueeTrack = document.querySelector(".marquee-track");
if (marqueeTrack) marqueeTrack.innerHTML += marqueeTrack.innerHTML;

/* ---------- 4. Apparition au défilement ---------- */
// Dans un bloc data-stagger, les enfants apparaissent l'un après l'autre
document.querySelectorAll("[data-stagger]").forEach((group) => {
  group.querySelectorAll(":scope > [data-reveal]").forEach((item, i) => {
    item.style.setProperty("--delay", `${i * 90}ms`);
  });
});

const revealTargets = document.querySelectorAll("[data-reveal]:not(.hero [data-reveal]), .section-title");
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target); // une seule fois
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  revealTargets.forEach((item) => revealObserver.observe(item));
} else {
  revealTargets.forEach((item) => item.classList.add("is-visible"));
}

/* ---------- 5. Compteurs animés ---------- */
// Les nombres montent de 0 à leur valeur quand la section arrive à l'écran
const formatNumber = (value, plain) => (plain ? String(value) : value.toLocaleString("fr-FR"));

const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix || "";
  const plain = element.dataset.format === "plain";
  const start = plain ? Math.max(target - 70, 0) : 0; // 1956 part de 1886, pas de 0
  const duration = 1800;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4); // ralentit à la fin
    const value = Math.round(start + (target - start) * eased);
    element.textContent = formatNumber(value, plain) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const counters = document.querySelectorAll("[data-count]");
if ("IntersectionObserver" in window && !reducedMotion) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  counters.forEach((counter) => counterObserver.observe(counter));
}

/* ---------- 6. En-tête, barre de progression, frise, parallaxe ---------- */
// Tout ce qui dépend du scroll est calculé dans une seule boucle requestAnimationFrame
const header = document.querySelector("#header");
const progressBar = document.querySelector("#scroll-progress");
const backToTop = document.querySelector("#back-to-top");
const ring = backToTop?.querySelector(".ring");
const timeline = document.querySelector("#timeline");
const timelineFill = timeline?.querySelector(".timeline-line span");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const RING_LENGTH = 132; // périmètre du cercle (2 x pi x 21)
let lastScroll = 0;
let ticking = false;

const onScroll = () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? y / max : 0;

  progressBar.style.transform = `scaleX(${ratio})`;

  // Header : ombre après 20 px, se cache si on descend vite, revient si on remonte
  if (header) {
    header.classList.toggle("is-scrolled", y > 20);
    const goingDown = y > lastScroll && y > 400;
    const menuOpen = document.querySelector("#nav")?.classList.contains("open");
    header.classList.toggle("is-hidden", goingDown && !menuOpen);
  }

  // Bouton retour en haut : visible après 600 px, anneau rempli selon la lecture
  if (backToTop) {
    backToTop.classList.toggle("is-visible", y > 600);
    if (ring) ring.style.strokeDashoffset = String(RING_LENGTH * (1 - ratio));
  }

  // Frise : la ligne se remplit selon la position de la section à l'écran
  if (timeline && timelineFill) {
    const box = timeline.getBoundingClientRect();
    const filled = (window.innerHeight * 0.6 - box.top) / box.height;
    timelineFill.style.setProperty("--progress", Math.min(Math.max(filled, 0), 1).toFixed(3));
  }

  // Parallaxe : les formes du hero bougent moins vite que la page
  if (!reducedMotion && y < window.innerHeight * 1.2) {
    parallaxItems.forEach((item) => {
      item.style.translate = `0 ${y * Number(item.dataset.parallax)}px`;
    });
  }

  lastScroll = y;
  ticking = false;
};

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });
onScroll();

/* ---------- 7. Menu mobile ---------- */
const burgerBtn = document.querySelector("#burger-btn");
const nav = document.querySelector("#nav");
if (burgerBtn && nav) {
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    burgerBtn.setAttribute("aria-expanded", String(open));
    burgerBtn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  };
  burgerBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      setMenu(false);
      burgerBtn.focus();
    }
  });
}

/* ---------- 8. Lien actif + trait jaune qui glisse ---------- */
const navLinks = [...document.querySelectorAll(".nav a[href^='#']")];
const indicator = document.querySelector(".nav-indicator");

const moveIndicator = (link) => {
  if (!indicator) return;
  if (!link) {
    indicator.style.opacity = "0";
    return;
  }
  indicator.style.opacity = "1";
  indicator.style.width = `${link.offsetWidth}px`;
  indicator.style.transform = `translateX(${link.offsetLeft}px)`;
};

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      let activeLink = null;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) {
          link.setAttribute("aria-current", "location");
          activeLink = link;
        } else link.removeAttribute("aria-current");
      });
      moveIndicator(activeLink);
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  // On observe aussi le hero pour effacer le trait tout en haut
  document.querySelectorAll("main > section[id]").forEach((section) => sectionObserver.observe(section));
}

/* ---------- 9. Effets souris : lumière, inclinaison, aimant, onde ---------- */
if (finePointer && !reducedMotion) {
  // Lumière jaune qui suit le curseur sur les cartes
  document.querySelectorAll(".spotlight").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - box.left}px`);
      card.style.setProperty("--my", `${event.clientY - box.top}px`);
      // Inclinaison 3D très légère (4 degrés maximum)
      const rx = ((event.clientY - box.top) / box.height - 0.5) * -4;
      const ry = ((event.clientX - box.left) / box.width - 0.5) * 4;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  // Le téléphone du hero s'incline vers la souris
  const phone = document.querySelector(".tilt");
  const heroSection = document.querySelector(".hero");
  if (phone && heroSection) {
    heroSection.addEventListener("pointermove", (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      phone.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${y * -10}deg)`;
    });
    heroSection.addEventListener("pointerleave", () => {
      phone.style.transform = "";
    });
  }

  // Boutons "aimantés" : ils suivent un peu le curseur
  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const box = button.getBoundingClientRect();
      const x = (event.clientX - box.left - box.width / 2) * 0.25;
      const y = (event.clientY - box.top - box.height / 2) * 0.35;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

// Onde jaune à chaque clic sur un bouton (souris et tactile)
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    if (reducedMotion) return;
    const box = button.getBoundingClientRect();
    const size = Math.max(box.width, box.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - box.left - size / 2}px`;
    ripple.style.top = `${event.clientY - box.top - size / 2}px`;
    button.append(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

/* ---------- 10. Son de la vidéo du hero ---------- */
const heroVideo = document.querySelector(".hero-video");
const soundToggle = document.querySelector(".sound-toggle");
if (heroVideo && soundToggle) {
  if (reducedMotion) heroVideo.pause(); // pas de lecture automatique dans ce cas
  soundToggle.addEventListener("click", () => {
    heroVideo.muted = !heroVideo.muted;
    if (heroVideo.paused) heroVideo.play();
    soundToggle.setAttribute("aria-pressed", String(!heroVideo.muted));
    soundToggle.setAttribute("aria-label", heroVideo.muted ? "Activer le son" : "Couper le son");
  });
}

/* ---------- 11. Catalogue : filtres par niveau + recherche ---------- */
const grid = document.querySelector("#formations-grid");
const searchInput = document.querySelector("#formation-search");
const chips = document.querySelectorAll(".chip");
const noResults = document.querySelector("#no-results");
const formations = grid ? [...grid.querySelectorAll(".formation")] : [];
let currentFilter = "all";

// Retire les accents pour que "comptabilite" trouve "Comptabilité"
const normalize = (text) => text.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Nombre de formations par niveau dans chaque bouton
chips.forEach((chip) => {
  const filter = chip.dataset.filter;
  const count = filter === "all" ? formations.length : formations.filter((card) => card.dataset.level === filter).length;
  const badge = chip.querySelector(".chip-count");
  if (badge) badge.textContent = count;
});

const applyFilters = () => {
  const query = normalize(searchInput?.value.trim() || "");
  let visible = 0;

  formations.forEach((card) => {
    const levelOk = currentFilter === "all" || card.dataset.level === currentFilter;
    const textOk = normalize(card.textContent).includes(query);
    const show = levelOk && textOk;

    if (show) {
      visible += 1;
      if (card.hidden) {
        // Réapparition : on affiche puis on lance la transition à l'image suivante
        card.hidden = false;
        card.classList.add("is-entering");
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove("is-entering")));
      }
    } else if (!card.hidden) {
      // Disparition : on rétrécit puis on cache à la fin de la transition
      card.classList.add("is-leaving");
      setTimeout(() => {
        card.hidden = true;
        card.classList.remove("is-leaving");
      }, reducedMotion ? 0 : 300);
    }
  });

  if (noResults) noResults.hidden = visible !== 0;
};

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((other) => {
      other.classList.toggle("is-active", other === chip);
      other.setAttribute("aria-pressed", String(other === chip));
    });
    currentFilter = chip.dataset.filter;
    applyFilters();
  });
});

searchInput?.addEventListener("input", applyFilters);

/* ---------- 12. Vidéos des événements ---------- */
const lightbox = document.querySelector("#lightbox");
const lightboxVideo = lightbox?.querySelector("video");
const lightboxTitle = lightbox?.querySelector(".lightbox-title");

document.querySelectorAll(".video-thumb").forEach((thumb) => {
  const preview = thumb.querySelector("video");

  // Aperçu muet au survol (ordinateur seulement)
  if (finePointer && preview) {
    thumb.addEventListener("pointerenter", () => preview.play().catch(() => {}));
    thumb.addEventListener("pointerleave", () => {
      preview.pause();
      preview.currentTime = 0;
    });
  }

  // Clic : ouverture de la fenêtre avec le son
  thumb.addEventListener("click", () => {
    if (!lightbox || !lightboxVideo) return;
    preview?.pause();
    lightboxVideo.src = thumb.dataset.src;
    lightboxTitle.textContent = thumb.dataset.title;
    lightbox.showModal();
    lightboxVideo.play().catch(() => {});
  });
});

if (lightbox && lightboxVideo) {
  const closeLightbox = () => lightbox.close();
  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  // Clic sur le fond sombre = fermeture
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  // A la fermeture (bouton, fond ou Echap) on arrête la vidéo
  lightbox.addEventListener("close", () => {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
  });
}

/* ---------- 13. FAQ : une seule question ouverte à la fois ---------- */
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item, index) => {
  const button = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  answer.id = `faq-answer-${index + 1}`;
  button.setAttribute("aria-controls", answer.id);
  button.setAttribute("aria-expanded", "false");

  button.addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");
    faqItems.forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });
    if (willOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

/* ---------- 14. Formulaire de préinscription ---------- */
const form = document.querySelector("#contact-form");
const success = document.querySelector("#contact-success");

// Message d'erreur en français selon le problème du champ
const errorMessage = (field) => {
  if (field.validity.valueMissing) return "Ce champ est obligatoire.";
  if (field.validity.typeMismatch) return "Adresse email invalide.";
  if (field.validity.patternMismatch) return "Numéro à 10 chiffres, ex : 07 00 00 00 00.";
  if (field.validity.tooShort) return "Indique ton nom complet.";
  return "";
};

// Vérifie un champ et met à jour son style et son message
const checkField = (field) => {
  const wrapper = field.closest(".field");
  const error = wrapper?.querySelector(".error");
  const message = errorMessage(field);
  wrapper?.classList.toggle("is-invalid", Boolean(message));
  wrapper?.classList.toggle("is-valid", !message && field.value !== "");
  field.setAttribute("aria-invalid", String(Boolean(message)));
  if (error) error.textContent = message;
  return !message;
};

if (form && success) {
  const fields = [...form.querySelectorAll("input[required], select[required]")];
  const button = form.querySelector(".btn-form");

  // Vérification en direct dès que l'utilisateur quitte un champ
  fields.forEach((field) => {
    field.addEventListener("blur", () => checkField(field));
    field.addEventListener("input", () => {
      if (field.closest(".field").classList.contains("is-invalid")) checkField(field);
    });
  });

  // Espaces automatiques dans le numéro : 0700000000 -> 07 00 00 00 00
  const tel = form.querySelector("#tel");
  tel?.addEventListener("input", () => {
    const digits = tel.value.replace(/[^\d+]/g, "");
    if (!digits.startsWith("+")) tel.value = digits.slice(0, 10).replace(/(\d{2})(?=\d)/g, "$1 ");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const allValid = fields.map(checkField).every(Boolean);
    if (!allValid) {
      form.querySelector(".is-invalid input, .is-invalid select")?.focus();
      return;
    }

    // Message WhatsApp pré-rempli avec les réponses du formulaire
    const data = new FormData(form);
    const text = [
      "Bonjour Pigier Yopougon, je souhaite me préinscrire.",
      `Nom : ${data.get("nom")}`,
      `Téléphone : ${data.get("telephone")}`,
      `Email : ${data.get("email")}`,
      `Formation : ${data.get("formation")}`,
      data.get("message") ? `Message : ${data.get("message")}` : "",
    ].filter(Boolean).join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    // Petit temps de chargement, puis l'écran de succès avec le bouton WhatsApp
    button.classList.add("is-loading");
    setTimeout(() => {
      button.classList.remove("is-loading");
      document.querySelector("#success-nom").textContent = String(data.get("nom")).split(" ")[0];
      document.querySelector("#success-link").href = url;
      form.hidden = true;
      success.hidden = false;
      document.querySelector("#success-link").focus();
    }, reducedMotion ? 0 : 900);
  });

  // "Nouvelle demande" : on vide le formulaire et on le réaffiche
  document.querySelector("#new-request")?.addEventListener("click", () => {
    form.reset();
    form.querySelectorAll(".field").forEach((field) => field.classList.remove("is-valid", "is-invalid"));
    success.hidden = true;
    form.hidden = false;
    form.querySelector("input")?.focus();
  });
}

/* ---------- 15. Année du pied de page ---------- */
const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();
