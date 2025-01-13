// Main function
function main(): void {
  initializeAnchorLinks();
  initializeMenu();
  initializeTheme();
  initializeCarousel();
  initializeCopyToClipboard();
}

// Initialize anchor link functionality
function initializeAnchorLinks(): void {
  const header = document.querySelector<HTMLElement>(".header");
  const anchorLinks = document.querySelectorAll<HTMLAnchorElement>(
    ".header__nav-anchor, .header__menu-anchor"
  );
  if (!header || anchorLinks.length === 0) return;

  // Get the height of the sticky header
  const headerHeight = header.offsetHeight;

  // Add click event listener to each anchor link
  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) =>
      handleAnchorClick(event, headerHeight)
    );
  });
}

// Handle the click event for anchor links
function handleAnchorClick(event: Event, headerHeight: number): void {
  event.preventDefault();

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

// Initialize menu functionality by adding click events to options button
function initializeMenu(): void {
  const optionsButton = document.querySelector<HTMLElement>(
    ".header__options-button"
  );
  const menuElement = document.querySelector<HTMLElement>(".header__menu");

  // Toggle the menu visibility when the options button is clicked
  optionsButton?.addEventListener("click", () => {
    menuElement?.classList.toggle("header__menu--hide");
  });

  // Hide the menu when clicking outside of the menu
  document.addEventListener("click", (event) => {
    const isMenuClicked = menuElement?.contains(event.target as Node);
    const isOptionsClicked = optionsButton?.contains(event.target as Node);

    if (!isMenuClicked && !isOptionsClicked) {
      menuElement?.classList.add("header__menu--hide");
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
  carousel.addEventListener("scroll", () =>
    toggleArrowVisibility(carousel, leftArrow, rightArrow)
  );

  // Initial check to toggle arrow visibility on load
  toggleArrowVisibility(carousel, leftArrow, rightArrow);
}

// Scroll the carousel in the specified direction
function scrollCarousel(carousel: HTMLElement, direction: string): void {
  const scrollAmount = carousel.offsetWidth;

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

  if (scrollLeft <= 0) {
    leftArrow.classList.add("main__projects-arrow--hide");
  } else {
    leftArrow.classList.remove("main__projects-arrow--hide");
  }
  if (scrollLeft >= maxScrollLeft - 1) {
    rightArrow.classList.add("main__projects-arrow--hide");
  } else {
    rightArrow.classList.remove("main__projects-arrow--hide");
  }
}

// Initialize copy-to-clipboard functionality
function initializeCopyToClipboard(): void {
  const copyElement = document.querySelector<HTMLElement>(
    ".footer__section-copy"
  );

  copyElement?.addEventListener("click", handleCopyToClipboard);
}

// Handle the click event and copy to clipboard
function handleCopyToClipboard(event: Event): void {
  const target = event.currentTarget as HTMLElement;
  const email = target.dataset.copy;
  if (!email) return;
  const iconElement = target.querySelector("i");

  // Copy the email to the clipboard
  navigator.clipboard.writeText(email).then(() => {
    if (iconElement) {
      iconElement.className = "fa-solid fa-check";

      setTimeout(() => {
        iconElement.className = "fa-solid fa-at";
      }, 2000);
    }
  });
}

// Call the main function when the DOM is ready
document.addEventListener("DOMContentLoaded", main);
