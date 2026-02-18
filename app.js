// OPIE Workwear - Core Interactivity

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const hero = document.querySelector('.hero');

    // 1. Sticky Navigation Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });

    // 1b. Mobile Menu Toggle
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-toggle';
    menuBtn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(menuBtn);

    const navLinks = document.querySelector('.nav-links');
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // 2. Smooth Scroll for links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Hover Parallax for Hero Background (Subtle)
    const heroBg = hero.querySelector('.hero-bg');

    // 3a. Load dynamic background from Admin
    const savedHeroBg = localStorage.getItem('opie-hero-bg');
    if (savedHeroBg && heroBg) {
        heroBg.style.backgroundImage = `linear-gradient(to bottom, rgba(18, 18, 18, 0.4), rgba(18, 18, 18, 0.8)), url('${savedHeroBg}')`;
    }

    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;

        if (heroBg) {
            heroBg.style.transform = `scale(1.1) translate(${xPos}px, ${yPos}px)`;
        }
    });

    // 4. Reveal on Scroll Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // 5. Shopping Cart Logic
    const cartToggle = document.querySelector('.cart-toggle');
    const closeCart = document.querySelector('.close-cart');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalAmount = document.getElementById('cart-total-amount');

    let cart = JSON.parse(localStorage.getItem('opie-cart')) || [];

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                count += item.quantity;

                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${item.img}" class="cart-item-img" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                        <button class="cart-item-remove" data-index="${index}">Eliminar</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }

        cartCount.textContent = count;
        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
        localStorage.setItem('opie-cart', JSON.stringify(cart));
    }

    function addToCart(name, price, img) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, img, quantity: 1 });
        }
        updateCartUI();
        cartDrawer.classList.add('active');
    }

    cartToggle.addEventListener('click', () => cartDrawer.classList.add('active'));
    closeCart.addEventListener('click', () => cartDrawer.classList.remove('active'));

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-item-remove')) {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            updateCartUI();
        }
    });

    // Delegate "Add to Cart" clicks
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-to-cart')) {
            const card = e.target.closest('.card');
            const name = card.querySelector('.card-title').textContent;
            const priceText = card.querySelector('.price-tag').textContent;
            // Handle both $XX.XX and S/. XX.XX PEN formats
            const priceValue = priceText.replace(/[^0-9.]/g, '');
            const price = parseFloat(priceValue);
            const img = card.querySelector('.card-img-src').src;
            addToCart(name, price, img);
        }
    });

    // 6. Dynamic Product Management (Admin Integration)
    const productGrid = document.getElementById('dynamic-products-grid');

    function renderProducts() {
        const customProducts = JSON.parse(localStorage.getItem('opie-custom-products')) || [];

        // Si hay productos custom, los añadimos primero o reemplazamos el catálogo
        if (customProducts.length > 0 && productGrid) {
            // Limpiamos los placeholders si hay productos reales subidos por el admin
            productGrid.innerHTML = '';

            customProducts.forEach(p => {
                const card = document.createElement('div');
                card.className = 'card hoodie-card';
                card.innerHTML = `
                    <div class="hoodie-img-container">
                        <img src="${p.img}" class="card-img-src" alt="${p.name}">
                    </div>
                    <div class="card-content">
                        <div class="card-category" style="color: var(--primary); font-size: 0.7rem; margin-bottom: 0.5rem;">${p.category || 'LANZAMIENTO'}</div>
                        <h3 class="card-title hoodie-title">${p.name}</h3>
                        <p class="price-tag hoodie-price">S/. ${p.price.toFixed(2)} PEN</p>
                        <div class="shopify-button-wrapper" data-product-id="${p.shopifyId || ''}">
                            <button class="btn btn-hoodie-add btn-add-to-cart">Añadir al Carrito</button>
                        </div>
                    </div>
                `;
                productGrid.appendChild(card);
            });
        }
    }

    // 8. Shopify Integration Support
    function checkShopifyIntegration() {
        const domain = localStorage.getItem('opie-shopify-domain');
        const token = localStorage.getItem('opie-shopify-token');

        if (window.ShopifyBuy && domain && token) {
            const client = ShopifyBuy.buildClient({
                domain: domain,
                storefrontAccessToken: token,
            });

            const ui = ShopifyBuy.UI.init(client);

            document.querySelectorAll('.shopify-button-wrapper').forEach(wrapper => {
                const productId = wrapper.dataset.productId;
                if (!productId) return;

                // Ocultamos el botón interno de "Añadir al Carrito" local
                const localBtn = wrapper.querySelector('.btn-add-to-cart');
                if (localBtn) localBtn.style.display = 'none';

                ui.createComponent('product', {
                    id: productId,
                    node: wrapper,
                    moneyFormat: 'S/.%7B%7Bamount%7D%7D',
                    options: {
                        product: {
                            buttonDestination: 'checkout',
                            contents: {
                                img: false,
                                title: false,
                                price: false,
                            },
                        }
                    }
                });
            });
        }
    }

    setTimeout(checkShopifyIntegration, 1000); // Dar tiempo al SDK para cargar

    // 7. Newsletter Logic
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input');
            const email = emailInput.value;

            if (email) {
                let subscribers = JSON.parse(localStorage.getItem('opie-subscribers')) || [];
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('opie-subscribers', JSON.stringify(subscribers));
                    alert("¡Gracias! Te avisaremos de los próximos lanzamientos.");
                } else {
                    alert("Este correo ya está registrado.");
                }
                emailInput.value = '';
            }
        });
    }

    renderProducts();
    updateCartUI();
    console.log('OPIE Workwear Engine Loaded');
});
