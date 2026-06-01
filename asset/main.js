// ==========================================
// 1. CẤU HÌNH THƯƠNG HIỆU CỐ ĐỊNH (BẤT BIẾN BẰNG JS)
// ==========================================
const BRAND_CONFIG = {
    general: {
        name: "Mai Tây Hair Salon",
        slogan: "Premium Hair Studio",
        rating: "5.0",
        version: "v1.0.3"
    },
    contact: {
        phoneDisplay: "0909 123 456",
        phoneLink: "0909123456",
        zaloLink: "https://zalo.me/0909123456"
    }
};

// Cấu hình Fallback dự phòng
const FALLBACK_DYNAMIC_CONFIG = {
    maintenanceMode: false,
    bookingIntervalMinutes: 30,
    fallbackOpenTime: "08:00",
    fallbackCloseTime: "20:00",
    heroBlock: {
        sliderImages: ["./asset/images/BGMT.jpg", "./asset/images/BGMT.jpg"],
        isFlashSale: true,
        flashSale: { title: "Flash Sale Đặc Quyền Vip", desc: "Giảm ngay 50% cho 5 khách hàng đặt lịch sớm nhất trong ngày. Giữ chỗ ngay trước khi kết thúc!", btnText: "SĂN DEAL NGAY", endTime: "2026-05-25T23:59:59" }
    },
    homeFeatures: {
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
    store: [] // Đã ẩn bên HTML nên để trống
};

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
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbwV7f8lE_evphu_A1ZwYsM_pPexjPvS8ZRNdFtAcEhvS6852vUljW49H-wuV6TgPYeFaQ/exec';

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
window.togglePlay = togglePlay;
// Khởi tạo trạng thái Auto Scroll toàn cục an toàn cho ES6 Module
if (window.isAutoScrollEnabled === undefined) {
    window.isAutoScrollEnabled = false;
}
if (window.blinkAutoScrollTimer === undefined) {
    window.blinkAutoScrollTimer = null;
}

// ==========================================
// 4. CORE LOADING & REALTIME DATABASE
// ==========================================
const viewIntro = document.getElementById('view-intro');
if (viewIntro) {
    viewIntro.addEventListener('scroll', function () {
        const dockedHeader = document.getElementById('docked-header');
        if (this.scrollTop > 250) {
            dockedHeader.classList.remove('-translate-y-12', 'opacity-0', 'pointer-events-none');
            dockedHeader.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        } else {
            dockedHeader.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
            dockedHeader.classList.add('-translate-y-12', 'opacity-0', 'pointer-events-none');
        }
    });
}

function startLoadingAnimation() { }
function finishLoadingAnimation() {
    const loadingDiv = document.getElementById('loading'), scissors = document.getElementById('scissorsContainer'), slashLine = document.getElementById('slashLine');
    if (!loadingDiv) return;
    scissors.classList.remove('is-normal-cutting'); scissors.classList.add('is-preparing');
    setTimeout(() => { scissors.classList.remove('is-preparing'); scissors.classList.add('is-snapping'); if (slashLine) slashLine.style.animation = 'slashEffect 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards'; }, 600);
    setTimeout(() => { loadingDiv.classList.add('page-split-active'); }, 700);
    setTimeout(() => { loadingDiv.style.display = 'none'; loadingDiv.remove(); }, 2000);
}

async function init() {
    startLoadingAnimation();
    try {
        const sysSnap = await getDoc(doc(firebaseDb, 'MaiTayData/Core/Config', 'system'));
        const systemData = sysSnap.exists() ? sysSnap.data() : FALLBACK_DYNAMIC_CONFIG;

        onSnapshot(doc(firebaseDb, 'MaiTayData/Core/Config', 'cms'), async (cmsSnap) => {
            const cmsData = cmsSnap.exists() ? cmsSnap.data() : FALLBACK_DYNAMIC_CONFIG;
            appConfig = { ...FALLBACK_DYNAMIC_CONFIG, ...systemData, ...cmsData, ...BRAND_CONFIG };

            if (appConfig.maintenanceMode === true) {
                document.body.innerHTML = `<div class="fixed inset-0 bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center z-[999]"><div class="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-6"><i class="fa-solid fa-screwdriver-wrench text-xl text-amber-400"></i></div><h1 class="text-xl font-black mb-2">${appConfig.general.name}</h1><p class="text-xs text-slate-400">Hệ thống đang bảo trì.</p></div>`; return;
            }

            applyConfig();
            renderHeroSlider();
            renderDynamicHero();
            renderHomeFeatures();
            renderOffers();
            renderFeed();
        });

        const branchesSnap = await getDocs(collection(firebaseDb, 'MaiTayData/Core/Branches'));
        db.branches = branchesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const servicesSnap = await getDocs(collection(firebaseDb, 'MaiTayData/Core/Services'));
        db.services = servicesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const staffSnap = await getDocs(collection(firebaseDb, 'MaiTayData/Core/Staff'));
        db.staff = staffSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        renderBranches();
        renderDateSelector();

        const currentVersion = appConfig.general.version;
        const localVersion = localStorage.getItem('MAITAY_APP_VERSION');
        if (localVersion && localVersion !== currentVersion) {
            localStorage.setItem('MAITAY_APP_VERSION', currentVersion);
            window.location.replace(`${window.location.href.split('?')[0]}?v=${new Date().getTime()}`);
            return;
        } else if (!localVersion) localStorage.setItem('MAITAY_APP_VERSION', currentVersion);

    } catch (e) {
        console.error("Lỗi Firestore: ", e);
        applyConfig(); renderHeroSlider(); renderDynamicHero();
    } finally { setTimeout(finishLoadingAnimation, 800); }
}

init();




// ==========================================
// 5. COMPONENT RENDER ENGINES
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
        
        // Cập nhật cấu trúc HTML: Thêm ô Ngày (cd-day) vào bộ đếm ngược
        container.innerHTML = `
            <div class="relative overflow-hidden rounded-[1.5rem] p-6 shadow-[0_12px_40px_-10px_rgba(159,18,57,0.4)] border border-rose-900/20 bg-[#2a0410]">
                <div class="absolute inset-0 bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900"></div>
                <div class="relative z-10 flex justify-between items-start mb-6 gap-3">
                    <div class="flex-1">
                        <div class="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-lg mb-3">
                            <span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                            <span class="text-rose-200 text-[8px] font-bold uppercase tracking-widest mt-0.5">Đặc Quyền Vip</span>
                        </div>
                        <h3 class="text-white text-xl font-black leading-tight tracking-tight">${conf.title}</h3>
                    </div>
                    
                    <div class="bg-black/20 backdrop-blur-md border border-white/5 rounded-xl p-2 text-center min-w-[110px] shrink-0">
                        <p class="text-[7px] uppercase tracking-[0.2em] font-medium text-rose-200/70 mb-1">Kết thúc sau</p>
                        <div class="flex items-center justify-center text-white font-mono text-xs font-bold tracking-wider">
                            <span id="cd-day" class="text-rose-300">00</span><span class="text-white/30 mr-0.5">d</span>
                            <span id="cd-hour">00</span><span class="text-white/30 mx-0.5">:</span>
                            <span id="cd-min">00</span><span class="text-white/30 mx-0.5">:</span>
                            <span id="cd-sec" class="text-rose-400">00</span>
                        </div>
                    </div>
                </div>
                <p class="relative z-10 text-[11px] text-white/70 font-normal mb-8 leading-relaxed">${conf.desc}</p>
                <button onclick="window.switchTab('booking')" class="relative z-10 w-full bg-white text-rose-950 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex justify-center items-center gap-2">${conf.btnText}</button>
            </div>
        `;

        const endTime = new Date(conf.endTime).getTime();
        
        countdownInterval = setInterval(() => {
            const diff = endTime - new Date().getTime();
            if (diff > 0) {
                // Tính toán chính xác Ngày - Giờ - Phút - Giây
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);

                // Đổ dữ liệu vào Khối Hero chính ngoài màn hình
                if(document.getElementById('cd-day')) document.getElementById('cd-day').innerText = String(d).padStart(2, '0');
                if(document.getElementById('cd-hour')) document.getElementById('cd-hour').innerText = String(h).padStart(2, '0');
                if(document.getElementById('cd-min')) document.getElementById('cd-min').innerText = String(m).padStart(2, '0');
                if(document.getElementById('cd-sec')) document.getElementById('cd-sec').innerText = String(s).padStart(2, '0');
                
                // Đồng bộ mượt mà sang Dynamic Island (Nếu giao diện của bạn có hỗ trợ các ID này)
                if(document.getElementById('di-day')) document.getElementById('di-day').innerText = String(d).padStart(2, '0');
                if(document.getElementById('di-hour')) document.getElementById('di-hour').innerText = String(h).padStart(2, '0');
                if(document.getElementById('di-min')) document.getElementById('di-min').innerText = String(m).padStart(2, '0');
                if(document.getElementById('di-sec')) document.getElementById('di-sec').innerText = String(s).padStart(2, '0');
            } else {
                clearInterval(countdownInterval);
                // Xử lý khi hết thời gian Flash Sale: ẩn block hoặc chuyển trạng thái
                container.innerHTML = '';
                document.getElementById('dynamic-island')?.classList.add('max-h-0', 'opacity-0');
            }
        }, 1000);

        document.getElementById('dynamic-island')?.classList.remove('max-h-0', 'opacity-0');
        document.getElementById('dynamic-island')?.classList.add('max-h-[100px]', 'opacity-100');
    } else {
        container.innerHTML = ''; 
        document.getElementById('dynamic-island')?.classList.add('max-h-0', 'opacity-0');
    }
}
function renderHomeFeatures() {
    const feat = appConfig.homeFeatures;
    const marqueeContainer = document.getElementById('homeMarquee');
    if (marqueeContainer && feat?.marqueeTexts) {
        marqueeContainer.innerHTML = `<div class="animate-marquee whitespace-nowrap flex items-center">` +
            feat.marqueeTexts.map(m => `<span class="inline-flex items-center mx-4 gap-2 text-[11px] uppercase tracking-widest font-black ${m.isHighlight ? 'text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border' : 'text-slate-500'}">${m.text}</span>`).join('<span class="text-slate-300">•</span>') +
            `</div>`;
    }
}

function renderOffers() {
    const container = document.getElementById('offersContainer'); // Trỏ đúng DOM ID tab Offers
    if (!container || !appConfig.offers) return;
    container.innerHTML = appConfig.offers.map(off => `
        <div class="w-full rounded-[2rem] p-6 bg-gradient-to-br ${off.gradient || 'from-slate-800 to-slate-950'} border border-white/10 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div class="absolute -right-4 -bottom-4 text-white/5 text-[120px] font-black"><i class="fa-solid ${off.icon || 'fa-gift'}"></i></div>
            <div class="relative z-10">
                <div class="flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg w-max mb-4">
                    <i class="fa-solid ${off.icon || 'fa-gift'} text-[10px]"></i>
                    <span class="text-[9px] font-black uppercase tracking-wider mt-0.5">${off.type}</span>
                </div>
                <h4 class="text-xl font-black leading-tight tracking-tight mb-2">${off.title}</h4>
                <p class="text-[12px] text-white/70 font-medium leading-relaxed">${off.desc}</p>
            </div>
            <div class="relative z-10 flex justify-between items-center bg-black/20 border border-white/10 rounded-xl p-3 mt-6 backdrop-blur-md">
                <div class="font-mono text-sm font-bold tracking-widest pl-2">${off.code}</div>
                <button onclick="navigator.clipboard.writeText('${off.code}'); alert('Đã sao chép mã ưu đãi!');" class="bg-white text-slate-950 text-[10px] font-black px-4 py-2 rounded-lg active:scale-95 transition-all shadow-md">SAO CHÉP</button>
            </div>
        </div>
    `).join('');
}

// ==========================================
// 5.1 LOGIC HỆ THỐNG BLINK (FEED TIKTOK-LIKE) - CHUẨN HOÁ TOÀN DIỆN
// ==========================================

// Đăng ký quyền thực thi toàn cục cho các tính năng tương tác của Feed
window.toggleAutoScroll = toggleAutoScroll;
window.toggleMediaFormat = toggleMediaFormat;
window.setupFeedObserver = setupFeedObserver;

function renderFeed() {
    const container = document.getElementById('feedContainer');
    if (!container || !appConfig.feed || appConfig.feed.length === 0) return;

    const sortedFeed = [...appConfig.feed].reverse();
    const videoExtensions = ['.mp4', '.mov', '.webm', '.m4v', '.3gp', '.avi'];

    container.innerHTML = sortedFeed.map((fd, i) => {
        const cleanUrl = String(fd.url).split('?')[0].toLowerCase();
        const isVideoFile = videoExtensions.some(ext => cleanUrl.endsWith(ext));

        let mediaTemplate = '';
        let overlayTemplate = '';

        const displayFomoText = fd.fomoText || "";
        const displayFomoIcon = fd.fomoIcon || "fa-bolt";
        const displayTitle = fd.title || "Tác phẩm thiết kế tóc cao cấp tại Mai Tây";
        
        // Dùng URL hoặc Title làm ID định danh bài viết để lưu vào nội dung báo cáo
        const feedId = encodeURIComponent(cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1)); 

        if (isVideoFile) {
            mediaTemplate = `
                <video src="${fd.url}" muted loop playsinline class="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-105 pointer-events-none z-0"></video>
                <video src="${fd.url}" loop playsinline class="feed-media-main relative w-full h-full object-cover transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-10" onclick="window.togglePlay(this.closest('.feed-item'))"></video>
            `;
            
            overlayTemplate = `
                <div class="play-btn-overlay absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity duration-300 z-20 pointer-events-auto cursor-pointer" onclick="window.togglePlay(this.closest('.feed-item'))">
                    <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-lg">
                        <i class="fa-solid fa-play text-xl ml-0.5"></i>
                    </div>
                </div>`;
        } else {
            mediaTemplate = `
                <img src="${fd.url}" class="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-105 pointer-events-none z-0" alt="background-blur">
                <img src="${fd.url}" class="feed-media-main relative w-full h-full object-cover transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-10" alt="${displayTitle}">
            `;
            overlayTemplate = '';
        }

        const autoScrollActiveClass = window.isAutoScrollEnabled ? 'text-amber-400 bg-slate-900 border-amber-400/30' : 'text-white/60 bg-black/40 border-white/10';
        const autoScrollIconClass = window.isAutoScrollEnabled ? 'fa-square-caret-down' : 'fa-square-minus';
        const autoScrollText = window.isAutoScrollEnabled ? 'Auto On' : 'Auto Off';

        return `
            <div class="h-full w-full snap-start relative flex items-center justify-center bg-zinc-950 overflow-hidden group feed-item">
                ${mediaTemplate}
                ${overlayTemplate}

                <div class="absolute bottom-0 left-0 w-[72%] p-6 pt-24 bg-gradient-to-t from-black/95 via-black/20 to-transparent pointer-events-none pb-[88px] z-25 flex flex-col justify-end text-left">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-md flex items-center gap-1 ${displayFomoText ? 'animate-pulse' : 'hidden'}">
                            <i class="fa-solid ${displayFomoIcon} text-[9px]"></i> 
                            ${displayFomoText}
                        </span>
                        <span class="text-[11px] font-black tracking-wider text-white drop-shadow-sm">@maitay.hairsalon</span>
                    </div>
                    <h3 class="text-white text-[13.5px] font-medium leading-relaxed drop-shadow-md line-clamp-3 pointer-events-auto select-text">${displayTitle}</h3>
                </div>

                <div class="absolute right-4 bottom-28 z-30 flex flex-col items-center gap-5 pointer-events-auto">
                    
                    <div class="flex flex-col items-center cursor-pointer group/auto" onclick="event.stopPropagation(); window.toggleAutoScroll(this)">
                        <div class="auto-scroll-btn w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center shadow-lg active:scale-90 transition-all ${autoScrollActiveClass}">
                            <i class="fa-solid ${autoScrollIconClass} text-base transition-transform duration-300"></i>
                        </div>
                        <span class="text-[9px] text-white/80 font-bold mt-1 drop-shadow-md tracking-wide uppercase auto-scroll-label">${autoScrollText}</span>
                    </div>

                    <div class="flex flex-col items-center cursor-pointer group/toggle" onclick="event.stopPropagation(); window.toggleMediaFormat(this)">
                        <div class="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform hover:bg-black/60">
                            <i class="fa-solid fa-expand text-base"></i>
                        </div>
                        <span class="text-[9px] text-white/80 font-bold mt-1 drop-shadow-md tracking-wide uppercase format-label">Cân đối</span>
                    </div>

                    <div class="flex flex-col items-center cursor-pointer" onclick="event.stopPropagation(); this.querySelector('i').classList.toggle('text-rose-500')">
                        <div class="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform">
                            <i class="fa-solid fa-heart text-lg"></i>
                        </div>
                        <span class="text-[9px] text-white/80 font-bold mt-1 drop-shadow-md uppercase tracking-wide">Thích</span>
                    </div>

                    <div class="flex flex-col items-center cursor-pointer group/report" onclick="event.stopPropagation(); window.openReportModal('${feedId}', '${displayTitle.replace(/'/g, "\\'")}')">
                        <div class="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-rose-400 shadow-lg active:scale-90 transition-transform hover:bg-black/60">
                            <i class="fa-solid fa-flag text-base"></i>
                        </div>
                        <span class="text-[9px] text-white/80 font-bold mt-1 drop-shadow-md uppercase tracking-wide">Báo cáo</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    setupFeedObserver(container);
}

/**
 * Quản lý trạng thái đệm tải dữ liệu thực tế và tính toán bước nhảy trang tự động khi hết nội dung
 */
function setupFeedObserver(container) {
    if (window.feedObserver) window.feedObserver.disconnect();
    
    window.feedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video.feed-media-main');
            const overlay = entry.target.querySelector('.play-btn-overlay');
            const feedItems = document.querySelectorAll('#feedContainer > .feed-item');
            const currentIndex = Array.from(feedItems).indexOf(entry.target);

            // Xử lý dịch chuyển viewport cuộn mượt mà chuẩn Apple xuống view kế tiếp
            const scrollToNext = () => {
                if (isAutoScrollEnabled && currentIndex < feedItems.length - 1) {
                    const nextItem = feedItems[currentIndex + 1];
                    container.scrollTo({ top: nextItem.offsetTop, behavior: 'smooth' });
                }
            };

            if (entry.isIntersecting) {
                if (blinkAutoScrollTimer) clearTimeout(blinkAutoScrollTimer);

                if (video) {
                    video.play().catch(() => { });
                    overlay?.classList.add('opacity-0', 'pointer-events-none');
                    video.onended = scrollToNext; // Hết video -> Tự động nhảy bài
                } else {
                    // Đối với định dạng ảnh -> Đếm ngược 10 giây để cuộn trang
                    blinkAutoScrollTimer = setTimeout(() => {
                        scrollToNext();
                    }, 10000);
                }
            } else {
                if (video) {
                    video.pause();
                    video.onended = null;
                }
                if (blinkAutoScrollTimer) clearTimeout(blinkAutoScrollTimer);
            }
        });
    }, { root: container, threshold: 0.6 });

    document.querySelectorAll('#feedContainer > .feed-item').forEach(el => window.feedObserver.observe(el));
}

/**
 * Xử lý bật/tắt tính năng Auto Scroll từ nút nhấn giao diện của người dùng
 */
function toggleAutoScroll(buttonElement) {
    isAutoScrollEnabled = !isAutoScrollEnabled;
    
    document.querySelectorAll('.auto-scroll-btn').forEach(btn => {
        const label = btn.nextElementSibling;
        const icon = btn.querySelector('i');
        
        if (isAutoScrollEnabled) {
            btn.className = "auto-scroll-btn w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center shadow-lg active:scale-90 transition-all text-amber-400 bg-slate-900 border-amber-400/30";
            if (icon) icon.className = "fa-solid fa-square-caret-down text-base";
            if (label) label.innerText = "Auto On";
        } else {
            btn.className = "auto-scroll-btn w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center shadow-lg active:scale-90 transition-all text-white/60 bg-black/40 border-white/10";
            if (icon) icon.className = "fa-solid fa-square-minus text-base";
            if (label) label.innerText = "Auto Off";
        }
    });

    const container = document.getElementById('feedContainer');
    if (container) setupFeedObserver(container);
}


/**
 * Xử lý co giãn định dạng hiển thị Media (Tràn khung <=> Giữ nguyên tỉ lệ thực 4:5)
 */
function toggleMediaFormat(buttonElement) {
    const feedItem = buttonElement.closest('.feed-item');
    if (!feedItem) return;

    const mainMedia = feedItem.querySelector('.feed-media-main');
    const label = buttonElement.querySelector('.format-label');
    const icon = buttonElement.querySelector('i');
    
    if (!mainMedia) return;

    if (mainMedia.classList.contains('object-cover')) {
        mainMedia.classList.remove('object-cover');
        mainMedia.classList.add('object-contain');
        if (label) label.innerText = "Gốc";
        if (icon) icon.className = "fa-solid fa-compress text-base";
    } else {
        mainMedia.classList.remove('object-contain');
        mainMedia.classList.add('object-cover');
        if (label) label.innerText = "Cân đối";
        if (icon) icon.className = "fa-solid fa-expand text-base";
    }
}
/**
 * Hàm xử lý bật/tắt phát Video khi chạm màn hình
 * Tách biệt hoàn toàn phân lớp để cô lập vùng chạm, tránh lỗi xung đột với cụm nút bấm
 */
function togglePlay(element) {
    // Nhận diện chính xác video chính đang hiển thị của feed-item đó
    const video = element.querySelector('video.feed-media-main');
    const overlay = element.querySelector('.play-btn-overlay');
    if (!video) return;

    if (video.paused) {
        // Nếu video đang dừng -> Kích hoạt phát tiếp và ẩn nút Play mồi
        video.play().catch(() => { });
        if (overlay) {
            overlay.classList.add('opacity-0', 'pointer-events-none');
        }
    } else {
        // Nếu video đang chạy -> Tạm dừng và hiển thị lại nút Play mồi
        video.pause();
        if (overlay) {
            overlay.classList.remove('opacity-0', 'pointer-events-none');
        }
    }
}
// Đảm bảo gán lại vào môi trường toàn cục window để các thẻ HTML gọi trực tiếp được
window.togglePlay = togglePlay;


window.openReportModal = openReportModal;
window.submitReport = submitReport;

/**
 * Mở modal báo cáo bài viết, tự động bắt ID và Tiêu đề bài viết đó
 */
function openReportModal(feedId, feedTitle) {
    const overlay = document.getElementById('custom-modal-overlay');
    const modalBox = document.getElementById('custom-modal-box');
    const iconContainer = document.getElementById('modal-icon-container');
    const icon = document.getElementById('modal-icon');
    const titleEl = document.getElementById('modal-title');
    const messageEl = document.getElementById('modal-message');
    const modalActions = document.getElementById('modal-actions');

    if (!overlay || !modalBox) return;

    // Tạm dừng mọi video đang phát để khách hàng tập trung thao tác
    document.querySelectorAll('#feedContainer video.feed-media-main').forEach(v => v.pause());

    // Thiết kế lại giao diện bên trong của Custom Modal thành Form Báo cáo Premium
    iconContainer.className = "w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-rose-50 text-rose-600 transition-all duration-300";
    icon.className = "fa-solid fa-triangle-exclamation text-xl";
    
    titleEl.innerText = "Báo cáo nội dung";
    
    // Hiển thị ID bài viết kèm menu chọn lý do tinh tế
    messageEl.innerHTML = `
        <p class="text-[11px] text-slate-400 mb-3 text-left font-mono truncate bg-slate-50 p-2 rounded border">ID bài: ${decodeURIComponent(feedId)}</p>
        <div class="text-left space-y-2 w-full" id="reportOptionsGroup">
            <label class="flex items-center gap-2.5 p-3 rounded-xl border bg-white cursor-pointer hover:bg-slate-50">
                <input type="radio" name="reportReason" value="Bản quyền / Yêu cầu gỡ" checked class="accent-slate-900">
                <span class="text-xs font-bold text-slate-700">Bản quyền / Yêu cầu gỡ bỏ</span>
            </label>
            <label class="flex items-center gap-2.5 p-3 rounded-xl border bg-white cursor-pointer hover:bg-slate-50">
                <input type="radio" name="reportReason" value="Nội dung sai phạm / Phản cảm" class="accent-slate-900">
                <span class="text-xs font-bold text-slate-700">Nội dung sai phạm / Phản cảm</span>
            </label>
            <label class="flex items-center gap-2.5 p-3 rounded-xl border bg-white cursor-pointer hover:bg-slate-50">
                <input type="radio" name="reportReason" value="Lý do khác" class="accent-slate-900">
                <span class="text-xs font-bold text-slate-700">Lý do đóng góp ý kiến khác</span>
            </label>
        </div>
        <textarea id="reportNote" placeholder="Mô tả chi tiết thêm nếu có..." rows="2" class="w-full mt-3 bg-slate-50 border p-3 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-slate-300 resize-none"></textarea>
    `;

    // Thay đổi 2 nút hành động bám đáy của modal
    modalActions.innerHTML = `
        <button id="report-btn-cancel" class="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all">Hủy</button>
        <button id="report-btn-submit" class="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-rose-600 text-white shadow-md hover:bg-rose-700 active:scale-95 transition-all">Gửi báo cáo</button>
    `;

    // Kích hoạt hiệu ứng mở popup mượt mà
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
        modalBox.classList.remove('scale-95');
        modalBox.classList.add('scale-100');
    }, 10);

    // Xử lý sự kiện nút Hủy
    document.getElementById('report-btn-cancel').onclick = () => {
        closeReportModal();
    };

    // Xử lý sự kiện nút Gửi
    document.getElementById('report-btn-submit').onclick = () => {
        window.submitReport(feedId, feedTitle);
    };
}

/**
 * Đóng modal và khôi phục lại cấu trúc nút bấm mặc định cho Custom Modal
 */
function closeReportModal() {
    const overlay = document.getElementById('custom-modal-overlay');
    const modalBox = document.getElementById('custom-modal-box');
    if (!overlay || !modalBox) return;

    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    modalBox.classList.remove('scale-100');
    modalBox.classList.add('scale-95');
    
    setTimeout(() => {
        overlay.classList.remove('flex');
        overlay.classList.add('hidden');
        
        // Trả lại cấu trúc nút "Đồng ý" mặc định cho Custom Modal để không làm hỏng các tính năng khác
        document.getElementById('modal-actions').innerHTML = `
            <button id="modal-btn-cancel" class="hidden flex-1 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all">Hủy</button>
            <button id="modal-btn-confirm" class="flex-1 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest bg-slate-900 text-white shadow-md hover:bg-slate-800 active:scale-95 transition-all">Đồng ý</button>
        `;
    }, 300);
}

/**
 * Đẩy dữ liệu báo cáo lên danh mục 'MaiTayData/Core/Reports' của Firebase
 */
async function submitReport(feedId, feedTitle) {
    const btnSubmit = document.getElementById('report-btn-submit');
    if (!btnSubmit) return;

    btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
    btnSubmit.disabled = true;

    const selectedReason = document.querySelector('input[name="reportReason"]:checked').value;
    const note = document.getElementById('reportNote').value.trim();

    const reportData = {
        targetFeedId: decodeURIComponent(feedId),
        targetFeedTitle: feedTitle,
        reason: selectedReason,
        userNote: note,
        createdAt: new Date().toISOString(),
        status: "Chờ xử lý",
        reporterUid: auth.currentUser ? auth.currentUser.uid : "Khách vãng lai"
    };

    try {
        // Lưu trữ vào Firestore bộ sưu tập Reports độc lập
        await addDoc(collection(firebaseDb, "MaiTayData/Core/Reports"), reportData);
        
        closeReportModal();
        
        // Thao tác thành công -> Gọi Custom Alert thông báo lại cho khách bằng giao diện Success sạch sẽ
        setTimeout(() => {
            showCustomAlert(
                "Đã ghi nhận báo cáo", 
                "Cảm ơn sự đóng góp của bạn. Ban quản trị Mai Tây sẽ tiến hành xác minh nội dung và xử lý trong vòng 24h.", 
                "success"
            );
        }, 400);

    } catch (error) {
        console.error("Lỗi gửi báo cáo bài viết:", error);
        alert("Không thể gửi báo cáo lúc này do sự cố mạng!");
        btnSubmit.innerHTML = "Gửi báo cáo";
        btnSubmit.disabled = false;
    }
}

// ==========================================
// 6. VIEWPORTS NAVIGATOR (TAB FLOW)
// ==========================================
function switchTab(tabName) {
    const targetPane = document.getElementById('view-' + tabName);
    if (!targetPane) return;

    document.querySelectorAll('.view-pane').forEach(el => el.classList.remove('active'));
    targetPane.classList.add('active');

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(el => {
        el.classList.remove('active', 'text-slate-900', '!text-white', '!text-white/60');
        el.classList.add('text-slate-400');
    });

    const activeNav = document.getElementById('nav-' + tabName);
    if (activeNav) {
        activeNav.classList.add('active');
        activeNav.classList.remove('text-slate-400');
        activeNav.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }   

    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        if (tabName === 'feed') {
            bottomNav.classList.add('!bg-black/40', '!w-full', '!max-w-full', '!bottom-0', '!rounded-none', '!border-white/10', '!shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]');
            bottomNav.classList.remove('bg-white/95', 'border-slate-200');
            navItems.forEach(el => {
                el.classList.remove('text-slate-400');
                if (el !== activeNav) el.classList.add('!text-white/60');
            });
            if (activeNav) activeNav.classList.add('!text-white');

            checkAndShowSwipeHint();

        } else {

            bottomNav.classList.remove('!bg-black/40', '!border-white/10', '!shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]','!w-full', '!max-w-full', '!bottom-0', '!rounded-none');
            bottomNav.classList.add('bg-white/95', 'border-slate-200');
            if (activeNav) activeNav.classList.add('text-slate-900');
        }
    }

    if (tabName !== 'feed') { document.querySelectorAll('#feedContainer video').forEach(v => v.pause()); }

    const island = document.getElementById('dynamic-island');
    if (island) {
        if (appConfig?.heroBlock?.isFlashSale && tabName !== 'intro') {
            island.classList.replace('max-h-0', 'max-h-[100px]');
            island.classList.replace('opacity-0', 'opacity-100');
            island.classList.replace('pointer-events-none', 'pointer-events-auto');
        } else {
            island.classList.replace('max-h-[100px]', 'max-h-0');
            island.classList.replace('opacity-100', 'opacity-0');
            island.classList.replace('pointer-events-auto', 'pointer-events-none');
        }
    }

    if (tabName === 'booking') {
        switchBookingSubTab('flow');
    } else {
        const bookingAction = document.getElementById('bookingAction');
        if (bookingAction) bookingAction.classList.add('hidden');
    }
}


function switchBookingSubTab(subTab) {
    const flow = document.getElementById('booking-flow-container'), lookup = document.getElementById('booking-lookup-container');
    const btnFlow = document.getElementById('btn-sub-flow'), btnLookup = document.getElementById('btn-sub-lookup');
    const headerTools = document.getElementById('booking-header-tools'), actionBtn = document.getElementById('bookingAction');
    if (subTab === 'flow') {
        flow.classList.remove('hidden'); flow.classList.add('flex'); lookup.classList.add('hidden'); lookup.classList.remove('flex');
        btnFlow.className = "flex-1 py-2 text-[11px] font-bold text-slate-900 bg-white shadow-sm rounded-lg transition-all sub-nav-btn"; btnLookup.className = "flex-1 py-2 text-[11px] font-bold text-slate-500 rounded-lg transition-all sub-nav-btn";
        if (headerTools) headerTools.style.display = 'flex'; updateStepUI();
    } else {
        lookup.classList.remove('hidden'); lookup.classList.add('flex'); flow.classList.add('hidden'); flow.classList.remove('flex');
        btnLookup.className = "flex-1 py-2 text-[11px] font-bold text-slate-900 bg-white shadow-sm rounded-lg transition-all sub-nav-btn"; btnFlow.className = "flex-1 py-2 text-[11px] font-bold text-slate-500 rounded-lg transition-all sub-nav-btn";
        if (headerTools) headerTools.style.display = 'none'; if (actionBtn) actionBtn.classList.add('hidden');
    }
}

// ==========================================
// 7. BOOKING SYSTEM SCHEDULER
// ==========================================
function renderBranches() {
    const list = document.getElementById('listBranch'); if (!list) return;

    list.innerHTML = db.branches.map(b => `<label class="group block relative cursor-pointer"><input type="radio" name="branch" class="hidden" onclick="window.selectBranch('${b.id}')">
        <div class="border-2 border-slate-100 rounded-[1.5rem] p-4 bg-white flex items-center transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-50">
        <img src="${b.img}" class="w-12 h-12 rounded-full mr-4 border border-slate-200">
        <div class="flex-1 min-w-0"><h4 class="font-black text-slate-800 text-sm truncate">${b.name}</h4><p class="text-[10px] font-bold text-slate-400 mt-0.5 truncate">${b.address}</p></div><div class="w-5 h-5 ml-2 rounded-full border-2 border-slate-200 bg-white transition-all group-has-[:checked]:border-[6px] group-has-[:checked]:border-slate-900 flex shrink-0"></div></div></label>`).join('');
}

function selectBranch(id) {
    selection.branch = db.branches.find(b => b.id === id);
    const listSrv = document.getElementById('listService'); if (!listSrv) return;
    listSrv.innerHTML = db.services.filter(s => s.branchId === 'ALL' || s.branchId === id).map(s => `<label class="group block relative cursor-pointer"><input type="radio" name="service" class="hidden" onclick="window.selectService('${s.id}')"><div class="border-2 border-slate-100 rounded-[1.5rem] p-5 bg-white flex justify-between items-center transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-50"><div><h4 class="font-bold text-slate-800 text-sm">${s.name}</h4><p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1"><i class="fa-regular fa-clock mr-1"></i>${s.duration} Phút</p></div><span class="font-black text-slate-600 text-sm bg-slate-50 border px-3 py-1.5 rounded-xl group-has-[:checked]:bg-slate-900 group-has-[:checked]:text-white">${s.price}</span></div></label>`).join('');
    nextStep();
}

function selectService(id) {
    selection.service = db.services.find(s => s.id === id);
    const listStf = document.getElementById('listStaff'); if (!listStf) return;
    listStf.innerHTML = db.staff.filter(st => st.branchId === 'ALL' || st.branchId === selection.branch.id).map(st => `<label class="group block relative cursor-pointer h-full"><input type="radio" name="staff" class="hidden" onclick="window.selectStaff('${st.id}')"><div class="border-2 border-slate-100 rounded-[2rem] p-4 bg-white text-center h-full flex flex-col justify-center items-center transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-50 shadow-sm relative overflow-hidden"><img src="${st.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(st.name)}&background=f1f5f9&color=0f172a&bold=true`}" class="w-14 h-14 rounded-full mb-3 object-cover border"><h4 class="font-bold text-slate-900 text-[11px] truncate w-full">${st.name}</h4><p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">${st.exp} Năm KN</p></div></label>`).join('');
    nextStep();
}

function selectStaff(id) { selection.staff = db.staff.find(st => st.id === id); selection.time = null; document.getElementById('timeSlotGrid').innerHTML = ''; nextStep(); }
function selectTime(timeStr) { selection.time = timeStr; }

function renderDateSelector() {
    const el = document.getElementById('customDatePicker'); if (!el) return;
    let html = ''; const tzOffset = new Date().getTimezoneOffset() * 60000; const today = new Date(Date.now() - tzOffset); const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    for (let i = 0; i < 30; i++) {
        let d = new Date(today); d.setDate(today.getDate() + i); const isoDate = d.toISOString().split('T')[0];
        html += `<label class="group shrink-0 cursor-pointer snap-start"><input type="radio" name="date" class="hidden" value="${isoDate}" onclick="window.selectDate('${isoDate}')"><div class="flex flex-col items-center justify-center w-[60px] h-[80px] rounded-[1.25rem] border-2 border-slate-100 bg-white shadow-sm transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-900"><span class="text-[9px] font-black uppercase text-slate-400 mb-1 group-has-[:checked]:text-slate-300">${i === 0 ? 'Hôm nay' : dayNames[d.getDay()]}</span><span class="text-lg font-black text-slate-800 group-has-[:checked]:text-white">${d.getDate()}</span></div></label>`;
    }
    el.innerHTML = html;
}

function jumpToToday() { selectDate(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]); const picker = document.getElementById('customDatePicker'); if (picker) picker.scrollTo({ left: 0, behavior: 'smooth' }); }
function selectDate(isoDate) {
    selection.date = isoDate; selection.time = null;
    const radio = document.querySelector(`input[name="date"][value="${isoDate}"]`);
    if (radio) { radio.checked = true; radio.closest('label').scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }
    fetchTimeSlots();
}

async function fetchTimeSlots() {
    if (!selection.date || !selection.branch) return; // Đổi điều kiện kiểm tra từ staff sang branch
    document.getElementById('timeSlotGrid').innerHTML = '';
    document.getElementById('timeLoading').classList.remove('hidden');
    try {
        // Quét toàn bộ lịch hẹn ĐÃ NHẬN của CHI NHÁNH hiện tại trong ngày được chọn
        const q = query(
            collection(firebaseDb, "MaiTayData/Core/Bookings"), 
            where("branchName", "==", selection.branch.name), 
            where("status", "==", "Đã nhận")
        );
        const snapshot = await getDocs(q);
        const busySlots = [];
        
        snapshot.forEach(docSnap => {
            const b = docSnap.data();
            // Lọc chính xác các lịch hẹn nằm trong ngày đang chọn
            if (b.startTime.startsWith(selection.date)) {
                busySlots.push({ 
                    start: new Date(b.startTime).getTime(), 
                    end: new Date(b.endTime).getTime() 
                });
            }
        });
        generateGrid(busySlots);
    } catch (e) { 
        console.error("Lỗi lấy lịch hẹn:", e); 
        generateGrid([]); 
    }
    document.getElementById('timeLoading').classList.add('hidden');
}

function generateGrid(busySlots) {
    const grid = document.getElementById('timeSlotGrid'); if(!grid) return; 
    const dur = parseInt(selection.service.duration);
    const parseTime = str => parseInt(String(str).split(':')[0] || 0) * 60 + parseInt(String(str).split(':')[1] || 0);
    
    const branch = selection.branch || { openTime: "08:00", closeTime: "20:00", seats: 1 };
    // Lấy số ghế cấu hình từ chi nhánh, nếu không có mặc định là 1 ghế
    const maxSeats = Number(branch.seats) || 1; 

    const currentMins = new Date().getHours() * 60 + new Date().getMinutes();
    const isToday = selection.date === new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    const interval = Number(appConfig.bookingIntervalMinutes) || 30;

    let html = "";
    for (let m = parseTime(branch.openTime); m <= parseTime(branch.closeTime); m += interval) {
        const timeLabel = `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`;
        const slotStart = new Date(`${selection.date}T${timeLabel}:00+07:00`).getTime();
        const slotEnd = slotStart + (dur * 60000);
        
        let isBusy = false;
        
        // 1. Khóa ca nếu là hôm nay và thời gian đã trôi qua
        if (isToday && m <= currentMins) {
            isBusy = true;
        } else {
            // 2. ĐẾM SỐ GHẾ ĐÃ ĐƯỢC ĐẶT TRONG KHUNG GIỜ NÀY
            let bookedCount = 0;
            for (let busy of busySlots) { 
                // Kiểm tra nếu lịch hẹn cũ và ca đặt mới có khoảng thời gian đè lên nhau
                if (slotStart < busy.end && slotEnd > busy.start) {
                    bookedCount++;
                }
            }
            // Nếu số lượng khách đặt vượt quá hoặc bằng số ghế hiện có của chi nhánh -> Khóa slot
            if (bookedCount >= maxSeats) {
                isBusy = true;
            }
        }
        
        html += `<label class="group block ${isBusy ? 'opacity-30 pointer-events-none' : 'cursor-pointer'}"><input type="radio" name="time" class="hidden" onclick="window.selectTime('${timeLabel}')" ${isBusy ? 'disabled' : ''}><div class="border-2 border-slate-100 rounded-[1rem] py-3 text-center bg-white transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-900"><span class="font-bold text-xs text-slate-700 group-has-[:checked]:text-white">${timeLabel}</span></div></label>`;
    }
    grid.innerHTML = html || '<p class="col-span-4 text-center text-[10px] font-bold text-slate-400 py-4 bg-slate-50 rounded-xl uppercase tracking-widest border border-slate-100">Hết lịch trống</p>';
}

function nextStep() {
    if (currentStep === 1 && !selection.branch) return; if (currentStep === 2 && !selection.service) return; if (currentStep === 3 && !selection.staff) return;
    if (currentStep === 4 && (!selection.date || !selection.time)) return alert("Vui lòng chọn ngày và giờ.");
    if (currentStep === 5) return document.getElementById('finalForm').dispatchEvent(new Event('submit'));
    if (currentStep === 3 && !selection.date) jumpToToday();
    currentStep++; updateStepUI(); const bFlow = document.getElementById('booking-flow-container'); if (bFlow) bFlow.scrollTo(0, 0);
}
function prevStep() { if (currentStep > 1) { currentStep--; updateStepUI(); } }

function updateStepUI() {
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById(`step${i}`); if (!step) continue;
        if (i === currentStep) { step.classList.remove('hidden'); step.classList.add('flex'); } else { step.classList.add('hidden'); step.classList.remove('flex'); }
    }
    const dotParent = document.getElementById('progressDots');
    if (dotParent) {
        const dots = dotParent.children;
        for (let i = 0; i < 5; i++) { if (dots[i]) dots[i].className = i < currentStep ? "w-4 h-2 rounded-full bg-slate-900 transition-all" : "w-2 h-2 rounded-full bg-slate-200 transition-all"; }
    }
    if (document.getElementById('stepCounter')) document.getElementById('stepCounter').innerText = currentStep;
    const btnBack = document.getElementById('btnBack'), bAct = document.getElementById('bookingAction');
    if (currentStep === 1) { if (btnBack) btnBack.classList.add('opacity-0', 'pointer-events-none'); if (bAct) bAct.classList.add('hidden'); }
    else { if (btnBack) btnBack.classList.remove('opacity-0', 'pointer-events-none'); if (bAct) bAct.classList.remove('hidden'); }

    if (currentStep === 5) {
        document.getElementById('btnNext').innerHTML = 'XÁC NHẬN ĐẶT LỊCH <i class="fa-solid fa-check ml-1"></i>';
        const dP = selection.date.split('-'); const dateObj = new Date(selection.date);
        document.getElementById('sumDayOfWeek').innerText = `${['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dateObj.getDay()]}, ${dP[2]}/${dP[1]}/${dP[0]}`;
        document.getElementById('sumTime').innerText = selection.time; document.getElementById('sumBranch').innerText = selection.branch.name; document.getElementById('sumService').innerText = selection.service.name; document.getElementById('sumStaff').innerText = selection.staff.name;
    } else { if (document.getElementById('btnNext')) document.getElementById('btnNext').innerText = 'TIẾP TỤC'; }
}

// ==========================================
// ĐIỀU KHIỂN PREMIUM MODAL ĐẶT LỊCH THÀNH CÔNG
// ==========================================

/**
 * Hàm hiển thị Custom Modal dựng sẵn thay thế cho alert() mặc định
 * @param {string} title - Tiêu đề thông báo
 * @param {string} message - Nội dung chi tiết
 * @param {string} type - Loại thông báo ('success', 'error', 'info') để đổi màu icon
 */
function showCustomAlert(title, message, type = 'info') {
    const overlay = document.getElementById('custom-modal-overlay');
    const modalBox = document.getElementById('custom-modal-box');
    const iconContainer = document.getElementById('modal-icon-container');
    const icon = document.getElementById('modal-icon');
    const titleEl = document.getElementById('modal-title');
    const messageEl = document.getElementById('modal-message');
    const btnConfirm = document.getElementById('modal-btn-confirm');

    if (!overlay || !modalBox) return;

    // Thiết lập nội dung text
    titleEl.innerText = title;
    messageEl.innerText = message;

    // Thiết lập màu sắc và icon premium tùy theo loại thông báo
    iconContainer.className = "w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300";
    if (type === 'success') {
        iconContainer.classList.add('bg-emerald-50', 'text-emerald-600');
        icon.className = "fa-solid fa-circle-check text-xl";
    } else if (type === 'error') {
        iconContainer.classList.add('bg-rose-50', 'text-rose-600');
        icon.className = "fa-solid fa-circle-exclamation text-xl";
    } else {
        iconContainer.classList.add('bg-slate-50', 'text-slate-900');
        icon.className = "fa-solid fa-bell text-xl";
    }

    // Kích hoạt hiệu ứng mở modal mượt mà của Apple
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
        modalBox.classList.remove('scale-95');
        modalBox.classList.add('scale-100');
    }, 10);

    // Gán sự kiện đóng đóng modal khi bấm nút "Đồng ý"
    btnConfirm.onclick = () => {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        modalBox.classList.remove('scale-100');
        modalBox.classList.add('scale-95');
        setTimeout(() => {
            overlay.classList.remove('flex');
            overlay.classList.add('hidden');
        }, 300);
    };
}

function showSuccessModal(code, data) {
    const modal = document.getElementById('bookingSuccessModal');
    const card = modal?.querySelector('.relative');

    if (!modal || !card) return;

    // 1. Đổ dữ liệu động vào cấu trúc giao diện Modal vé ảo
    document.getElementById('mdlBookingCode').innerText = code;
    document.getElementById('mdlService').innerText = data.serviceName;
    document.getElementById('mdlStaff').innerText = data.staffName;
    document.getElementById('mdlBranch').innerText = data.branchName;

    // Xử lý định dạng thời gian & ngày hẹn hiển thị chuẩn sang trọng
    const dP = selection.date.split('-');
    const dateObj = new Date(selection.date);
    const dayOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dateObj.getDay()];

    document.getElementById('mdlTime').innerText = selection.time;
    document.getElementById('mdlDate').innerText = `${dayOfWeek}, ${dP[2]}/${dP[1]}/${dP[0]}`;

    // 2. Gán sự kiện cho nút Copy mã tích hợp trong vé
    const copyBtnZone = document.getElementById('btnCopyBookingCode');
    copyBtnZone.onclick = () => {
        navigator.clipboard.writeText(code);

        // Hiệu ứng phản hồi xúc giác nhẹ (Haptic feedback) bằng UI khi bấm copy thành công
        const originalHTML = copyBtnZone.innerHTML;
        copyBtnZone.innerHTML = `<span class="text-xs font-black tracking-widest text-emerald-600 uppercase w-full text-center"><i class="fa-solid fa-circle-check mr-1.5"></i>ĐÃ SAO CHÉP MÃ</span>`;
        setTimeout(() => { copyBtnZone.innerHTML = originalHTML; }, 2000);
    };

    // 3. Kích hoạt hiệu ứng chuyển động mượt mà bật màng bọc Apple
    modal.classList.remove('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-95', 'opacity-0');
    card.classList.add('scale-100', 'opacity-100');

    // 4. Gán sự kiện đóng modal dọn dẹp dữ liệu cũ bước về Home
    document.getElementById('btnCloseSuccessModal').onclick = () => closeSuccessModal();
}

function closeSuccessModal() {
    const modal = document.getElementById('bookingSuccessModal');
    const card = modal?.querySelector('.relative');

    if (!modal || !card) return;

    // Ẩn mượt mà các Layer
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');
    modal.classList.add('opacity-0', 'pointer-events-none');

    // Reset lại toàn bộ Form và đưa luồng đặt lịch về Step 1
    selection = { branch: null, service: null, staff: null, date: null, time: null };
    document.getElementById('listService').innerHTML = '';
    document.getElementById('listStaff').innerHTML = '';
    document.getElementById('timeSlotGrid').innerHTML = '';
    currentStep = 1;
    updateStepUI();

    // Cuộn mượt màn hình lên đầu trang luồng đặt lịch
    const flowCont = document.getElementById('booking-flow-container');
    if (flowCont) flowCont.scrollTo({ top: 0, behavior: 'smooth' });
}

// BỔ SUNG BINDING VÀO WINDOW ĐỂ TRÁNH LỖI PHẠM VI MODULE
window.closeSuccessModal = closeSuccessModal;

// ==========================================
// TỐI ƯU HOÁ HÀM SUBMIT BOOKING CHẠY THỰC TẾ
// ==========================================
async function submitBooking() {
    if (!selection.time) return alert("Vui lòng chọn ca hẹn.");
    const btn = document.getElementById('btnNext');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ĐANG XỬ LÝ...';
    btn.disabled = true;

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let bookingCode = "";
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

        // Kích hoạt Premium Modal thay vì alert lỗi thời
        if (document.getElementById('finalForm')) document.getElementById('finalForm').reset();
        showSuccessModal(bookingCode, bookingData);

        // Chạy đồng bộ ngầm gửi lên hệ thống Google Sheets Automation
        fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'create_event', data: bookingData }) })
            .then(res => res.json())
            .then(async (result) => {
                if (result.status === 'success' && result.eventId) {
                    await updateDoc(doc(firebaseDb, "MaiTayData/Core/Bookings", docRef.id), { eventId: result.eventId });
                }
            }).catch(() => { });

    } catch (e) {
        console.error("Lỗi Firebase:", e);
        alert("Có lỗi xảy ra trong quá trình lưu dữ liệu, vui lòng kiểm tra kết nối mạng!");
    } finally {
        btn.innerHTML = 'XÁC NHẬN ĐẶT LỊCH <i class="fa-solid fa-check ml-1"></i>';
        btn.disabled = false;
    }
}

async function lookupBooking() {
    const inputVal = document.getElementById('lookupPhone').value.trim(); if (!inputVal) return;
    const btn = document.getElementById('btnLookup'); btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    try {
        let q;
        if (inputVal.length === 5 && !/^\d+$/.test(inputVal)) { q = query(collection(firebaseDb, "MaiTayData/Core/Bookings"), where("bookingCode", "==", inputVal.toUpperCase()), where("status", "==", "Đã nhận")); }
        else { const cleanPhone = inputVal.replace(/[^0-9]/g, ''); q = query(collection(firebaseDb, "MaiTayData/Core/Bookings"), where("phone", "==", cleanPhone), where("status", "==", "Đã nhận"), orderBy("startTime", "desc")); }
        const snapshot = await getDocs(q); const container = document.getElementById('lookupResults'); if (!container) return;
        if (snapshot.empty) { container.innerHTML = '<div class="bg-white p-4 rounded-xl text-center text-[11px] font-bold text-slate-400 uppercase border border-slate-100">Không tìm thấy thông tin</div>'; }
        else {
            let html = '';
            snapshot.forEach((docSnap) => {
                const b = docSnap.data(); const d = new Date(b.startTime); const tm = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                let mPhone = "N/A"; if (b.phone) { const p = String(b.phone).replace(/[^0-9]/g, ''); mPhone = p.length >= 6 ? `${p.substring(0, 3)} *** ${p.substring(p.length - 3)}` : p; }
                html += `<div class="bg-white border rounded-2xl p-5 shadow-sm mb-4"><div class="flex justify-between items-start mb-2"><p class="text-[9px] font-black text-slate-500 uppercase tracking-widest"><i class="fa-solid fa-location-dot mr-1"></i>${b.branchName}</p><span class="text-[10px] font-mono font-black px-2 py-0.5 bg-slate-100 rounded text-slate-800 tracking-wider">MÃ: ${b.bookingCode || 'N/A'}</span></div><h4 class="font-black text-slate-800 text-base mb-1">${b.serviceName}</h4><p class="text-[11px] font-bold text-slate-400 mb-3">Khách: ${b.customerName} (${mPhone})</p><div class="bg-slate-50 p-3 rounded-xl flex flex-col gap-2 mb-4"><div class="text-[11px] font-bold text-slate-600"><i class="fa-regular fa-clock mr-2 text-slate-400"></i>${tm}</div><div class="text-[11px] font-bold text-slate-600"><i class="fa-solid fa-user-tie mr-2 text-slate-400"></i>${b.staffName}</div></div><button onclick="window.cancelBooking('${docSnap.id}')" class="w-full py-3 text-rose-500 font-bold text-[10px] uppercase tracking-widest bg-white border border-rose-100 rounded-xl shadow-sm">Huỷ Lịch Hẹn</button></div>`;
            });
            container.innerHTML = html;
        }
    } catch (e) { alert("Lỗi tra cứu!"); } finally { btn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>'; }
}

async function cancelBooking(docId) {
    if (!confirm("Huỷ lịch hẹn này?")) return;
    try {
        const docRef = doc(firebaseDb, "MaiTayData/Core/Bookings", docId); const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const bData = docSnap.data(); await updateDoc(docRef, { status: "Đã huỷ" });
            if (bData.eventId) fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'cancel_event', eventId: bData.eventId }) }).catch(() => { });
            alert("Đã huỷ lịch!"); lookupBooking();
        }
    } catch (e) { alert("Lỗi huỷ lịch!"); }
}

// ==========================================
// LOGIC BLINK (FEED) - VUỐT & TỰ ĐỘNG CUỘN
// ==========================================

function checkAndShowSwipeHint() {
    const hint = document.getElementById('swipe-hint-overlay');
    const container = document.getElementById('feedContainer');
    if (!hint || !container) return;

    if (!localStorage.getItem('blinkHintSeen')) {
        hint.classList.remove('hidden', 'opacity-0');
        hint.classList.add('flex', 'opacity-100');

        const hideHint = () => {
            hint.classList.remove('opacity-100');
            hint.classList.add('opacity-0');
            setTimeout(() => hint.classList.add('hidden'), 500);
            localStorage.setItem('blinkHintSeen', 'true');

            container.removeEventListener('scroll', hideHint);
            container.removeEventListener('touchstart', hideHint);
        };

        container.addEventListener('scroll', hideHint, { once: true });
        container.addEventListener('touchstart', hideHint, { once: true });
    }
}

function setupVideoAutoplay() {
    const feedItems = document.querySelectorAll('.feed-item');
    const container = document.getElementById('feedContainer');
    if (feedObserver) feedObserver.disconnect();

    feedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            const img = entry.target.querySelector('img.lazy-img');
            const index = Array.from(feedItems).indexOf(entry.target);

            const scrollToNext = () => {
                if (index < feedItems.length - 1) {
                    const nextItem = feedItems[index + 1];
                    container.scrollTo({ top: nextItem.offsetTop, behavior: 'smooth' });
                }
            };

            if (entry.isIntersecting) {
                if (blinkAutoScrollTimer) clearTimeout(blinkAutoScrollTimer);

                // --- 1. KÍCH HOẠT LOAD MEDIA HIỆN TẠI NẾU CHƯA CÓ ---
                if (video && video.hasAttribute('data-src')) {
                    video.src = video.getAttribute('data-src');
                    video.removeAttribute('data-src');
                    video.setAttribute('preload', 'auto');
                    video.load();
                } else if (img && img.hasAttribute('data-src')) {
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                }

                // --- 2. PRELOAD NGẦM 3 FEED TIẾP THEO ---
                for (let i = 1; i <= 3; i++) {
                    if (index + i < feedItems.length) {
                        const nextItem = feedItems[index + i];
                        const nextVid = nextItem.querySelector('video');
                        const nextImg = nextItem.querySelector('img.lazy-img');

                        if (nextVid && nextVid.hasAttribute('data-src')) {
                            nextVid.src = nextVid.getAttribute('data-src');
                            nextVid.removeAttribute('data-src');
                            nextVid.setAttribute('preload', 'auto');
                            nextVid.load(); // Kích hoạt trình duyệt đệm trước video
                        } else if (nextImg && nextImg.hasAttribute('data-src')) {
                            nextImg.src = nextImg.getAttribute('data-src');
                            nextImg.removeAttribute('data-src');
                        }
                    }
                }

                // --- 3. XỬ LÝ AUTOPLAY & HIỆU ỨNG LOADING KHI MẠNG YẾU ---
                if (video) {
                    const loader = entry.target.querySelector('.media-loader');

                    // Bật spinner nếu video bị khựng lại để buffer
                    video.onwaiting = () => { if (loader) loader.style.display = 'flex'; };

                    // Tắt spinner khi video đủ dữ liệu chạy tiếp
                    video.onplaying = () => { if (loader) loader.style.display = 'none'; };
                    video.oncanplay = () => { if (loader) loader.style.display = 'none'; };
                    video.onerror = () => { if (loader) loader.style.display = 'none'; console.log("Lỗi tải video"); };
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => { /* Bỏ qua lỗi Auto-play bị chặn bởi trình duyệt */ });
                    }
                    video.onended = scrollToNext;
                } else {
                    blinkAutoScrollTimer = setTimeout(() => {
                        scrollToNext();
                    }, 10000);
                }
            } else {
                // Tạm dừng video khi lướt qua để tiết kiệm tài nguyên
                if (video) {
                    video.pause();
                    video.onended = null;
                }
                if (blinkAutoScrollTimer) clearTimeout(blinkAutoScrollTimer);
            }
        });
    }, { root: container, threshold: 0.6 });

    feedItems.forEach(item => feedObserver.observe(item));
}

if (document.getElementById('lookupPhone')) {
    document.getElementById('lookupPhone').addEventListener('input', () => {
        const val = document.getElementById('lookupPhone').value.trim();
        if (val.length === 5 || val.length >= 10) lookupBooking();
    });
}

// Đăng ký các hàm kiểm soát với biến window cục bộ để tránh lỗi scope module
window.rateStar = rateStar;
window.toggleAnonymousMode = toggleAnonymousMode;
window.submitFeedback = submitFeedback;

/**
 * Điều khiển chấm sao cho từng tiêu chí riêng biệt
 * @param {string} type - Loại tiêu chí ('attitude', 'service', 'space')
 * @param {number} rating - Số sao (1 - 5)
 */
function rateStar(type, rating) {
    document.getElementById(`fbRating-${type}`).value = rating;
    document.getElementById(`txt-rating-${type}`).innerText = rating.toFixed(1);
    
    const stars = document.querySelectorAll(`#stars-${type} i`);
    stars.forEach(star => {
        const idx = parseInt(star.getAttribute('data-index'));
        if (idx <= rating) {
            star.classList.remove('text-slate-200');
            star.classList.add('text-amber-400');
        } else {
            star.classList.remove('text-amber-400');
            star.classList.add('text-slate-200');
        }
    });
}

/**
 * Chuyển đổi trạng thái khi click chọn Gửi ẩn danh
 */
function toggleAnonymousMode(checkbox) {
    const infoFieldsGroup = document.getElementById('infoFieldsGroup');
    const nameInput = document.getElementById('fbName');
    const phoneInput = document.getElementById('fbPhone');
    const anonIcon = document.getElementById('anonymous-icon');

    if (checkbox.checked) {
        // Trạng thái Ẩn danh: Làm mờ, xóa giá trị bắt buộc và vô hiệu hóa nhập liệu
        infoFieldsGroup.classList.add('opacity-40', 'pointer-events-none');
        nameInput.removeAttribute('required');
        phoneInput.removeAttribute('required');
        nameInput.value = "";
        phoneInput.value = "";
        
        anonIcon.innerHTML = '<i class="fa-solid fa-user-secret text-slate-900"></i>';
        anonIcon.classList.add('bg-slate-100');
    } else {
        // Trạng thái Công khai: Mở khóa trường nhập liệu
        infoFieldsGroup.classList.remove('opacity-40', 'pointer-events-none');
        nameInput.setAttribute('required', 'required');
        phoneInput.setAttribute('required', 'required');
        
        anonIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
        anonIcon.classList.remove('bg-slate-100');
    }
}

async function submitFeedback(event) {
    event.preventDefault();
    
    const btnSubmit = document.getElementById('btnSubmitFeedback');
    const originalText = btnSubmit.innerHTML;
    
    btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-[10px]"></i> ĐANG GỬI...';
    btnSubmit.disabled = true;

    const isAnonymous = document.getElementById('fbAnonymous').checked;
    const cleanPhone = String(document.getElementById('fbPhone').value).replace(/[^0-9]/g, '');

    // Đóng gói cấu trúc thực thể dữ liệu mới
    const feedbackData = {
        isAnonymous: isAnonymous,
        customerName: isAnonymous ? "Khách hàng ẩn danh" : document.getElementById('fbName').value.trim(),
        phone: isAnonymous ? "Ẩn danh" : cleanPhone,
        
        // Lưu chi tiết điểm của từng tiêu chí
        ratings: {
            attitude: parseInt(document.getElementById('fbRating-attitude').value),
            service: parseInt(document.getElementById('fbRating-service').value),
            space: parseInt(document.getElementById('fbRating-space').value)
        },
        
        // Tính điểm trung bình cộng làm chỉ số tổng quan
        ratingAverage: parseFloat(((
            parseInt(document.getElementById('fbRating-attitude').value) +
            parseInt(document.getElementById('fbRating-service').value) +
            parseInt(document.getElementById('fbRating-space').value)
        ) / 3).toFixed(1)),
        
        message: document.getElementById('fbMessage').value.trim(),
        createdAt: new Date().toISOString(),
        uid: (isAnonymous || !auth.currentUser) ? null : auth.currentUser.uid
    };

    try {
        // Đồng bộ lên Firestore
        await addDoc(collection(firebaseDb, "MaiTayData/Core/Feedbacks"), feedbackData);
        
        // Gọi Custom Alert Modal xịn thay vì alert() truyền thống
        showCustomAlert(
            "Gửi góp ý thành công", 
            "Cảm ơn bạn đã đóng góp ý kiến chân thực để giúp Mai Tây ngày càng hoàn thiện hơn!", 
            "success"
        );
        
        // Reset form về trạng thái ban đầu
        document.getElementById('nativeFeedbackForm').reset();
        document.getElementById('fbAnonymous').checked = false;
        window.toggleAnonymousMode(document.getElementById('fbAnonymous'));
        
        // Trả các thanh sao về 5 sao mặc định
        window.rateStar('attitude', 5);
        window.rateStar('service', 5);
        window.rateStar('space', 5);
        
    } catch (error) {
        console.error("Lỗi gửi feedback:", error);
        
        // Gọi Custom Alert Modal báo lỗi thiết kế Apple
        showCustomAlert(
            "Gửi thất bại", 
            "Gặp sự cố mạng, hệ thống không thể ghi nhận đánh giá vào lúc này. Vui lòng thử lại!", 
            "error"
        );
    } finally {
        btnSubmit.innerHTML = originalText;
        btnSubmit.disabled = false;
    }
}