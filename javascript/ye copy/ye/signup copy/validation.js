const form = document.getElementById('form');

const rules = [
  {
    input: document.getElementById('InputFirstName'),
    error: document.getElementById('firstnameError'),
    validate: (v) => v.trim().length >= 2 ? null : 'First name must be at least 2 characters.',
  },
  {
    input: document.getElementById('InputLastName'),
    error: document.getElementById('lastnameError'),
    validate: (v) => v.trim().length >= 2 ? null : 'Last name must be at least 2 characters.',
  },
  {
    input: document.getElementById('InputEmail'),
    error: document.getElementById('emailError'),
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Please enter a valid email.',
  },
  {
    input: document.getElementById('InputPassword'),
    error: document.getElementById('passwordError'),
    validate: (v) => v.length >= 8 ? null : 'Password must be at least 8 characters.',
  },
  {
    input: document.getElementById('InputPhone'),
    error: document.getElementById('phoneError'),
    validate: (v) => /^\+?[\d\s\-]{7,15}$/.test(v) ? null : 'Please enter a valid phone number.',
  },
  {
    input: document.getElementById('InputAddress'),
    error: document.getElementById('addressError'),
    validate: (v) => v.trim().length >= 5 ? null : 'Please enter a valid address.',
  },
];

// Validate a single field and show/hide its error
function validateField({ input, error, validate }) {
  const message = validate(input.value);
  if (message) {
    error.textContent = message;
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
  } else {
    error.textContent = '';
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
  }
  return !message;
}

// Validate on each input event (live feedback)
rules.forEach((rule) => {
  rule.input.addEventListener('input', () => validateField(rule));
});

// Block submission if any field is invalid
form.addEventListener('submit', (e) => {
  const allValid = rules.every((rule) => validateField(rule));
  if (!allValid) e.preventDefault();
});