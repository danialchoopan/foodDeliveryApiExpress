const state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    restaurants: [],
    currentView: 'home'
};

const mockRestaurants = [
    { name: 'رستوران نایب', slug: 'nayeb', category: 'کباب', rating: 4.8, image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/64772b97950c4.jpg', description: 'بهترین کباب‌های سنتی' },
    { name: 'پیتزا سیب ۳۶۰', slug: 'sib360', category: 'پیتزا', rating: 4.5, image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/645367123612d.jpg', description: 'پیتزاهای حجیم' },
    { name: 'برگر زغالی', slug: 'charcoal', category: 'برگر', rating: 4.2, image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/644799066666a.jpg', description: 'برگرهای دست‌ساز' }
];

const showView = (viewName) => {
    state.currentView = viewName;
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(`${viewName}-view`);
    if (target) target.classList.remove('hidden');
    if (viewName === 'home') loadRestaurants();
};

const loadRestaurants = () => {
    const grid = document.getElementById('restaurants-grid');
    if (!grid) return;
    grid.innerHTML = mockRestaurants.map(r => `
        <div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer restaurant-card" onclick="viewRestaurant('${r.slug}')">
            <img src="${r.image}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex justify-between mb-2"><h4 class="text-xl font-bold">${r.name}</h4><span class="bg-gray-100 px-2 py-1 rounded-lg text-xs">${r.category}</span></div>
                <p class="text-gray-500 text-sm mb-4">${r.description}</p>
                <div class="flex justify-between items-center"><span class="text-yellow-500 font-bold">${r.rating} ★</span><span class="text-primary text-xs">مشاهده منو</span></div>
            </div>
        </div>
    `).join('');
};

const viewRestaurant = (slug) => {
    const r = mockRestaurants.find(m => m.slug === slug);
    const view = document.getElementById('restaurant-view');
    showView('restaurant');
    view.innerHTML = `
        <button onclick="showView('home')" class="text-primary font-bold mb-4">← بازگشت</button>
        <div class="bg-white rounded-3xl p-8 shadow-sm mb-8 flex gap-8">
            <img src="${r.image}" class="w-48 h-48 rounded-2xl object-cover">
            <div><h2 class="text-3xl font-bold mb-2">${r.name}</h2><p class="text-gray-500">${r.description}</p></div>
        </div>
        <h3 class="text-2xl font-bold mb-6 border-r-4 border-primary pr-3">منوی غذاها</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between">
                <div><h4 class="font-bold">غذای ویژه ۱</h4><p class="text-primary font-bold mt-2">۱۸۵,۰۰۰ تومان</p></div>
                <button class="bg-gray-100 text-primary p-2 rounded-xl">+</button>
            </div>
        </div>
    `;
};

const showLogin = () => document.getElementById('login-modal').classList.replace('hidden', 'flex');
const closeModal = () => document.getElementById('login-modal').classList.replace('flex', 'hidden');
const performLogin = () => {
    state.user = { user: { fullName: 'کاربر تستی' }, token: 'mock-token' };
    updateUserUI();
    closeModal();
};

const updateUserUI = () => {
    const menu = document.getElementById('user-menu');
    if (state.user && menu) menu.innerHTML = `<span class="font-medium">${state.user.user.fullName}</span>`;
};

window.onload = () => {
    updateUserUI();
    loadRestaurants();
};

window.showView = showView;
window.viewRestaurant = viewRestaurant;
window.showLogin = showLogin;
window.closeModal = closeModal;
window.performLogin = performLogin;
window.loadRestaurants = loadRestaurants;
window.searchRestaurants = () => loadRestaurants();
