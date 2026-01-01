document.addEventListener("DOMContentLoaded", function () {
  // ====== DOM ELEMENTS ======
  const drawer = document.getElementById("drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");
  const openDrawerBtn = document.getElementById("open-drawer");
  const closeDrawerBtn = document.getElementById("close-drawer");
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleMobile = document.getElementById("theme-toggle-mobile");
  const notificationBtn = document.getElementById("notification-btn");
  const notificationDropdown = document.getElementById("notification-dropdown");
  const profileBtn = document.getElementById("profile-btn");
  const profileDropdown = document.getElementById("profile-dropdown");
  const logoutBtn = document.getElementById("logout-btn");
  const logoutDropdownBtn = document.getElementById("logout-dropdown-btn");
  const navLinks = document.querySelectorAll(".nav-link");

  // ====== THEME MANAGEMENT ======
  function setupTheme() {
    const savedTheme = localStorage.getItem("dashboard-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute("data-theme", "dark");
      updateThemeButtons(true);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      updateThemeButtons(false);
    }
  }

  function updateThemeButtons(isDark) {
    const icon = isDark ? "fa-sun" : "fa-moon";
    const text = isDark ? "Light Mode" : "Dark Mode";

    themeToggle.innerHTML = `<i class="fas ${icon}"></i><span class="text-sm">${text}</span>`;
    themeToggleMobile.innerHTML = `<i class="fas ${icon}"></i>`;
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const isDark = currentTheme === "dark";

    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "light" : "dark"
    );
    localStorage.setItem("dashboard-theme", isDark ? "light" : "dark");
    updateThemeButtons(!isDark);

    // Show theme change notification
    showNotification(`Switched to ${isDark ? "light" : "dark"} mode`);
  }

  // ====== DRAWER FUNCTIONS ======
  function openDrawer() {
    drawer.classList.remove("-translate-x-full");
    drawer.classList.add("translate-x-0", "animate-slide-in");
    drawerOverlay.classList.remove("opacity-0", "invisible");
    drawerOverlay.classList.add("opacity-100", "visible");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("translate-x-0", "animate-slide-in");
    drawer.classList.add("-translate-x-full");
    drawerOverlay.classList.remove("opacity-100", "visible");
    drawerOverlay.classList.add("opacity-0", "invisible");
    document.body.style.overflow = "auto";
  }

  function handleResize() {
    if (window.innerWidth >= 768) {
      // On larger screens, ensure drawer is open
      drawer.classList.remove("-translate-x-full");
      drawer.classList.add("translate-x-0");
      drawerOverlay.classList.remove("opacity-100", "visible");
      drawerOverlay.classList.add("opacity-0", "invisible");
      document.body.style.overflow = "auto";
    } else {
      // On smaller screens, ensure drawer is closed
      drawer.classList.remove("translate-x-0");
      drawer.classList.add("-translate-x-full");
    }

    // Close dropdowns on resize
    notificationDropdown.classList.add("hidden");
    profileDropdown.classList.add("hidden");
  }

  // ====== NOTIFICATION SYSTEM ======
  function showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in ${
      type === "success"
        ? "bg-green-500"
        : type === "error"
        ? "bg-red-500"
        : type === "warning"
        ? "bg-yellow-500"
        : "bg-blue-500"
    } text-white`;
    notification.innerHTML = `
          <div class="flex items-center space-x-2">
            <i class="fas ${
              type === "success"
                ? "fa-check-circle"
                : type === "error"
                ? "fa-exclamation-circle"
                : type === "warning"
                ? "fa-exclamation-triangle"
                : "fa-info-circle"
            }"></i>
            <span>${message}</span>
          </div>
        `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-10px)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // ====== DROPDOWN MANAGEMENT ======
  function toggleDropdown(dropdown, btn) {
    const isVisible = !dropdown.classList.contains("hidden");

    // Close all other dropdowns
    document.querySelectorAll('[id$="-dropdown"]').forEach((d) => {
      if (d !== dropdown) d.classList.add("hidden");
    });

    // Toggle current dropdown
    dropdown.classList.toggle("hidden", isVisible);

    // Close dropdown when clicking outside
    if (!isVisible) {
      const clickHandler = (e) => {
        if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
          dropdown.classList.add("hidden");
          document.removeEventListener("click", clickHandler);
        }
      };
      setTimeout(() => document.addEventListener("click", clickHandler), 10);
    }
  }

  // ====== EVENT LISTENERS ======
  // Drawer controls
  openDrawerBtn.addEventListener("click", openDrawer);
  closeDrawerBtn.addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("click", closeDrawer);

  // Theme toggles
  themeToggle.addEventListener("click", toggleTheme);
  themeToggleMobile.addEventListener("click", toggleTheme);

  // Dropdown toggles
  notificationBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDropdown(notificationDropdown, notificationBtn);
  });

  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDropdown(profileDropdown, profileBtn);
  });

  // Navigation active state
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Don't prevent default for links with href
      if (this.getAttribute("href") === "#") {
        e.preventDefault();
      }

      // Update active state
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      // Close drawer on mobile after clicking a link
      if (window.innerWidth < 768) {
        closeDrawer();
      }
    });
  });

  // Logout buttons
  [logoutBtn, logoutDropdownBtn].forEach((btn) => {
    btn.addEventListener("click", () => {
      if (confirm("Are you sure you want to logout?")) {
        showNotification("Successfully logged out", "success");
        // In a real app, you would redirect to login page
        // window.location.href = "/login";
      }
    });
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Escape key closes everything
    if (e.key === "Escape") {
      closeDrawer();
      notificationDropdown.classList.add("hidden");
      profileDropdown.classList.add("hidden");
    }

    // Ctrl/Cmd + B toggles drawer
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      if (window.innerWidth < 768) {
        if (drawer.classList.contains("-translate-x-full")) {
          openDrawer();
        } else {
          closeDrawer();
        }
      }
    }

    // Ctrl/Cmd + T toggles theme
    if ((e.ctrlKey || e.metaKey) && e.key === "t") {
      e.preventDefault();
      toggleTheme();
    }
  });

  // Close dropdowns on window resize
  window.addEventListener("resize", handleResize);

  // ====== INITIALIZATION ======
  setupTheme();
  handleResize(); // Set initial state

  // Simulate some initial notifications
  setTimeout(() => {
    showNotification("Welcome to Dashboard Pro!", "success");
  }, 1000);
});
