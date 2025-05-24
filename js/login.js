
function Login() {
    const formData = new FormData(document.getElementById('login_form'));
    const registrationMessage = document.getElementById('registration-message');

    fetch('php/login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store admin info in sessionStorage
            sessionStorage.setItem('full_name', data.full_name);
            sessionStorage.setItem('email', data.email);
            
            if(data.role === 'admin') {
                window.location.href = 'admin.html';
            }else{
                window.location.href = 'catalogue.html';
            }
            // Redirect to dashboard 
            
        } else {
            // alert(data.message || 'Invalid username or password.');
            registrationMessage.textContent = data.message || data.error;
            registrationMessage.classList.add('error-message');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        registrationMessage.textContent = data.message || data.error;
        registrationMessage.classList.add('error-message');
        // alert('Something went wrong. Please try again.');
    });
}

