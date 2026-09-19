// DEV: add, remove or edit products in this list. Images can be local paths or URLs.
const DEFAULT_PRODUCTS = [
    { id: 1, name: 'Rack Nexo', category: 'sala', categoryLabel: 'Sala', price: 'A partir de R$ 3.890', description: 'Linhas leves e armazenamento inteligente para o centro da casa.', image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=900&q=85' },
    { id: 2, name: 'Mesa Orla', category: 'jantar', categoryLabel: 'Jantar', price: 'A partir de R$ 5.240', description: 'Uma mesa generosa, feita para receber sem pressa.', image: 'https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=900&q=85' },
    { id: 3, name: 'Cama Lina', category: 'quarto', categoryLabel: 'Quarto', price: 'A partir de R$ 4.680', description: 'Proporção precisa e aconchego para o seu ritual de descanso.', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85' },
    { id: 4, name: 'Estante Mínima', category: 'sala', categoryLabel: 'Sala', price: 'A partir de R$ 2.950', description: 'Um desenho modular que acompanha suas descobertas.', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=85' },
    { id: 5, name: 'Escrivaninha Cora', category: 'home-office', categoryLabel: 'Home office', price: 'A partir de R$ 2.180', description: 'Concentração e beleza em uma estação feita para você.', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85' },
    { id: 6, name: 'Poltrona Ada', category: 'sala', categoryLabel: 'Sala', price: 'A partir de R$ 2.490', description: 'Curvas acolhedoras para pausas que fazem bem.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85' }
];
let PRODUCTS = JSON.parse(localStorage.getItem('ana-conceito-products')) || DEFAULT_PRODUCTS;

const grid = document.querySelector('#product-grid');
const filters = document.querySelectorAll('.filter');
const modal = document.querySelector('#product-modal');
const adminModal = document.querySelector('#admin-modal');
const productForm = document.querySelector('#product-form');
let activeFilter = 'todos';

function renderProducts(filter = 'todos') {
    activeFilter = filter;
    const visibleProducts = filter === 'todos' ? PRODUCTS : PRODUCTS.filter(product => product.category === filter);
    grid.innerHTML = visibleProducts.map(product => `
        <article class="product-card" data-id="${product.id}" tabindex="0" role="button" aria-label="Ver detalhes de ${product.name}">
            <div class="product-image" style="background-image: url('${product.image}')"><span class="product-tag">${product.categoryLabel}</span></div>
            <div class="product-info"><div><h3>${product.name}</h3><p>${product.categoryLabel}</p></div><span class="product-price">${product.price}</span></div>
        </article>`).join('');
    grid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => openProduct(Number(card.dataset.id)));
        card.addEventListener('keydown', event => { if (event.key === 'Enter') openProduct(Number(card.dataset.id)); });
    });
}

function saveProducts() {
    localStorage.setItem('ana-conceito-products', JSON.stringify(PRODUCTS));
}

function categoryLabel(category) {
    return { sala: 'Sala', jantar: 'Jantar', quarto: 'Quarto', 'home-office': 'Home office' }[category] || category;
}

function renderAdminProducts() {
    document.querySelector('#product-count').textContent = `${PRODUCTS.length} ${PRODUCTS.length === 1 ? 'item' : 'itens'}`;
    document.querySelector('#admin-product-list').innerHTML = PRODUCTS.map(product => `
        <div class="admin-product-row"><div class="admin-product-thumb" style="background-image: url('${product.image}')"></div><div class="admin-product-info"><strong>${product.name}</strong><span>${categoryLabel(product.category)} · ${product.price}</span></div><button class="edit-product" data-id="${product.id}">Editar</button><button class="delete-product" data-id="${product.id}" aria-label="Excluir ${product.name}">×</button></div>`).join('');
    document.querySelectorAll('.edit-product').forEach(button => button.addEventListener('click', () => fillProductForm(Number(button.dataset.id))));
    document.querySelectorAll('.delete-product').forEach(button => button.addEventListener('click', () => deleteProduct(Number(button.dataset.id))));
}

function fillProductForm(id) {
    const product = PRODUCTS.find(item => item.id === id);
    document.querySelector('#product-id').value = product.id;
    document.querySelector('#product-name').value = product.name;
    document.querySelector('#product-category').value = product.category;
    document.querySelector('#product-price').value = product.price;
    document.querySelector('#product-image').value = product.image;
    document.querySelector('#product-description').value = product.description;
    document.querySelector('#form-submit-label').textContent = 'Salvar alterações';
    document.querySelector('#product-name').focus();
}

function clearProductForm() {
    productForm.reset();
    document.querySelector('#product-id').value = '';
    document.querySelector('#form-submit-label').textContent = 'Adicionar produto';
}

function deleteProduct(id) {
    const product = PRODUCTS.find(item => item.id === id);
    if (!window.confirm(`Remover ${product.name} da vitrine?`)) return;
    PRODUCTS = PRODUCTS.filter(item => item.id !== id);
    saveProducts();
    renderProducts(activeFilter);
    renderAdminProducts();
}

function openProduct(id) {
    const product = PRODUCTS.find(item => item.id === id);
    document.querySelector('#modal-image').style.backgroundImage = `url('${product.image}')`;
    document.querySelector('#modal-category').textContent = product.categoryLabel;
    document.querySelector('#modal-title').textContent = product.name;
    document.querySelector('#modal-description').textContent = product.description;
    document.querySelector('#modal-price').textContent = product.price;
    modal.showModal();
}

filters.forEach(filter => filter.addEventListener('click', () => {
    filters.forEach(item => item.classList.remove('active'));
    filter.classList.add('active');
    renderProducts(filter.dataset.filter);
}));
productForm.addEventListener('submit', event => {
    event.preventDefault();
    const id = Number(document.querySelector('#product-id').value);
    const category = document.querySelector('#product-category').value;
    const product = { id: id || Date.now(), name: document.querySelector('#product-name').value.trim(), category, categoryLabel: categoryLabel(category), price: document.querySelector('#product-price').value.trim(), description: document.querySelector('#product-description').value.trim(), image: document.querySelector('#product-image').value.trim() };
    if (id) PRODUCTS = PRODUCTS.map(item => item.id === id ? product : item);
    else PRODUCTS.push(product);
    saveProducts();
    renderProducts(activeFilter);
    renderAdminProducts();
    clearProductForm();
});
document.querySelector('#clear-form').addEventListener('click', clearProductForm);
document.querySelector('.admin-close').addEventListener('click', () => adminModal.close());
adminModal.addEventListener('click', event => { if (event.target === adminModal) adminModal.close(); });
document.addEventListener('keydown', event => {
    if (event.ctrlKey && event.key.toLowerCase() === 'g') {
        event.preventDefault();
        if (adminModal.open) adminModal.close();
        else { renderAdminProducts(); adminModal.showModal(); }
    }
});
document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
document.querySelector('.menu-toggle').addEventListener('click', event => {
    const nav = document.querySelector('.main-nav');
    const open = nav.classList.toggle('open');
    event.currentTarget.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => document.querySelector('.main-nav').classList.remove('open')));
renderProducts();