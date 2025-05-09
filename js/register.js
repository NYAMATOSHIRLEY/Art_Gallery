document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const registrationMessage = document.getElementById('registration-message');
    
    try {
        const response = await fetch('php/register.php', {
            method: 'POST',
            body: formData
        });
        console.log("Response", response)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        registrationMessage.textContwent = data.message || data.error;
        registrationMessage.classList.remove('hidden');
        
        if (data.success) {
            registrationMessage.classList.add('success-message');
            sessionStorage.setItem('full_name', formData.get('full_name'));
            sessionStorage.setItem('email', formData.get('email'));
            setTimeout(() => {
                window.location.href = data.redirect || 'login.html';
            }, 2000);
        } else {
            registrationMessage.classList.add('error-message');
        }
    }catch (error) {
        console.error('Registration error:', error);
        registrationMessage.textContent = 'Registration failed. Please try again.';
        registrationMessage.classList.remove('hidden');
        registrationMessage.classList.add('error-message');
    }
});