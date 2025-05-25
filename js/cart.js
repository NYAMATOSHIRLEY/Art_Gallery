document.addEventListener('DOMContentLoaded', () => {
    fetchCartData();
});

function addToCart(id) {
    const qty = parseInt(document.getElementById(`qty-${id}`).textContent);
    fetch('php/add_to_cart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ art_id: id, quantity: qty })
    })
    .then(res => res.text())
    .then(msg => {
        fetchCartData();
        showMessage(msg);
    });
    
    // console.log("Refetched cart data");
}

const fetchCartData = () =>{
    fetch('php/load_cart.php')
    .then(res => res.json())
    .then(data => {
        // console.log("Cart Data", data)
        const container = document.getElementById('cartItems');
        if (!data.length) {
            container.innerHTML = "<p style='color:white; font-weight:bold;'>Your cart is empty.</p>";
            return;
        }

        let total = 0;
        container.innerHTML = data.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            return `
                <div class="cart-item">
                     <span style="position: absolute; top: 5px; right: 5px; cursor: pointer;" class="lets-icons--close-round-fill" onclick="confirmRemoveFromCart(${item.id}, '${item.title.replace(/'/g, "\\'")}')"></span>
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.title}" />
                    </div>
                    <div class="cart-item-details">
                        <div>
                            <h3>${item.title}</h3>
                            <p class="artist">By ${item.artist}</p>
                        </div>
                        <p>Quantity: ${item.quantity}</p>
                        <p class="total"> Ksh ${itemTotal.toFixed(2)}</p>
            
                    </div>
                </div>
            `;
        }).join('');
        amount = total.toFixed(2);
        container.innerHTML += `<h3 style="color:azure; font-weight:bold; text-align:center;">Total: Ksh ${amount}</h3>`;
        container.innerHTML += ` <button id="customBtn" type="button" style=" margin-left: 30%;" onclick="document.getElementById('payment-popUp').style.display ='block' ">ORDER</button>`
    });
}

function confirmRemoveFromCart(artId, itemName) {
    const message = `Are you sure you want to remove the item ${itemName} from your cart?`;
    const overlay = document.getElementById('deleteModal');
    const warningText = document.getElementById('warning');

    overlay.style.display = 'block';
    warningText.textContent = message;

    // Add event listeners to the buttons
    document.getElementById('confirmDelete').onclick = () => {
        removeFromCart(artId);
        overlay.style.display = 'none';
    };
    document.getElementById('cancelDelete').onclick = () => {
        overlay.style.display = 'none';
    };
}

//Function to remove an item from cart
function removeFromCart(artId) {
    fetch('php/remove_from_cart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ art_id: artId })
    })
    .then(res => res.text())
    .then(msg => {
        showMessage(msg);
        fetchCartData(); // Refresh cart after removal
    });
}


function checkout() {
    window.location.href = "homepage.html";
}

let amount ;
function orderNow(x) {
    // window.location.href = "payment.html";
    document.getElementById('payment-popUp').style.display ='none'
    const message = `Dear Customer, an Mpesa Pin Prompt has been sent to the number ${x}.Please enter your Mpesa pin to complete the transaction amounting to Ksh. ${amount}. ` 
    document.getElementById('cartSidebar').classList.remove('cart-visible');
    showMessage(message);
}

const showPopUpMessage= (msg) =>{
    
    const messagePopUp = document.getElementById('message-popUp-container');
    messagePopUp.style.display= "block";
    messagePopUp.innerHTML = ` <p>${msg}</p>`;
}


function showMessage(message) {
    const overlay = document.getElementById('modalOverlay');
    const popup = document.getElementById('message-popUp-container');
    const messageText = document.getElementById('message-popUpText');

    messageText.textContent = message;
    overlay.style.display = 'block';
    popup.style.display = 'block';


}
