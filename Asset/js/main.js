
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, collection, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import fjGallery from "./fjGallery.js";

// --- Cấu hình Firebase ---
const firebaseConfigFromUser = {
    apiKey: "AIzaSyCTnDNOzI-8JYFfrxtJclFxe7vY27PM6FU",
    authDomain: "salon-mt.firebaseapp.com",
    projectId: "salon-mt",
    storageBucket: "salon-mt.firebasestorage.app",
    messagingSenderId: "1086041756251",
    appId: "1:1086041756251:web:5f7c4cc7144cc59be8a57e",
    measurementId: "G-3BV9HNVP29"
};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : firebaseConfigFromUser;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let app, db, auth;
let userId = null;
let currentBookingState = {};
let currentBookingStep = 1;

let currentGalleryView = 'grid'; // 'grid' hoặc 'justified'

// --- Hàm tiện ích ---
function showModal(title, message, confirmCallback = null) {
    const modal = document.getElementById('modal');
    modal.querySelector('#modal-title').textContent = title;
    modal.querySelector('#modal-message').textContent = message;
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
    const modalCloseBtn = modal.querySelector('#modal-close-button');
    const newBtn = modalCloseBtn.cloneNode(true);
    const closeModal = () => {
        modal.classList.add('opacity-0');
        setTimeout(() => { modal.classList.add('hidden'); newBtn.replaceWith(modalCloseBtn); }, 300);
    };
    if (confirmCallback) {
        newBtn.textContent = "Xác nhận";
        newBtn.onclick = () => { confirmCallback(); closeModal(); };
    } else {
        newBtn.textContent = "Đã hiểu";
        newBtn.onclick = closeModal;
    }
    modalCloseBtn.replaceWith(newBtn);
}
document.getElementById('modal-close-button').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
});
function formatFirebaseTimestamp(timestamp) { return timestamp?.toDate()?.toLocaleString('vi-VN') || '...'; }
function getTodayString() { return new Date().toISOString().split('T')[0]; }

// --- (MỚI) Logic Lightbox Gallery ---
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || '';
    lightboxModal.classList.add('visible');
    // Chặn cuộn body khi mở lightbox
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    lightboxModal.classList.remove('visible');
    document.body.style.overflow = '';
}
lightboxCloseBtn.addEventListener('click', closeLightbox);
lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) { // Chỉ đóng khi nhấp vào nền
        closeLightbox();
    }
});

// --- (MỚI) Logic Scroll Reveal ---
function setupScrollReveal() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    const mainContentContainer = document.getElementById('content-container');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
            // Tùy chọn: ẩn đi khi cuộn ra khỏi view
            // else {
            //    hideScrollElement(el);
            // }
        });
    };
    // Gọi 1 lần ban đầu để check
    setTimeout(handleScrollAnimation, 100);
    // Gán sự kiện cuộn cho container chính
    mainContentContainer.addEventListener('scroll', handleScrollAnimation);
}

// (MỚPre) Thay thế TOÀN BỘ hàm setupSlideshow cũ bằng hàm này
function setupSlideshow() {
    const slideshow = document.getElementById('image-slideshow');
    if (!slideshow) return;

    const sliderContainer = document.getElementById('slider-container');
    const prevBtn = document.getElementById('slider-prev-btn');
    const nextBtn = document.getElementById('slider-next-btn');
    const pauseBtn = document.getElementById('slider-pause-btn'); // (MỚI) Nút Pause
    const images = sliderContainer.querySelectorAll('.slide');
    const imageCount = images.length;

    if (imageCount <= 0) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'none'; // (MỚI) Ẩn nút nếu không có ảnh
        return;
    }

    let currentIndex = 0;
    let startX = 0;
    let isSwiping = false;
    let autoPlayInterval = null;
    let isPaused = false; // (MỚI) Trạng thái đang pause
    let timeSkip = 10000;
    // (MỚI) Hàm Dừng Autoplay (chỉ dừng interval)
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    // (MỚI) Hàm Bắt đầu Autoplay (tôn trọng trạng thái isPaused)
    function startAutoPlay() {
        stopAutoPlay(); // Xóa cái cũ trước
        if (isPaused) return; // Nếu người dùng chủ động pause, không chạy

        autoPlayInterval = setInterval(autoNextSlide, timeSkip); // 3 giây
    }

    // (MỚI) Hàm tự động qua slide (quay vòng)
    function autoNextSlide() {
        let nextIndex = (currentIndex + 1) % imageCount;
        goToSlide(nextIndex);
    }

    // Hàm chính để di chuyển slide
    function goToSlide(index) {
        // Quay vòng tay phải
        if (index >= imageCount) {
            index = 0;
        }
        // Quay vòng tay trái
        if (index < 0) {
            index = imageCount - 1;
        }

        currentIndex = index;
        const offset = -currentIndex * 100;
        sliderContainer.style.transform = `translateX(${offset}%)`;
    }


    // 1. Gán sự kiện cho Nút Bấm (Prev/Next)
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        startAutoPlay(); // Reset timer
    });
    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        startAutoPlay(); // Reset timer
    });

    // 2. Gán sự kiện cho Vuốt (Swipe)
    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
        sliderContainer.style.transition = 'none';
        stopAutoPlay(); // Tạm dừng khi bắt đầu vuốt
    });

    sliderContainer.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        let currentX = e.touches[0].clientX;
        let diff = currentX - startX;
        sliderContainer.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff}px))`;
    });

    sliderContainer.addEventListener('touchend', (e) => {
        if (!isSwiping) return;

        sliderContainer.style.transition = 'transform 0.5s ease-in-out';
        let endX = e.changedTouches[0].clientX;
        let diffX = startX - endX;

        if (diffX > 50) { // Vuốt sang trái (slide tiếp)
            goToSlide(currentIndex + 1);
        } else if (diffX < -50) { // Vuốt sang phải (slide trước)
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(currentIndex); // Quay lại slide hiện tại
        }

        isSwiping = false;
        startAutoPlay(); // Bắt đầu đếm lại sau khi thả tay
    });

    // 3. (MỚI) Gán sự kiện cho Nút Pause/Play
    pauseBtn.addEventListener('click', () => {
        if (isPaused) {
            // Nếu đang pause -> bấm Play
            isPaused = false;
            pauseBtn.classList.remove('paused');
            startAutoPlay(); // Chạy lại
        } else {
            // Nếu đang chạy -> bấm Pause
            isPaused = true;
            pauseBtn.classList.add('paused');
            stopAutoPlay(); // Dừng lại
        }
    });

    // 4. Khởi chạy slide đầu tiên
    goToSlide(0);
    startAutoPlay(); // Bắt đầu autoplay ngay khi tải trang
}

setupSlideshow();
// --- Logic Điều hướng (Navigation) ---
function showPage(pageId, title) {
    console.log(pageId);

    document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.add('active');
        document.getElementById('content-container').scrollTop = 0;
    }
    if (title) {
        document.getElementById('mobile-page-title').textContent = title;
    }
    document.querySelectorAll('#bottom-nav .nav-button').forEach(button => {
        button.classList.toggle('active', button.dataset.page === pageId);
    });
    document.querySelectorAll('#desktop-nav .desktop-nav-button').forEach(button => {
        button.classList.toggle('active', button.dataset.page === pageId);
    });
    // Tải dữ liệu khi chuyển trang (Chỉ khi trang đó được kích hoạt)
    if (pageId === 'page-news') loadNewsAndOffers();
    if (pageId === 'page-gallery') loadGallery();
    if (pageId === 'page-booking') loadBranches(); // Luôn tải chi nhánh khi vào trang đặt lịch

    // (MỚI) Kích hoạt lại scroll-reveal khi chuyển trang
    if (pageId === 'page-home' || pageId === 'page-review') {
        setTimeout(setupScrollReveal, 300); // Đợi page transition
    }
}

function setupTabs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const tabButtons = container.querySelectorAll('[data-tab-button]');
    const tabPanels = container.querySelectorAll('[data-tab-panel]');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tabButton;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabPanels.forEach(panel => {
                panel.classList.toggle('hidden', panel.dataset.tabPanel !== tabName);
            });
        });
    });
}

// --- Logic Đặt lịch (Booking) ---
function showBookingStep(step) {
    document.querySelectorAll('.booking-step').forEach(el => el.classList.add('hidden'));
    const stepEl = document.getElementById(`booking-step-${step}`);
    if (stepEl) stepEl.classList.remove('hidden');
    if (step === 5) loadClientInfo();
    currentBookingStep = step;
    document.getElementById('booking-back-button').classList.toggle('hidden', step <= 1 || step >= 6);
}
function previousBookingStep() { if (currentBookingStep > 1) showBookingStep(currentBookingStep - 1); }
function resetBookingFlow() {
    currentBookingState = {}; currentBookingStep = 1;
    showBookingStep(1);
    document.querySelectorAll('.selectable-item.active').forEach(btn => btn.classList.remove('active'));
}

async function loadBranches() {
    const listEl = document.getElementById('branch-list');
    listEl.innerHTML = `<div class="skeleton h-20 w-full"></div>`;
    try {
        const branchSnapshot = await getDocs(collection(db, `artifacts/${appId}/public/data/branches`));
        if (branchSnapshot.empty) { listEl.innerHTML = '<p class="text-sm text-red-500">Chưa có chi nhánh nào.</p>'; return; }
        listEl.innerHTML = '';
        const today = getTodayString();
        branchSnapshot.forEach(doc => {
            const branch = doc.data();
            const btn = document.createElement('button');
            // (ĐIỀU CHỈNH) Tự động nhận style .selectable-item
            btn.className = "w-full text-left p-3 rounded-lg selectable-item";
            btn.innerHTML = `<p class="font-medium text-gray-900">${branch.name}</p><p class="text-sm" style="color: var(--color-text-sec);">${branch.address}</p>`;
            let isClosedToday = branch.specialSchedule && branch.specialSchedule[today]?.status === 'closed';
            if (isClosedToday) {
                btn.disabled = true;
                btn.innerHTML += `<span class="block text-sm font-semibold text-red-600 mt-1">${branch.specialSchedule[today].note || "Tạm nghỉ"}</span>`;
            } else {
                btn.onclick = () => {
                    currentBookingState.branchId = doc.id; currentBookingState.branchData = branch;
                    listEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    loadDates(); showBookingStep(2);
                };
            }
            listEl.appendChild(btn);
        });
    } catch (error) { listEl.innerHTML = '<p class="text-sm text-red-500">Lỗi khi tải chi nhánh.</p>'; }
}

function loadDates() {
    const listEl = document.getElementById('date-list');
    listEl.innerHTML = '';
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const date = new Date(today); date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        const day = date.getDate(); const month = date.getMonth() + 1;
        const weekday = date.toLocaleDateString('vi-VN', { weekday: 'short' });
        const btn = document.createElement('button');
        btn.className = "p-2 rounded-lg text-sm text-center selectable-item"; // Tự nhận style
        btn.innerHTML = `<span class="font-medium">${weekday}</span><span class="block">${day}/${month}</span>`;
        btn.onclick = () => {
            currentBookingState.date = dateString;
            listEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadTimeSlots(); showBookingStep(3);
        };
        listEl.appendChild(btn);
    }
}

function isTimeSlotBlocked(timeSlot, blockedPeriods) {
    for (const period of blockedPeriods) {
        if (timeSlot >= period.startTime && timeSlot < period.endTime) return true;
    }
    return false;
}

async function loadTimeSlots() {
    const listEl = document.getElementById('timeslot-list');
    listEl.innerHTML = `<div class="skeleton h-14 w-full"></div>`;
    const { branchData: branch, date } = currentBookingState;
    if (!branch || !date) { listEl.innerHTML = '<p class="text-sm text-red-500 col-span-3">Vui lòng chọn chi nhánh và ngày.</p>'; return; }
    const totalSeats = branch.totalSeats || 5;
    const startTime = parseInt(branch.openingTime.split(':')[0]);
    const endTime = parseInt(branch.closingTime.split(':')[0]);
    const tempUsedSeats = branch.dailyOverrides?.[date]?.tempUsedSeats || 0;
    let bookedCounts = {}; let blockedPeriods = [];
    try {
        const q_bookings = query(collection(db, `artifacts/${appId}/public/data/bookings`), where("branchId", "==", currentBookingState.branchId), where("date", "==", date), where("status", "==", "confirmed"));
        const bookingSnapshot = await getDocs(q_bookings);
        bookingSnapshot.forEach(doc => { bookedCounts[doc.data().time] = (bookedCounts[doc.data().time] || 0) + 1; });
        const q_blocked = query(collection(db, `artifacts/${appId}/public/data/blocked_slots`), where("branchId", "==", currentBookingState.branchId), where("date", "==", date));
        const blockedSnapshot = await getDocs(q_blocked);
        blockedSnapshot.forEach(doc => blockedPeriods.push(doc.data()));
    } catch (error) { listEl.innerHTML = '<p class="text-sm text-red-500 col-span-3">Lỗi khi tải lịch.</p>'; return; }
    listEl.innerHTML = '';
    let hasSlot = false;
    const now = new Date();
    const isToday = (date === now.toISOString().split('T')[0]);
    for (let hour = startTime; hour < endTime; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            const booked = bookedCounts[timeString] || 0;
            const totalUsedSeats = booked + tempUsedSeats;
            const availableSeats = totalSeats - totalUsedSeats;
            const slotTime = new Date(`${date}T${timeString}`);
            const isPast = isToday && (slotTime < now);
            const isBlocked = isTimeSlotBlocked(timeString, blockedPeriods);
            const btn = document.createElement('button');
            btn.className = "p-2 rounded-lg text-sm text-center selectable-item"; // Tự nhận style
            let statusText = `(${availableSeats}/${totalSeats} ghế)`;
            if (isPast) statusText = `(Đã qua)`;
            else if (isBlocked) statusText = `(Đã bị khoá)`;
            else if (availableSeats <= 0) statusText = `(Hết ghế)`;
            btn.innerHTML = `${timeString}<span class="block text-xs">${statusText}</span>`;
            if (availableSeats <= 0 || isPast || isBlocked) {
                btn.disabled = true;
            } else {
                btn.onclick = () => {
                    currentBookingState.time = timeString;
                    listEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    loadTechnicians(); showBookingStep(4);
                };
            }
            listEl.appendChild(btn);
            hasSlot = true;
        }
    }
    if (!hasSlot) { listEl.innerHTML = '<p class="text-sm text-gray-500 col-span-3">Không có khung giờ nào.</p>'; }
}

async function loadTechnicians() {
    const listEl = document.getElementById('technician-list');
    listEl.innerHTML = `<div class="skeleton h-32 w-full"></div>`;
    try {
        const q = query(collection(db, `artifacts/${appId}/public/data/technicians`), where("branchId", "==", currentBookingState.branchId));
        const querySnapshot = await getDocs(q);
        listEl.innerHTML = '';
        const anyBtn = document.createElement('button');
        anyBtn.className = "w-full text-center p-3 rounded-lg flex flex-col items-center justify-center selectable-item h-full"; // Tự nhận style
        anyBtn.innerHTML = `
                    <i class="fas fa-users w-20 h-20 flex items-center justify-center text-3xl text-gray-500 bg-gray-100 rounded-full mb-2"></i>
                    <div><p class="font-medium text-sm">Để salon sắp xếp</p><p class="text-xs" style="color: var(--color-text-sec);">Stylist phù hợp</p></div>`;
        anyBtn.onclick = () => {
            currentBookingState.technicianId = 'any'; currentBookingState.technicianName = 'Salon sắp xếp';
            listEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            anyBtn.classList.add('active');
            showBookingStep(5);
        };
        listEl.appendChild(anyBtn);
        if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                const tech = doc.data();
                const btn = document.createElement('button');
                btn.className = "w-full text-center p-3 rounded-lg flex flex-col items-center justify-center selectable-item h-full"; // Tự nhận style
                const photoUrl = tech.photoUrl || `https://placehold.co/120x120/EAE8E4/777777?text=${tech.name[0]}`;
                btn.innerHTML = `
                            <img src="${photoUrl}" alt="${tech.name}" class="w-20 h-20 rounded-full object-cover mb-2">
                            <div><p class="font-medium text-sm">${tech.name}</p><p class="text-xs" style="color: var(--color-text-sec);">${tech.title}</p></div>`;
                btn.onclick = () => {
                    currentBookingState.technicianId = doc.id; currentBookingState.technicianName = tech.name;
                    listEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    showBookingStep(5);
                };
                listEl.appendChild(btn);
            });
        }
    } catch (error) { listEl.innerHTML = '<p class="text-sm text-red-500 col-span-2 md:col-span-3">Lỗi khi tải danh sách.</p>'; }
}
document.querySelectorAll('input[name="contact-method"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        document.getElementById('contact-phone-group').classList.toggle('hidden', e.target.value !== 'phone');
        document.getElementById('contact-social-group').classList.toggle('hidden', e.target.value !== 'social');
    });
});
document.getElementById('submit-booking').addEventListener('click', async () => {
    if (!userId) { showModal("Lỗi", "Bạn cần đăng nhập để đặt lịch."); return; }
    const clientName = document.getElementById('client-name').value.trim();
    const contactMethod = document.querySelector('input[name="contact-method"]:checked').value;
    const clientPhone = document.getElementById('client-phone').value.trim();
    const socialPlatform = document.getElementById('social-platform').value;
    const socialDetail = document.getElementById('social-detail').value.trim();
    if (!clientName || (contactMethod === 'phone' && !clientPhone) || (contactMethod === 'social' && !socialDetail)) {
        showModal("Thông báo", "Vui lòng nhập đầy đủ thông tin bắt buộc (*)."); return;
    }
    localStorage.setItem('clientBookingInfo', JSON.stringify({ name: clientName, phone: clientPhone, socialPlatform, socialDetail, contactMethod }));
    const bookingCode = `MAITAY-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const bookingData = {
        ...currentBookingState, clientId: userId, clientName, contactMethod,
        contactDetail: contactMethod === 'phone' ? clientPhone : `${socialPlatform}: ${socialDetail}`,
        priorityCode: document.getElementById('priority-code').value.trim(),
        bookingCode, status: 'confirmed', createdAt: serverTimestamp(),
        branchName: currentBookingState.branchData.name
    };
    delete bookingData.branchData;
    try {
        await addDoc(collection(db, `artifacts/${appId}/public/data/bookings`), bookingData);
        document.getElementById('booking-code').textContent = bookingCode;
        showBookingStep(6);
        loadBookingHistory();
    } catch (error) { showModal("Lỗi", "Đã xảy ra lỗi khi đặt lịch."); }
});
document.getElementById('new-booking-button').addEventListener('click', resetBookingFlow);
document.getElementById('booking-back-button').addEventListener('click', previousBookingStep);

async function loadBookingHistory() {
    if (!userId) return;
    const listEl = document.getElementById('booking-history-list');
    listEl.innerHTML = '<p class="text-sm text-center text-gray-500">Đang tải lịch sử...</p>';
    try {
        const q = query(collection(db, `artifacts/${appId}/public/data/bookings`), where("clientId", "==", userId));
        const querySnapshot = await getDocs(q);
        let bookings = [];
        querySnapshot.forEach(doc => bookings.push({ id: doc.id, ...doc.data() }));
        bookings.sort((a, b) => (b.createdAt && a.createdAt) ? b.createdAt.toDate() - a.createdAt.toDate() : 0);
        if (bookings.length === 0) {
            listEl.innerHTML = '<p class="text-sm text-center text-gray-500">Bạn chưa có lịch sử đặt chỗ nào.</p>';
            return;
        }
        listEl.innerHTML = '';
        bookings.forEach(booking => {
            const card = document.createElement('div');
            card.className = "card-light p-4 space-y-1 !shadow-sm"; // Tự nhận style
            const bookingTime = new Date(`${booking.date}T${booking.time}`);
            const now = new Date();
            const bookingCreatedAt = booking.createdAt?.toDate();
            let canCancel = false;
            if (booking.status === 'confirmed') {
                const minsBeforeAppointment = (bookingTime.getTime() - now.getTime()) / 60000;
                const minsAfterBooking = bookingCreatedAt ? (now.getTime() - bookingCreatedAt.getTime()) / 60000 : Infinity;
                canCancel = (minsBeforeAppointment > 45) || (minsAfterBooking < 15);
            }
            let statusHtml = '';
            if (booking.status === 'confirmed') statusHtml = '<p class="text-green-600 font-medium">Đã xác nhận</p>';
            else if (booking.status === 'cancelled') statusHtml = '<p class="text-red-600 font-medium">Đã huỷ</p>';
            else if (booking.status === 'completed') statusHtml = '<p class="text-blue-600 font-medium">Đã hoàn thành</p>';
            else statusHtml = `<p class="text-yellow-600 font-medium capitalize">${booking.status || 'Đang chờ'}</p>`;
            card.innerHTML = `
                        <p class="text-sm font-medium text-gray-500">Mã: ${booking.bookingCode}</p>
                        <p class="text-lg font-semibold text-gray-900">${booking.branchName || 'N/A'}</p>
                        <p class="text-gray-700 text-sm">Thời gian: ${booking.time} - ${new Date(booking.date).toLocaleDateString('vi-VN')}</p>
                        <p class="text-gray-700 text-sm">Kỹ thuật viên: ${booking.technicianName || 'Salon sắp xếp'}</p>
                        <div class="pt-2 flex justify-between items-center">
                            ${statusHtml}
                            ${canCancel ? `<button data-id="${booking.id}" class="cancel-booking-btn text-sm text-red-600 hover:underline">Huỷ lịch</button>` : ''}
                        </div>`;
            listEl.appendChild(card);
        });
        document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                showModal("Xác nhận", "Bạn có chắc chắn muốn huỷ lịch hẹn này không?", () => {
                    cancelBooking(e.target.dataset.id);
                });
            });
        });
    } catch (error) { listEl.innerHTML = '<p class="text-sm text-red-500 text-center">Lỗi khi tải lịch sử.</p>'; }
}
async function cancelBooking(bookingId) {
    try {
        await updateDoc(doc(db, `artifacts/${appId}/public/data/bookings`, bookingId), { status: 'cancelled' });
        showModal("Thành công", "Đã huỷ lịch hẹn của bạn.");
        loadBookingHistory();
    } catch (error) { showModal("Lỗi", "Không thể huỷ lịch."); }
}

// --- Tải nội dung cho các trang riêng lẻ ---
async function loadNewsAndOffers() {
    const listEl = document.getElementById('news-all-container');
    listEl.innerHTML = `<div class="skeleton h-24 w-full"></div>`;
    try {
        const q = query(collection(db, `artifacts/${appId}/public/data/news`));
        const snapshot = await getDocs(q);
        let items = [];
        snapshot.forEach(doc => items.push(doc.data()));
        items.sort((a, b) => (b.createdAt && a.createdAt) ? b.createdAt.toDate() - a.createdAt.toDate() : 0);
        listEl.innerHTML = '';
        if (items.length === 0) { listEl.innerHTML = '<p class="text-sm text-center text-gray-500">Chưa có tin tức nào.</p>'; return; }
        items.forEach(item => {
            const el = document.createElement('div');
            el.className = "card-light p-4"; // Tự nhận style
            const typeLabel = item.type === 'offer'
                ? `<span class="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Ưu đãi</span>`
                : `<span class="text-xs font-medium px-2 py-0.5 rounded-full" style="color: var(--color-accent); background-color: var(--color-accent-light-bg);">Tin tức</span>`;
            el.innerHTML = `
                        <div class="flex justify-between items-center mb-1">
                            <h3 class="text-lg font-serif text-gray-900">${item.title}</h3>
                            ${typeLabel}
                        </div>
                        <p class="text-sm text-gray-500 mb-2">${formatFirebaseTimestamp(item.createdAt)}</p>
                        <div class="text-sm text-gray-700 prose prose-sm max-w-none">${item.content}</div>`;
            listEl.appendChild(el);
        });
    } catch (error) { listEl.innerHTML = '<p class="text-sm text-red-500 text-center">Lỗi khi tải dữ liệu.</p>'; }
}

// (MỚI) Thay thế toàn bộ hàm loadGallery
// (MỚI) Thay thế toàn bộ hàm loadGallery
async function loadGallery() {
    const listEl = document.getElementById('gallery-grid');

    // Cập nhật skeleton dựa trên view
    if (currentGalleryView === 'grid') {
        listEl.innerHTML = `<div class="skeleton w-full h-auto aspect-[4/5]"></div>`;
    } else {
        listEl.innerHTML = `<div class="skeleton w-full h-64 rounded-3xl"></div>`;
    }

    try {
        const q = query(collection(db, `artifacts/${appId}/public/data/gallery`));
        const snapshot = await getDocs(q);
        let items = [];
        snapshot.forEach(doc => items.push(doc.data()));
        items.sort((a, b) => (b.createdAt && a.createdAt) ? b.createdAt.toDate() - a.createdAt.toDate() : 0);
        listEl.innerHTML = '';
        if (items.length === 0) { listEl.innerHTML = '<p class="text-sm col-span-full text-center text-gray-500">Chưa có ảnh nào.</p>'; return; }

        // (MỚI) Lặp và tạo HTML
        items.forEach(item => {
            const el = document.createElement('div');

            if (currentGalleryView === 'grid') {
                // Chế độ 'grid' (như cũ)
                el.className = "relative group rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer";
                el.innerHTML = `
                            <img src="${item.imageUrl}" alt="${item.caption || 'Ảnh'}" class="object-cover w-full h-auto aspect-[4/5] transition-transform duration-300 group-hover:scale-105" onerror="this.src='https://placehold.co/400x500/EAE8E4/777777?text=Lỗi+ảnh';">
                            <div class="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-70 text-white text-xs opacity-100 group-hover:opacity-100 transition-opacity duration-300">${item.caption || ''}</div>`;

                // Sự kiện click (cho chế độ grid)
                el.addEventListener('click', () => {
                    openLightbox(item.imageUrl, item.caption || '');
                });

            } else {
                // (ĐIỀU CHỈNH) Chế độ 'justified'
                // (MỚI) Thêm 'relative' và 'group'
                el.className = "fj-gallery-item cursor-pointer relative group";
                el.innerHTML = `
                            <img src="${item.imageUrl}" data-fj-src="${item.imageUrl}" alt="${item.caption || 'Ảnh'}" />
                            <div class="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-70 text-white text-xs opacity-100 transition-opacity duration-300">${item.caption || ''}</div>
                        `;
                // (CSS mới đã xử lý style cho img, nên ta bỏ style inline)

                // Sự kiện click (cho chế độ justified)
                el.addEventListener('click', () => {
                    openLightbox(item.imageUrl, item.caption || '');
                });
            }
            listEl.appendChild(el);
        });

        // (MỚI) Nếu là 'justified', khởi chạy thư viện sau khi lặp xong
        if (currentGalleryView === 'justified' && items.length > 0) {

            // (MỚI) Dùng setTimeout(..., 0) để trì hoãn
            // Điều này cho trình duyệt 1 tích tắc để render các <img> đã được thêm
            // trước khi thư viện cố gắng "đo" chúng.
            setTimeout(() => {
                fjGallery(listEl, {
                    itemMargin: 4,
                    rowHeight: 160,
                    justifyLastRow: false
                });
            }, 0); // 0 mili-giây là đủ
        }

    } catch (error) {
        console.error("Lỗi khi tải gallery:", error);
        listEl.innerHTML = '<p class="text-sm text-red-500 col-span-full text-center">Lỗi khi tải dữ liệu.</p>';
    }
}

// (MỚI) Thay thế TOÀN BỘ khối này
// Gán sự kiện cho Nút chuyển đổi Gallery (Grid/Justified)
const gridBtn = document.getElementById('gallery-toggle-grid');
const justifiedBtn = document.getElementById('gallery-toggle-justified');

// (MỚI) Phải dùng 'let' vì chúng ta sẽ tạo 'div' mới
let galleryGrid = document.getElementById('gallery-grid');
// (MỚI) Tìm cha của nó
const galleryGridParent = galleryGrid.parentElement;

if (gridBtn && justifiedBtn && galleryGrid) {

    gridBtn.addEventListener('click', () => {
        if (currentGalleryView === 'grid') return;
        currentGalleryView = 'grid';
        gridBtn.classList.add('active');
        justifiedBtn.classList.remove('active');

        // (MỚI) Bước 1: Xóa sổ div cũ
        galleryGrid.remove();

        // (MỚI) Bước 2: Tạo div mới tinh
        const newGalleryGrid = document.createElement('div');
        newGalleryGrid.id = 'gallery-grid';
        newGalleryGrid.className = 'grid grid-cols-2 md:grid-cols-3 gap-3';

        // (MỚI) Bước 3: Thêm div mới vào DOM
        galleryGridParent.appendChild(newGalleryGrid);

        // (MỚI) Bước 4: Cập nhật biến để lần nhấp sau tìm thấy div mới
        galleryGrid = newGalleryGrid;

        loadGallery(); // Tải lại
    });

    justifiedBtn.addEventListener('click', () => {
        if (currentGalleryView === 'justified') return;
        currentGalleryView = 'justified';
        justifiedBtn.classList.add('active');
        gridBtn.classList.remove('active');

        // (MỚI) Bước 1: Xóa sổ div cũ
        galleryGrid.remove();

        // (MỚI) Bước 2: Tạo div mới tinh
        const newGalleryGrid = document.createElement('div');
        newGalleryGrid.id = 'gallery-grid';
        // Không cần class, fjGallery sẽ tự thêm

        // (MỚI) Bước 3: Thêm div mới vào DOM
        galleryGridParent.appendChild(newGalleryGrid);

        // (MỚI) Bước 4: Cập nhật biến
        galleryGrid = newGalleryGrid;

        loadGallery(); // Tải lại
    });
}

function setupReviewForm() {
    // (MỚI) Thêm sự kiện cho nút Đặt Lịch trên trang chủ
    const homeBookBtn = document.getElementById('home-book-now-btn');
    if (homeBookBtn) {
        homeBookBtn.addEventListener('click', () => {
            // Tìm nút nav "Đặt lịch" (desktop hoặc mobile) và giả lập 1 cú click
            const bookingNavButton = document.querySelector('.desktop-nav-button[data-page="page-booking"]');
            if (bookingNavButton) {
                bookingNavButton.click(); // Chuyển trang trên desktop
            } else {
                const mobileBookingBtn = document.querySelector('.nav-button[data-page="page-booking"]');
                if (mobileBookingBtn) {
                    mobileBookingBtn.click(); // Chuyển trang trên mobile
                }
            }
        });
    }
    document.querySelectorAll('.star-rating-group div[data-rating-for]').forEach(starContainer => {
        const stars = starContainer.querySelectorAll('i.fas.fa-star');
        const ratingFor = starContainer.dataset.ratingFor;
        const hiddenInput = document.getElementById(`rating-${ratingFor}`);
        const detailInput = document.getElementById(`rating-detail-${ratingFor}`);
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = parseInt(star.dataset.value);
                hiddenInput.value = value;
                stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value) <= value));
                detailInput.classList.toggle('hidden', value >= 4);
            });
        });
    });
    document.getElementById('submit-review').addEventListener('click', async () => {
        if (!userId) { showModal("Lỗi", "Bạn cần đăng nhập để gửi đánh giá."); return; }
        const name = document.getElementById('review-name').value.trim();
        const phone = document.getElementById('review-phone').value.trim();
        const serviceRating = parseInt(document.getElementById('rating-service').value);
        const attitudeRating = parseInt(document.getElementById('rating-attitude').value);
        if (!name || !phone) { showModal("Thông báo", "Vui lòng nhập Tên và Số điện thoại."); return; }
        if (serviceRating === 0 || attitudeRating === 0) { showModal("Thông báo", "Vui lòng đánh giá đủ 2 mục."); return; }
        const reviewData = {
            clientId: userId, clientName: name, clientPhone: phone,
            anonymous: document.getElementById('review-anonymous').checked,
            serviceRating, attitudeRating,
            serviceDetail: document.getElementById('rating-detail-service').value.trim(),
            attitudeDetail: document.getElementById('rating-detail-attitude').value.trim(),
            feedback: document.getElementById('review-feedback').value.trim(),
            createdAt: serverTimestamp()
        };
        try {
            await addDoc(collection(db, `artifacts/${appId}/public/data/reviews`), reviewData);
            document.getElementById('review-form-container').classList.add('hidden');
            document.getElementById('review-thank-you').classList.remove('hidden');
        } catch (error) { showModal("Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại."); }
    });
}

function loadClientInfo() {
    try {
        const clientData = localStorage.getItem('clientBookingInfo');
        if (clientData) {
            const info = JSON.parse(clientData);
            document.getElementById('client-name').value = info.name || '';
            document.getElementById('client-phone').value = info.phone || '';
            document.getElementById('social-platform').value = info.socialPlatform || 'facebook';
            document.getElementById('social-detail').value = info.socialDetail || '';
            const methodRadio = document.querySelector(`input[name="contact-method"][value="${info.contactMethod}"]`);
            if (methodRadio) { methodRadio.checked = true; methodRadio.dispatchEvent(new Event('change')); }
        }
    } catch (e) { console.error("Không thể tải thông tin client:", e); }
}

// --- Hàm Khởi chạy (Main) ---
async function main() {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
    } catch (error) {
        document.body.innerHTML = '<div class="p-4 text-red-600">Lỗi kết nối máy chủ.</div>';
        return;
    }
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            userId = user.uid;
            loadBookingHistory();
        } else {
            try {
                if (initialAuthToken) await signInWithCustomToken(auth, initialAuthToken);
                else await signInAnonymously(auth);
            } catch (error) { showModal("Lỗi xác thực", "Không thể kết nối đến dịch vụ."); }
        }
    });

    // Gán sự kiện cho Nav (Mobile & Desktop)
    const allNavButtons = document.querySelectorAll('.nav-button, .desktop-nav-button');
    allNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.dataset.page;
            const title = button.dataset.title;
            showPage(pageId, title);
        });
    });

    // Gán sự kiện cho Tab (bên trong trang Đặt lịch)
    setupTabs('booking-tabs');
    document.querySelector('[data-tab-button="tab-booking-history"]').addEventListener('click', loadBookingHistory);

    // Gán sự kiện cho Tab (bên trong trang Tin tức)
    setupTabs('news-tabs');

    // Gán sự kiện cho Form Đánh giá
    setupReviewForm();

    // Khởi chạy trang chủ
    showPage('page-home', 'Giới thiệu');

    // (MỚI) Khởi chạy Scroll Reveal cho lần tải đầu tiên
    setupScrollReveal();
}
document.addEventListener('DOMContentLoaded', main);
