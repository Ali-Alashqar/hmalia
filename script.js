// hmalaia.js

// 1. استيراد المنتجات من الملف الخارجي
import { allProducts } from './hmalaia-products.js'; 

let productsPerPage = 20; 
let currentPage = 1;
let currentProducts = [...allProducts]; 

const productGrid = document.getElementById('product-grid');
const searchBar = document.getElementById('search-bar');
const categoryList = document.querySelector('.sticky-sidebar #category-list'); 
const priceSort = document.getElementById('price-sort');
const paginationControls = document.getElementById('pagination-controls');
const productsPerPageSelect = document.getElementById('products-per-page-select');
const pageEndMessage = document.getElementById('page-end-message');


// 1. دالة عرض المنتجات في الواجهة مع الرسالة التوجيهية
function renderProducts(productsToRender) {
    productGrid.style.opacity = '0'; 
    
    const totalPages = Math.ceil(productsToRender.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = productsToRender.slice(startIndex, endIndex);

    setTimeout(() => {
        productGrid.innerHTML = ''; 
        
        if (paginatedProducts.length === 0) {
            productGrid.innerHTML = '<p class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #dc3545; font-size: 1.5em;"><i class="fas fa-exclamation-triangle"></i> لا توجد منتجات مطابقة للمعايير المختارة.</p>';
            pageEndMessage.style.display = 'none';
        } else {
            paginatedProducts.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product-card');
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.price.toFixed(2)} د.أ</p>
                    </div>
                `;
                productGrid.appendChild(card);
            });
            
            // عرض رسالة نهاية الصفحة التوجيهية
            if (currentPage < totalPages) {
                pageEndMessage.innerHTML = `
                    <p>لقد وصلت لنهاية الصفحة الحالية (صفحة ${currentPage} من ${totalPages}).</p>
                    <p>يرجى النقر على زر **"التالي"** لعرض الـ **${productsPerPage}** منتجاً التالية!</p>
                `;
                pageEndMessage.style.display = 'block';
            } else {
                pageEndMessage.innerHTML = `<p><i class="fas fa-check-circle"></i> تم عرض جميع المنتجات المطابقة للفلترة. (${productsToRender.length} منتج)</p>`;
                pageEndMessage.style.display = 'block';
            }
        }
        productGrid.style.opacity = '1';
    }, 50); 
}

// 2. دالة تطبيق البحث والتصفية
function applyFilters() {
    // تحديث عدد المنتجات في الصفحة بناءً على اختيار المستخدم
    productsPerPage = parseInt(productsPerPageSelect.value, 10);
    
    const searchTerm = searchBar.value.trim().toLowerCase();
    const selectedCategoryElement = categoryList.querySelector('.active');
    const selectedCategory = selectedCategoryElement ? selectedCategoryElement.dataset.category : 'all'; 
    const sortValue = priceSort.value;

    let filtered = allProducts.filter(product => {
        const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
        const searchMatch = product.name.toLowerCase().includes(searchTerm);
        return categoryMatch && searchMatch;
    });

    if (sortValue !== 'default') {
        filtered.sort((a, b) => {
            if (sortValue === 'asc') {
                return a.price - b.price; 
            } else {
                return b.price - a.price; 
            }
        });
    }

    currentProducts = filtered;
    currentPage = 1; 
    renderProducts(currentProducts);
    renderPagination();
    
    // تحديث رقم المنتجات المعروضة في خانة "الكل"
    const allCountLi = categoryList.querySelector('[data-category="all"]');
    if (allCountLi) {
        allCountLi.innerHTML = `<i class="fas fa-layer-group"></i> الكل (${allProducts.length})`;
    }
}

// 3. دالة إنشاء Pagination
function renderPagination() {
    const totalPages = Math.ceil(currentProducts.length / productsPerPage);
    paginationControls.innerHTML = '';
    
    if (totalPages <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.classList.add('pagination-btn');
    prevBtn.innerHTML = '<i class="fas fa-arrow-right"></i> السابق';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        currentPage--;
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        renderProducts(currentProducts);
        renderPagination();
    });
    paginationControls.appendChild(prevBtn);

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `الصفحة ${currentPage} من ${totalPages}`;
    pageInfo.style.margin = '0 15px';
    pageInfo.style.fontWeight = 'bold';
    pageInfo.style.color = '#212529'; 
    paginationControls.appendChild(pageInfo);

    const nextBtn = document.createElement('button');
    nextBtn.classList.add('pagination-btn');
    nextBtn.innerHTML = 'التالي <i class="fas fa-arrow-left"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        currentPage++;
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        renderProducts(currentProducts);
        renderPagination();
    });
    paginationControls.appendChild(nextBtn);
}


// 4. معالجة الأحداث (Event Listeners)

searchBar.addEventListener('input', applyFilters);
priceSort.addEventListener('change', applyFilters);
productsPerPageSelect.addEventListener('change', applyFilters); // الاستماع لاختيار عدد المنتجات

categoryList.addEventListener('click', (e) => {
    const targetLi = e.target.closest('li');
    if (targetLi) {
        categoryList.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        targetLi.classList.add('active');
        applyFilters();
    }
});


// عند تحميل الصفحة
applyFilters();