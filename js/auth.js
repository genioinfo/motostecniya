// Función para manejar el inicio de sesión
async function handleLogin(event) {
  event.preventDefault();
  console.log('Intentando iniciar sesión...');
  
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
      console.log('Login exitoso:', data);
      // Guardar el token en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirigir según el tipo de usuario
      console.log('Usuario autenticado:', data.user);
      if (data.user.type === 'mecanico') {
        window.location.href = './mecanico.html';
      } else {
        window.location.href = './dashboard.html';
      }
    } else {
      alert(data.message || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error('Error detallado:', error);
    if (error.message.includes('Failed to fetch')) {
      alert('Error al conectar con el servidor. Asegúrate de que el servidor backend esté ejecutándose en http://localhost:3000');
    } else {
      alert('Error al iniciar sesión: ' + error.message);
    }
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

  console.log('Intentando registrar usuario:', { email, nombre, apellido, telefono });
  
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
      // Guardar el token en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = './dashboard.html';
    } else {
      alert(data.message || 'Error al registrar usuario');
    }
  } catch (error) {
    console.error('Error detallado:', error);
    if (error.message.includes('Failed to fetch')) {
      alert('Error al conectar con el servidor. Asegúrate de que el servidor backend esté ejecutándose en http://localhost:3000');
    } else {
      alert('Error al registrar usuario: ' + error.message);
    }
  }
}
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
      // Guardar el token en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirigir según el tipo de usuario
      if (data.user.type === 'mecanico') {
        window.location.href = '/mecanico.html';
      } else {
        window.location.href = '/dashboard.html';
      }
    } else {
      alert(data.message || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al conectar con el servidor');
    console.error('Error:', error);
    alert('Error al conectar con el servidor');
  }
}

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