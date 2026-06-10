(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- navbar: shrink + blur on scroll ---------- */
  const navbar = document.getElementById("navbar");
  const progress = document.querySelector(".scroll-progress");

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : "0%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinksList = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const open = navLinksList.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navLinksList.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navLinksList.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- active nav link via section observation ---------- */
  const navLinks = Array.from(
    document.querySelectorAll('.nav-links a[href^="#"]')
  );
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  /* ---------- scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    reveals.forEach((el) => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- animated stat counters ---------- */
  const counters = document.querySelectorAll(".stat-number");

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (prefersReducedMotion) {
    counters.forEach((el) => {
      el.textContent =
        parseFloat(el.dataset.count).toFixed(
          parseInt(el.dataset.decimals || "0", 10)
        ) + (el.dataset.suffix || "");
    });
  } else {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ---------- hero typing effect ---------- */
  const typedEl = document.getElementById("typed");
  const phrases = [
    "Machine Learning",
    "Python & SQL",
    "AI Workflows with Claude",
    "Demand Forecasting",
    "Business Intelligence",
  ];

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const type = () => {
        const phrase = phrases[phraseIndex];

        if (deleting) {
          charIndex--;
          typedEl.textContent = phrase.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 350);
            return;
          }
          setTimeout(type, 35);
        } else {
          charIndex++;
          typedEl.textContent = phrase.slice(0, charIndex);
          if (charIndex === phrase.length) {
            deleting = true;
            setTimeout(type, 2100);
            return;
          }
          setTimeout(type, 65);
        }
      };
      setTimeout(type, 600);
    }
  }
})();
