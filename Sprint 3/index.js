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
    registerNavBtn.addEventListener('click', () => {
      window.location.href = 'register.html';
    });
  }

  const loginNavBtn = document.getElementById('login-button');
  if (loginNavBtn) {
    loginNavBtn.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  }

  const medicalInfoNavBtn = document.getElementById('medical-info-button');
  if (medicalInfoNavBtn) {
    medicalInfoNavBtn.addEventListener('click', () => {
      window.location.href = 'medical-info.html';
    });
  }

  const healthGoalsNavBtn = document.getElementById('health-goals-button');
  if (healthGoalsNavBtn) {
    healthGoalsNavBtn.addEventListener('click', () => {
      window.location.href = 'health-goals.html';
    });
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
      const emailTaken = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      const usernameTaken = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
      if (emailTaken) {
        alert('that email is already registered.');
        return;
      }
      if (usernameTaken) {
        alert('that username is already taken.');
        return;
      }

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
      const user = users.find((u) => u.username === username && u.password === password);

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

    // reopen page, load past values if any
    try {
      const stored = localStorage.getItem('medicalInfo');
      if (stored) {
        const data = JSON.parse(stored);
        if (weightInput && data.weight !== undefined) {
          weightInput.value = data.weight;
        }
        if (heightFeetInput && data.heightFeet !== undefined) {
          heightFeetInput.value = data.heightFeet;
        }
        if (heightInchesInput && data.heightInches !== undefined) {
          heightInchesInput.value = data.heightInches;
        }
        if (ageInput && data.age !== undefined) {
          ageInput.value = data.age;
        }
      }
    } catch (e) {
      // ignore anything else that isn't valid
      console.error('error loading medical info', e);
    }

    medicalInfoSaveBtn.addEventListener('click', () => {
      const weight = Number(String(weightInput?.value ?? '').trim());
      const heightFeet = Number(String(heightFeetInput?.value ?? '').trim());
      const heightInches = Number(String(heightInchesInput?.value ?? '').trim());
      const age = Number(String(ageInput?.value ?? '').trim());

      if (!messageEl) {
        return;
      }

      // validate weight / height / age
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

      if (!Number.isFinite(heightInches) || heightInches < 0 || heightInches > 11) {
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
      messageEl.textContent = 'medical information saved successfully.';
      messageEl.style.color = 'green';
    });
  }

  // --- health goals page ---
  const goalsForm = document.getElementById('health-goals-form');
  const goalsSaveButton = document.getElementById('health-goals-save-button');
  const toggleGoalsButton = document.getElementById('toggle-goals-form-button');
  const goalsMessageEl = document.getElementById('health-goals-message');

  const summaryWeight = document.getElementById('summary-weight');
  const summarySleep = document.getElementById('summary-sleep');
  const summarySteps = document.getElementById('summary-steps');
  const summaryEmpty = document.getElementById('summary-empty-message');

  // Only run this if we're on the health-goals page
  if (goalsForm && goalsSaveButton && toggleGoalsButton) {
    const showForm = () => {
      goalsForm.style.display = 'block';
      if (goalsMessageEl) goalsMessageEl.textContent = '';
    };

    const hideForm = () => {
      goalsForm.style.display = 'none';
    };

    const updateSummaryView = (goals) => {
      if (!summaryWeight || !summarySleep || !summarySteps || !summaryEmpty) return;

      if (!goals) {
        summaryWeight.textContent = '';
        summarySleep.textContent = '';
        summarySteps.textContent = '';
        summaryEmpty.style.display = 'block';
        return;
      }

      summaryWeight.textContent = `Weight goal: ${goals.weight.toFixed(1)} lbs`;
      summarySleep.textContent = `Sleep goal: ${goals.sleepHours} hr ${goals.sleepMinutes} min`;
      summarySteps.textContent = `Step goal: ${goals.steps} steps`;

      summaryEmpty.style.display = 'none';
    };

    const loadGoalsFromStorage = () => {
      const stored = localStorage.getItem('healthGoals');
      if (!stored) {
        updateSummaryView(null);
        toggleGoalsButton.textContent = 'Set Goals';
        return;
      }

      try {
        const goals = JSON.parse(stored);
        updateSummaryView(goals);
        toggleGoalsButton.textContent = 'Change Goals';
      } catch (e) {
        localStorage.removeItem('healthGoals');
        updateSummaryView(null);
        toggleGoalsButton.textContent = 'Set Goals';
      }
    };

    // On first load, show whatever is saved
    loadGoalsFromStorage();

    // Open the form when user clicks Set/Change Goals
    toggleGoalsButton.addEventListener('click', () => {
      const stored = localStorage.getItem('healthGoals');
      if (stored) {
        try {
          const goals = JSON.parse(stored);
          const weightInput = document.getElementById('weight');
          const sleepHoursInput = document.getElementById('sleep-hours');
          const sleepMinutesInput = document.getElementById('sleep-minutes');
          const stepsInput = document.getElementById('steps');

          if (weightInput) weightInput.value = goals.weight;
          if (sleepHoursInput) sleepHoursInput.value = goals.sleepHours;
          if (sleepMinutesInput) sleepMinutesInput.value = goals.sleepMinutes;
          if (stepsInput) stepsInput.value = goals.steps;
        } catch (e) {
          // ignore and leave the form blank
        }
      }
      showForm();
    });

    // Save button logic
    goalsSaveButton.addEventListener('click', () => {
      const weight = parseFloat(document.getElementById('weight')?.value ?? '');
      const sleepHours = parseInt(document.getElementById('sleep-hours')?.value ?? '', 10);
      const sleepMinutes = parseInt(document.getElementById('sleep-minutes')?.value ?? '', 10);
      const steps = parseInt(document.getElementById('steps')?.value ?? '', 10);

      if (!goalsMessageEl) return;

      // BR01: weight > 0
      if (!Number.isFinite(weight) || weight <= 0) {
        goalsMessageEl.textContent = 'Impossible weight (must be greater than 0).';
        return;
      }

      // BR02: sleep > 0 hr 0 min
      if (
        !Number.isFinite(sleepHours) ||
        !Number.isFinite(sleepMinutes) ||
        (sleepHours === 0 && sleepMinutes === 0)
      ) {
        goalsMessageEl.textContent = 'Sleep must be greater than 0 hours 0 minutes.';
        return;
      }

      if (!Number.isFinite(steps) || steps < 0) {
        goalsMessageEl.textContent = 'Steps must be 0 or more.';
        return;
      }

      const goals = { weight, sleepHours, sleepMinutes, steps };

      // Save to localStorage (acts as our local “database”)
      localStorage.setItem('healthGoals', JSON.stringify(goals));

      // Update UI to read-only summary
      updateSummaryView(goals);
      hideForm();
      toggleGoalsButton.textContent = 'Change Goals';

      // Show confirmation message
      goalsMessageEl.textContent = 'Goals updated.';
    });
  }
});
