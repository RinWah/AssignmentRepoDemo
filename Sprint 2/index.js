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
  const medicalInfoNavBtn = document.getElementById('medical-info-button');
  if (medicalInfoNavBtn) {
    medicalInfoNavBtn.addEventListener('click', () => (window.location.href = 'medical-info.html'));
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

      // inline-if style password validation
      if (password.length < 6) {
        alert('password must be at least 6 characters long.');
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
// --- medical info page ---
const medicalInfoSaveBtn = document.getElementById('medical-info-save-button');
if (medicalInfoSaveBtn) {
  const weightInput = document.getElementById('weight');
  const heightFeetInput = document.getElementById('height-feet');
  const heightInchesInput = document.getElementById('height-inches');
  const ageInput = document.getElementById('age');
  const messageEl = document.getElementById('medical-info-message');

  // reopen page, save past stuff hehe
  try {
    const stored = localStorage.getItem('medicalInfo');
    if (stored) {
      const data = JSON.parse(stored);
      if (weightInput && data.weight !== undefined) {
        weightInput.value = data.value;
      }
      if (heightFeetInput && data.heightFeet !== undefined) {
        heightFeetInput.gvalue = data.heightFeet;
      }
      if (heightInchesInput && data.HeightInchhes !== undefined) {
        heightInchesInput.value = data.heightInches;
      }
      if (ageInput && data.age !== undefined) {
        ageInput.value = data.age;
      }
    }
    catch {
      // ignore anything else that isn't valid
    }
    medicalInfoSaveBtn.addEventListener('click', () => {
      const weight = Number(String(weightInput?.value ?? '').trim());
      const heightFeet = Number(String(heightFeetInput?.value ?? '').trim());
      const heightInches = Number(String(heightInchesInput?.value ?? '').trim());
      const age = Number(String(ageInput?.value ?? '').trim());

      if(!messageEl) {
        return;
      }
      // vaidate weight
      if (!Number.isFinite(weight) || weight <= 0) {
        messageEl.textContent = 'weight must be a positive number.';
        messageEl.style.color = 'red';
        return;
      }
      if (!Number.isFinite(heightFeet) || heightFeet <= 0 || heightFeet > 8) {
        messageEl.textContent = 'height (feet) must be between 1 and 8.';
        messageEl.style.color = 'red';
        return;
      }
      if(!Number.isFinite(heightInches) || heightInches < 0 || heightInches > 11) { 
        messageEl.textContent = 'height (inches) must be between 0 and 11.';
        messageEl.style.color = 'red';
        return;
      }
      if (!Number.isFinite(age) || age <= 0 || age > 120) {
        messageEl.textContent = 'age must be between 1 and 120.';
        messageEl.style.color = 'red';
        return;
      }
      const medicalInfo = {
        weight,
        heightFeet,
        heightInches,
        age
      };
      localStorage.setItem('medicalInfo', JSON.stringify(medicalInfo));
      // feedback to user to say that it saved everything
      messageEl.textContent = 'Medical info saved successfully.';
      messageEl.style.color = 'green';
    });
  }
}
});
