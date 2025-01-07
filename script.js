  document.addEventListener("DOMContentLoaded", () => {
    const themeSwitchCheckbox = document.querySelector("#checkbox");
    const sections = document.querySelectorAll(".section");
    const navLinks = document.querySelectorAll(".sidebar a");

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
    };

    // Force phone mode for testing (Set to `true` or `false` explicitly)
    const isDevicePhone = () => {
      return true;  
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 10 ||
        /Mobi|Android/i.test(navigator.userAgent)
      );
    };
    // Initialize theme based on localStorage or device type
    const initializeTheme = () => {

    const phone = isDevicePhone(); // Forced to `true` for testing
    if (phone) {
      document.body.classList.add("touchscreen");
      applyTheme("dark"); // Default to light theme for phones
    } else {
      applyTheme("dark"); // Default to dark theme for non-phones
    }
      
    };

    // Initialize the theme on page load
    initializeTheme();

    // Update theme on toggle and save preference
    themeSwitchCheckbox.addEventListener("change", () => {
      if (themeSwitchCheckbox.checked) {
        applyTheme("light"); // Checkbox "on" means light mode
        localStorage.setItem("theme", "light");
      } else {
        applyTheme("dark"); // Checkbox "off" means dark mode
        localStorage.setItem("theme", "dark");
      }
    });

    // Prevent unintended scroll on reload
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // Observer for section visibility and navigation links
    const upperThreshold = 0.32; // Upper edge of buffer zone
    const lowerThreshold = 0.28; // Lower edge of buffer zone

    const sectionStates = new Map();
    const observer = new IntersectionObserver(
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
      observer.observe(section);
      sectionStates.set(section.getAttribute("id"), "hidden");
    });

    // Flip card logic
    const cards = document.querySelectorAll(".card");
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
