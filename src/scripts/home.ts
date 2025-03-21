// Main function
function main(): void {
  initializeAnchorLinks();
  initializeSectionHighlight();
  initializeMenu();
  initializeTheme();
  initializeCarousel();
  initializeContactSection();

  window.addEventListener("resize", () => {
    initializeSectionHighlight();
  });
}

// Initialize anchor link functionality
function initializeAnchorLinks(): void {
  const header = document.querySelector<HTMLElement>(".header");
  const anchorLinks = document.querySelectorAll<HTMLAnchorElement>(
    ".header__nav-anchor, .header__menu-anchor"
  );
  if (!header || anchorLinks.length === 0) return;

  // Add click event listener to each anchor link
  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => handleAnchorClick(event, header));
  });
}

// Handle the click event for anchor links
function handleAnchorClick(event: Event, header: HTMLElement): void {
  event.preventDefault();

  // Get the height of the sticky header
  const headerHeight = header.offsetHeight;

  // Get the target section ID
  const link = (event.target as HTMLAnchorElement).closest<HTMLAnchorElement>(
    "a"
  );
  if (!link) return;
  const targetId = link.getAttribute("href");
  if (!targetId) return;

  // Find the target section
  const targetElement = document.querySelector<HTMLElement>(targetId);
  if (!targetElement) return;

  // Calculate the adjusted scroll position
  const offsetPosition = calculateScrollPosition(targetElement, headerHeight);

  // Smoothly scroll to the adjusted position
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

// Calculate the scroll position adjusted by the header height
function calculateScrollPosition(target: HTMLElement, offset: number): number {
  return target.offsetTop - offset;
}

// Initialize section highlight functionality using IntersectionObserver
function initializeSectionHighlight(): void {
  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px",
    threshold: getDynamicThreshold(),
  };
  const sections = document.querySelectorAll<HTMLElement>("section[id]");
  const anchorLinks = document.querySelectorAll<HTMLAnchorElement>(
    ".header__nav-anchor, .header__menu-anchor"
  );
  if (!sections.length || !anchorLinks.length) return;

  // Create an observer for each section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      const links = document.querySelectorAll<HTMLAnchorElement>(
        `.header__nav-anchor[href="#${id}"], .header__menu-anchor[href="#${id}"]`
      );

      // Highlight the corresponding anchor link when the section is in view
      if (entry.isIntersecting && links.length > 0) {
        anchorLinks.forEach((anchor) => {
          anchor.classList.remove("active");
        });
        links.forEach((link) => {
          link.classList.add("active");
        });
      }
    });
  }, observerOptions);
  sections.forEach((section) => observer.observe(section));
}

// Get the dynamic threshold based on the window width
function getDynamicThreshold(): number {
  return window.innerWidth < 960 ? 0.4 : 0.9;
}

// Initialize menu functionality by adding click events to options button
function initializeMenu(): void {
  const optionsButton = document.querySelector<HTMLElement>(
    ".header__options-button"
  );
  const menuElement = document.querySelector<HTMLElement>(".header__menu");
  if (!optionsButton || !menuElement) return;

  // Toggle the menu visibility when the options button is clicked
  optionsButton.addEventListener("click", () => {
    menuElement.classList.remove("header__menu--hide");
    menuElement.classList.toggle("header__menu--fade-out");
    menuElement.classList.toggle("header__menu--fade-in");
  });

  // Hide the menu when clicking outside of the menu
  document.addEventListener("click", (event) => {
    const isMenuClicked = menuElement?.contains(event.target as Node);
    const isOptionsClicked = optionsButton?.contains(event.target as Node);

    if (!isMenuClicked && !isOptionsClicked) {
      menuElement.classList.add("header__menu--fade-out");
      menuElement.classList.remove("header__menu--fade-in");
    }
  });
}

// Initialize theme functionality by adding click event to theme button
function initializeTheme(): void {
  const themeButton = document.querySelector<HTMLElement>(
    ".header__menu-theme"
  );
  if (!themeButton) return;

  // Set the initial theme based on the saved preference
  const savedTheme = localStorage.getItem("theme") || "system";
  applyTheme(savedTheme);
  updateThemeButton(themeButton, savedTheme);

  // Change the theme when the theme button is clicked
  themeButton.addEventListener("click", () => {
    const currentTheme = localStorage.getItem("theme") || "system";
    const newTheme = getNextTheme(currentTheme);

    applyTheme(newTheme);
    updateThemeButton(themeButton, newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

// Apply the selected theme to the document
function applyTheme(theme: string): void {
  const htmlElement = document.documentElement;

  if (theme === "light") {
    htmlElement.setAttribute("data-theme", "light");
  } else if (theme === "dark") {
    htmlElement.setAttribute("data-theme", "dark");
  } else {
    htmlElement.removeAttribute("data-theme");
  }
}

// Update the theme button based on the current theme
function updateThemeButton(themeButton: HTMLElement, theme: string): void {
  const themeIcon = themeButton.querySelector<HTMLElement>("i");
  const themeText = themeButton.querySelector<HTMLElement>("span");
  if (!themeIcon || !themeText) return;

  if (theme === "light") {
    themeIcon.className = "fa-solid fa-sun";
    themeText.textContent = "Claro";
  } else if (theme === "dark") {
    themeIcon.className = "fa-solid fa-moon";
    themeText.textContent = "Oscuro";
  } else {
    themeIcon.className = "fa-solid fa-circle-half-stroke";
    themeText.textContent = "Sistema";
  }
}

// Get the next theme based on the current theme
function getNextTheme(currentTheme: string): string {
  if (currentTheme === "system") return "light";
  if (currentTheme === "light") return "dark";
  return "system";
}

// Initialize carousel functionality by adding click events to arrows
function initializeCarousel(): void {
  const carousel = document.querySelector<HTMLElement>(
    ".main__projects-carousel"
  );
  const leftArrow = document.querySelector<HTMLElement>(
    ".main__projects-arrow--left"
  );
  const rightArrow = document.querySelector<HTMLElement>(
    ".main__projects-arrow--right"
  );
  if (!carousel || !leftArrow || !rightArrow) return;

  // Scroll carousel left or right when arrows are clicked
  leftArrow.addEventListener("click", () => scrollCarousel(carousel, "left"));
  rightArrow.addEventListener("click", () => scrollCarousel(carousel, "right"));

  // Add scroll event listener to toggle arrow visibility
  carousel.addEventListener("scroll", () => {
    toggleArrowVisibility(carousel, leftArrow, rightArrow);
  });

  // Initial check to toggle arrow visibility on load
  toggleArrowVisibility(carousel, leftArrow, rightArrow);
}

// Scroll the carousel in the specified direction
function scrollCarousel(carousel: HTMLElement, direction: string): void {
  const card = carousel.querySelector<HTMLElement>(".main__projects-grid");
  if (!card) return;

  // Use the width of a single card as the scroll amount
  const scrollAmount =
    card.offsetWidth + parseInt(getComputedStyle(carousel).gap || "0", 10);

  carousel.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
}

// Toggle the visibility of arrows based on the carousel's scroll position
function toggleArrowVisibility(
  carousel: HTMLElement,
  leftArrow: HTMLElement,
  rightArrow: HTMLElement
): void {
  const scrollLeft = carousel.scrollLeft;
  const maxScrollLeft = carousel.scrollWidth - carousel.offsetWidth;
  const margin = 4;

  if (scrollLeft <= margin) {
    leftArrow.classList.remove("main__projects-arrow--fade-in");
    leftArrow.classList.add("main__projects-arrow--fade-out");
  } else {
    leftArrow.classList.remove("main__projects-arrow--hide");
    leftArrow.classList.remove("main__projects-arrow--fade-out");
    leftArrow.classList.add("main__projects-arrow--fade-in");
  }
  if (scrollLeft >= maxScrollLeft - margin) {
    rightArrow.classList.remove("main__projects-arrow--fade-in");
    rightArrow.classList.add("main__projects-arrow--fade-out");
  } else {
    rightArrow.classList.remove("main__projects-arrow--hide");
    rightArrow.classList.remove("main__projects-arrow--fade-out");
    rightArrow.classList.add("main__projects-arrow--fade-in");
  }
}

// Initialize contact section functionality by adding click events
function initializeContactSection(): void {
  const emailElement = document.querySelector<HTMLElement>(
    ".footer__section--email"
  );
  const cvElement = document.querySelector<HTMLElement>(".footer__section--cv");

  emailElement?.addEventListener("click", (event) => {
    handleCopyToClipboard(event.currentTarget as HTMLElement);
  });
  cvElement?.addEventListener("click", (event) =>
    toggleCheckIcon(event.currentTarget as HTMLElement, "fa-download")
  );
}

// Handle the click event and copy to clipboard
function handleCopyToClipboard(target: HTMLElement): void {
  const email = "adrielgbm@gmail.com";

  // Copy the email to the clipboard
  navigator.clipboard.writeText(email).then(() => {
    toggleCheckIcon(target, "fa-at");
  });
}

// Toggle the check icon for a short period of time
function toggleCheckIcon(target: HTMLElement, icon: string): void {
  const iconElement = target.querySelector("i");

  if (iconElement) {
    iconElement.className = "fa-solid fa-check";

    setTimeout(() => {
      iconElement.className = `fa-solid ${icon}`;
    }, 2000);
  }
}

// Call the main function when the DOM is ready
document.addEventListener("DOMContentLoaded", main);
