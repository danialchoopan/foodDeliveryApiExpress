const state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    restaurants: [],
    currentView: 'home',
    courierOnline: true
};

const API_BASE = '/api';

const mockRestaurants = [
    {
        name: 'رستوران نایب (سهروردی)',
        slug: 'nayeb',
        description: 'ارائه دهنده بهترین کباب‌های سنتی با برنج ۱۰۰٪ ایرانی',
        category: 'کباب',
        rating: 4.8,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/64772b97950c4.jpg',
        menu: [
            { title: 'چلو کباب', items: [
                { title: 'چلو کباب کوبیده مخصوص', price: 320000, description: 'دو سیخ کوبیده ۱۸۰ گرمی + برنج ایرانی' },
                { title: 'چلو کباب لقمه زعفرانی', price: 350000, description: 'یک سیخ لقمه ۲۲۰ گرمی + برنج ایرانی' }
            ]}
        ]
    },
    {
        name: 'پیتزا سیب ۳۶۰ (سعادت‌آباد)',
        slug: 'sib360',
        description: 'تجربه پیتزاهای مثلثی و حجیم با بهترین پنیر موتزارلا',
        category: 'پیتزا',
        rating: 4.6,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/645367123612d.jpg',
        menu: [
            { title: 'پیتزا پنجره‌ای', items: [
                { title: 'پیتزا پپرونی', price: 245000, description: 'پپرونی تند، پنیر فراوان، سس مخصوص' },
                { title: 'پیتزا مخصوص سیب', price: 280000, description: 'ترکیب ژامبون، قارچ، فلفل دلمه و پنیر' }
            ]}
        ]
    },
    {
        name: 'برگر هیزمی ۱۷',
        slug: 'charcoal',
        description: 'برگرهای ذغالی با طعم واقعی گوشت تازه و ادویه خاص',
        category: 'برگر',
        rating: 4.2,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/644799066666a.jpg',
        menu: [
            { title: 'برگرها', items: [
                { title: 'چیزبرگر مخصوص', price: 210000, description: '۱۸۰ گرم گوشت، پنیر گودا، کاهو، گوجه' },
                { title: 'ماشروم برگر', price: 230000, description: 'برگر با سس قارچ و خامه و پنیر اضافه' }
            ]}
        ]
    },
    {
        name: 'سوخاری چاکوچ',
        slug: 'fried',
        description: 'جوجه سوخاری کامل و ترد با ادویه مخصوص و سیب‌زمینی',
        category: 'سوخاری',
        rating: 4.4,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/64819d4547b74.jpg',
        menu: [
            { title: 'مرغ سوخاری', items: [
                { title: 'سوخاری ۲ تکه', price: 195000, description: '۲ تکه سینه یا ران + سیب‌زمینی + نان سیر' },
                { title: 'جوجه کامل سوخاری', price: 420000, description: 'یک عدد جوجه کامل سرخ شده ترد' }
            ]}
        ]
    },
    {
        name: 'آش و حلیم سید مهدی',
        slug: 'iranian',
        description: 'قدیمی‌ترین و با کیفیت‌ترین آش و حلیم تجریش',
        category: 'ایرانی',
        rating: 4.9,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/647585645524b.jpg',
        menu: [
            { title: 'صبحانه و عصرانه', items: [
                { title: 'حلیم مخصوص (یک کیلو)', price: 180000, description: 'با گوشت گوسفندی فراوان و روغن کرمانشاهی' },
                { title: 'آش شله قلمکار', price: 160000, description: 'آش سنتی با حبوبات، سبزی و گوشت لذیذ' }
            ]}
        ]
    }
];

async function fetchAPI(endpoint, options = {}) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (state.user?.token) headers['Authorization'] = `Bearer ${state.user.token}`;

        const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'خطایی رخ داد');
        return data;
    } catch (err) {
        console.warn(`API Error (${endpoint}):`, err.message);
        return null;
    }
}

function showView(viewName) {
    state.currentView = viewName;
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(`${viewName}-view`);
    if (target) target.classList.remove('hidden');

    if (viewName === 'home') renderRestaurants();
    if (viewName === 'admin') loadAdminStats();
    if (viewName === 'vendor') loadVendorOrders();
    if (viewName === 'courier') updateCourierUI();

    window.scrollTo(0,0);
}

async function renderRestaurants() {
    const grid = document.getElementById('restaurants-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="col-span-3 text-center py-10 text-gray-400">در حال دریافت لیست رستوران‌ها...</div>';

    const query = document.getElementById('search-input')?.value || '';
    let url = '/restaurants';
    if (query) url += `?search=${encodeURIComponent(query)}`;

    let list = await fetchAPI(url);
    if (!list || !list.length) {
        list = mockRestaurants;
    }

    grid.innerHTML = list.map(r => `
        <div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer restaurant-card" onclick="viewRestaurant('${r.slug}')">
            <img src="${r.image}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex justify-between mb-2 text-right" dir="rtl">
                    <h4 class="text-xl font-bold text-gray-800">${r.name}</h4>
                    <span class="bg-red-50 text-red-500 px-2 py-1 rounded-lg text-xs font-bold">${r.category}</span>
                </div>
                <p class="text-gray-500 text-sm mb-4 line-clamp-1 text-right" dir="rtl">${r.description}</p>
                <div class="flex justify-between items-center" dir="rtl">
                    <div class="flex items-center gap-1">
                        <span class="text-yellow-500 font-bold">${r.rating || 5.0}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </div>
                    <span class="text-primary text-xs font-bold">مشاهده منو و سفارش ←</span>
                </div>
            </div>
        </div>
    `).join('');
}

async function viewRestaurant(slug) {
    let r = await fetchAPI(`/restaurants/${slug}`);
    if (!r) r = mockRestaurants.find(m => m.slug === slug);
    if (!r) return showView('home');

    const view = document.getElementById('restaurant-view');
    showView('restaurant');
    view.innerHTML = `
        <button onclick="showView('home')" class="text-primary font-bold mb-6 flex items-center gap-1">
            <span>بازگشت به لیست رستوران‌ها</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </button>
        <div class="bg-white rounded-3xl p-8 shadow-sm mb-8 flex flex-col md:flex-row gap-8 text-right" dir="rtl">
            <img src="${r.image}" class="w-full md:w-64 h-48 rounded-2xl object-cover shadow-lg">
            <div>
                <h2 class="text-4xl font-bold mb-2 text-gray-800">${r.name}</h2>
                <p class="text-gray-500 text-lg mb-4">${r.description}</p>
                <div class="flex items-center gap-4">
                    <span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-xl font-bold">${r.rating || 5} ★</span>
                    <span class="bg-gray-100 text-gray-500 px-3 py-1 rounded-xl font-medium">${r.category}</span>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right" dir="rtl">
            <div class="lg:col-span-2 space-y-12">
                ${(r.menu || []).map(cat => `
                    <div>
                        <h3 class="text-2xl font-bold mb-6 border-r-8 border-primary pr-4 text-gray-800">${cat.title}</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            ${(cat.items || []).map(item => `
                                <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-primary/20 transition-colors">
                                    <div class="flex justify-between gap-4 mb-4">
                                        <div>
                                            <h4 class="font-bold text-xl mb-1">${item.title}</h4>
                                            <p class="text-gray-400 text-sm leading-relaxed">${item.description}</p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="font-bold text-2xl text-primary">${item.price.toLocaleString()} <span class="text-sm">تومان</span></span>
                                        <button class="bg-red-50 text-primary w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="hidden lg:block">
                <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
                    <h3 class="text-xl font-bold mb-4 text-gray-800">سبد خرید</h3>
                    <div class="py-12 text-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        <p>هنوز محصولی به سبد خرید اضافه نکرده‌اید</p>
                    </div>
                    <button class="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-2xl cursor-not-allowed">تکمیل سفارش</button>
                </div>
            </div>
        </div>
    `;
}

async function loadAdminStats() {
    const stats = await fetchAPI('/admin/stats');
    if (stats) {
        const containers = document.querySelectorAll('#admin-view h4');
        if (containers.length >= 4) {
            containers[0].innerText = `${stats.data.totalSales.toLocaleString()} تومان`;
            containers[1].innerText = stats.data.todayOrders;
            containers[2].innerText = stats.data.activeRestaurants;
            containers[3].innerText = stats.data.onlineCouriers;
        }
    }
}

async function loadVendorOrders() {
    const orders = await fetchAPI('/orders/vendor');
    const container = document.querySelector('#vendor-view .space-y-4');
    if (orders && orders.data && orders.data.length && container) {
        container.innerHTML = orders.data.map(o => `
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                <div>
                    <p class="font-bold">سفارش #${o._id.slice(-4).toUpperCase()}</p>
                    <p class="text-sm text-gray-500">${o.items.length} آیتم - ${o.user.fullName}</p>
                </div>
                <button class="bg-green-500 text-white px-4 py-2 rounded-xl text-sm">تایید و آماده‌سازی</button>
            </div>
        `).join('');
    } else if (container) {
        container.innerHTML = `
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                <div>
                    <p class="font-bold">سفارش #۴۵۶۲</p>
                    <p class="text-sm text-gray-500">۲ عدد پیتزا پپرونی - علی علوی</p>
                </div>
                <button class="bg-green-500 text-white px-4 py-2 rounded-xl text-sm">تایید و آماده‌سازی</button>
            </div>
        `;
    }
}

function updateCourierUI() {
    const container = document.getElementById('courier-view');
    if (!container) return;

    const statusText = state.courierOnline ? 'آنلاین' : 'آفلاین';
    const statusColor = state.courierOnline ? 'green' : 'red';
    const actionText = state.courierOnline ? 'تغییر به آفلاین' : 'تغییر به آنلاین';
    const actionBtnColor = state.courierOnline ? 'red' : 'green';

    container.innerHTML = `
        <h2 class="text-3xl font-bold mb-8">پنل سفیر (پیک)</h2>
        <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
            <div class="w-20 h-20 bg-${statusColor}-100 text-${statusColor}-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${state.courierOnline ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}" />
                </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">وضعیت: ${statusText}</h3>
            <p class="text-gray-500 mb-6">${state.courierOnline ? 'در انتظار دریافت سفارش جدید...' : 'برای دریافت سفارش باید آنلاین شوید'}</p>
            <button onclick="toggleCourierStatus()" class="bg-${actionBtnColor}-100 text-${actionBtnColor}-600 px-8 py-3 rounded-2xl font-bold">${actionText}</button>
        </div>
    `;
}

async function toggleCourierStatus() {
    state.courierOnline = !state.courierOnline;
    // Attempt API call
    await fetchAPI('/auth/status', {
        method: 'PATCH',
        body: JSON.stringify({ isOnline: state.courierOnline })
    });
    updateCourierUI();
}

function showLogin() {
    document.getElementById('login-modal').classList.remove('hidden');
    document.getElementById('login-modal').classList.add('flex');
}
function closeModal() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('login-modal').classList.remove('flex');
}

async function performLogin() {
    const phone = document.getElementById('login-phone').value;
    if (!phone) return alert('لطفا شماره موبایل را وارد کنید');

    const result = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber: phone, otp: '1234' })
    });

    if (result) {
        state.user = result.data;
        localStorage.setItem('user', JSON.stringify(state.user));
    } else {
        state.user = { user: { fullName: 'کاربر دمو' }, token: 'demo-token' };
    }

    updateUserUI();
    closeModal();
}

function updateUserUI() {
    const menu = document.getElementById('user-menu');
    if (state.user && menu) {
        menu.innerHTML = `
            <div class="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl">
                <div class="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                    ${(state.user.user.fullName || 'ک').charAt(0)}
                </div>
                <span class="font-bold text-gray-700">${state.user.user.fullName}</span>
            </div>
        `;
    }
}

window.onload = () => {
    updateUserUI();
    renderRestaurants();
};

window.showView = showView;
window.viewRestaurant = viewRestaurant;
window.showLogin = showLogin;
window.closeModal = closeModal;
window.performLogin = performLogin;
window.toggleCourierStatus = toggleCourierStatus;
window.searchRestaurants = () => renderRestaurants();
renderRestaurants();
