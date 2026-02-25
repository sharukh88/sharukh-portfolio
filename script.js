(() => {
  const navLinks = Array.from(
    document.querySelectorAll('.navbar .nav-link[href^="#"]')
  );
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!navLinks.length || !sections.length) {
    return;
  }

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active-section", isActive);
      link.setAttribute("aria-current", isActive ? "page" : "false");
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-40% 0px -50% 0px",
      threshold: 0.01,
    }
  );

  sections.forEach((section) => observer.observe(section));
  setActive(sections[0].id);
})();
