// App State
const state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    restaurants: [],
    cart: [],
};

const mockRestaurants = [
    {
        name: 'رستوران نایب',
        slug: 'nayeb',
        description: 'ارائه دهنده بهترین کباب‌های سنتی با برنج ایرانی',
        category: 'کباب',
        rating: 4.8,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/64772b97950c4.jpg'
    },
    {
        name: 'پیتزا سیب ۳۶۰',
        slug: 'sib360',
        description: 'پیتزاهای حجیم و با کیفیت',
        category: 'پیتزا',
        rating: 4.5,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/645367123612d.jpg'
    },
    {
        name: 'برگر زغالی',
        slug: 'charcoal-burger',
        description: 'برگرهای دست‌ساز با گوشت تازه',
        category: 'فست‌فود',
        rating: 4.2,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/644799066666a.jpg'
    }
];

// API Fetcher
const api = async (endpoint, options = {}) => {
    try {
        const res = await fetch(`/api${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                ...(state.user ? { 'Authorization': `Bearer ${state.user.token}` } : {})
            }
        });
        if (!res.ok) throw new Error('API Error');
        return await res.json();
    } catch (err) {
        console.warn('Using mock data:', err);
        if (endpoint.includes('/restaurants')) return mockRestaurants;
        return null;
    }
};

// UI Components
const createRestaurantCard = (restaurant) => `
    <div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group" onclick="viewRestaurant('${restaurant.slug}')">
        <div class="relative h-48 overflow-hidden">
            <img src="${restaurant.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${restaurant.name}">
            <div class="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-xl shadow-sm flex items-center gap-1">
                <span class="font-bold">${restaurant.rating.toFixed(1)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </div>
        </div>
        <div class="p-6">
            <div class="flex justify-between items-start mb-2">
                <h4 class="text-xl font-bold text-gray-800">${restaurant.name}</h4>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">${restaurant.category}</span>
            </div>
            <p class="text-gray-500 text-sm line-clamp-1 mb-4">${restaurant.description || ''}</p>
            <div class="flex items-center gap-4 text-xs font-medium text-gray-600">
                <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>۳۰-۴۵ دقیقه</span>
                </div>
                <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>ارسال رایگان</span>
                </div>
            </div>
        </div>
    </div>
`;

// Actions
window.loadRestaurants = async (params = '') => {
    const home = document.getElementById('home-view');
    const resView = document.getElementById('restaurant-view');
    if (home) home.classList.remove('hidden');
    if (resView) resView.classList.add('hidden');

    const grid = document.getElementById('restaurants-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="animate-pulse bg-white rounded-3xl h-64 shadow-sm border border-gray-100"></div>'.repeat(3);

    const restaurants = await api(`/restaurants?${params}`);
    if (restaurants && restaurants.length > 0) {
        state.restaurants = restaurants;
        grid.innerHTML = restaurants.map(r => createRestaurantCard(r)).join('');
    } else {
        grid.innerHTML = '<p class="col-span-full text-center text-gray-500 py-12">رستورانی یافت نشد.</p>';
    }
};

window.searchRestaurants = () => {
    const query = document.getElementById('search-input').value;
    window.loadRestaurants(`search=${query}`);
};

window.filterByCategory = (cat) => {
    window.loadRestaurants(`category=${cat}`);
};

window.viewRestaurant = async (slug) => {
    let data = await api(`/restaurants/${slug}`);
    if (!data || !data.restaurant) {
        const r = mockRestaurants.find(m => m.slug === slug) || mockRestaurants[0];
        data = {
            restaurant: r,
            menu: [{ title: 'پیشنهاد سرآشپز', items: [{ _id: '1', title: 'غذای نمونه', price: 150000, description: 'توضیحات غذای نمونه' }] }]
        };
    }

    const { restaurant, menu } = data;
    const view = document.getElementById('restaurant-view');
    const home = document.getElementById('home-view');
    if (home) home.classList.add('hidden');
    if (view) {
        view.classList.remove('hidden');
        view.innerHTML = `
            <div class="mb-8">
                <button onclick="loadRestaurants()" class="text-primary font-bold mb-4 flex items-center gap-1">
                     بازگشت به خانه
                </button>
                <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 text-right" dir="rtl">
                    <img src="${restaurant.image}" class="w-full md:w-64 h-48 object-cover rounded-2xl">
                    <div>
                        <h2 class="text-3xl font-bold mb-2">${restaurant.name}</h2>
                        <p class="text-gray-500 mb-4">${restaurant.description}</p>
                        <div class="flex items-center gap-4">
                            <span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg font-bold">${restaurant.rating} ★</span>
                            <span class="text-gray-400">${restaurant.category}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-right" dir="rtl">
                <div class="md:col-span-2 space-y-8">
                    ${menu.map(cat => `
                        <div>
                            <h3 class="text-2xl font-bold mb-4 border-r-4 border-primary pr-3">${cat.title}</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${cat.items.map(item => `
                                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between gap-4">
                                        <div class="flex-grow">
                                            <h4 class="font-bold text-lg mb-1">${item.title}</h4>
                                            <p class="text-gray-500 text-sm mb-3 line-clamp-2">${item.description || ''}</p>
                                            <div class="flex justify-between items-center">
                                                <span class="font-bold text-primary">${item.price.toLocaleString()} تومان</span>
                                                <button class="bg-gray-100 text-primary p-2 rounded-xl hover:bg-primary hover:text-white transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        ${item.image ? `<img src="${item.image}" class="w-24 h-24 object-cover rounded-xl">` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit sticky top-24">
                    <h3 class="text-xl font-bold mb-4">سبد خرید</h3>
                    <div id="cart-items" class="space-y-4 mb-6 text-gray-500 text-center py-8">
                        سبد خرید شما خالی است
                    </div>
                    <button class="w-full bg-primary text-white font-bold py-4 rounded-2xl opacity-50 cursor-not-allowed">تکمیل سفارش</button>
                </div>
            </div>
        `;
    }
};

window.showLogin = () => {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

window.closeModal = () => {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

window.performLogin = async () => {
    const phone = document.getElementById('login-phone').value;
    if (!phone) return alert('لطفا شماره تماس را وارد کنید');

    try {
        const res = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'ali@gmail.com', password: 'password123' })
        });
        if (res && res.token) {
            state.user = res;
            localStorage.setItem('user', JSON.stringify(res));
            updateUserUI();
            window.closeModal();
        }
    } catch (err) {
        alert('خطا در ورود: ' + err.message);
    }
};

const updateUserUI = () => {
    const menu = document.getElementById('user-menu');
    if (state.user && menu) {
        menu.innerHTML = `
            <span class="text-gray-700 font-medium">${state.user.user.fullName}</span>
            <button onclick="logout()" class="text-xs text-gray-400 mr-2">خروج</button>
        `;
    }
};

window.logout = () => {
    state.user = null;
    localStorage.removeItem('user');
    location.reload();
};

window.showPanel = (role) => {
    alert(`انتقال به پنل ${role}... (در حال پیاده‌سازی)`);
};

// Init
window.onload = () => {
    updateUserUI();
    window.loadRestaurants();
};
