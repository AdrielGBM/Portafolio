// Main function
function main(): void {
  navigator.clipboard.writeText("Hola amigos.");
  initializeAnchorLinks();
  initializeCopyToClipboard();
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

  navigator.clipboard.writeText("Hola amigos.");

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
