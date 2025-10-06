document.addEventListener('DOMContentLoaded', function() {
    const eyeIcon = document.querySelector('.eye-icon');
    const passwordInput = document.querySelector('input[type="password"]');

    eyeIcon.addEventListener('click', function() {
        // Toggle password visibility
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon appearance (optional)
        this.textContent = type === 'password' ? '👁' : '👁‍🗨';
    });
});