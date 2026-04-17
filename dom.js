const CUPON_COD = "DESC30";
let editIndex = null;

window.onload = mostrarProductos;

// VALIDAR URL
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// MENSAJE
function showMessage(text, type) {
    let msg = document.getElementById("message");

    msg.textContent = text;
    msg.className = "message " + type;
    msg.style.opacity = "1";

    setTimeout(() => {
        msg.style.opacity = "0";
    }, 2500);
}

// LOCAL STORAGE
function obtenerProductos() {
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
    let cupon = document.getElementById("cupon").value;

    if (!isValidURL(image)) {
        alert("Ingresa una URL válida");
        return;
    }

    if (!title || !description || isNaN(price)) {
        alert("Completa todos los campos");
        return;
    }

    let finalPrice = (cupon === CUPON_COD) ? price * 0.7 : price;

    let productData = {
        image,
        title,
        description,
        price,
        finalPrice,
        hasDiscount: (cupon === CUPON_COD)
    };

    let products = obtenerProductos();

    if (editIndex !== null) {
        products[editIndex] = productData;
        showMessage("Producto actualizado", "edit-success");
        editIndex = null;
        document.getElementById("btnGuardar").textContent = "Guardar";
    } else {
        products.push(productData);

        if (productData.hasDiscount) {
            showMessage("Producto guardado con descuento ", "discount-success");
        } else {
            showMessage("Producto guardado correctamente", "success");
        }
    }

    saveProducts(products);
    mostrarProductos();
    clearForm();
}

// MOSTRAR
function mostrarProductos() {
    let container = document.getElementById("productContainer");
    let count = document.getElementById("productCount");

    container.innerHTML = "";
    let products = obtenerProductos();
    count.textContent = products.length;

    products.forEach((p, index) => {
        let card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${p.image}">
            <div class="card-content">
                <h3>${p.title}</h3>
                <p>${p.description}</p>

                ${p.hasDiscount ? `
                    <p>Se aplicó un descuento del 30%</p>
                    <p class="old-price">$${p.price}</p>
                    <span class="badge">30% OFF</span>
                    <p class="price">$${p.finalPrice}</p>
                ` : `
                    <p class="price">$${p.price}</p>
                `}

                <button class="edit-btn" onclick="editProduct(${index})">Editar</button>
                <button class="delete-btn" onclick="deleteProduct(${index})">Eliminar</button>
            </div>
        `;

        container.appendChild(card);
    });
}

// EDITAR
function editProduct(index) {
    let product = obtenerProductos()[index];

    document.getElementById("image").value = product.image;
    document.getElementById("title").value = product.title;
    document.getElementById("description").value = product.description;
    document.getElementById("price").value = product.price;

    editIndex = index;
    document.getElementById("btnGuardar").textContent = "Actualizar";
}

// ELIMINAR
function deleteProduct(index) {
    let products = obtenerProductos();
    products.splice(index, 1);
    saveProducts(products);
    mostrarProductos();

    showMessage("Producto eliminado", "delete-success");
}

// LIMPIAR
function clearForm() {
    document.getElementById("image").value = "";
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("cupon").value = "";
}