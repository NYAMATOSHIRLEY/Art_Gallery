
function Login() {
    const formData = new FormData(document.getElementById('login_form'));

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
            

            // Redirect to dashboard 
            window.location.href = 'catalogue.html';
        } else {
            alert(data.message || 'Invalid username or password.');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('Something went wrong. Please try again.');
    });
}

