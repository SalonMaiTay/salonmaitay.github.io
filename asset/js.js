// ==========================================
// 1. CẤU HÌNH THƯƠNG HIỆU CỐ ĐỊNH (BẤT BIẾN BẰNG JS)
// ==========================================
const BRAND_CONFIG = {
    general: {
        name: "Mai Tây Hair Salon",
        slogan: "Premium Hair Studio",
        rating: "5.0",
        version: "v1.0.3" // Đổi số version này khi cần trình duyệt khách hàng xóa sạch cache cũ
    },
    contact: {
        phoneDisplay: "0909 123 456",
        phoneLink: "0909123456",
        zaloLink: "https://zalo.me/0909123456"
    }
};

// Cấu hình Fallback dự phòng (Chỉ sử dụng khi thiết lập trên Firestore bị trống hoặc mất kết nối mạng)
const FALLBACK_DYNAMIC_CONFIG = {
    maintenanceMode: false,
    bookingIntervalMinutes: 30,
    fallbackOpenTime: "08:00",
    fallbackCloseTime: "20:00",
    heroBlock: {
        sliderImages: ["./asset/images/BGMT.jpg", "./asset/images/BGMT.jpg"],
        isFlashSale: true, 
        normalBooking: { title: "Trải Nghiệm Đẳng Cấp", desc: "Đặt lịch để giữ chỗ ngay hôm nay.", btnText: "ĐẶT LỊCH NGAY", icon: "fa-calendar-check" },
        flashSale: { title: "Flash Sale Đặc Quyền Vip", desc: "Giảm ngay 50% cho 5 khách hàng đặt lịch sớm nhất trong ngày. Giữ chỗ ngay trước khi kết thúc!", btnText: "SĂN DEAL NGAY", endTime: "2026-05-25T23:59:59" }
    },
    homeFeatures: {
        categories: [
            { icon: "fa-scissors", name: "Cắt" },
            { icon: "fa-fill-drip", name: "Nhuộm" },
            { icon: "fa-wind", name: "Uốn" },
            { icon: "fa-spa", name: "Phục hồi" }
        ],
        marqueeTexts: [
            { text: "🎉 Chào mừng bạn đến với hệ thống Mai Tây Hair Salon", isHighlight: true },
            { text: "✨ Trải nghiệm dịch vụ làm đẹp đẳng cấp 5 sao", isHighlight: false },
            { text: "🔥 Đang có Flash Sale cực sốc - Đặt lịch ngay!", isHighlight: true }
        ]
    },
    offers: [
        { type: "Ưu đãi", title: "Giảm 20% Dịch Vụ Hóa Chất", desc: "Áp dụng cho hóa đơn từ 500k trở lên. Nhập mã lúc thanh toán.", code: "MAITAY20", gradient: "from-slate-500 to-slate-800", icon: "fa-gift" },
        { type: "Voucher", title: "Miễn Phí Hấp Phục Hồi Keratin", desc: "Dành riêng cho khách hàng lần đầu tiên sử dụng dịch vụ.", code: "NEWBIE", gradient: "from-rose-500 to-rose-800", icon: "fa-ticket" }
    ],
    feed: [
        { isVideo: true, url: "https://res.cloudinary.com/dt8zhfng8/video/upload/v1778504963/cobek2edjzufp98eknbp.mp4", img: "https://res.cloudinary.com/dt8zhfng8/video/upload/v1778504963/cobek2edjzufp98eknbp.mp4", fomoText: "Sắp hết chỗ", fomoIcon: "fa-bolt", title: "Kiểu uốn layer bồng bềnh tự nhiên chuẩn Hàn Quốc cho các nàng công sở" },
        { isVideo: true, url: "https://res.cloudinary.com/dt8zhfng8/video/upload/q_auto/f_auto/v1778505437/ghgxwzhekglanycyx9p6.mp4", img: "https://res.cloudinary.com/dt8zhfng8/video/upload/q_auto/f_auto/v1778505437/ghgxwzhekglanycyx9p6.mp4", fomoText: "Sắp hết chỗ", fomoIcon: "fa-bolt", title: "Kiểu uốn layer bồng bềnh tự nhiên chuẩn Hàn Quốc cho các nàng công sở" }
    ],
    store: [
        { id: 'P1', name: 'by Hunq', sub: 'Design & Build', brand: 'Hunq', price: 'Liên hệ', desc: 'Gói thiết kế & phát triển Web App chuyên nghiệp, tối ưu hóa UI/UX.', themeColor: '#f59e0b', img: '/Asset/logo/logo.png' },
        { id: 'P2', name: 'Pro Premium', sub: 'System Architecture', brand: 'Hunq', price: 'Liên hệ', desc: 'Xây dựng hệ thống quản lý toàn diện với hiệu suất cao.', themeColor: '#06b6d4', img: '/Asset/logo/logo.png' }
    ]
};

// Hợp nhất cấu hình khởi chạy tổng thể cho SPA Client
let appConfig = { ...BRAND_CONFIG, ...FALLBACK_DYNAMIC_CONFIG };

// ==========================================
// 2. IMPORT FIREBASE SERVICES MODULES
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getFirestore, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, collection, query, where, orderBy, onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, 
    GoogleAuthProvider, sendPasswordResetEmail, onAuthStateChanged, updateProfile, signOut,
    updatePassword, EmailAuthProvider, reauthenticateWithCredential, getRedirectResult
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCTnDNOzI-8JYFfrxtJclFxe7vY27PM6FU",
    authDomain: "salon-mt.firebaseapp.com",
    projectId: "salon-mt",
    storageBucket: "salon-mt.firebasestorage.app",
    messagingSenderId: "1086041756251",
    appId: "1:1086041756251:web:5f7c4cc7144cc59be8a57e",
    measurementId: "G-3BV9HNVP29"
};

const app = initializeApp(firebaseConfig);
const firebaseDb = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Webhook URL kết nối tới file Code.gs phụ trách xử lý Calendar/Gmail Worker
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbwYOUR_NEW_DEPLOYMENT_ID/exec'; 

// ==========================================
// 3. GLOBAL VARIABLES & WINDOW BINDINGS
// ==========================================
let db = { branches: [], services: [], staff: [] };
let selection = { branch: null, service: null, staff: null, date: null, time: null };
let currentStep = 1, countdownInterval, currentSlide = 0;

window.switchTab = switchTab; 
window.switchBookingSubTab = switchBookingSubTab;
window.nextStep = nextStep; 
window.prevStep = prevStep;
window.selectBranch = selectBranch; 
window.selectService = selectService; 
window.selectStaff = selectStaff;
window.selectDate = selectDate; 
window.jumpToToday = jumpToToday; 
window.selectTime = selectTime;
window.submitBooking = submitBooking; 
window.lookupBooking = lookupBooking; 
window.cancelBooking = cancelBooking;
window.toggleDescription = toggleDescription; 
window.togglePlay = togglePlay;

// ==========================================
// 4. CORE LOADING & REALTIME DATABASE INITIALIZATION
// ==========================================
function startLoadingAnimation() {}
function finishLoadingAnimation() {
    const loadingDiv = document.getElementById('loading'), scissors = document.getElementById('scissorsContainer'), slashLine = document.getElementById('slashLine');
    if (!loadingDiv) return;
    scissors.classList.remove('is-normal-cutting'); scissors.classList.add('is-preparing');
    setTimeout(() => { scissors.classList.remove('is-preparing'); scissors.classList.add('is-snapping'); if(slashLine) slashLine.style.animation = 'slashEffect 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards'; }, 600);
    setTimeout(() => { loadingDiv.classList.add('page-split-active'); }, 700);
    setTimeout(() => { loadingDiv.style.display = 'none'; loadingDiv.remove(); }, 2000);
}

async function init() {
    startLoadingAnimation();
    try {
        // 4.1 Nạp cấu hình tham số đóng mở ca hẹn mặc định (system)
        const sysSnap = await getDoc(doc(firebaseDb, 'MaiTayData/Core/Config', 'system'));
        const systemData = sysSnap.exists() ? sysSnap.data() : FALLBACK_DYNAMIC_CONFIG;

        // 4.2 LẮNG NGHE REALTIME TOÀN BỘ KHỐI CONTENT CMS TỪ TRANG AD.HTML V4
        onSnapshot(doc(firebaseDb, 'MaiTayData/Core/Config', 'cms'), async (cmsSnap) => {
            const cmsData = cmsSnap.exists() ? cmsSnap.data() : FALLBACK_DYNAMIC_CONFIG;
            
            // Hợp nhất dữ liệu động, khóa chặt BRAND_CONFIG ở lớp ngoài cùng
            appConfig = {
                ...FALLBACK_DYNAMIC_CONFIG,
                ...systemData,
                ...cmsData,
                ...BRAND_CONFIG
            };

            // Kiểm tra trạng thái kích hoạt bảo trì khẩn cấp toàn hệ thống
            if (appConfig.maintenanceMode === true) {
                document.body.innerHTML = `
                    <div class="fixed inset-0 bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center z-[999]">
                        <div class="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
                            <i class="fa-solid fa-screwdriver-wrench text-xl text-amber-400"></i>
                        </div>
                        <h1 class="text-xl font-black tracking-tight mb-2 uppercase">${appConfig.general.name}</h1>
                        <p class="text-xs font-bold text-slate-400 max-w-xs leading-relaxed">Hệ thống đang được nâng cấp để tối ưu hóa tính năng. Quý khách vui lòng quay lại sau ít phút.</p>
                    </div>`;
                return;
            }

            // Đồng bộ dữ liệu sạch ra kết xuất toàn bộ UI CMS công khai ngoài màn hình
            applyConfig();
            renderHeroSlider();
            renderDynamicHero();
            renderHomeFeatures();
            renderOffers();
            renderFeed();
            renderStoreView();
        });

        // 4.3 Nạp mảng danh mục Core đặt lịch
        const branchesSnap = await getDocs(collection(firebaseDb, 'MaiTayData/Core/Branches'));
        db.branches = branchesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const servicesSnap = await getDocs(collection(firebaseDb, 'MaiTayData/Core/Services'));
        db.services = servicesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const staffSnap = await getDocs(collection(firebaseDb, 'MaiTayData/Core/Staff'));
        db.staff = staffSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        renderBranches();
        renderDateSelector();

        // Xử lý bộ nhớ đệm Cache Version làm mới mã nguồn
        const currentVersion = appConfig.general.version;
        const localVersion = localStorage.getItem('MAITAY_APP_VERSION');
        if (localVersion && localVersion !== currentVersion) {
            localStorage.setItem('MAITAY_APP_VERSION', currentVersion);
            window.location.replace(`${window.location.href.split('?')[0]}?v=${new Date().getTime()}`);
            return;
        } else if (!localVersion) localStorage.setItem('MAITAY_APP_VERSION', currentVersion);

    } catch (e) {
        console.error("Lỗi đồng bộ cấu hình Firestore: ", e);
        applyConfig(); renderHeroSlider(); renderDynamicHero();
    } finally {
        setTimeout(finishLoadingAnimation, 800);
    }
}

init();

// ==========================================
// 5. COMPONENT RENDER ENGINES (DOM RENDERING)
// ==========================================
function applyConfig() {
    if (document.getElementById('config-salon-name')) document.getElementById('config-salon-name').innerText = appConfig.general.name;
    if (document.getElementById('config-salon-name-docked')) document.getElementById('config-salon-name-docked').innerText = appConfig.general.name;
    
    const textEl = document.getElementById('config-open-hours'); const dotEl = textEl?.previousElementSibling;
    if (textEl && dotEl) {
        textEl.innerText = `Mở cửa từ ${appConfig.fallbackOpenTime || '08:00'} đến ${appConfig.fallbackCloseTime || '20:00'}`;
        dotEl.className = "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"; 
    }
    const cleanPhone = String(appConfig.contact.phoneLink).replace(/[^0-9]/g, '');
    if (document.getElementById('config-phone-link')) document.getElementById('config-phone-link').href = "tel:" + cleanPhone;
    if (document.getElementById('config-phone-text')) document.getElementById('config-phone-text').innerText = appConfig.contact.phoneDisplay;
    if (document.getElementById('config-zalo-link')) document.getElementById('config-zalo-link').href = appConfig.contact.zaloLink;
    if (document.getElementById('config-version')) document.getElementById('config-version').innerText = appConfig.general.version;
}

function renderHeroSlider() {
    const container = document.getElementById('heroSliderContainer'); const images = appConfig.heroBlock?.sliderImages || [];
    if (!container || images.length === 0) return;
    container.innerHTML = images.map((img, idx) => `<img src="${img}" id="slide-${idx}" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === 0 ? 'opacity-100' : 'opacity-0'}">`).join('');
    if (images.length > 1) {
        clearInterval(window.heroSliderInterval);
        window.heroSliderInterval = setInterval(() => {
            const currentSlideEl = document.getElementById(`slide-${currentSlide}`);
            if (currentSlideEl) currentSlideEl.classList.replace('opacity-100', 'opacity-0');
            currentSlide = (currentSlide + 1) % images.length;
            const nextSlideEl = document.getElementById(`slide-${currentSlide}`);
            if (nextSlideEl) nextSlideEl.classList.replace('opacity-0', 'opacity-100');
        }, 5000);
    }
}

function renderDynamicHero() {
    const container = document.getElementById('dynamicHeroBlock'); if(!container) return; clearInterval(countdownInterval);
    if (appConfig.heroBlock?.isFlashSale) {
        const conf = appConfig.heroBlock.flashSale;
        container.innerHTML = `<div class="relative overflow-hidden rounded-[1.5rem] p-6 shadow-[0_12px_40px_-10px_rgba(159,18,57,0.4)] border border-rose-900/20 bg-[#2a0410]"><div class="absolute inset-0 bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900"></div><div class="relative z-10 flex justify-between items-start mb-6 gap-3"><div class="flex-1"><div class="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-lg mb-3"><span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span><span class="text-rose-200 text-[8px] font-bold uppercase tracking-widest mt-0.5">Đặc Quyền Vip</span></div><h3 class="text-white text-xl font-black leading-tight tracking-tight">${conf.title}</h3></div><div class="bg-black/20 backdrop-blur-md border border-white/5 rounded-xl p-3 text-center min-w-[75px] shrink-0"><p class="text-[7px] uppercase tracking-[0.2em] font-medium text-rose-200/70 mb-1">Kết thúc sau</p><div class="flex items-center justify-center text-white font-mono text-sm font-bold tracking-wider"><span id="cd-hour">00</span><span class="text-white/30 mx-0.5 pb-0.5">:</span><span id="cd-min">00</span><span class="text-white/30 mx-0.5 pb-0.5">:</span><span id="cd-sec" class="text-rose-300">00</span></div></div></div><p class="relative z-10 text-[11px] text-white/70 font-normal mb-8 leading-relaxed">${conf.desc}</p><button onclick="window.switchTab('booking')" class="relative z-10 w-full bg-white text-rose-950 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex justify-center items-center gap-2">${conf.btnText}</button></div>`;
        const endTime = new Date(conf.endTime).getTime();
        countdownInterval = setInterval(() => {
            const diff = endTime - new Date().getTime();
            if (diff > 0) {
                const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
                if(document.getElementById('cd-hour')) document.getElementById('cd-hour').innerText = String(h).padStart(2, '0');
                if(document.getElementById('cd-min')) document.getElementById('cd-min').innerText = String(m).padStart(2, '0');
                if(document.getElementById('cd-sec')) document.getElementById('cd-sec').innerText = String(s).padStart(2, '0');
            } else clearInterval(countdownInterval);
        }, 1000);
    } else {
        const conf = appConfig.heroBlock?.normalBooking || { title: "Trải Nghiệm", desc: "Đặt lịch hẹn", icon: "fa-calendar-check", btnText: "ĐẶT LỊCH" };
        container.innerHTML = `<div class="bg-white border border-slate-100 rounded-[1.5rem] p-6 flex flex-col items-center text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden"><div class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-sm"><i class="fa-regular ${conf.icon} text-xl text-slate-900"></i></div><h3 class="text-lg font-black mb-2 text-slate-900">${conf.title}</h3><p class="text-[12px] text-slate-500 font-medium mb-6 leading-relaxed">${conf.desc}</p><button onclick="window.switchTab('booking')" class="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800">${conf.btnText}</button></div>`;
    }
}

function renderHomeFeatures() {
    const feat = appConfig.homeFeatures;
    const catContainer = document.getElementById('homeCategoriesGrid');
    if (catContainer && feat?.categories) {
        catContainer.innerHTML = feat.categories.map(c => `<div class="flex flex-col items-center gap-2 cursor-pointer" onclick="window.switchTab('booking')"><div class="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center text-slate-800 text-base active:scale-95 transition-all"><i class="fa-solid ${c.icon}"></i></div><span class="text-[10px] font-black uppercase text-slate-500 tracking-wider text-center">${c.name}</span></div>`).join('');
    }
    const marqueeContainer = document.getElementById('homeMarqueeTextTrack');
    if (marqueeContainer && feat?.marqueeTexts) {
        marqueeContainer.innerHTML = feat.marqueeTexts.map(m => `<span class="inline-flex items-center mx-4 gap-2 text-[11px] uppercase tracking-widest font-black ${m.isHighlight ? 'text-slate-950 bg-slate-100 px-3 py-1 rounded-lg border' : 'text-slate-400'}">${m.text}</span>`).join('');
    }
}

function renderOffers() {
    const container = document.getElementById('homeOffersContainer'); if (!container || !appConfig.offers) return;
    container.innerHTML = appConfig.offers.map(off => `<div class="shrink-0 w-[290px] rounded-[2rem] p-6 bg-gradient-to-br ${off.gradient || 'from-slate-800 to-slate-950'} border text-white shadow-md flex flex-col justify-between relative overflow-hidden"><div class="absolute -right-6 -bottom-6 text-white/5 text-8xl font-black"><i class="fa-solid ${off.icon || 'fa-gift'}"></i></div><div class="relative z-10"><div class="flex items-center gap-1.5 bg-white/10 border border-white/10 px-2 py-1 rounded-lg w-max mb-4"><i class="fa-solid ${off.icon || 'fa-gift'} text-[9px]"></i><span class="text-[8px] font-black uppercase tracking-wider mt-0.5">${off.type}</span></div><h4 class="text-base font-black leading-tight tracking-tight mb-1.5">${off.title}</h4><p class="text-[10px] text-white/70 font-medium leading-relaxed">${off.desc}</p></div><div class="relative z-10 flex justify-between items-center bg-black/10 border border-white/5 rounded-xl p-2.5 mt-6"><div class="font-mono text-xs font-bold tracking-widest">${off.code}</div><button onclick="navigator.clipboard.writeText('${off.code}'); alert('Đã sao chép mã ưu đãi!');" class="bg-white text-slate-950 text-[9px] font-black px-3 py-1.5 rounded-lg active:scale-95 transition-all">SAO CHÉP</button></div></div>`).join('');
}

function renderFeed() {
    const container = document.getElementById('homeFeedTrack'); if (!container || !appConfig.feed) return;
    container.innerHTML = appConfig.feed.map((fd, i) => `<div class="shrink-0 w-[180px] bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm flex flex-col relative group" onclick="togglePlay(this)"><div class="relative aspect-[9/16] bg-slate-900 overflow-hidden"><video src="${fd.url}" loop muted playsinline class="w-full h-full object-cover"></video><div class="play-btn-overlay absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity"><div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white"><i class="fa-solid fa-play text-xs ml-0.5"></i></div></div><div class="absolute top-3 left-3 bg-red-600 text-white font-black text-[7px] uppercase tracking-widest px-2 py-1 rounded-md shadow-sm animate-pulse flex items-center gap-1"><i class="fa-solid ${fd.fomoIcon || 'fa-bolt'}"></i> ${fd.fomoText}</div></div><div class="p-3 flex-1 flex flex-col justify-between"><h4 class="text-[11px] font-bold text-slate-800 line-clamp-2 leading-snug mb-2">${fd.title}</h4><div class="text-[8px] font-black text-slate-300 uppercase tracking-widest"><i class="fa-regular fa-clock mr-1"></i> VIDEO REELS</div></div></div>`).join('');
    
    if (window.feedObserver) window.feedObserver.disconnect();
    window.feedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { const video = entry.target.querySelector('video'); const overlay = entry.target.querySelector('.play-btn-overlay'); if (video) { if (entry.isIntersecting) { video.play().catch(()=>{}); overlay?.classList.add('opacity-0'); } else { video.pause(); overlay?.classList.remove('opacity-0'); } } });
    }, { threshold: 0.6 });
    document.querySelectorAll('#homeFeedTrack > div').forEach(el => window.feedObserver.observe(el));
}

function renderStoreView() {
    const container = document.getElementById('homeStoreGrid'); if(!container || !appConfig.store) return;
    container.innerHTML = appConfig.store.map(p => `<div class="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4 flex flex-col justify-between"><div class="space-y-3"><div class="aspect-square bg-slate-50 border rounded-2xl overflow-hidden p-4 flex items-center justify-center relative"><span class="absolute top-2 left-2 px-2 py-0.5 rounded text-[7px] font-black uppercase text-white tracking-widest" style="background-color: ${p.themeColor || '#000'}">${p.brand}</span><img src="${p.img || './asset/logo/logo.png'}" class="w-2/3 object-contain"></div><div><div class="flex justify-between items-start gap-1"><h4 class="font-black text-slate-900 text-sm truncate flex-1">${p.name}</h4><span class="text-[10px] font-black text-slate-400 mt-0.5">${p.sub}</span></div><p class="text-[11px] font-medium text-slate-400 mt-1 line-clamp-2 leading-relaxed">${p.desc}</p></div></div><div class="flex justify-between items-center pt-2 border-t border-slate-50"><div><span class="text-[7px] font-black text-slate-300 uppercase tracking-widest block">Chi phí</span><span class="text-sm font-black text-slate-800">${p.price}</span></div><button onclick="window.switchTab('contact')" class="px-4 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-widest text-white active:scale-95 transition-all shadow-sm" style="background-color: ${p.themeColor || '#0f172a'}">Liên hệ</button></div></div>`).join('');
}

// ==========================================
// 6. VIEWPORTS NAVIGATOR (TAB FLOW CONTROL)
// ==========================================
function switchTab(tabName) {
    const targetPane = document.getElementById('view-' + tabName); if (!targetPane) return;
    document.querySelectorAll('.view-pane').forEach(el => el.classList.remove('active')); targetPane.classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(el => { el.classList.remove('active', 'text-slate-900', '!text-white'); el.classList.add('text-slate-400'); });
    const activeNav = document.getElementById('nav-' + tabName);
    if (activeNav) { activeNav.classList.add('active'); activeNav.classList.remove('text-slate-400'); activeNav.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }
    
    if (tabName !== 'feed') { document.querySelectorAll('#homeFeedTrack video').forEach(v => v.pause()); }
    if (tabName === 'booking') switchBookingSubTab('flow');
    else { const ba = document.getElementById('bookingAction'); if (ba) ba.classList.add('hidden'); }
}

function switchBookingSubTab(subTab) {
    const flow = document.getElementById('booking-flow-container'), lookup = document.getElementById('booking-lookup-container');
    const btnFlow = document.getElementById('btn-sub-flow'), btnLookup = document.getElementById('btn-sub-lookup');
    const headerTools = document.getElementById('booking-header-tools'), actionBtn = document.getElementById('bookingAction');
    if (subTab === 'flow') {
        flow.classList.remove('hidden'); flow.classList.add('flex'); lookup.classList.add('hidden'); lookup.classList.remove('flex');
        btnFlow.className = "flex-1 py-2 text-[11px] font-bold text-slate-900 bg-white shadow-sm rounded-lg transition-all"; btnLookup.className = "flex-1 py-2 text-[11px] font-bold text-slate-500 rounded-lg transition-all";
        if(headerTools) headerTools.style.display = 'flex'; updateStepUI();
    } else {
        lookup.classList.remove('hidden'); lookup.classList.add('flex'); flow.classList.add('hidden'); flow.classList.remove('flex');
        btnLookup.className = "flex-1 py-2 text-[11px] font-bold text-slate-900 bg-white shadow-sm rounded-lg transition-all"; btnFlow.className = "flex-1 py-2 text-[11px] font-bold text-slate-500 rounded-lg transition-all";
        if(headerTools) headerTools.style.display = 'none'; if(actionBtn) actionBtn.classList.add('hidden');
    }
}

// ==========================================
// 7. BOOKING CACHE SCHEDULER GRID (REALTIME SYNC)
// ==========================================
function renderBranches() {
    const list = document.getElementById('listBranch'); if(!list) return;
    list.innerHTML = db.branches.map(b => `<label class="group block relative cursor-pointer"><input type="radio" name="branch" class="hidden" onclick="window.selectBranch('${b.id}')"><div class="border-2 border-slate-100 rounded-[1.5rem] p-4 bg-white flex items-center transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-50"><img src="https://ui-avatars.com/api/?name=${encodeURIComponent(b.name)}&background=f8fafc&color=0f172a&rounded=true&bold=true" class="w-12 h-12 rounded-full mr-4 border border-slate-200"><div class="flex-1 min-w-0"><h4 class="font-black text-slate-800 text-sm truncate">${b.name}</h4><p class="text-[10px] font-bold text-slate-400 mt-0.5 truncate">${b.address}</p></div><div class="w-5 h-5 ml-2 rounded-full border-2 border-slate-200 bg-white transition-all group-has-[:checked]:border-[6px] group-has-[:checked]:border-slate-900 flex shrink-0"></div></div></label>`).join('');
}

function selectBranch(id) {
    selection.branch = db.branches.find(b => b.id === id);
    const listSrv = document.getElementById('listService'); if(!listSrv) return;
    listSrv.innerHTML = db.services.filter(s => s.branchId === 'ALL' || s.branchId === id).map(s => `<label class="group block relative cursor-pointer"><input type="radio" name="service" class="hidden" onclick="window.selectService('${s.id}')"><div class="border-2 border-slate-100 rounded-[1.5rem] p-5 bg-white flex justify-between items-center transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-50"><div><h4 class="font-bold text-slate-800 text-sm">${s.name}</h4><p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1"><i class="fa-regular fa-clock mr-1"></i>${s.duration} Phút</p></div><span class="font-black text-slate-600 text-sm bg-slate-50 border px-3 py-1.5 rounded-xl group-has-[:checked]:bg-slate-900 group-has-[:checked]:text-white">${s.price}</span></div></label>`).join('');
    nextStep();
}

function selectService(id) {
    selection.service = db.services.find(s => s.id === id);
    const listStf = document.getElementById('listStaff'); if(!listStf) return;
    listStf.innerHTML = db.staff.filter(st => st.branchId === 'ALL' || st.branchId === selection.branch.id).map(st => `<label class="group block relative cursor-pointer h-full"><input type="radio" name="staff" class="hidden" onclick="window.selectStaff('${st.id}')"><div class="border-2 border-slate-100 rounded-[2rem] p-4 bg-white text-center h-full flex flex-col justify-center items-center transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-50 shadow-sm relative overflow-hidden"><img src="${st.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(st.name)}&background=f1f5f9&color=0f172a&bold=true`}" class="w-14 h-14 rounded-full mb-3 object-cover border"><h4 class="font-bold text-slate-900 text-[11px] truncate w-full">${st.name}</h4><p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">${st.exp} Năm KN</p></div></label>`).join('');
    nextStep();
}

function selectStaff(id) { selection.staff = db.staff.find(st => st.id === id); selection.time = null; document.getElementById('timeSlotGrid').innerHTML = ''; nextStep(); }
function selectTime(timeStr) { selection.time = timeStr; }

function renderDateSelector() {
    const el = document.getElementById('customDatePicker'); if(!el) return;
    let html = ''; const tzOffset = new Date().getTimezoneOffset() * 60000; const today = new Date(Date.now() - tzOffset); const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    for (let i = 0; i < 30; i++) {
        let d = new Date(today); d.setDate(today.getDate() + i); const isoDate = d.toISOString().split('T')[0];
        html += `<label class="group shrink-0 cursor-pointer snap-start"><input type="radio" name="date" class="hidden" value="${isoDate}" onclick="window.selectDate('${isoDate}')"><div class="flex flex-col items-center justify-center w-[60px] h-[80px] rounded-[1.25rem] border-2 border-slate-100 bg-white shadow-sm transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-900"><span class="text-[9px] font-black uppercase text-slate-400 mb-1 group-has-[:checked]:text-slate-300">${i === 0 ? 'Hôm nay' : dayNames[d.getDay()]}</span><span class="text-lg font-black text-slate-800 group-has-[:checked]:text-white">${d.getDate()}</span></div></label>`;
    }
    el.innerHTML = html;
}

function jumpToToday() { selectDate(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]); const picker = document.getElementById('customDatePicker'); if(picker) picker.scrollTo({ left: 0, behavior: 'smooth' }); }
function selectDate(isoDate) { 
    selection.date = isoDate; selection.time = null; 
    const radio = document.querySelector(`input[name="date"][value="${isoDate}"]`); 
    if (radio) { radio.checked = true; radio.closest('label').scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }
    fetchTimeSlots(); 
}

async function fetchTimeSlots() {
    if (!selection.date || !selection.staff) return;
    document.getElementById('timeSlotGrid').innerHTML = '';
    document.getElementById('timeLoading').classList.remove('hidden');
    try {
        const q = query(collection(firebaseDb, "MaiTayData/Core/Bookings"), where("staffName", "==", selection.staff.name), where("status", "==", "Đã nhận"));
        const snapshot = await getDocs(q);
        const busySlots = [];
        snapshot.forEach(docSnap => {
            const b = docSnap.data();
            if (b.startTime.startsWith(selection.date)) busySlots.push({ start: new Date(b.startTime).getTime(), end: new Date(b.endTime).getTime() });
        });
        generateGrid(busySlots);
    } catch (e) { console.error(e); generateGrid([]); }
    document.getElementById('timeLoading').classList.add('hidden');
}

function generateGrid(busySlots) {
    const grid = document.getElementById('timeSlotGrid'); if(!grid) return; const dur = parseInt(selection.service.duration);
    const parseTime = str => parseInt(String(str).split(':')[0] || 0) * 60 + parseInt(String(str).split(':')[1] || 0);
    const branch = selection.branch || { openTime: "08:00", closeTime: "20:00" };
    const currentMins = new Date().getHours() * 60 + new Date().getMinutes();
    const isToday = selection.date === new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    
    // Đồng bộ tần suất chia lưới ca hẹn theo cài đặt bookingIntervalMinutes trên Firebase
    const interval = Number(appConfig.bookingIntervalMinutes) || 30;

    let html = "";
    for (let m = parseTime(branch.openTime); m <= parseTime(branch.closeTime) - dur; m += interval) {
        const timeLabel = `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`;
        const slotStart = new Date(`${selection.date}T${timeLabel}:00+07:00`).getTime();
        let isBusy = false;
        if (isToday && m <= currentMins) isBusy = true;
        for (let busy of busySlots) { if (slotStart < busy.end && (slotStart + dur * 60000) > busy.start) isBusy = true; }
        html += `<label class="group block ${isBusy ? 'opacity-30 pointer-events-none' : 'cursor-pointer'}"><input type="radio" name="time" class="hidden" onclick="window.selectTime('${timeLabel}')" ${isBusy ? 'disabled' : ''}><div class="border-2 border-slate-100 rounded-[1rem] py-3 text-center bg-white transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-900"><span class="font-bold text-xs text-slate-700 group-has-[:checked]:text-white">${timeLabel}</span></div></label>`;
    }
    grid.innerHTML = html || '<p class="col-span-4 text-center text-[10px] font-bold text-slate-400 py-4 bg-slate-50 rounded-xl uppercase tracking-widest border border-slate-100">Hết lịch trống</p>';
}

function nextStep() {
    if (currentStep === 1 && !selection.branch) return; if (currentStep === 2 && !selection.service) return; if (currentStep === 3 && !selection.staff) return;
    if (currentStep === 4 && (!selection.date || !selection.time)) return alert("Vui lòng chọn ngày và giờ.");
    if (currentStep === 5) return document.getElementById('finalForm').dispatchEvent(new Event('submit'));
    if (currentStep === 3 && !selection.date) jumpToToday();
    currentStep++; updateStepUI(); const bFlow = document.getElementById('booking-flow-container'); if(bFlow) bFlow.scrollTo(0,0);
}
function prevStep() { if (currentStep > 1) { currentStep--; updateStepUI(); } }

function updateStepUI() {
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById(`step${i}`); if(!step) continue;
        if (i === currentStep) { step.classList.remove('hidden'); step.classList.add('flex'); } else { step.classList.add('hidden'); step.classList.remove('flex'); }
    }
    const dotParent = document.getElementById('progressDots');
    if(dotParent) {
        const dots = dotParent.children;
        for (let i = 0; i < 5; i++) { if(dots[i]) dots[i].className = i < currentStep ? "w-4 h-2 rounded-full bg-slate-900 transition-all" : "w-2 h-2 rounded-full bg-slate-200 transition-all"; }
    }
    if(document.getElementById('stepCounter')) document.getElementById('stepCounter').innerText = currentStep;
    const btnBack = document.getElementById('btnBack'), bAct = document.getElementById('bookingAction');
    if (currentStep === 1) { if(btnBack) btnBack.classList.add('opacity-0', 'pointer-events-none'); if(bAct) bAct.classList.add('hidden'); }
    else { if(btnBack) btnBack.classList.remove('opacity-0', 'pointer-events-none'); if(bAct) bAct.classList.remove('hidden'); }

    if (currentStep === 5) {
        document.getElementById('btnNext').innerHTML = 'XÁC NHẬN ĐẶT LỊCH <i class="fa-solid fa-check ml-1"></i>';
        const dP = selection.date.split('-'); const dateObj = new Date(selection.date);
        document.getElementById('sumDayOfWeek').innerText = `${['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dateObj.getDay()]}, ${dP[2]}/${dP[1]}/${dP[0]}`;
        document.getElementById('sumTime').innerText = selection.time; document.getElementById('sumBranch').innerText = selection.branch.name; document.getElementById('sumService').innerText = selection.service.name; document.getElementById('sumStaff').innerText = selection.staff.name;
    } else { if(document.getElementById('btnNext')) document.getElementById('btnNext').innerText = 'TIẾP TỤC'; }
}

// ==========================================
// 8. SUBMIT BOOKING DATA CHẮC CÚ (FIRESTORE)
// ==========================================
async function submitBooking() {
    if (!selection.time) return alert("Vui lòng chọn ca hẹn.");
    const btn = document.getElementById('btnNext'); btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ĐANG XỬ LÝ...'; btn.disabled = true;

    // Cơ chế tạo mã 5 ký tự ngẫu nhiên cao cấp Base32 chống đoán mã quy mô cửa hàng
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let bookingCode = "";
    for (let i = 0; i < 5; i++) bookingCode += chars.charAt(Math.floor(Math.random() * chars.length));

    const cleanPhone = String(document.getElementById('cusPhone').value).replace(/[^0-9]/g, '');
    const startTime = new Date(`${selection.date}T${selection.time}:00+07:00`);
    const bookingData = {
        bookingCode: bookingCode,
        branchName: selection.branch.name,
        serviceName: selection.service.name,
        staffName: selection.staff.name,
        startTime: startTime.toISOString(),
        endTime: new Date(startTime.getTime() + selection.service.duration * 60000).toISOString(),
        customerName: document.getElementById('cusName').value,
        phone: cleanPhone,
        email: document.getElementById('cusEmail').value,
        status: "Đã nhận",
        createdAt: new Date().toISOString(),
        uid: auth.currentUser ? auth.currentUser.uid : null
    };

    try {
        const docRef = await addDoc(collection(firebaseDb, "MaiTayData/Core/Bookings"), bookingData);
        alert(`ĐẶT LỊCH THÀNH CÔNG!\nMã tra cứu lịch hẹn của bạn là: ${bookingCode}\nHẹn gặp bạn tại Salon.`);

        document.getElementById('finalForm').reset(); selection = { branch: null, service: null, staff: null, date: null, time: null };
        document.getElementById('listService').innerHTML = ''; document.getElementById('listStaff').innerHTML = ''; document.getElementById('timeSlotGrid').innerHTML = '';
        currentStep = 1; updateStepUI(); const flowCont = document.getElementById('booking-flow-container'); if(flowCont) flowCont.scrollTo({ top: 0, behavior: 'smooth' });

        // Gửi tín hiệu kích hoạt GAS Worker chạy ngầm đồng bộ lịch Calendar và Email
        fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'create_event', data: bookingData }) })
        .then(res => res.json()).then(async (result) => {
            if (result.status === 'success' && result.eventId) await updateDoc(doc(firebaseDb, "MaiTayData/Core/Bookings", docRef.id), { eventId: result.eventId });
        }).catch(e => console.error(e));
    } catch (e) { alert("Lỗi kết nối máy chủ dữ liệu Firebase!"); } finally { btn.innerHTML = 'XÁC NHẬN ĐẶT LỊCH <i class="fa-solid fa-check ml-1"></i>'; btn.disabled = false; }
}

// ==========================================
// 9. SEARCH & TRA CỨU AN TOÀN (MỜ SĐT BẢO MẬT)
// ==========================================
async function lookupBooking() {
    const inputVal = document.getElementById('lookupPhone').value.trim(); if (!inputVal) return;
    const btn = document.getElementById('btnLookup'); btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    try {
        let q;
        if (inputVal.length === 5 && !/^\d+$/.test(inputVal)) {
            q = query(collection(firebaseDb, "MaiTayData/Core/Bookings"), where("bookingCode", "==", inputVal.toUpperCase()), where("status", "==", "Đã nhận"));
        } else {
            const cleanPhone = inputVal.replace(/[^0-9]/g, '');
            q = query(collection(firebaseDb, "MaiTayData/Core/Bookings"), where("phone", "==", cleanPhone), where("status", "==", "Đã nhận"), orderBy("startTime", "desc"));
        }
        const snapshot = await getDocs(q); const container = document.getElementById('lookupResults'); if(!container) return;
        if (snapshot.empty) {
            container.innerHTML = '<div class="bg-white p-4 rounded-xl text-center text-[11px] font-bold text-slate-400 uppercase border border-slate-100">Không tìm thấy thông tin lịch hẹn hợp lệ</div>';
        } else {
            let html = '';
            snapshot.forEach((docSnap) => {
                const b = docSnap.data(); const d = new Date(b.startTime); const tm = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')} - ${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
                
                // Thuật toán mờ số điện thoại để tránh lộ dữ liệu nơi công cộng
                let mPhone = "N/A"; if (b.phone) { const p = String(b.phone).replace(/[^0-9]/g, ''); mPhone = p.length >= 6 ? `${p.substring(0, 3)} *** ${p.substring(p.length - 3)}` : p; }
                
                html += `
                    <div class="bg-white border rounded-2xl p-5 shadow-sm mb-4">
                        <div class="flex justify-between items-start mb-2">
                            <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest"><i class="fa-solid fa-location-dot mr-1"></i>${b.branchName}</p>
                            <span class="text-[10px] font-mono font-black px-2 py-0.5 bg-slate-100 rounded text-slate-800 tracking-wider">MÃ: ${b.bookingCode||'N/A'}</span>
                        </div>
                        <h4 class="font-black text-slate-800 text-base mb-1">${b.serviceName}</h4>
                        <p class="text-[11px] font-bold text-slate-400 mb-3">Khách: ${b.customerName} (${mPhone})</p>
                        <div class="bg-slate-50 p-3 rounded-xl flex flex-col gap-2 mb-4">
                            <div class="text-[11px] font-bold text-slate-600"><i class="fa-regular fa-clock mr-2 text-slate-400"></i>${tm}</div>
                            <div class="text-[11px] font-bold text-slate-600"><i class="fa-solid fa-user-tie mr-2 text-slate-400"></i>${b.staffName}</div>
                        </div>
                        <button onclick="window.cancelBooking('${docSnap.id}')" class="w-full py-3 text-rose-500 font-bold text-[10px] uppercase tracking-widest bg-white border border-rose-100 rounded-xl shadow-sm">Huỷ Lịch Hẹn</button>
                    </div>`;
            });
            container.innerHTML = html;
        }
    } catch (e) { console.error(e); alert("Lỗi kết nối máy chủ tra cứu!"); } finally { btn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>'; }
}

async function cancelBooking(docId) {
    if (!confirm("Bạn có chắc chắn muốn huỷ lịch hẹn này?")) return;
    try {
        const docRef = doc(firebaseDb, "MaiTayData/Core/Bookings", docId); const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const bData = docSnap.data(); await updateDoc(docRef, { status: "Đã huỷ" });
            if (bData.eventId) fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'cancel_event', eventId: bData.eventId }) }).catch(()=>{});
            alert("Đã huỷ lịch thành công!"); lookupBooking();
        }
    } catch (e) { alert("Lỗi huỷ lịch!"); }
}

// ==========================================
// 10. INTERACTION UTILITIES
// ==========================================
function rateStar() {}
function toggleDescription(elementId, btnElement) { const descElement = document.getElementById(elementId); if(descElement) { if (descElement.classList.contains('line-clamp-2')) { descElement.classList.remove('line-clamp-2'); btnElement.innerText = 'ẨN BỚT'; } else { descElement.classList.add('line-clamp-2'); btnElement.innerText = 'XEM THÊM'; } } }
function togglePlay(element) { const video = element.querySelector('video'), overlay = element.querySelector('.play-btn-overlay'); if (video) { if (video.paused) { video.play().catch(()=>{}); overlay?.classList.add('opacity-0'); } else { video.pause(); overlay?.classList.remove('opacity-0'); } } }

// Ràng buộc bộ lắng nghe sự kiện ô nhập tra cứu trực tiếp từ Scope Module tránh lỗi Undefined lệch pha biên dịch
if (document.getElementById('lookupPhone')) {
    document.getElementById('lookupPhone').addEventListener('input', () => {
        const val = document.getElementById('lookupPhone').value.trim();
        // Tự động tìm kiếm tức thì khi nhập đủ 5 ký tự mã đặt lịch hoặc số điện thoại dài chuẩn
        if (val.length === 5 || val.length >= 10) lookupBooking();
    });
}