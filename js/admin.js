document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('profileName').textContent = sessionStorage.getItem('full_name') || 'Admin';
    document.getElementById('profileEmail').textContent = sessionStorage.getItem('email') || 'Admin Email';
    loadArts();
    loadArtists();
    loadEvents();   
    loadOrders()
    loadArtistNames()
    loadAdmins();
    loadMessages();

    document.getElementById('sortBy').addEventListener('change', function () {
        loadArts(this.value);
    });
});

function loadArts(sort = 'newest') {
    fetch(`php/load_admin.php?sort=${sort}`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('artsTableBody');
            tbody.innerHTML = '';

            data.forEach(art => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${art.id}</td>
                    <td><img src="${art.image}" alt="${art.title}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 5px;"></td>
                    <td>${art.title}</td>
                    <td>${art.price}</td>
                    <td>${new Date(art.created_at).toLocaleDateString()}</td>
                    <td>${new Date(art.updated_at).toLocaleDateString()}</td>
                    <td>${art.artist}</td> 
                    <td style="color: ${art.show == 1 ? 'green' : 'red'}; font-weight: bold;">
                      ${art.show == 1 ? 'Yes' : 'No'}
                    </td>

                    <td>${art.quantity}</td>                   
                    <td>
                        <button onclick="editArt(${art.id})"><span class="ic--outline-edit"></span></button>
                        <button onclick="confirmDelete(${art.id})"><span class="material-symbols--delete"></span></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error("Error loading arts:", err));
}




document.addEventListener('DOMContentLoaded', () => {
    const artForm = document.getElementById('artForm');
    const artModal = document.getElementById('artModal');
    const modalTitle = document.getElementById('modalTitle');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const imageInput = document.getElementById('artImage');
    const imagePreview = document.getElementById('imagePreview');
  
    // Preview selected image
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 150px;">`;
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Handle form submission
    artForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData(artForm);
      const artId = document.getElementById('artId').value;
      const url = artId ? 'php/edit_art.php' : 'php/add_art.php';
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData
        });
  
        const result = await response.json();
        // console.log("Result", result);
  
        if (result.success) {
            document.getElementById('addModal').style.display = 'block';
            document.getElementById('showmsg').textContent = result.message;
          artForm.reset();
          imagePreview.innerHTML = '';
          closeModal();
          loadArts(); 
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        // alert('An error occurred while processing the form.');
        document.getElementById('adminSuccessModal').style.display = 'block';
        document.getElementById('success-message').textContent =   'An error occurred while processing the form.';
      }
    });
  
    // Close modal
    closeModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        artForm.reset();
        imagePreview.innerHTML = '';
        closeModal();
      });
    });
  
    function closeModal() {
      artModal.style.display = 'none';
    }
  });


function editArt(id) {
    fetch(`php/load_art.php?id=${id}`)
        .then(res => res.json())
        .then(art => {
            // Fill form fields with fetched data
            document.getElementById('artId').value = art.id;
            document.getElementById('artTitle').value = art.title;
            document.getElementById('artPrice').value = art.price;
            document.getElementById('artQuantity').value= art.quantity;
            document.getElementById('show').value = art.show;
            const option = document.createElement('option');
            option.value = art.artist_id;
            option.text = art.artist_name;
            option.selected = true;
            document.getElementById('artArtist').appendChild(option);

            document.getElementById('artImage').required = false;
            // Show image preview if available
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = art.image 
                ? `<img src="${art.image}" alt="Art Image" style="max-width: 100px; max-height: 100px; border-radius: 5px;">` 
                : '';

            // Update modal title
            document.getElementById('modalTitle').textContent = 'Edit Art';

            // Show modal
            document.getElementById('artModal').style.display = 'block';
        })
        .catch(err => console.error("Error loading art:", err));
        // document.getElementById('artForm').reset();
}


function confirmDelete(id) {
    document.getElementById('deleteModal').style.display = 'block';
    document.getElementById('confirmDelete').onclick = () => {
        deleteArt(id);
        document.getElementById('deleteModal').style.display = 'none';
    };
    document.getElementById("cancelDelete").onclick= () =>{
        document.getElementById('deleteModal').style.display = 'none';
    }
}

function deleteArt(id) {
    fetch(`php/delete_art.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${id}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            document.getElementById('addModal').style.display = 'block';
            document.getElementById('showmsg').textContent = data.message;
            // alert('Artwork deleted successfully.');
            loadArts(); // refresh the table
        } else {
            alert('Failed to delete: ' + data.message);
        }
    });
    
}

function loadArtistNames() {
    // console.log("Loading artist names...");
    fetch('php/load_artists_names.php')
        .then(res => res.json())
        .then(artists => {
            const artistSelect = document.getElementById('artArtist');
            artistSelect.innerHTML = '<option value="">Select an Artist</option>';
            artists.forEach(artist => {
                const option = document.createElement('option');
                option.value = artist.id;
                option.textContent = artist.name;
                artistSelect.appendChild(option);
            });
        })
        .catch(err => console.error("Error loading artists:", err));
}



//Manage Artists
document.addEventListener('DOMContentLoaded', () => {
    // loadArtists();

    document.getElementById('addArtistBtn').addEventListener('click', () => {
        document.getElementById('artistForm').reset();
        document.getElementById('artistId').value = '';
        document.getElementById('artistModalTitle').textContent = 'Add Artist';
        document.getElementById('artistModal').style.display = 'block';
    });

});

const saveArtist= ()=> {
    const formData = new FormData(document.getElementById('artistForm'))
    const artistId = formData.get('artistId');
    const url =  'php/add_artist.php';


    if (![...formData.entries()].length) {
        document.getElementById('addModal').style.display = 'block';
        document.getElementById('showmsg').textContent ="Please fill in all fields.";
        return;
    }else{
        try{
            fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('adminSuccessModal').style.display = 'block';
                    document.getElementById('success-message').textContent =  data.message;
                    closeArtistModal();
                    loadArtists();
                }
                else{
                    document.getElementById('adminSuccessModal').style.display = 'block';
                    document.getElementById('success-message').textContent =  data.message;
                }
            })
        }
        catch(error ) {console.error('Error:', error)};
    }
};
// 
function loadArtists(sortBy = 'name') {
    fetch(`php/load_artists.php?sort=${sortBy}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#artistsTable tbody');
            tbody.innerHTML = '';
            data.forEach(artist => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${artist.id}</td>
                    <td>${artist.name}</td>
                    <td>${artist.bio}</td>
                    <td>${artist.birth_date}</td>
                    <td>${artist.town}</td>
                    <td>${artist.created_at}</td>
                    <td>
                        <button style="width:40px;" onclick="startArtistDeletion('${artist.name.replace(/'/g, "\\'")}', ${artist.id})"><span class="material-symbols--delete"></span></button>                      
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function startArtistDeletion(name, id){
    // console.log("Deleting artist:", name, id);
    document.getElementById('deleteArtistModal').style.display = 'block';
    document.getElementById('delArtistName').textContent = name;


    document.getElementById('confirmDeleteArtist').onclick = () => {
        deleteArtist(id) ;
        document.getElementById('deleteArtistModal').style.display = 'none';       
    
    }
}




function deleteArtist(id) {
    // console.log("Deleting artist ID:", id);
    fetch('php/delete_artists.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => {

        // alert(data.message);
        if (data.success) {
            document.getElementById('adminSuccessModal').style.display = 'block';
            document.getElementById('success-message').textContent =  data.message;
            loadArtists();
        }
    })
    .catch(error => console.error('Error:', error));
    
}

function closeArtistModal() {
    document.getElementById('artistModal').style.display = 'none';
}



//Schedule and manage events
// Handle opening and closing of event modal
function openEventModal() {
    document.getElementById('eventModal').style.display = 'block';
}

function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
    document.getElementById('eventForm').reset();
}


function loadEvents() {
    fetch('php/load_events.php')
        .then(response => response.json())
        .then(events => {
            const tbody = document.getElementById('eventsTableBody');
            tbody.innerHTML = '';
            events.forEach(event => {
                const row = `<tr>
                    <td>${event.id}</td>
                    <td>${event.name}</td>
                    <td>${event.location}</td>
                    <td>${event.event_date}</td>
                    <td>${event.event_time}</td>
                    <td>${event.host}</td>
                    <td id="url">${event.register_url}</td>
                    <td>${event.added_on}</td>
                    <td>
                        <button style="width:40px;" onclick="editEvent(${event.id})"><span class="ic--outline-edit"></span></button>
                        <button style="width:40px;" onclick="confirmDeleteEvent(${event.id})"><span class="material-symbols--delete"></span></button>
                    </td>
                </tr>`;
                tbody.innerHTML += row;
            });
        });
}

function saveEvent() {
    const formData = new FormData(document.getElementById('eventForm'));
    const artId = document.getElementById('eventId').value;
    const url = artId ? 'php/edit_event.php' : 'php/save_event.php';
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('adminSuccessModal').style.display = 'block';
        document.getElementById('success-message').textContent =  data.message;
        // alert(data.message);
        if (data.success) {
            closeEventModal();
            loadEvents();
        }
    });
}

function editEvent(id) {
    fetch(`php/load_event.php?id=${id}`)
        .then(response => response.json())
        .then(event => {
            document.getElementById('eventId').value = event.id;
            document.getElementById('eventName').value = event.name;
            document.getElementById('eventLocation').value = event.location;
            document.getElementById('eventDate').value = event.event_date;
            document.getElementById('eventTime').value = event.event_time;
            document.getElementById('eventHost').value = event.host;
            document.getElementById('eventRegisterUrl').value = event.register_url;
            openEventModal();
        });
}

function confirmDeleteEvent(id) {
    document.getElementById('deleteEventModal').style.display = 'block';
    document.getElementById('confirmDeleteEvent').onclick = () => deleteEvent(id);
}

function deleteEvent(id) {
    fetch('php/delete_event.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => {
        // alert(data.message);
        if (data.success) {
            document.getElementById('adminSuccessModal').style.display = 'block';
            document.getElementById('success-message').textContent =  data.message;
            document.getElementById('deleteEventModal').style.display = 'none';
            loadEvents();
        }
    });
}


//View Orders
let currentOrderId = null;


let ordersData = [];

function loadOrders() {
    fetch('php/load_orders.php')
        .then(response => response.json())
        .then(data => {
            ordersData = data;
            sortAndRenderOrders('default'); // Default sort
        });
}

function sortAndRenderOrders(criteria) {
    const tbody = document.querySelector("#ordersTable tbody");
    tbody.innerHTML = "";

    let sortedOrders = [...ordersData];

    switch (criteria) {
        case 'user_name':
        case 'art_id':
        case 'quantity':
        case 'total_price':
            sortedOrders.sort((a, b) => {
                if (typeof a[criteria] === 'string') {
                    return a[criteria].localeCompare(b[criteria]);
                }
                return a[criteria] - b[criteria];
            });
            break;

        case 'default':
        default:
            sortedOrders.sort((a, b) => {
                if (a.served !== b.served) {
                    return a.served - b.served; // No (0) before Yes (1)
                }
            
                const dateA = new Date(a.order_date);
                const dateB = new Date(b.order_date);
                return dateB - dateA; // Latest first
            });
            
    }

    sortedOrders.forEach(order => {
        const row = `
            <tr>
                <td>${order.id}</td>
                <td>${order.user_name}</td>
                <td>${order.art_id}</td>
                <td>${order.quantity}</td>
                <td>${order.total_price}</td>
                <td>${order.order_date}</td>
                <td>${order.served == 1 ? 'Yes' : 'No'}</td>
                <td><button style="width:fit-content;" onclick="viewOrder(${order.id})">View</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Bind sort dropdown
document.getElementById('sortSelect').addEventListener('change', function () {
    sortAndRenderOrders(this.value);
});

// Call this once when page loads
loadOrders();



function viewOrder(id) {
    document.getElementById('orderModal').style.display = "block";
    currentOrderId = id;
    fetch(`php/load_order_user_details.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('orderDetails').innerHTML = `
                <p><strong>User:</strong> ${data.user_name} (${data.user_email})</p>
                <p><strong>Art ID:</strong> ${data.art_id}</p>
                <p><strong>Quantity:</strong> ${data.quantity}</p>
                <p><strong>Total Price:</strong> ${data.total_price}</p>
                <p><strong>Order Date:</strong> ${data.order_date}</p>
            `;
            document.getElementById('orderServedStatus').value = data.served ? "1" : "0";
            
        });
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = "none";
    currentOrderId = null;
}

function updateOrderStatus() {
    const servedValue = document.getElementById('orderServedStatus').value;
    fetch('php/edit_order_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentOrderId, served: servedValue })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('adminSuccessModal').style.display = 'block';
        document.getElementById('success-message').textContent =  data.message;
        // alert(data.message);
        closeOrderModal();
        loadOrders();
    });
}



//Load charts and reports

    function showReportsSection() {
        document.getElementById('reports').style.display = 'block';
    
        setTimeout(() => {
            fetch('php/load_reports_data.php')
            .then(response => response.json())
           
            .then(data => {
                renderBarChart('quantityChart', data.quantityOrdered, 'Quantity Ordered' , 'Art Title');
                renderBarChart('totalAmountChart', data.totalAmount, 'Art Title', 'Total Sales');
                renderBarChart('userSpendingChart', data.userSpending, 'User', 'Amount Spent');
                renderPieChart('artistArtCountChart', data.artistArtCount, 'Artist vs Number of Artworks');
                // console.log("Reports Data", response);
            });
        }, 50); // allow layout to stabilize
    }

    function renderBarChart(canvasId, chartData, xLabel, yLabel) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.map(item => item.label),
                datasets: [{
                    label: yLabel,
                    data: chartData.map(item => item.value),
                    backgroundColor: 'rgba(54, 162, 235, 0.7)'
                }]
            },
            options: {
                indexAxis: canvasId === 'quantityChart' ? 'y' : 'x',
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: xLabel
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: yLabel
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function renderPieChart(canvasId, chartData, title) {
        const ctx = document.getElementById(canvasId).getContext('2d');
    
        const colorPalette = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#00C49F', '#FF6666', '#33CCFF', '#FFB347',
            '#FF7F50', '#DA70D6', '#00CED1', '#A52A2A', '#6495ED'
        ];
    
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.map(item => item.label),
                datasets: [{
                    data: chartData.map(item => item.value),
                    backgroundColor: chartData.map((_, i) => colorPalette[i % colorPalette.length])
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: title
                    },
                    datalabels: {
                        color: '#fff',
                        formatter: (value, context) => {
                            const label = context.chart.data.labels[context.dataIndex];
                            return `${label}: ${value}`;
                        },
                        anchor: 'center',
                        align: 'center',
                        font: {
                            weight: 'bold',
                            size: 12
                        },
                        clamp: true
                    },
                    legend: {
                        labels: {
                            boxWidth: 20
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }
    
    function downloadChart(chartId, filename) {
        const canvas = document.getElementById(chartId);
        const image = canvas.toDataURL('image/png');
    
        const link = document.createElement('a');
        link.href = image;
        link.download = `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    

    // Load Admins and manage roles
    function loadAdmins() {
        fetch('php/load_admins.php')
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector("#adminsTable tbody");
                tbody.innerHTML = "";
                data.forEach(admin => {
                    const row = `
                    <tr>
                        <td>${admin.id}</td>
                        <td>${admin.full_name}</td>
                        <td>${admin.email}</td>
                        <td>${admin.role}</td>
                        <td>${admin.registered_on}</td>
                        <td>
                            <button style="width:fit-content;" onclick="openChangeRoleModal(${admin.id}, '${admin.role}')">Dismiss</button>
                    
                        </td>
                    </tr>
                `;
                
                    tbody.innerHTML += row;
                });
            })
            .catch(error => console.error('Error loading admins:', error));
    }

    document.getElementById('addAdminBtn').addEventListener('click', () => {
        document.getElementById('addAdminModal').style.display = 'block';
        document.getElementById('userDetails').style.display = 'none';
        document.getElementById('findUserForm').reset();
    });
    
    document.getElementById('findUserForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('searchEmail').value;
    
        fetch('php/load_user_by_email.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById('userFullName').textContent = data.full_name;
                document.getElementById('userRole').textContent = data.role;
                document.getElementById('userDetails').style.display = 'block';
    
                document.getElementById('makeAdminBtn').onclick = () => {
                    fetch('php/make_admin.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: data.id })
                    })
                    .then(res => res.json())
                    .then(result => {
                        if (result.success) {
                            document.getElementById('addAdminModal').style.display = 'none';
                            // document.getElementById('adminSuccessModal').style.display = 'block';
                            document.getElementById('adminSuccessModal').style.display = 'block';
                            document.getElementById('success-message').textContent = "✅ Admin Added Successfully."; ;
                            loadAdmins(); // Refresh the admin list
                        } else {
                            // alert('Error: ' + result.message);
                            document.getElementById('adminSuccessModal').style.display = 'block';
                            document.getElementById('success-message').textContent = result.message;
                        }
                    });
                };
            } else {
                document.getElementById('adminSuccessModal').style.display = 'block';
                document.getElementById('success-message').textContent = data.message;
                // alert(data.message);
            }
        });
    });
    
    
    function openChangeRoleModal(userId, currentRole) {
        document.getElementById('changeRoleUserId').value = userId;
        document.getElementById('newRole').value = currentRole;
        document.getElementById('changeRoleModal').style.display = 'block';
    }
    
    document.getElementById('changeRoleForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const userId = document.getElementById('changeRoleUserId').value;
        const newRole = document.getElementById('newRole').value;
    
        fetch('php/edit_admin_role.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, new_role: newRole })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // alert('Role updated successfully.');
                document.getElementById('adminSuccessModal').style.display = 'block';
                document.getElementById('success-message').textContent =  "✅ Admin Dismissed Successfully.";
                document.getElementById('changeRoleModal').style.display = 'none';
                loadAdmins();
            } else {
                document.getElementById('adminSuccessModal').style.display = 'block';
                document.getElementById('success-message').textContent = 'Error updating role: ' + result.message;
                // alert('Error updating role: ' + result.message);
            }
        })
        .catch(error => console.error('Error updating role:', error));
    });
    




    async function loadMessages() {
        const container = document.getElementById('messagesContainer');
        container.innerHTML = ''; // Clear previous content
    
        try {
            const response = await fetch('php/load_messages.php');
            const data = await response.json();  // 🛠️ await this
    
            if (data.success) {
                const messages = data.messages;
    
                if (messages.length === 0) {
                    container.innerHTML = '<p style="text-align:center;">No messages found.</p>';
                    return;
                }
    
                messages.forEach(msg => {
                    const card = document.createElement('div');
                    card.style = `
                        padding: 15px;
                        border-radius: 10px;
                        background: ${msg.attended_to == 0 ? '#ff7f50' : '#e5f4e3'};
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        margin-bottom: 10px;
                        width: 95%;
                    `;
    
                    card.innerHTML = `
                        <h3 >Subject: <span style="text-decoration:underline; text-decoration-offset:4px; color:green;">${msg.subject}</span> </h3>
                        <p><strong>From:</strong> ${msg.name} (${msg.email})</p>
                        <p>${msg.message}</p>
                        <p style="font-size: 0.9em; color: green;">Received: ${new Date(msg.created_at).toLocaleString()}</p>
                        <p>Reply: <a href="mailto:${msg.email}">${msg.email}</a> </p>
                        <div style="position:relative; height:55px; display:flex; flex-direction:column; align-items:right; margin-left:70%;">
                            <div style="position:relative; height:55px; border:4px solid red; width:300px;">
                                <label style="font-weight: bold; position: absolute;  right: 10px; top:0px; display:block; color:black;   ">                            
                                ${msg.attended_to == 1 ? 'ALREADY ATTENDED TO' : 'Click Below To Mark as Attended to'}
                                 </label>
                                <input   style=" position: absolute;  right: 20px;  top: 20px; width: 15px; height: 15px; accent-color: #28a745; cursor: pointer; transform: scale(1.5);
                                    "type="checkbox" class="attendCheckbox" data-id="${msg.id}" ${msg.attended_to == 1 ? 'checked' : ''}>
                            </div>
                        </div>

                    `;
                    // console.log(msg.id);
    
                    container.appendChild(card);
                });
    
                // Optionally attach checkbox change event here
                document.querySelectorAll('.attendCheckbox').forEach(checkbox => {
                    checkbox.addEventListener('change', async (e) => {
                        const messageId = e.target.dataset.id;
                        const isChecked = e.target.checked;
                        console.log("Checkbox changed for message ID:", messageId, "Checked:", isChecked);
                        
                        try{
                            const res = await fetch('php/edit_attended_to.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: messageId, attended_to: isChecked ? 1 : 0 })
                            });
        
                            const result = await res.json();
                            if (result.success) {
                                document.getElementById('adminSuccessModal').style.display = 'block';
                                document.getElementById('success-message').textContent =  "✅ The Message's Attended-to Status updated Successfully.";
                                loadMessages(); // Refresh messages
                            
                            } else {
                                // alert("Failed to update status.");
                                console.log(result.message)
                                document.getElementById('adminSuccessModal').style.display = 'block';
                                document.getElementById('success-message').textContent =  " Failed to update status.";
                            }

                    }catch (error) {
                        console.error('Error updating status:', error);
                        // alert('An error occurred while updating the status.');
                        document.getElementById('adminSuccessModal').style.display = 'block';
                        document.getElementById('success-message').textContent =  " An error occurred while updating the status.";
                    }
                });
                });
    
            } else {
                container.innerHTML = `<p style="color:red;">${data.message}</p>`;
            }
    
        } catch (err) {
            console.error(err);
            container.innerHTML = '<p style="color:red;">An error occurred while loading messages.</p>';
        }
    }
    

