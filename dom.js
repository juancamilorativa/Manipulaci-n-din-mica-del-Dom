const COUPON_CODE = "DESC30";
let editIndex = null;

window.onload = showProducts;

// VALIDAR URL
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// LOCAL STORAGE
function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// AGREGAR / EDITAR
function addProduct() {
    let image = document.getElementById("image").value;
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let price = parseFloat(document.getElementById("price").value);
    let coupon = document.getElementById("coupon").value;

    if (!isValidURL(image)) {
        alert("Ingresa una URL de imagen válida");
        return;
    }

    if (!title || !description || isNaN(price)) {
        alert("Completa todos los campos correctamente");
        return;
    }

    let finalPrice = (coupon === COUPON_CODE) ? price * 0.3 : price;

    let products = getProducts();

    let productData = {
        image,
        title,
        description,
        price: finalPrice
    };

    if (editIndex !== null) {
        // EDITAR
        products[editIndex] = productData;
        editIndex = null;
        document.getElementById("btnGuardar").textContent = "Guardar";
    } else {
        // AGREGAR
        products.push(productData);
    }

    saveProducts(products);
    showProducts();
    clearForm();
}

// MOSTRAR
function showProducts() {
    let container = document.getElementById("productContainer");
    let count = document.getElementById("productCount");

    container.innerHTML = "";

    let products = getProducts();
    count.textContent = products.length;

    products.forEach((product, index) => {
        let card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${product.image}">
            <div class="card-content">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p class="price">$${product.price}</p>
                <button class="edit-btn" onclick="editProduct(${index})">Editar</button>
                <button class="delete-btn" onclick="deleteProduct(${index})">Eliminar</button>
            </div>
        `;

        container.appendChild(card);
    });
}

// EDITAR
function editProduct(index) {
    let products = getProducts();
    let product = products[index];

    document.getElementById("image").value = product.image;
    document.getElementById("title").value = product.title;
    document.getElementById("description").value = product.description;
    document.getElementById("price").value = product.price;

    editIndex = index;

    document.getElementById("btnGuardar").textContent = "Actualizar";
}

// ELIMINAR
function deleteProduct(index) {
    let products = getProducts();
    products.splice(index, 1);
    saveProducts(products);
    showProducts();
}

// LIMPIAR
function clearForm() {
    document.getElementById("image").value = "";
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("coupon").value = "";
}