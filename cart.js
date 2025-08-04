// Cart functionality
class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        this.loadCart();
        this.setupEventListeners();
        this.updateCartDisplay();
    }

    setupEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.cart').forEach(button => {
            button.addEventListener('click', (e) => {
                this.addToCart(e);
            });
        });

        // Cart icon click to show/hide cart
        const cartIcon = document.querySelector('.cart-icon');
        const cartSection = document.querySelector('.cart-section');
        
        if (cartIcon && cartSection) {
            cartIcon.addEventListener('click', () => {
                cartSection.style.display = cartSection.style.display === 'block' ? 'none' : 'block';
            });
        }

        // Quantity controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                const cartItem = e.target.closest('.cart-item');
                const itemId = cartItem.dataset.itemId;
                const isIncrease = e.target.textContent === '+';
                this.updateQuantity(itemId, isIncrease);
            }
        });

        // Remove item buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-btn') && !e.target.closest('.cart-header')) {
                const cartItem = e.target.closest('.cart-item');
                if (cartItem) {
                    const itemId = cartItem.dataset.itemId;
                    this.removeItem(itemId);
                }
            }
        });

        // Clear cart button
        const clearCartBtn = document.querySelector('.cart-header .remove-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }

        // Continue shopping link
        const continueShopping = document.querySelector('.continue-shopping a');
        if (continueShopping) {
            continueShopping.addEventListener('click', (e) => {
                e.preventDefault();
                const cartSection = document.querySelector('.cart-section');
                if (cartSection) {
                    cartSection.style.display = 'none';
                }
            });
        }
    }

    addToCart(event) {
        const productCard = event.target.closest('.product-card');
        const productImage = productCard.querySelector('.product-image');
        const productTitle = productCard.querySelector('h2').textContent;
        const productPrice = productCard.querySelector('.price p').textContent;
        
        // Extract price value (remove "Rs. " and convert to number)
        const priceValue = parseFloat(productPrice.replace('Rs. ', '').replace(',', ''));
        
        // Get image URL (use original image)
        const imageUrl = productImage.getAttribute('data-original');
        
        // Generate unique ID for the item
        const itemId = Date.now() + Math.random();
        
        // Check if item already exists in cart
        const existingItem = this.items.find(item => item.title === productTitle);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: itemId,
                title: productTitle,
                price: priceValue,
                image: imageUrl,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartNotification();
    }

    updateQuantity(itemId, increase) {
        const item = this.items.find(item => item.id == itemId);
        if (item) {
            if (increase) {
                item.quantity += 1;
            } else {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    this.removeItem(itemId);
                    return;
                }
            }
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id != itemId);
        this.saveCart();
        this.updateCartDisplay();
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return this.total;
    }

    updateCartDisplay() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartHeader = document.querySelector('.cart-header h2');
        const subtotalElement = document.querySelector('.subtotal');
        const totalElement = document.querySelector('.total-amount');
        
        if (!cartItemsContainer) return;

        // Update cart header with item count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        if (cartHeader) {
            cartHeader.textContent = `Your Cart (${totalItems} items)`;
        }

        // Clear existing cart items (except header)
        const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
        existingItems.forEach(item => item.remove());

        // Add cart items
        this.items.forEach(item => {
            const cartItemHTML = `
                <div class="cart-item" data-item-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${item.title}</h3>
                        <div class="cart-item-price">Rs. ${item.price.toLocaleString()}.00</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn">+</button>
                        </div>
                        <button class="remove-btn">
                            <i class="ri-delete-bin-line"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });

        // Update totals
        const total = this.calculateTotal();
        if (subtotalElement) {
            subtotalElement.textContent = `Rs. ${total.toLocaleString()}.00`;
        }
        if (totalElement) {
            totalElement.textContent = `Rs. ${total.toLocaleString()}.00`;
        }

        // Update cart icon with item count
        this.updateCartIcon();
    }

    updateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartIcon) {
            // Remove existing badge
            const existingBadge = cartIcon.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            // Add badge if there are items
            if (totalItems > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = totalItems;
                badge.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ff4444;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                `;
                cartIcon.style.position = 'relative';
                cartIcon.appendChild(badge);
            }
        }
    }

    showAddToCartNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'add-to-cart-notification';
        notification.textContent = 'Item added to cart!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Cart();
}); 