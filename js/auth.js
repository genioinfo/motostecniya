// Función para manejar el inicio de sesión
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const contrasena = document.getElementById('contrasena').value;
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, contrasena })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Credenciales incorrectas o usuario no encontrado');
    }
  } catch (error) {
    alert('No se pudo conectar con el servidor. Verifica la conexión.');
  }
}

// Función para manejar el registro de clientes
async function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const contrasena = document.getElementById('contrasena').value;
  const nombre = document.getElementById('nombre')?.value;
  const apellido = document.getElementById('apellido')?.value;
  const telefono = document.getElementById('telefono')?.value;
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email, 
        contrasena,
        nombre: nombre || '',
        apellido: apellido || '',
        telefono: telefono || ''
      })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
  window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'No se pudo registrar el usuario');
    }
  } catch (error) {
    alert('No se pudo conectar con el servidor. Verifica la conexión.');
  }
  } // Closing brace added here
// ...existing code...

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = './micuenta.html';
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

// Función para obtener el token
function getToken() {
  return localStorage.getItem('token');
}

// Función para obtener la información del usuario
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Función para refrescar el token
async function refreshToken() {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch('http://localhost:3000/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data.token;
    } else {
      // Si el token expiró, cerrar sesión
      logout();
      return null;
    }
  } catch (error) {
    console.error('Error al refrescar el token:', error);
    return null;
  }
}

// Configurar intervalo para refrescar el token cada 23 horas
setInterval(async () => {
  if (isAuthenticated()) {
    await refreshToken();
  }
}, 23 * 60 * 60 * 1000); // 23 horas en milisegundos

// Agregar listeners si el DOM tiene los formularios
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
});