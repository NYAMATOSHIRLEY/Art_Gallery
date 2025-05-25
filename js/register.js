document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const registrationMessage = document.getElementById('registration-message');

    
    // Get password and confirm password values
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password'); // make sure your confirm password input has name="confirm_password"

    // Validate passwords match
    if (password !== confirmPassword) {
        registrationMessage.textContent = 'Passwords do not match.';
        registrationMessage.style.color = 'red';
        return; // stop form submission
    }

    
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
        
        registrationMessage.textContent = data.message || data.error;
        registrationMessage.classList.remove('hidden');
        
        if (data.success) {
            registrationMessage.classList.add('success-message');
            sessionStorage.setItem('full_name', formData.get('full_name'));
            sessionStorage.setItem('email', formData.get('email'));
            setTimeout(() => {
                window.location.href = data.redirect || 'catalogue.html';
            }, 2000);
        } else {
            registrationMessage.classList.add('error-message');
            // registrationMessage.textContent = data.message;
            
        }
    }catch (error) {
        console.error('Registration error:', error);
        registrationMessage.classList.remove('hidden');
        registrationMessage.classList.add('error-message');
        registrationMessage.textContent = 'An Error Occurred . Please try again.';
    }
});