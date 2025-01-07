document.addEventListener("DOMContentLoaded", () => {
  const themeSwitchCheckbox = document.querySelector("#checkbox");
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".sidebar a");
  const cards = document.querySelectorAll(".card");

  // Create a map for quick link lookups
  const linkMap = new Map();
  navLinks.forEach((link) => {
    const id = link.getAttribute("href").slice(1);
    linkMap.set(id, link);
  });

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark-theme");
      document.documentElement.classList.remove("light-theme");
      themeSwitchCheckbox.checked = false; // Checkbox unchecked for dark mode
    } else {
      document.documentElement.classList.remove("dark-theme");
      document.documentElement.classList.add("light-theme");
      themeSwitchCheckbox.checked = true; // Checkbox checked for light mode
    }
    // Update theme color dynamically
    updateThemeColor();
  };

  const isDevicePhone = () => {
    // Force phone mode for testing (Set to `true` or `false` explicitly)
    return true;
    /*
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 10 ||
      /Mobi|Android/i.test(navigator.userAgent)
    );
    */
  };

  const initializeTheme = () => {
    const phone = isDevicePhone();
    if (phone) {
      document.body.classList.add("touchscreen");
      applyTheme("dark"); // Default to dark theme for phones
    } else {
      applyTheme("dark"); // Default to dark theme for non-phones
    }
  };

  const updateThemeColor = () => {
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }
  };

  const observer = new MutationObserver(updateThemeColor);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

  initializeTheme();

  themeSwitchCheckbox.addEventListener("change", () => {
    if (themeSwitchCheckbox.checked) {
      applyTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      applyTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  });

  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  const upperThreshold = 0.32;
  const lowerThreshold = 0.28;

  const sectionStates = new Map();
  const observerForSections = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        const currentState = sectionStates.get(id);
        const ratio = entry.intersectionRatio;
        const correspondingLink = linkMap.get(id);

        if (ratio >= upperThreshold && currentState !== "visible") {
          entry.target.classList.add("visible");
          navLinks.forEach((link) => link.classList.remove("active"));
          correspondingLink?.classList.add("active");
          sectionStates.set(id, "visible");
        } else if (ratio <= lowerThreshold && currentState !== "hidden") {
          entry.target.classList.remove("visible");
          correspondingLink?.classList.remove("active");
          sectionStates.set(id, "hidden");
        }
      });
    },
    {
      threshold: [lowerThreshold, upperThreshold],
    }
  );

  sections.forEach((section) => {
    observerForSections.observe(section);
    sectionStates.set(section.getAttribute("id"), "hidden");
  });

  // Function to check the number of cards per row and apply CSS class
  const checkCardsPerRow = () => {
    const cardRows = new Map();
    cards.forEach((card) => {
      const row = Math.round(card.getBoundingClientRect().top);
      cardRows.set(row, (cardRows.get(row) || 0) + 1);
    });

    // Determine if any row has 2 or more cards
    let hasMultipleCardsPerRow = false;
    cardRows.forEach((count) => {
      if (count >= 2) {
        hasMultipleCardsPerRow = true;
      }
    });

    if (hasMultipleCardsPerRow) {
      cards.forEach((card) => {
        card.classList.add("multi-card-row");
      });
    } else {
      cards.forEach((card) => {
        card.classList.remove("multi-card-row");
      });
    }
  };

  // Run on load
  checkCardsPerRow();

  // Run on resize and orientation change
  window.addEventListener("resize", checkCardsPerRow);
  window.addEventListener("orientationchange", checkCardsPerRow);

  // Flip card logic
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".card.expanded").forEach((openCard) => {
        if (openCard !== card) {
          openCard.classList.remove("expanded");
          openCard.classList.remove("flipped");
        }
      });
      card.classList.toggle("expanded");
      card.classList.toggle("flipped");
    });
  });
});
