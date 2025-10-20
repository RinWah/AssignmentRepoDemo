// index.js — feature-parity with inline if checks
document.addEventListener('DOMContentLoaded', () => {

  // --- helpers ---
  const getUsers = () => {
    try {
      const raw = localStorage.getItem('users');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  // --- nav on homepage ---
  const registerNavBtn = document.getElementById('register-button');
  if (registerNavBtn) {
    registerNavBtn.addEventListener('click', () => (window.location.href = 'register.html'));
  }
  const loginNavBtn = document.getElementById('login-button');
  if (loginNavBtn) {
    loginNavBtn.addEventListener('click', () => (window.location.href = 'login.html'));
  }

  // --- register page ---
  const registerBtn = document.getElementById('register-account-button');
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      const email = String(document.getElementById('email')?.value ?? '').trim();
      const username = String(document.getElementById('username')?.value ?? '').trim();
      const password = String(document.getElementById('password')?.value ?? '');

      if (!email || !username || !password) {
        alert('please fill out email, username, and password.');
        return;
      }

      // inline-if style email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('please enter a valid email.');
        return;
      }

      const users = getUsers();
      const emailTaken = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      const usernameTaken = users.some(u => u.username.toLowerCase() === username.toLowerCase());
      if (emailTaken) { alert('that email is already registered.'); return; }
      if (usernameTaken) { alert('that username is already taken.'); return; }

      users.push({ email, username, password });
      saveUsers(users);
      alert('account created! redirecting to login…');
      window.location.href = 'login.html';
    });
  }

  // --- login page ---
  const loginBtn = document.getElementById('login-account-button');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const username = String(document.getElementById('login-username')?.value ?? '').trim();
      const password = String(document.getElementById('login-password')?.value ?? '');

      if (!username || !password) {
        alert('make sure you fill both username and password!');
        return;
      }

      const users = getUsers();
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('loggedInUser', user.username);
        alert(`welcome, ${user.username}!`);
        window.location.href = 'homepage.html';
      } else {
        alert('invalid username/password.');
      }
    });
  }
});
