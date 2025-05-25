document.addEventListener("DOMContentLoaded", function () {
  const drawer = document.getElementById("drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");
  const openDrawerBtn = document.getElementById("open-drawer");
  const closeDrawerBtn = document.getElementById("close-drawer");
  const drawerContent = document.querySelector(".drawer-content");

  // Function to open the drawer
  function openDrawer() {
    drawer.classList.remove("-translate-x-full");
    drawer.classList.add("translate-x-0");
    drawerOverlay.classList.remove("opacity-0", "invisible");
    drawerOverlay.classList.add("opacity-50", "visible");
  }

  // Function to close the drawer
  function closeDrawer() {
    drawer.classList.remove("translate-x-0");
    drawer.classList.add("-translate-x-full");
    drawerOverlay.classList.remove("opacity-50", "visible");
    drawerOverlay.classList.add("opacity-0", "invisible");
  }

  // Event listeners
  openDrawerBtn.addEventListener("click", openDrawer);
  closeDrawerBtn.addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("click", closeDrawer);

  // Close drawer when clicking outside on mobile
  document.addEventListener("click", function (event) {
    if (
      window.innerWidth < 768 &&
      !drawer.contains(event.target) &&
      event.target !== openDrawerBtn &&
      !openDrawerBtn.contains(event.target)
    ) {
      closeDrawer();
    }
  });

  // Handle window resize
  function handleResize() {
    if (window.innerWidth >= 768) {
      // On larger screens, ensure drawer is open
      drawer.classList.remove("-translate-x-full");
      drawer.classList.add("translate-x-0");
      drawerOverlay.classList.remove("opacity-50", "visible");
      drawerOverlay.classList.add("opacity-0", "invisible");
    } else {
      // On smaller screens, ensure drawer is closed
      drawer.classList.remove("translate-x-0");
      drawer.classList.add("-translate-x-full");
    }
  }

  // Initial check
  handleResize();

  // Listen for resize events
  window.addEventListener("resize", handleResize);
});
