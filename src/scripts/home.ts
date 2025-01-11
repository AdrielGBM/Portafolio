// Main function
function main(): void {
  initializeAnchorLinks();
}

// Initialize anchor link functionality
function initializeAnchorLinks(): void {
  const header = document.querySelector<HTMLElement>(".header");
  const anchorLinks = document.querySelectorAll<HTMLAnchorElement>(
    ".header__nav-anchor"
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

// Function to handle the click event for anchor links
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

// Call the main function when the DOM is ready
document.addEventListener("DOMContentLoaded", main);
