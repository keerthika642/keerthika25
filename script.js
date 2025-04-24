document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: "Laptop Pro", category: "Electronics", price: 999.99, rating: 4.7, imageUrl:"https://images.unsplash.com/photo-1511385348-a52b4a160dc2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3" },
        { id: 2, name: "Wireless Mouse", category: "Electronics", price: 25.50, rating: 4.5, imageUrl: "https://t3.ftcdn.net/jpg/13/30/10/54/360_F_1330105426_otttx04lWeuc4Q137WUqRn9GB9dEswiG.jpg" },
        { id: 3, name: "Running Shoes", category: "Apparel", price: 89.90, rating: 4.2, imageUrl: "https://rukminim2.flixcart.com/image/850/1000/xif0q/shoe/r/j/o/-original-imah2urtcrdgzp4k.jpeg?q=90&crop=false" },
        { id: 4, name: "Coffee Maker", category: "Home Goods", price: 49.99, rating: 4.6, imageUrl: "https://images.philips.com/is/image/philipsconsumer/vrs_3048e19ccb6d8759a41a5fb4279b066498d69d0e?&wid=309&hei=309&$jpglarge$" },
        { id: 5, name: "T-Shirt", category: "Apparel", price: 19.99, rating: 4.0, imageUrl: "https://images.meesho.com/images/products/251954560/u7t7t_512.webp" },
        { id: 6, name: "Smartphone X", category: "Electronics", price: 799.00, rating: 4.8, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2WVbzibbdStxyKu9fZT79XIU-cB05EGTVoQ&s" },
        { id: 7, name: "Bookshelf", category: "Home Goods", price: 120.00, rating: 4.3, imageUrl: "https://m.media-amazon.com/images/I/71lpyazUW2L.jpg" },
        { id: 8, name: "Gaming Keyboard", category: "Electronics", price: 75.00, rating: 4.9, imageUrl: "https://m.media-amazon.com/images/I/71eWnvYKN3L._AC_UF1000,1000_QL80_.jpg" },
        { id: 9, name: "Winter Jacket", category: "Apparel", price: 150.00, rating: 4.4, imageUrl: "https://img4.dhresource.com/webp/m/0x0/f3/albu/km/z/21/b4d80e63-a5bb-427e-928b-79f2a08b6247.jpg" },
        { id: 10, name: "Blender", category: "Home Goods", price: 35.75, rating: 3.9, imageUrl: "https://www.allrecipes.com/thmb/7ZONe-XxfkrnfD_8L5bUWxBvC5A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/alr-primary-blenders-rkilgore-0129-04807bd0ae994d2f96aee779c20915dc.jpeg" },
    ];

    const productListContainer = document.getElementById('product-list');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const priceFilter = document.getElementById('price-filter');
    const priceValueDisplay = document.getElementById('price-value');
    const sortSelect = document.getElementById('sort-select');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    let currentFilters = {
        categories: [],
        maxPrice: 1000, // Initialize with default max
        sortBy: 'default'
    };

    // --- Initialization ---

    function initializePage() {
        populateCategoryFilters();
        setupPriceFilter();
        displayProducts(products); // Initial display
        addEventListeners();
    }

    // --- Display Logic ---

    function displayProducts(productsToDisplay) {
        productListContainer.innerHTML = ''; // Clear existing products

        if (productsToDisplay.length === 0) {
            productListContainer.innerHTML = '<p>No products match your criteria.</p>';
            return;
        }

        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p class="category">${product.category}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="rating">Rating: ${product.rating} ★</p>
            `;
            productListContainer.appendChild(productCard);
        });
    }

    // --- Filtering and Sorting Logic ---

    function applyFiltersAndSort() {
        let filteredProducts = [...products]; // Start with all products

        // Apply Category Filter
        const selectedCategories = currentFilters.categories;
        if (selectedCategories.length > 0) {
            filteredProducts = filteredProducts.filter(product =>
                selectedCategories.includes(product.category)
            );
        }

        // Apply Price Filter
        filteredProducts = filteredProducts.filter(product =>
            product.price <= currentFilters.maxPrice
        );

        // Apply Sorting
        const sortBy = currentFilters.sortBy;
        switch (sortBy) {
            case 'rating-desc':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                 filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                 break;
            // case 'default': // No sorting needed or sort by ID
            // filteredProducts.sort((a, b) => a.id - b.id);
            // break;
        }

        displayProducts(filteredProducts);
    }

    // --- Setup UI Elements ---

    function populateCategoryFilters() {
        const categories = [...new Set(products.map(p => p.category))]; // Get unique categories
        categories.sort(); // Sort alphabetically

        categories.forEach(category => {
            const div = document.createElement('div');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `cat-${category.toLowerCase().replace(/\s+/g, '-')}`;
            input.value = category;
            input.classList.add('category-filter');

            const label = document.createElement('label');
            label.htmlFor = input.id;
            label.textContent = category;

            div.appendChild(input);
            div.appendChild(label);
            categoryFiltersContainer.appendChild(div);
        });
    }

    function setupPriceFilter() {
        const maxPriceInData = Math.max(...products.map(p => p.price));
        const roundedMaxPrice = Math.ceil(maxPriceInData / 10) * 10; // Round up to nearest 10 for slider steps
        priceFilter.max = roundedMaxPrice;
        priceFilter.value = roundedMaxPrice; // Set initial value to max
        priceValueDisplay.textContent = `$${roundedMaxPrice}`;
        currentFilters.maxPrice = roundedMaxPrice; // Update filter state
    }

    // --- Event Listeners ---

    function addEventListeners() {
        // Category Filter Change
        categoryFiltersContainer.addEventListener('change', (event) => {
            if (event.target.classList.contains('category-filter')) {
                const checkedBoxes = categoryFiltersContainer.querySelectorAll('.category-filter:checked');
                currentFilters.categories = Array.from(checkedBoxes).map(cb => cb.value);
                applyFiltersAndSort();
            }
        });

        // Price Filter Input (updates live)
        priceFilter.addEventListener('input', () => {
            const value = parseInt(priceFilter.value, 10);
            priceValueDisplay.textContent = `$${value}`;
            currentFilters.maxPrice = value;
            // Debounce or throttle this in a real app for performance if needed
            applyFiltersAndSort();
        });

        // Sort Select Change
        sortSelect.addEventListener('change', () => {
            currentFilters.sortBy = sortSelect.value;
            applyFiltersAndSort();
        });

        // Clear Filters Button
        clearFiltersBtn.addEventListener('click', () => {
            // Reset checkboxes
            categoryFiltersContainer.querySelectorAll('.category-filter:checked').forEach(cb => cb.checked = false);
            // Reset price slider
            priceFilter.value = priceFilter.max;
            priceValueDisplay.textContent = `$${priceFilter.max}`;
            // Reset sort dropdown
            sortSelect.value = 'default';
            // Reset filter state object
             currentFilters = {
                categories: [],
                maxPrice: parseInt(priceFilter.max, 10),
                sortBy: 'default'
            };
            // Re-apply (which will now show all products)
            applyFiltersAndSort();
        });
    }

    // --- Run Initialization ---
    initializePage();

}); // End DOMContentLoaded