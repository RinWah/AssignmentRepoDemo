document.addEventListener("DOMContentLoaded", () => {
  // redirect for register and login pages
  const registerNavBtn = document.getElementById("register-button");
  const loginNavBtn = document.getElementById("login-button");

  if (registerNavBtn) {
    registerNavBtn.addEventListener("click", () => {
      window.location.href = "register.html";
    });
  }

  if (loginNavBtn) {
    loginNavBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  // page-specific buttons
  const registerAccountBtn = document.getElementById("register-account-button");
  if (registerAccountBtn) {
    registerAccountBtn.addEventListener("click", registerUser);
  }

  const loginAccountBtn = document.getElementById("login-account-button");
  if (loginAccountBtn) {
    loginAccountBtn.addEventListener("click", loginFromPage);
  }
});

// helpers
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("users")) || [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// registration handler
function registerUser() {
  const userEmail = document.getElementById("email");
  const userUsername = document.getElementById("username");
  const userPassword = document.getElementById("password");

  const email = userEmail ? userEmail.value.trim() : "";
  const username = userUsername ? userUsername.value.trim() : "";
  const password = userPassword ? userPassword.value.trim() : "";

  if (!email || !username || !password) {
    alert("looks like you didn't fill in all the blanks. try again!");
    return;
  }

  const users = getUsers();
  const duplicate = users.find(u => u.username === username || u.email === email);

  if (duplicate) {
    alert("username/email already taken!");
    return;
  }

  users.push({ email, username, password, healthData: [] });
  saveUsers(users);
  alert("account registration successful.");
}

// login handler
function loginFromPage() {
  const usernameEl = document.getElementById("login-username");
  const passwordEl = document.getElementById("login-password");

  const username = usernameEl ? usernameEl.value.trim() : "";
  const password = passwordEl ? passwordEl.value.trim() : "";

  if (!username || !password) {
    alert("make sure you fill both username and password!");
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", user.username);
    alert(`welcome, ${user.username}!`);
    window.location.href = "homepage.html";
  } else {
    alert("invalid username/password.");
  }
}
