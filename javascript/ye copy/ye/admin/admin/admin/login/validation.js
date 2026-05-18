const form = document.getElementById('form');

const rules = [
  {
    input: document.getElementById('inputEmail'),
    error: document.getElementById('emailError'),
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Please enter a valid email.',
  }
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