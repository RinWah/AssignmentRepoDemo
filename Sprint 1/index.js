// redirect button for register button
document.getElementById("register-button").onclick = function() {
    window.location.href = "register.html";
};

// register user
document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.getElementById("register-account-button");
    const loginButton = document.getElementById("login-button");

    if (registerButton) {
        registerButton.addEventListener("click", registerUser);
    }
    if (loginButton) {
        loginButton.addEventListener("click", loginUser);
    }
});

// helper func to help pull all users
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

// helper func to save all users
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// register a new user
function registerUser() {
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !username || !password) {
        alert("looks like you didn't fill in all the blanks. try again!");
        return;
    }

    let users = getUsers();

    // check for duplicates
    const duplicate = users.find(
        u => u.username === username || u.email === email
    );

    if (duplicate) {
        alert("username/email already taken!");
        return;
    }

    // add new user
    users.push({ email, username, password, healthData: [] });
    saveUsers(users);
    alert("account registration successful.");
}

// login
document.addEventListener("DOMContentLoaded", () => {
    const loginAccountButton = document.getElementById("login-account-button");
    if (loginAccountButton) {
        loginAccountButton.addEventListener("click", loginFromPage);
    }
});

function loginFromPage() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!username || !password) {
        alert("make sure you fill both username and password!");
        return;
    }
    
    const users = getUsersr();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", user.username);
        alert("welcome, ${user.username}!");
        window.location.href = "homepage.html"; // redirect page to homepage after logging in
    } else {
        alert("invalid username/password.");
    }
}
// need to add the thing to have it redirect from homepage to login page