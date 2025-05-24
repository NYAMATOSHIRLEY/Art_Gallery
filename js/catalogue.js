document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('profileName').textContent = sessionStorage.getItem('full_name') || 'Name';
    document.getElementById('profileEmail').textContent = sessionStorage.getItem('email') || 'Email';
    try{
        fetch('php/load_catalogue.php')
        .then(res => res.json())
        .then(data => {
            console.log("Data", data)
            const artList = document.getElementById('artList');
            artList.innerHTML = '';
            data.forEach(art => {
                const artDiv = document.createElement('div');
                artDiv.className = 'art-item';
                artDiv.setAttribute('data-id', art.id);

                artDiv.innerHTML = `
                    <img src="${art.image}" alt="${art.title}" />
                    <h3>${art.title}</h3>
                    <p style="font-size:12px;">By ${art.artist}</p>
                    <p>Price: KES ${art.price}</p>
                    <div class="quantity-controls" style="display:inline-block;">
                        <button onclick="changeQty(${art.id}, -1)">-</button>
                        <span id="qty-${art.id}">0</span>
                        <button onclick="changeQty(${art.id}, 1)">+</button>
                    </div>
                    <button id="add-to-cart" onclick="addToCart(${art.id})">Add to Cart</button>
                    
                `;
                artList.appendChild(artDiv);
            });
        });
    }
    catch(error){
        console.error("Error loading catalogue: ", error);
    }



    // const cart = {};

    function changeQty(id, delta) {
        const qtySpan = document.getElementById(`qty-${id}`);
        let qty = parseInt(qtySpan.textContent);
        qty = Math.max(0, qty + delta);
        qtySpan.textContent = qty;
    }



    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');

    cartToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent body click from immediately hiding it
        cartSidebar.classList.toggle('cart-visible');
    });

    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
            closeCart();
        }
    });

    function closeCart(){
        cartSidebar.classList.remove('cart-visible');
    }

});


const panel = document.getElementById('eventsPanel');
const trigger = document.getElementById('eventsSection');

document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !trigger.contains(e.target)) {
        closeEvents();
    }
});

function showEvents(){
    const isVisible = panel.style.display === 'block';
    
    panel.style.display = isVisible ? 'none' : 'block';

    if (!isVisible) loadEvents(); // load events only when showing
};



function closeEvents(){
    panel.style.display = 'none';
}

function loadEvents() {
    fetch('php/load_events.php')
        .then(res => res.json())
        .then(events => {
            const list = document.getElementById('eventsList');
            list.innerHTML = ''; // clear previous

            if (events.length === 0) {
                list.innerHTML = '<li>No upcoming events.</li>';
                return;
            }

            console.log("Events", events)
            events.forEach(event => {
                const li = document.createElement('li');
                li.style.cssText = `
                    background-color: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 12px 15px;
                    margin-bottom: 10px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    font-family: Arial, sans-serif;

                `;
                
                li.innerHTML = `
                    <div style="font-size: 18px; font-weight: 700; margin-bottom: 6px; color: #333;">
                        ${event.name}
                    </div>
                    <div style="font-size: 14px; color: #555;">
                        📍 ${event.location}<br>
                        📅 ${event.event_date} ⏰ ${event.event_time}<br>
                        🧑‍💼 Hosted by: ${event.host}<br>
                        
                        <a href="${event.register_url}" target="_blank" style="color: #007BFF; text-decoration: none; cursor: pointer;">
                            Register
                        </a>
                    </div>
                `;
                
                list.appendChild(li);
                
            });
        })
        .catch(err => {
            console.error('Error loading events:', err);
        });
}



