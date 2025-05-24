function logout() {
    fetch('php/logout.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear sessionStorage
                sessionStorage.clear();

                // Redirect to login page
                window.location.href = 'home.html';
            } else {
                alert('Logout failed.');
            }
        })
        .catch(err => {
            console.error('Logout error:', err);
            alert('Something went wrong.');
        });
}
