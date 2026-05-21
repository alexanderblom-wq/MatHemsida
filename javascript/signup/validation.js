// Hämtar formuläret
const form = document.getElementById('form');

// Regler för validering
// Varje regel har ett input-fält, ett error-element och en validate-funktion
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


// Validerar ett fält och visar/döljer felmeddelande
function validateField({ input, error, validate }) {
  const message = validate(input.value);

  if (message) {
    // Visar felmeddelande
    error.textContent = message;
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
  } else {
    // Tar bort felmeddelande
    error.textContent = '';
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
  }

  return !message;
}

// Lyssnar på input-event för live-validering
rules.forEach((rule) => {
  rule.input.addEventListener('input', () => validateField(rule));
});

// Stoppar formuläret från att skickas om något fält är ogiltigt
form.addEventListener('submit', (e) => {
  const allValid = rules.every((rule) => validateField(rule));
  if (!allValid) e.preventDefault();
});
