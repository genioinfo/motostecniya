// Verificar si el usuario está autenticado
document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated()) {
        window.location.href = 'micuenta.html';
        return;
    }

    // Cargar información del usuario
    const user = getUser();
    if (user) {
        document.getElementById('userName').textContent = `${user.nombre} ${user.apellido}`;
    }

    // Cargar citas pendientes
    loadAppointments();
});

// Función para cargar las citas del usuario
async function loadAppointments() {
    try {
        const response = await fetch('http://localhost:3000/api/citas', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (response.ok) {
            const appointments = await response.json();
            displayAppointments(appointments);
        }
    } catch (error) {
        console.error('Error al cargar las citas:', error);
    }
}

// Función para mostrar las citas en la interfaz
function displayAppointments(appointments) {
    const appointmentsList = document.getElementById('appointments-list');
    if (!appointments || appointments.length === 0) {
        appointmentsList.innerHTML = '<p>No tienes citas programadas</p>';
        return;
    }

    appointmentsList.innerHTML = appointments.map(appointment => `
        <div class="appointment-card">
            <h3>${appointment.servicio}</h3>
            <p>Fecha: ${new Date(appointment.fecha).toLocaleDateString()}</p>
            <p>Hora: ${appointment.hora}</p>
            <p>Estado: ${appointment.estado}</p>
        </div>
    `).join('');
}

// Event listeners para los botones de agendar
document.querySelectorAll('.agendar-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const service = e.target.closest('.service-card').querySelector('h3').textContent;
        // Aquí puedes implementar la lógica para agendar el servicio
        alert(`Próximamente podrás agendar el servicio: ${service}`);
    });
});