// index.js

// ---------- Helpers for localStorage ----------
function loadUsers() {
  const raw = localStorage.getItem("users");
  return raw ? JSON.parse(raw) : {};
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUserName() {
  return localStorage.getItem("currentUser");
}

function setCurrentUserName(username) {
  localStorage.setItem("currentUser", username);
}

function getCurrentUser() {
  const username = getCurrentUserName();
  if (!username) return null;

  const users = loadUsers();
  return users[username] ?? null;
}

function updateCurrentUser(updater) {
  const username = getCurrentUserName();
  if (!username) return;

  const users = loadUsers();
  if (!users[username]) return;

  users[username] = updater(users[username]);
  saveUsers(users);
}

// ---------- Global helper: press Enter to click a button ----------
function enableEnterKeySubmit(buttonId) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // stop default form submit / page reload
      btn.click();        // behave like clicking the main button
    }
  });
}

// ---------- PAGE DETECTION ----------
document.addEventListener("DOMContentLoaded", () => {
  setupHomepage();
  setupRegisterPage();
  setupLoginPage();
  setupMedicalInfoPage();
  setupHealthGoalsPage();
});

// ---------- HOMEPAGE ----------
function setupHomepage() {
  const registerBtn = document.getElementById("register-button");
  const loginBtn = document.getElementById("login-button");
  const medicalInfoBtn = document.getElementById("medical-info-button");
  const healthGoalsBtn = document.getElementById("health-goals-button");
  const logoutBtn = document.getElementById("logout-button");

  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      window.location.href = "register.html";
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  if (medicalInfoBtn) {
    medicalInfoBtn.addEventListener("click", () => {
      window.location.href = "medical-info.html";
    });
  }

  if (healthGoalsBtn) {
    healthGoalsBtn.addEventListener("click", () => {
      window.location.href = "health-goals.html";
    });
  }

  // Logout button (only exists on pages where you added it)
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      alert("You have been logged out.");
      window.location.href = "login.html";
    });
  }
}

// ---------- REGISTER PAGE ----------
function setupRegisterPage() {
  const registerBtn = document.getElementById("register-account-button");
  if (!registerBtn) return; // not on this page

  const emailInput = document.getElementById("email");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  registerBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!email || !username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    const users = loadUsers();
    if (users[username]) {
      alert("That username is already taken.");
      return;
    }

    users[username] = {
      email,
      password, // note: plain text, only OK for a simple school project
      medicalInfo: null,
      healthGoals: null,
    };

    saveUsers(users);
    setCurrentUserName(username);
    alert("Account created and logged in!");
    window.location.href = "homepage.html";
  });

  // Press Enter to submit register form
  enableEnterKeySubmit("register-account-button");
}

// ---------- LOGIN PAGE ----------
function setupLoginPage() {
  const loginBtn = document.getElementById("login-account-button");
  if (!loginBtn) return; // not on this page

  const usernameInput = document.getElementById("login-username");
  const passwordInput = document.getElementById("login-password");

  loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    const users = loadUsers();
    const user = users[username];

    if (!user || user.password !== password) {
      alert("Invalid username or password.");
      return;
    }

    setCurrentUserName(username);
    alert("Logged in as " + username);
    window.location.href = "homepage.html";
  });

  // Press Enter to submit login form
  enableEnterKeySubmit("login-account-button");
}

// ---------- MEDICAL INFO PAGE ----------
function setupMedicalInfoPage() {
  const saveBtn = document.getElementById("medical-info-save-button");
  if (!saveBtn) return; // not on this page

  const weightInput = document.getElementById("weight");
  const heightFeetInput = document.getElementById("height-feet");
  const heightInchesInput = document.getElementById("height-inches");
  const ageInput = document.getElementById("age");
  const messageP = document.getElementById("medical-info-message");

  const currentUser = getCurrentUser();
  if (!currentUser) {
    messageP.textContent = "You must be logged in to view this page.";
    return;
  }

  // Pre-fill if data exists
  if (currentUser.medicalInfo) {
    const info = currentUser.medicalInfo;
    weightInput.value = info.weight ?? "";
    heightFeetInput.value = info.heightFeet ?? "";
    heightInchesInput.value = info.heightInches ?? "";
    ageInput.value = info.age ?? "";
  }

  saveBtn.addEventListener("click", () => {
    const weight = parseFloat(weightInput.value);
    const heightFeet = parseInt(heightFeetInput.value, 10);
    const heightInches = parseInt(heightInchesInput.value, 10);
    const age = parseInt(ageInput.value, 10);

    if (
      isNaN(weight) ||
      isNaN(heightFeet) ||
      isNaN(heightInches) ||
      isNaN(age)
    ) {
      messageP.textContent = "Please fill in all fields correctly.";
      return;
    }

    updateCurrentUser((user) => ({
      ...user,
      medicalInfo: {
        weight,
        heightFeet,
        heightInches,
        age,
      },
    }));

    messageP.textContent = "Medical information saved!";
  });

  // Press Enter to save medical info
  enableEnterKeySubmit("medical-info-save-button");
}

// ---------- HEALTH GOALS PAGE ----------
function setupHealthGoalsPage() {
  const saveBtn = document.getElementById("health-goals-save-button");
  const toggleBtn = document.getElementById("toggle-goals-form-button");
  if (!toggleBtn) return; // not on this page

  const form = document.getElementById("health-goals-form");
  const summaryWeight = document.getElementById("summary-weight");
  const summarySleep = document.getElementById("summary-sleep");
  const summarySteps = document.getElementById("summary-steps");
  const summaryEmpty = document.getElementById("summary-empty-message");
  const messageP = document.getElementById("health-goals-message");

  const weightInput = document.getElementById("weight");
  const sleepHoursInput = document.getElementById("sleep-hours");
  const sleepMinutesInput = document.getElementById("sleep-minutes");
  const stepsInput = document.getElementById("steps");

  const currentUser = getCurrentUser();
  if (!currentUser) {
    if (messageP) {
      messageP.textContent = "You must be logged in to view this page.";
    }
    if (form) form.style.display = "none";
    return;
  }

  function updateSummaryFromUser(user) {
    if (!user || !user.healthGoals) {
      summaryWeight.textContent = "";
      summarySleep.textContent = "";
      summarySteps.textContent = "";
      summaryEmpty.style.display = "block";
      return;
    }

    const g = user.healthGoals;
    summaryWeight.textContent = `Weight goal: ${g.weight} lbs`;
    summarySleep.textContent = `Sleep goal: ${g.sleepHours} hours ${g.sleepMinutes} minutes`;
    summarySteps.textContent = `Steps goal: ${g.steps} steps`;
    summaryEmpty.style.display = "none";
  }

  // Pre-fill if goals exist
  if (currentUser.healthGoals) {
    const g = currentUser.healthGoals;
    weightInput.value = g.weight ?? "";
    sleepHoursInput.value = g.sleepHours ?? "";
    sleepMinutesInput.value = g.sleepMinutes ?? "";
    stepsInput.value = g.steps ?? "";
  }

  updateSummaryFromUser(currentUser);

  toggleBtn.addEventListener("click", () => {
    if (!form) return;
    const isHidden =
      form.style.display === "none" || form.style.display === "";
    form.style.display = isHidden ? "block" : "none";
    toggleBtn.textContent = isHidden ? "Hide Goals Form" : "Set Goals";
  });

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const weight = parseFloat(weightInput.value);
      const sleepHours = parseInt(sleepHoursInput.value, 10);
      const sleepMinutes = parseInt(sleepMinutesInput.value, 10);
      const steps = parseInt(stepsInput.value, 10);

      if (
        isNaN(weight) ||
        isNaN(sleepHours) ||
        isNaN(sleepMinutes) ||
        isNaN(steps)
      ) {
        messageP.textContent = "Please fill in all fields correctly.";
        return;
      }

      updateCurrentUser((user) => ({
        ...user,
        healthGoals: {
          weight,
          sleepHours,
          sleepMinutes,
          steps,
        },
      }));

      const updatedUser = getCurrentUser();
      updateSummaryFromUser(updatedUser);
      messageP.textContent = "Health goals saved!";
      form.style.display = "none";
      toggleBtn.textContent = "Set Goals";
    });
  }

  // Press Enter to save health goals
  enableEnterKeySubmit("health-goals-save-button");
}
