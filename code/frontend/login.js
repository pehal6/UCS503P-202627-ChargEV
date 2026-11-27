document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorAlert = document.getElementById('login-error');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      // Hide error alert initially
      if (errorAlert) {
        errorAlert.classList.add('d-none');
        errorAlert.textContent = '';
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('isLoggedIn', 'true');
          window.location.href = 'index.html';
        } else {
          const message = data.message || 'Invalid Credentials';
          if (errorAlert) {
            errorAlert.textContent = message;
            errorAlert.classList.remove('d-none');
          } else {
            alert(message);
          }
        }
      } catch (err) {
        console.error(err);
        const serverError = 'Server error. Make sure node server.js is running.';
        if (errorAlert) {
          errorAlert.textContent = serverError;
          errorAlert.classList.remove('d-none');
        } else {
          alert(serverError);
        }
      }
    });
  }
});