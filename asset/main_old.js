// ==========================================
// CẤU HÌNH GIAO DIỆN CHÍNH (APP_CONFIG)
// Quản lý toàn bộ nội dung tĩnh của App tại đây
// ==========================================
const APP_CONFIG = {
    general: {
        name: "Mai Tây Hair Salon",
        slogan: "Premium Hair Studio",
        rating: "5.0",
        openHours: {
            status: 1, // 1: Mở cửa (Pulse Xanh), 2: Bảo trì (Pulse Vàng), 3: Đóng cửa (Đỏ)
            text: "Mở cửa từ 8h đến 20h",
            reason: ""
        },
        version: "v1.0.2" // Đổi version để ép trình duyệt cập nhật cache
    },

    contact: {
        phoneDisplay: "0909 123 456",
        phoneLink: "0909123456",
        zaloLink: "https://zalo.me/0909123456"
    },

    heroBlock: {
        sliderImages: [
            "./asset/images/BGMT.jpg",
            "./asset/images/BGMT.jpg"
        ],
        isFlashSale: true, // Đã bật TRUE để kích hoạt giao diện đếm ngược
        normalBooking: {
            title: "Trải Nghiệm Đẳng Cấp",
            desc: "Đặt lịch để giữ chỗ ngay hôm nay.",
            btnText: "ĐẶT LỊCH NGAY",
            icon: "fa-calendar-check"
        },
        flashSale: {
            title: "Flash Sale Đặc Quyền Vip",
            desc: "Giảm ngay 50% cho 5 khách hàng đặt lịch sớm nhất trong ngày. Giữ chỗ ngay trước khi kết thúc!",
            btnText: "SĂN DEAL NGAY",
            // Đặt thời điểm kết thúc tuyệt đối (Năm-Tháng-Ngày T Giờ:Phút:Giây)
            endTime: "2026-05-12T23:59:59"
        }
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
        {
            type: "Ưu đãi",
            title: "Giảm 20% Dịch Vụ Hóa Chất",
            desc: "Áp dụng cho hóa đơn từ 500k trở lên. Nhập mã lúc thanh toán.",
            code: "MAITAY20",
            gradient: "from-slate-500 to-slate-800",
            icon: "fa-gift"
        },
        {
            type: "Voucher",
            title: "Miễn Phí Hấp Phục Hồi Keratin",
            desc: "Dành riêng cho khách hàng lần đầu tiên sử dụng dịch vụ.",
            code: "NEWBIE",
            gradient: "from-rose-500 to-rose-800",
            icon: "fa-ticket"
        }
    ],

    feed: [
        {
            isVideo: true,
            url: "https://res.cloudinary.com/dt8zhfng8/video/upload/v1778504963/cobek2edjzufp98eknbp.mp4",
            img: "https://res.cloudinary.com/dt8zhfng8/video/upload/v1778504963/cobek2edjzufp98eknbp.mp4",
            fomoText: "Sắp hết chỗ",
            fomoIcon: "fa-bolt",
            title: "Kiểu uốn layer bồng bềnh tự nhiên chuẩn Hàn Quốc cho các nàng công sở"
        },
        {
            isVideo: true,
            url: "https://res.cloudinary.com/dt8zhfng8/video/upload/q_auto/f_auto/v1778505437/ghgxwzhekglanycyx9p6.mp4",
            img: "https://res.cloudinary.com/dt8zhfng8/video/upload/q_auto/f_auto/v1778505437/ghgxwzhekglanycyx9p6.mp4",
            fomoText: "Sắp hết chỗ",
            fomoIcon: "fa-bolt",
            title: "Kiểu uốn layer bồng bềnh tự nhiên chuẩn Hàn Quốc cho các nàng công sở"
        }
    ],

    store: [
        {
            id: 'P1',
            name: 'by Hunq',
            sub: 'Design & Build',
            brand: 'Hunq',
            price: 'Liên hệ',
            desc: 'Gói thiết kế & phát triển Web App chuyên nghiệp, tối ưu hóa UI/UX.',
            themeColor: '#f59e0b',
            img: '/Asset/logo/logo.png'
        },
        {
            id: 'P2',
            name: 'Pro Premium',
            sub: 'System Architecture',
            brand: 'Hunq',
            price: 'Liên hệ',
            desc: 'Xây dựng hệ thống quản lý toàn diện với hiệu suất cao.',
            themeColor: '#06b6d4',
            img: '/Asset/logo/logo.png'
        }
    ]
};


// ==========================================
// 1. IMPORT FIREBASE & CẤU HÌNH
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
// THÊM CÁC IMPORT CHO AUTHENTICATION
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    sendPasswordResetEmail, 
    onAuthStateChanged, 
    updateProfile,
    signOut,
    updatePassword,
    EmailAuthProvider,         
    reauthenticateWithCredential,
    signInWithRedirect,   
    getRedirectResult
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

// KHỞI TẠO AUTHENTICATION
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ==========================================
// THÊM: LOGIC CHO TAB THÀNH VIÊN (MEMBER AUTH)
// ==========================================
let currentAuthMode = 'login'; // login | register | forgot

// Hàm quản lý chuyển đổi UI Form
window.toggleAuthMode = (mode) => {
    currentAuthMode = mode;
    const nameInput = document.getElementById('authName');
    const passInput = document.getElementById('authPass');
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const btnSubmit = document.getElementById('btn-auth-submit');
    const btnForgot = document.getElementById('btn-forgot-pass');
    const socialGroup = document.getElementById('social-login-group');
    
    // Reset tabs
    document.getElementById('btn-tab-login').className = "flex-1 py-2.5 text-[11px] font-bold text-slate-500 rounded-lg transition-all hover:text-slate-700";
    document.getElementById('btn-tab-register').className = "flex-1 py-2.5 text-[11px] font-bold text-slate-500 rounded-lg transition-all hover:text-slate-700";

    if (mode === 'login') {
        document.getElementById('btn-tab-login').className = "flex-1 py-2.5 text-[11px] font-bold text-slate-900 bg-white shadow-sm rounded-lg transition-all";
        nameInput.classList.add('hidden'); nameInput.required = false;
        passInput.classList.remove('hidden'); passInput.required = true;
        btnForgot.classList.remove('hidden');
        socialGroup.classList.remove('hidden');
        title.innerText = "Chào mừng trở lại";
        subtitle.innerText = "Vui lòng đăng nhập để tiếp tục";
        btnSubmit.innerText = "ĐĂNG NHẬP";
    } else if (mode === 'register') {
        document.getElementById('btn-tab-register').className = "flex-1 py-2.5 text-[11px] font-bold text-slate-900 bg-white shadow-sm rounded-lg transition-all";
        nameInput.classList.remove('hidden'); nameInput.required = true;
        passInput.classList.remove('hidden'); passInput.required = true;
        btnForgot.classList.add('hidden');
        socialGroup.classList.remove('hidden');
        title.innerText = "Đăng ký thành viên";
        subtitle.innerText = "Mở khóa nhiều đặc quyền từ Mai Tây";
        btnSubmit.innerText = "TẠO TÀI KHOẢN";
    } else if (mode === 'forgot') {
        document.getElementById('btn-tab-login').className = "flex-1 py-2.5 text-[11px] font-bold text-slate-900 bg-white shadow-sm rounded-lg transition-all";
        nameInput.classList.add('hidden'); nameInput.required = false;
        passInput.classList.add('hidden'); passInput.required = false;
        btnForgot.classList.add('hidden');
        socialGroup.classList.add('hidden');
        title.innerText = "Khôi phục mật khẩu";
        subtitle.innerText = "Nhập email đã đăng ký để đặt lại";
        btnSubmit.innerText = "GỬI LIÊN KẾT ĐẶT LẠI";
    }
};

// Hàm xử lý Submit Form (Đăng nhập/Đăng ký/Khôi phục)
window.handleAuthSubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-auth-submit');
    const originalText = btn.innerText;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
    btn.disabled = true;

    const email = document.getElementById('authEmail').value;
    const pass = document.getElementById('authPass').value;
    const name = document.getElementById('authName').value;

    try {
        if (currentAuthMode === 'login') {
            await signInWithEmailAndPassword(auth, email, pass);
        } 
        else if (currentAuthMode === 'register') {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            await updateProfile(userCredential.user, { displayName: name });
        } 
        else if (currentAuthMode === 'forgot') {
            await sendPasswordResetEmail(auth, email);
            CustomModal.alert("Đã gửi liên kết khôi phục. Vui lòng kiểm tra Email!", "success");
            toggleAuthMode('login');
        }
    } catch (error) {
        let errorMsg = "Có lỗi xảy ra, vui lòng thử lại!";
        if (error.code === 'auth/email-already-in-use') errorMsg = "Email này đã được sử dụng!";
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') errorMsg = "Tài khoản hoặc mật khẩu không chính xác!";
        if (error.code === 'auth/weak-password') errorMsg = "Mật khẩu quá yếu, ít nhất 6 ký tự!";
        CustomModal.alert(errorMsg, "error");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
};

// Đăng nhập bằng Google dạng Popup chuẩn
window.handleGoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        
        // Đã sửa 'user' thành 'result.user'
        if (result.user) {
            console.log("Đăng nhập thành công tài khoản:", result.user.email);
            // Giao diện sẽ tự động chuyển sang tab Thành viên nhờ hàm onAuthStateChanged
        }
    } catch (error) {
        console.error("Lỗi đăng nhập Google Popup:", error);
        
        // Xử lý các trường hợp lỗi phổ biến để báo cho người dùng
        if (error.code === 'auth/popup-closed-by-user') {
            CustomModal.alert("Bạn đã đóng cửa sổ đăng nhập trước khi hoàn tất.", "warning");
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            CustomModal.alert("Email này đã được đăng ký bằng tài khoản Mật khẩu. Vui lòng đăng nhập bằng mật khẩu!", "warning");
        } else if (error.code === 'auth/blocked-by-popup-blocker') {
            CustomModal.alert("Trình duyệt của bạn đang chặn hiển thị cửa sổ Popup. Vui lòng cấp quyền mở Popup cho trang web này!", "error");
        } else {
            CustomModal.alert("Lỗi hệ thống: " + error.code, "error");
        }
    }
};
// Xử lý kết quả sau khi Google chuyển hướng về lại trang web
getRedirectResult(auth)
    .then((result) => {
        if (result) {
            console.log("Đăng nhập Google thành công:", result.user.email);
            // Giao diện sẽ tự chuyển sang tab Thành viên nhờ onAuthStateChanged
        }
    })
    .catch((error) => {
        console.error("Lỗi Redirect Google:", error);
        
        // Bắt chính xác lỗi trùng email
        if (error.code === 'auth/account-exists-with-different-credential') {
            CustomModal.alert("Email này đã được đăng ký bằng tài khoản Mật khẩu. Vui lòng đăng nhập bằng mật khẩu!", "warning");
        } 
        // Bắt lỗi chặn Popup/Redirect
        else if (error.code === 'auth/web-storage-unsupported') {
            CustomModal.alert("Trình duyệt đang chặn Cookie. Vui lòng mở bằng tab thường hoặc Safari tắt 'Prevent cross-site tracking'.", "error");
        } 
        else {
            CustomModal.alert("Lỗi đăng nhập Google: " + error.code, "error");
        }
    });
// Đăng xuất
window.handleLogout = async () => {
    const isConfirm = await CustomModal.confirm("Bạn có chắc muốn đăng xuất?");
    if (isConfirm) {
        await signOut(auth);
    }
};

// Thêm các biến hàm vào window để gọi từ HTML
window.toggleEditProfileForm = toggleEditProfileForm;
window.handleSaveProfile = handleSaveProfile;

// Lắng nghe trạng thái đăng nhập hệ thống
onAuthStateChanged(auth, async (user) => {
    const authSection = document.getElementById('member-auth-section');
    const profileSection = document.getElementById('member-profile-section');
    
    // Khai báo các phần tử thẻ QR ngoài trang chủ
    const homeQrLoggedOut = document.getElementById('home-qr-logged-out');
    const homeQrLoggedIn = document.getElementById('home-qr-logged-in');
    
    if (user) {
        // Tab Thành viên
        authSection.classList.add('hidden');
        authSection.classList.remove('flex');
        profileSection.classList.remove('hidden');
        profileSection.classList.add('flex');

        document.getElementById('profile-uid').innerText = user.uid.substring(0, 10).toUpperCase();
        
        document.getElementById('qr-loading').style.display = 'flex';
        document.getElementById('profile-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${user.uid}&color=0f172a`;

        // UI Trang chủ (Ẩn đăng nhập, hiện QR)
        if (homeQrLoggedOut && homeQrLoggedIn) {
            homeQrLoggedOut.classList.add('hidden');
            homeQrLoggedOut.classList.remove('flex');
            homeQrLoggedIn.classList.remove('hidden');
            
            document.getElementById('home-qr-loading').style.display = 'flex';
            document.getElementById('home-mini-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${user.uid}&color=0f172a`;
        }

        await loadUserProfile(user);

    } else {
        // Tab Thành viên
        authSection.classList.remove('hidden');
        authSection.classList.add('flex');
        profileSection.classList.add('hidden');
        profileSection.classList.remove('flex');
        document.getElementById('authForm').reset();
        
        // XÓA TRỐNG FORM ĐẶT LỊCH KHI ĐĂNG XUẤT (THÊM ĐOẠN NÀY)
        if (document.getElementById('finalForm')) document.getElementById('finalForm').reset();
        
        // UI Trang chủ (Hiện nút đăng nhập, ẩn QR)
        if (homeQrLoggedOut && homeQrLoggedIn) {
            homeQrLoggedOut.classList.remove('hidden');
            homeQrLoggedOut.classList.add('flex');
            homeQrLoggedIn.classList.add('hidden');
        }
    }
});

// ==========================================
// CÁC HÀM XỬ LÝ GIAO DIỆN & BẢO MẬT TÀI KHOẢN
// ==========================================
window.toggleSensitiveInfo = toggleSensitiveInfo;
window.toggleChangePasswordForm = toggleChangePasswordForm;
window.handleChangePassword = handleChangePassword;
window.togglePasswordVisibility = togglePasswordVisibility;

// 1. Hàm tạo chuỗi che giấu dữ liệu (Masking)
function maskEmail(email) {
    if (!email) return 'Chưa cập nhật';
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const name = parts[0];
    const domain = parts[1];
    const maskedName = name.length > 2 ? name.substring(0, 2) + '*'.repeat(name.length - 2) : name.substring(0, 1) + '***';
    return `${maskedName}@${domain}`;
}

function maskPhone(phone) {
    if (!phone) return 'Chưa cập nhật';
    if (phone.length < 6) return phone;
    return phone.substring(0, 3) + ' *** ' + phone.substring(phone.length - 3);
}

// 2. Logic Bật/Tắt hiển thị dữ liệu thật (Email, SĐT)
function toggleSensitiveInfo(type) {
    const maskedEl = document.getElementById(`view-${type}-masked`);
    const realEl = document.getElementById(`view-${type}-real`);
    const iconEl = document.getElementById(`icon-toggle-${type}`);
    
    if (realEl.classList.contains('hidden')) {
        realEl.classList.remove('hidden');
        maskedEl.classList.add('hidden');
        iconEl.classList.replace('fa-eye-slash', 'fa-eye');
        iconEl.classList.add('text-slate-900');
    } else {
        realEl.classList.add('hidden');
        maskedEl.classList.remove('hidden');
        iconEl.classList.replace('fa-eye', 'fa-eye-slash');
        iconEl.classList.remove('text-slate-900');
    }
}

// 3. Hàm bật/tắt hiển thị mật khẩu (Nút con mắt trong Form)
function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    
    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace('fa-eye-slash', 'fa-eye');
        icon.classList.add('text-slate-900');
    } else {
        input.type = "password";
        icon.classList.replace('fa-eye', 'fa-eye-slash');
        icon.classList.remove('text-slate-900');
    }
}

// 4. Logic Đóng/Mở form Đổi mật khẩu
function toggleChangePasswordForm(show) {
    const form = document.getElementById('profile-password-mode');
    const btnShow = document.getElementById('btn-show-password-form');
    if (show) {
        form.classList.remove('hidden');
        btnShow.classList.add('hidden');
    } else {
        form.classList.add('hidden');
        btnShow.classList.remove('hidden');
        form.reset();
        
        // Reset lại type password và icon con mắt khi đóng form
        ['old-password', 'new-password', 'confirm-password'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.type = "password";
        });
        ['icon-old-pass', 'icon-new-pass', 'icon-confirm-pass'].forEach(id => {
            const icon = document.getElementById(id);
            if(icon) {
                icon.classList.replace('fa-eye', 'fa-eye-slash');
                icon.classList.remove('text-slate-900');
            }
        });
    }
}

// 5. Logic Xử lý Xác thực và Cập nhật mật khẩu mới
async function handleChangePassword(e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const isGoogleAccount = user.providerData.some(p => p.providerId === 'google.com');
    if (isGoogleAccount) {
        CustomModal.alert("Tài khoản của bạn đang liên kết với Google. Không thể đổi mật khẩu tại đây.", "warning");
        toggleChangePasswordForm(false);
        return;
    }

    const oldPass = document.getElementById('old-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-password').value;

    if (newPass !== confirmPass) {
        CustomModal.alert("Mật khẩu xác nhận không khớp!", "warning");
        return;
    }

    if (oldPass === newPass) {
        CustomModal.alert("Mật khẩu mới phải khác mật khẩu hiện tại!", "warning");
        return;
    }

    const btn = document.getElementById('btn-save-password');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
        const credential = EmailAuthProvider.credential(user.email, oldPass);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPass);
        
        await CustomModal.alert("Mật khẩu đã được cập nhật thành công!", "success");
        toggleChangePasswordForm(false);
        
    } catch (error) {
        console.error("Lỗi đổi mật khẩu:", error);
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            CustomModal.alert("Mật khẩu hiện tại không chính xác!", "error");
        } else if (error.code === 'auth/weak-password') {
            CustomModal.alert("Mật khẩu mới quá yếu. Vui lòng nhập ít nhất 6 ký tự.", "warning");
        } else {
            CustomModal.alert("Lỗi không xác định. Vui lòng thử lại sau.", "error");
        }
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Hàm tải dữ liệu hồ sơ cá nhân từ bộ lưu trữ đám mây biệt lập
async function loadUserProfile(user) {
    const userDocRef = doc(firebaseDb, 'users', user.uid);
    // Ưu tiên sử dụng ảnh profile từ tài khoản Google, nếu không có sẽ tự tạo ảnh đại diện ký tự mặc định
    let defaultAvatar = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=f1f5f9&color=0f172a&bold=true`;
    
    let profileData = {
        name: user.displayName || '',
        email: user.email || '',
        photoURL: defaultAvatar,
        phone: '',
        gender: '',
        facebook: '',
        tiktok: '',
        instagram: ''
    };

    try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            profileData = { ...profileData, ...docSnap.data() };
        } else {
            // Thiết lập tài liệu cá nhân ban đầu nếu tài khoản mới đăng nhập lần đầu
            await setDoc(userDocRef, profileData);
        }
    } catch (e) {
        console.error("Lỗi xác thực quyền truy cập dữ liệu cá nhân:", e);
    }

    if (document.getElementById('home-mini-name')) {
        document.getElementById('home-mini-name').innerText = profileData.name || 'Thành viên';
    }

    // Kết xuất dữ liệu ra chế độ hiển thị giao diện công khai cho người dùng (View Mode)
    document.getElementById('profile-name').innerText = profileData.name || 'Thành viên';
    document.getElementById('view-name').innerText = profileData.name || 'Chưa cập nhật';
    document.getElementById('view-gender').innerText = profileData.gender || 'Chưa cập nhật';
// ĐỒNG BỘ ĐIỀN SẴN VÀO FORM ĐẶT LỊCH NHANH (THÊM ĐOẠN NÀY)
    if (document.getElementById('cusName')) document.getElementById('cusName').value = profileData.name || '';
    if (document.getElementById('cusPhone')) document.getElementById('cusPhone').value = profileData.phone || '';
    if (document.getElementById('cusEmail')) document.getElementById('cusEmail').value = profileData.email || '';

    // Thay thế đoạn gán Email & SĐT cũ bằng đoạn này:
    document.getElementById('view-email-real').innerText = profileData.email || 'Chưa cập nhật';
    document.getElementById('view-email-masked').innerText = maskEmail(profileData.email);
    
    document.getElementById('view-phone-real').innerText = profileData.phone || 'Chưa cập nhật';
    document.getElementById('view-phone-masked').innerText = maskPhone(profileData.phone);
    
    // Đảm bảo trạng thái ban đầu luôn là bị che mỗi khi tải lại Profile
    document.getElementById('view-email-real').classList.add('hidden');
    document.getElementById('view-email-masked').classList.remove('hidden');
    document.getElementById('icon-toggle-email').className = 'fa-solid fa-eye-slash text-[10px]';
    
    document.getElementById('view-phone-real').classList.add('hidden');
    document.getElementById('view-phone-masked').classList.remove('hidden');
    document.getElementById('icon-toggle-phone').className = 'fa-solid fa-eye-slash text-[10px]';
    // Rà soát cấu hình hiển thị trạng thái các liên kết mạng xã hội
    const setSocialLink = (linkId, url) => {
        const element = document.getElementById(linkId);
        if (url) {
            element.href = url;
            element.classList.remove('opacity-40', 'pointer-events-none');
        } else {
            element.href = '#';
            element.classList.add('opacity-40', 'pointer-events-none');
        }
    };
    setSocialLink('link-fb', profileData.facebook);
    setSocialLink('link-tiktok', profileData.tiktok);
    setSocialLink('link-ig', profileData.instagram);

    // Đồng bộ điền sẵn dữ liệu vào các ô nhập của Form chỉnh sửa (Edit Mode)
    document.getElementById('edit-name').value = profileData.name;
    document.getElementById('edit-phone').value = profileData.phone;
    document.getElementById('edit-gender').value = profileData.gender;
    document.getElementById('edit-fb').value = profileData.facebook;
    document.getElementById('edit-tiktok').value = profileData.tiktok;
    document.getElementById('edit-ig').value = profileData.instagram;
}

// Chuyển đổi qua lại giữa Form chỉnh sửa thông tin và bảng hiển thị
function toggleEditProfileForm(show) {
    const viewMode = document.getElementById('profile-view-mode');
    const editMode = document.getElementById('profile-edit-mode');
    if (show) {
        viewMode.classList.add('hidden');
        editMode.classList.remove('hidden');
    } else {
        viewMode.classList.remove('hidden');
        editMode.classList.add('hidden');
    }
}

// Hàm xử lý lưu thông tin cập nhật tài khoản
async function handleSaveProfile(e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const btn = document.getElementById('btn-save-profile');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ĐANG LƯU...';
    btn.disabled = true;

    const userDocRef = doc(firebaseDb, 'users', user.uid);
    const updatedData = {
        name: document.getElementById('edit-name').value,
        phone: document.getElementById('edit-phone').value,
        gender: document.getElementById('edit-gender').value,
        facebook: document.getElementById('edit-fb').value,
        tiktok: document.getElementById('edit-tiktok').value,
        instagram: document.getElementById('edit-ig').value,
    };

    try {
        // Lưu thông tin trực tiếp vào Firestore với cơ chế Merge tránh mất mát các trường dữ liệu khác
        await setDoc(userDocRef, updatedData, { merge: true });
        
        // Đồng bộ cập nhật tên hiển thị cơ sở của hệ thống Authentication nếu có thay đổi
        if (updatedData.name !== user.displayName) {
            await updateProfile(user, { displayName: updatedData.name });
        }

        CustomModal.alert("Cập nhật thông tin tài khoản thành công!", "success");
        await loadUserProfile(user);
        
        // CẬP NHẬT LẠI FORM ĐẶT LỊCH SAU KHI ĐỔI HỒ SƠ (THÊM ĐOẠN NÀY)
        if (document.getElementById('cusName')) document.getElementById('cusName').value = document.getElementById('edit-name').value;
        if (document.getElementById('cusPhone')) document.getElementById('cusPhone').value = document.getElementById('edit-phone').value;

        toggleEditProfileForm(false);
    } catch (error) {
        console.error("Lỗi lưu trữ dữ liệu:", error);
        CustomModal.alert("Không thể lưu thông tin. Vui lòng kiểm tra lại quyền hạn hoặc kết nối!", "error");
    } finally {
        btn.innerText = "LƯU LẠI";
        btn.disabled = false;
    }
}
// ==========================================
// 2. DỮ LIỆU DỰ PHÒNG (FALLBACK_CONFIG)
// Giữ lại nội dung tĩnh cũ để dự phòng khi mất mạng
// ==========================================
const FALLBACK_CONFIG = {
    general: {
        name: "Mai Tây Hair Salon",
        slogan: "Premium Hair Studio",
        rating: "5.0",
        openHours: { status: 1, text: "Mở cửa từ 8h đến 20h", reason: "" },
        version: "v1.0.2"
    },
    contact: { phoneDisplay: "0909 123 456", phoneLink: "0909123456", zaloLink: "https://zalo.me/0909123456" },
    heroBlock: {
        sliderImages: ["./asset/images/BGMT.jpg", "./asset/images/BGMT.jpg"],
        isFlashSale: true,
        normalBooking: { title: "Trải Nghiệm Đẳng Cấp", desc: "Đặt lịch để giữ chỗ ngay hôm nay.", btnText: "ĐẶT LỊCH NGAY", icon: "fa-calendar-check" },
        flashSale: { title: "Flash Sale Đặc Quyền Vip", desc: "Giảm ngay 50% cho 5 khách hàng...", btnText: "SĂN DEAL NGAY", endTime: "2026-05-12T23:59:59" }
    },
    homeFeatures: { /* ... (Giữ nguyên mảng categories, marqueeTexts) ... */ },
    offers: [ /* ... (Giữ nguyên) ... */],
    feed: [ /* ... (Giữ nguyên) ... */],
    store: [ /* ... (Giữ nguyên) ... */]
};

// Khởi tạo biến toàn cục
let appConfig = FALLBACK_CONFIG;

// ==========================================
// 1.5 CUSTOM MODAL SYSTEM (THAY THẾ ALERT/CONFIRM)
// ==========================================
const CustomModal = {
    show: function ({ type = 'alert', title = 'Thông báo', message, icon = 'fa-bell', iconBg = 'bg-slate-100', iconColor = 'text-slate-900' }) {
        return new Promise((resolve) => {
            const overlay = document.getElementById('custom-modal-overlay');
            const box = document.getElementById('custom-modal-box');
            const titleEl = document.getElementById('modal-title');
            const msgEl = document.getElementById('modal-message');
            const iconEl = document.getElementById('modal-icon');
            const iconContainer = document.getElementById('modal-icon-container');
            const btnConfirm = document.getElementById('modal-btn-confirm');
            const btnCancel = document.getElementById('modal-btn-cancel');

            if (!overlay) {
                console.error("Thiếu HTML của Custom Modal");
                resolve(true); return;
            }

            titleEl.innerText = title;
            msgEl.innerHTML = message;
            iconEl.className = `fa-solid ${icon} text-xl ${iconColor}`;
            iconContainer.className = `w-14 h-14 rounded-full flex items-center justify-center mb-4 ${iconBg}`;

            if (type === 'confirm') {
                btnCancel.classList.remove('hidden'); btnCancel.classList.add('block');
            } else {
                btnCancel.classList.add('hidden'); btnCancel.classList.remove('block');
            }

            overlay.classList.remove('hidden');
            overlay.classList.add('flex');

            requestAnimationFrame(() => {
                overlay.classList.remove('opacity-0'); overlay.classList.add('opacity-100');
                box.classList.remove('scale-95'); box.classList.add('scale-100');
            });

            const close = (result) => {
                overlay.classList.remove('opacity-100'); overlay.classList.add('opacity-0');
                box.classList.remove('scale-100'); box.classList.add('scale-95');
                setTimeout(() => {
                    overlay.classList.add('hidden'); overlay.classList.remove('flex');
                    resolve(result);
                }, 300);
                btnConfirm.onclick = null; btnCancel.onclick = null;
            };

            btnConfirm.onclick = () => close(true);
            btnCancel.onclick = () => close(false);
        });
    },
    alert: function (message, type = 'info') {
        let icon = 'fa-bell', iconBg = 'bg-blue-50', iconColor = 'text-blue-500', title = 'Thông báo';
        if (type === 'success') {
            icon = 'fa-check'; iconBg = 'bg-emerald-50'; iconColor = 'text-emerald-500'; title = 'Thành công';
        } else if (type === 'error') {
            icon = 'fa-triangle-exclamation'; iconBg = 'bg-rose-50'; iconColor = 'text-rose-500'; title = 'Có lỗi xảy ra';
        } else if (type === 'warning') {
            icon = 'fa-circle-exclamation'; iconBg = 'bg-amber-50'; iconColor = 'text-amber-500'; title = 'Lưu ý';
        }
        return this.show({ type: 'alert', title, message, icon, iconBg, iconColor });
    },
    confirm: function (message) {
        return this.show({
            type: 'confirm', title: 'Xác nhận', message,
            icon: 'fa-circle-question', iconBg: 'bg-amber-50', iconColor: 'text-amber-500'
        });
    }
};
window.CustomModal = CustomModal;

// ==========================================
// 2. BIẾN TOÀN CỤC & GOOGLE APPS SCRIPT API
// ==========================================
const API_URL = 'https://script.google.com/macros/s/AKfycby7YKcoWqaZ1a5Rf7abzThUDl_G7pPiHVuTdn8xyXdqgz8tE6ZYWutHLjI0-3-t1gsxFQ/exec';
let db = { branches: [], services: [], staff: [] };
let selection = { branch: null, service: null, staff: null, date: null, time: null };
let currentStep = 1;
let countdownInterval;
let currentSlide = 0;
let feedObserver;

window.switchTab = switchTab;
window.switchBookingSubTab = switchBookingSubTab;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.selectBranch = selectBranch;
window.selectService = selectService;
window.selectStaff = selectStaff;
window.selectDate = selectDate;
window.jumpToToday = jumpToToday;
window.submitBooking = submitBooking;
window.lookupBooking = lookupBooking;
window.cancelBooking = cancelBooking;
window.rateStar = rateStar;
window.submitFeedback = submitFeedback;
window.toggleDescription = toggleDescription;
window.togglePlay = togglePlay;
window.selectTime = selectTime;

// ==========================================
// 3. CÁC HÀM XỬ LÝ GIAO DIỆN CHÍNH
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
    const loadingDiv = document.getElementById('loading');
    const scissors = document.getElementById('scissorsContainer');
    const slashLine = document.getElementById('slashLine');
    if (!loadingDiv) return;
    scissors.classList.remove('is-normal-cutting');
    scissors.classList.add('is-preparing');
    setTimeout(() => {
        scissors.classList.remove('is-preparing');
        scissors.classList.add('is-snapping');
        slashLine.style.animation = 'slashEffect 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    }, 600);
    setTimeout(() => { loadingDiv.classList.add('page-split-active'); }, 700);
    setTimeout(() => { loadingDiv.style.display = 'none'; loadingDiv.remove(); }, 2000);
}

function renderHeroSlider() {
    const container = document.getElementById('heroSliderContainer');
    const images = appConfig.heroBlock.sliderImages;
    if (!images || images.length === 0) return;
    container.innerHTML = images.map((img, index) => `
            <img src="${img}" id="slide-${index}" alt="Salon Space"
                 class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === 0 ? 'opacity-100' : 'opacity-0'}">
        `).join('');

    if (images.length > 1) {
        setInterval(() => {
            document.getElementById(`slide-${currentSlide}`).classList.remove('opacity-100');
            document.getElementById(`slide-${currentSlide}`).classList.add('opacity-0');
            currentSlide = (currentSlide + 1) % images.length;
            document.getElementById(`slide-${currentSlide}`).classList.remove('opacity-0');
            document.getElementById(`slide-${currentSlide}`).classList.add('opacity-100');
        }, 5000);
    }
}

function applyConfig() {
    if (document.getElementById('config-salon-name')) document.getElementById('config-salon-name').innerText = appConfig.general.name;
    if (document.getElementById('config-salon-name-docked')) document.getElementById('config-salon-name-docked').innerText = appConfig.general.name;

    const oh = appConfig.general.openHours;
    const textEl = document.getElementById('config-open-hours');
    const dotEl = textEl?.previousElementSibling;
    if (textEl && dotEl) {
        textEl.innerText = oh.text;
        switch (oh.status) {
            case 1: dotEl.className = "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"; break;
            case 2: dotEl.className = "w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"; break;
            case 3: dotEl.className = "w-1.5 h-1.5 rounded-full bg-rose-500"; break;
        }
    }

    if (document.getElementById('config-phone-link')) document.getElementById('config-phone-link').href = "tel:" + appConfig.contact.phoneLink;
    if (document.getElementById('config-zalo-link')) document.getElementById('config-zalo-link').href = appConfig.contact.zaloLink;
    if (document.getElementById('config-version')) document.getElementById('config-version').innerText = appConfig.general.version;
}

function renderHomeFeatures() {
    const catContainer = document.getElementById('homeCategories');
    if (catContainer) {
        catContainer.innerHTML = appConfig.homeFeatures.categories.map(cat => `
                <div class="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform" onclick="window.switchTab('booking')">
                    <div class="w-14 h-14 rounded-[1.25rem] bg-white border border-slate-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center text-slate-800 text-lg">
                        <i class="fa-solid ${cat.icon}"></i>
                    </div>
                    <span class="text-[10px] font-bold text-slate-700">${cat.name}</span>
                </div>
            `).join('');
    }

    const marqueeContainer = document.getElementById('homeMarquee');
    if (marqueeContainer) {
        marqueeContainer.innerHTML = appConfig.homeFeatures.marqueeTexts.map(m => `
                <span class="mr-4 ${m.isHighlight ? 'text-slate-900 font-black' : 'text-slate-600'}">${m.text}</span>
            `).join('');

        const parent = marqueeContainer.parentElement;
        marqueeContainer.style.animation = 'none';

        setTimeout(() => {
            if (marqueeContainer.scrollWidth > parent.clientWidth) {
                const scrollDist = marqueeContainer.scrollWidth - parent.clientWidth + 10;
                marqueeContainer.style.setProperty('--scroll-dist', `-${scrollDist}px`);
                const duration = scrollDist / 15;
                marqueeContainer.style.animation = `marquee-dynamic ${duration}s ease-in-out infinite alternate`;
            }
        }, 100);
    }
}

function renderDynamicHero() {
    const container = document.getElementById('dynamicHeroBlock');
    clearInterval(countdownInterval);

    if (appConfig.heroBlock.isFlashSale) {
        const conf = appConfig.heroBlock.flashSale;
        container.innerHTML = `
            <style>
                @keyframes smooth-shimmer {
                    0% { background-position: 250% center; }
                    100% { background-position: -50% center; }
                }
                @keyframes slow-breathe {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.05); }
                }
                .liquid-shimmer {
                    background: linear-gradient(
                        105deg, transparent 20%, rgba(255, 178, 204, 0.1) 40%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 178, 204, 0.1) 60%, transparent 80%
                    );
                    background-size: 300% 100%;
                    animation: smooth-shimmer 6s linear infinite;
                }
            </style>
            
            <div class="relative overflow-hidden rounded-[1.5rem] p-6 shadow-[0_12px_40px_-10px_rgba(159,18,57,0.4)] border border-rose-900/20 group bg-[#2a0410]">
                <div class="absolute inset-0 bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900"></div>
                <div class="absolute -top-20 -right-20 w-64 h-64 bg-rose-500/30 rounded-full blur-[50px]" style="animation: slow-breathe 6s ease-in-out infinite;"></div>
                <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-rose-800/40 rounded-full blur-[40px]" style="animation: slow-breathe 8s ease-in-out infinite reverse;"></div>
                <div class="absolute inset-0 liquid-shimmer mix-blend-overlay pointer-events-none"></div>

                <div class="relative z-10 flex justify-between items-start mb-6 gap-3">
                    <div class="flex-1">
                        <div class="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-lg mb-3">
                            <span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                            <span class="text-rose-200 text-[8px] font-bold uppercase tracking-widest mt-0.5">Đặc Quyền Vip</span>
                        </div>
                        <h3 class="text-white text-xl font-black leading-tight tracking-tight">${conf.title}</h3>
                    </div>
                    <div class="bg-black/20 backdrop-blur-md border border-white/5 rounded-xl p-3 text-center min-w-[75px] shrink-0">
                        <p class="text-[7px] uppercase tracking-[0.2em] font-medium text-rose-200/70 mb-1">Kết thúc sau</p>
                        <div class="flex items-center justify-center text-white font-mono text-sm font-bold tracking-wider">
                            <span id="cd-hour">00</span><span class="text-white/30 mx-0.5 pb-0.5">:</span><span id="cd-min">00</span><span class="text-white/30 mx-0.5 pb-0.5">:</span><span id="cd-sec" class="text-rose-300">00</span>
                        </div>
                    </div>
                </div>
                <p class="relative z-10 text-[11px] text-white/70 font-normal mb-8 leading-relaxed">${conf.desc}</p>
                <button onclick="window.switchTab('booking')" class="relative z-10 w-full bg-white text-rose-950 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-[0_8px_20px_-5px_rgba(255,255,255,0.2)] hover:bg-rose-50 flex justify-center items-center gap-2">
                    ${conf.btnText}
                </button>
            </div>`;
        startCountdown(conf.endTime);
    } else {
        const conf = appConfig.heroBlock.normalBooking;
        container.innerHTML = `
            <div class="bg-white border border-slate-100 rounded-[1.5rem] p-6 flex flex-col items-center text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                    <i class="fa-regular ${conf.icon} text-xl text-slate-900"></i>
                </div>
                <h3 class="text-lg font-black mb-2 text-slate-900">${conf.title}</h3>
                <p class="text-[12px] text-slate-500 font-medium mb-6 leading-relaxed">${conf.desc}</p>
                <button onclick="window.switchTab('booking')" class="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-md shadow-slate-900/10 hover:bg-slate-800">
                    ${conf.btnText}
                </button>
            </div>`;
    }
}

function startCountdown(endTimeString) {
    const endTime = new Date(endTimeString).getTime();

    // Đảm bảo xóa interval cũ nếu có để tránh lỗi chạy nhanh đè lên nhau
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const diff = endTime - now;

        if (diff > 0) {
            // Tính tổng số giờ còn lại (nếu thời gian > 24h thì cộng dồn thẳng vào giờ hiển thị)
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            // Format thêm số 0 ở trước nếu < 10
            const hStr = h < 10 ? '0' + h : h;
            const mStr = m < 10 ? '0' + m : m;
            const sStr = s < 10 ? '0' + s : s;

            if (document.getElementById('cd-hour')) document.getElementById('cd-hour').innerText = hStr;
            if (document.getElementById('cd-min')) document.getElementById('cd-min').innerText = mStr;
            if (document.getElementById('cd-sec')) document.getElementById('cd-sec').innerText = sStr;
            if (document.getElementById('di-hour')) document.getElementById('di-hour').innerText = hStr;
            if (document.getElementById('di-min')) document.getElementById('di-min').innerText = mStr;
            if (document.getElementById('di-sec')) document.getElementById('di-sec').innerText = sStr;
        } else {
            // Khi hết thời gian, dừng đếm và đưa các số về 00
            clearInterval(countdownInterval);
            const ids = ['cd-hour', 'cd-min', 'cd-sec', 'di-hour', 'di-min', 'di-sec'];
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.innerText = '00';
            });
        }
    }, 1000);
}
function renderOffers() {
    document.getElementById('offersContainer').innerHTML = appConfig.offers.map(o => `
            <div class="flex bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
                <div class="w-1/3 bg-gradient-to-br ${o.gradient || 'from-slate-500 to-slate-800'} text-white p-4 flex flex-col justify-center items-center relative shrink-0">
                    <i class="fa-solid ${o.icon || 'fa-gift'} text-2xl mb-2 opacity-90"></i>
                    <span class="text-[9px] font-black uppercase text-center leading-tight">${o.type || 'Ưu đãi'}</span>
                </div>
                <div class="w-2/3 p-5 relative border-l border-dashed border-slate-200">
                    <div class="ticket-cutout-left"></div> <div class="ticket-cutout-right"></div>
                    <h4 class="font-black text-slate-900 text-sm leading-tight mb-1">${o.title || ''}</h4>
                    <p class="text-[10px] text-slate-400 font-medium mb-4">${o.desc || ''}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">MÃ: ${o.code || ''}</span>
                        <button onclick="window.switchTab('booking')" class="text-[9px] bg-slate-900 text-white px-3 py-1.5 rounded-lg font-black uppercase tracking-widest active:scale-95 transition-all">Sử dụng</button>
                    </div>
                </div>
            </div>
        `).join('');
}

function renderFeed() {
    // 1. Tạo bản sao và đảo ngược mảng để đưa bài mới nhất lên đầu
    const reversedFeed = [...appConfig.feed].reverse();

    // 2. Dùng mảng đã đảo ngược để render
    document.getElementById('feedContainer').innerHTML = reversedFeed.map((f, index) => {
        // Chỉ tải trước tài nguyên cho 3 feed đầu tiên (lúc này chính là 3 bài mới nhất)
        const isPreloaded = index < 3;

        const mediaHtml = f.isVideo
            ? `<div class="media-loader absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-0">
                    <span class="w-8 h-8 border-[3px] border-slate-800 border-t-white rounded-full animate-spin mb-3"></span>
                    <span class="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase">Đang tải...</span>
               </div>
               <video ${isPreloaded ? `src="${f.url}"` : `data-src="${f.url}"`} 
                      poster="${f.img || ''}" 
                      class="w-full h-full object-cover relative z-10 transition-opacity duration-300" 
                      loop playsinline preload="${isPreloaded ? 'auto' : 'none'}"></video>
               
               <div class="play-btn-overlay absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none z-20">
                    <i class="fa-solid fa-play text-white/60 text-7xl drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"></i>
               </div>`
            : `<div class="media-loader absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-0">
                    <span class="w-8 h-8 border-[3px] border-slate-800 border-t-white rounded-full animate-spin mb-3"></span>
               </div>
               <img ${isPreloaded ? `src="${f.img}"` : `data-src="${f.img}"`} 
                    class="w-full h-full object-cover relative z-10 lazy-img" 
                    onload="this.previousElementSibling.style.display='none'">`;

        const fomoTagHtml = f.fomoText ? `
                <div class="flex items-center gap-2 mb-3">
                    <span class="flex items-center bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                        ${f.fomoIcon ? `<i class="fa-solid ${f.fomoIcon} mr-1.5 text-[10px]"></i>` : ''}
                        <span class="text-[9px] font-bold uppercase tracking-widest text-slate-100">${f.fomoText}</span>
                    </span>
                </div>
            ` : '';

        return `
            <div class="feed-item snap-start w-full h-full relative bg-slate-950 flex justify-center items-center overflow-hidden cursor-pointer" onclick="window.togglePlay(this)">
                ${mediaHtml}
                <div class="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-20"></div>
                <div class="absolute bottom-[100px] left-5 right-5 text-white z-30 pointer-events-none">
                    ${fomoTagHtml}
                    <h3 class="font-black text-xl mb-1.5 drop-shadow-lg flex items-center gap-1.5 text-white pointer-events-auto">
                        Mai Tây Hair Salon <i class="fa-solid fa-circle-check text-blue-500 text-sm"></i>
                    </h3>
                    <div class="relative  pointer-events-auto">
                        <p id="desc-${index}" class="text-sm font-medium drop-shadow-md text-slate-200 line-clamp-2 transition-all duration-300">${f.title}</p>
                        <button onclick="window.toggleDescription('desc-${index}', this); event.stopPropagation();" class="text-[11px] font-black text-slate-400 mt-1 hover:text-white uppercase tracking-wider">Xem thêm</button>
                    </div>
                </div>
            </div>
        `}).join('');
        
    setupVideoAutoplay();
}

function toggleDescription(elementId, btnElement) {
    const descElement = document.getElementById(elementId);
    if (descElement.classList.contains('line-clamp-2')) {
        descElement.classList.remove('line-clamp-2'); btnElement.innerText = 'ẨN BỚT';
    } else {
        descElement.classList.add('line-clamp-2'); btnElement.innerText = 'XEM THÊM';
    }
}

function togglePlay(element) {
    const video = element.querySelector('video');
    const overlay = element.querySelector('.play-btn-overlay');
    if (video) {
        if (video.paused) { video.play(); overlay.classList.add('opacity-0'); overlay.classList.remove('opacity-100'); }
        else { video.pause(); overlay.classList.remove('opacity-0'); overlay.classList.add('opacity-100'); }
    }
}

// ==========================================
// LOGIC BLINK (FEED) - VUỐT & TỰ ĐỘNG CUỘN
// ==========================================
let blinkAutoScrollTimer = null;

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
            bottomNav.classList.add('!bg-black/40', '!border-white/10', '!shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]');
            bottomNav.classList.remove('bg-white/95', 'border-slate-200');
            navItems.forEach(el => {
                el.classList.remove('text-slate-400');
                if (el !== activeNav) el.classList.add('!text-white/60');
            });
            if (activeNav) activeNav.classList.add('!text-white');

            checkAndShowSwipeHint();

        } else {
            bottomNav.classList.remove('!bg-black/40', '!border-white/10', '!shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]');
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

// ==========================================
// 4. LOGIC ĐẶT LỊCH & QUY TRÌNH GAS
// ==========================================

function switchBookingSubTab(subTab) {
    const flow = document.getElementById('booking-flow-container');
    const lookup = document.getElementById('booking-lookup-container');
    const btnFlow = document.getElementById('btn-sub-flow');
    const btnLookup = document.getElementById('btn-sub-lookup');
    const headerTools = document.getElementById('booking-header-tools');
    const actionBtn = document.getElementById('bookingAction');

    if (subTab === 'flow') {
        flow.classList.remove('hidden'); flow.classList.add('flex');
        lookup.classList.add('hidden'); lookup.classList.remove('flex');
        btnFlow.className = "flex-1 py-2 text-[11px] font-bold text-slate-900 bg-white shadow-sm rounded-lg transition-all";
        btnLookup.className = "flex-1 py-2 text-[11px] font-bold text-slate-500 rounded-lg transition-all";
        headerTools.style.display = 'flex';
        updateStepUI();
    } else {
        lookup.classList.remove('hidden'); lookup.classList.add('flex');
        flow.classList.add('hidden'); flow.classList.remove('flex');
        btnLookup.className = "flex-1 py-2 text-[11px] font-bold text-slate-900 bg-white shadow-sm rounded-lg transition-all";
        btnFlow.className = "flex-1 py-2 text-[11px] font-bold text-slate-500 rounded-lg transition-all";
        headerTools.style.display = 'none';
        actionBtn.classList.add('hidden');
    }
}

function renderBranches() {
    document.getElementById('listBranch').innerHTML = db.branches.map(b => {
        const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(b.name)}&background=f8fafc&color=0f172a&rounded=true&bold=true`;
        return `
        <label class="group block relative cursor-pointer">
            <input type="radio" name="branch" class="hidden" onclick="window.selectBranch('${b.id}')">
            <div class="border-2 border-slate-100 rounded-[1.5rem] p-4 bg-white flex items-center transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-50 group-has-[:checked]:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.05)]">
                <img src="${logoUrl}" class="w-12 h-12 rounded-full mr-4 border border-slate-200">
                <div class="flex-1 min-w-0">
                    <h4 class="font-black text-slate-800 text-sm truncate">${b.name}</h4>
                    <p class="text-[10px] font-bold text-slate-400 mt-0.5 truncate">${b.address}</p>
                </div>
                <div class="w-5 h-5 ml-2 rounded-full border-2 border-slate-200 bg-white transition-all group-has-[:checked]:border-[6px] group-has-[:checked]:border-slate-900 flex shrink-0"></div>
            </div>
        </label>`;
    }).join('');
}

function selectBranch(id) {
    selection.branch = db.branches.find(b => b.id === id);
    document.getElementById('listService').innerHTML = db.services.filter(s => s.branchId === 'ALL' || s.branchId === id).map(s => `
        <label class="group block relative cursor-pointer">
            <input type="radio" name="service" class="hidden" onclick="window.selectService('${s.id}')">
            <div class="border-2 border-slate-100 rounded-[1.5rem] p-5 bg-white flex justify-between items-center transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-50 group-has-[:checked]:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.05)]">
                <div>
                    <h4 class="font-bold text-slate-800 text-sm group-has-[:checked]:text-slate-900">${s.name}</h4>
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1"><i class="fa-regular fa-clock mr-1"></i>${s.duration} Phút</p>
                </div>
                <span class="font-black text-slate-600 text-sm bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl transition-all group-has-[:checked]:bg-slate-900 group-has-[:checked]:text-white group-has-[:checked]:border-slate-900">${s.price}k</span>
            </div>
        </label>`).join('');
    nextStep();
}

function selectService(id) {
    selection.service = db.services.find(s => s.id === id);
    document.getElementById('listStaff').innerHTML = db.staff.filter(st => st.branchId === 'ALL' || st.branchId === selection.branch.id).map(st => {
        const avatar = st.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(st.name)}&background=f1f5f9&color=0f172a&bold=true`;
        return `
        <label class="group block relative cursor-pointer h-full">
            <input type="radio" name="staff" class="hidden" onclick="window.selectStaff('${st.id}')">
            <div class="border-2 border-slate-100 rounded-[2rem] p-4 bg-white text-center h-full flex flex-col justify-center items-center transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-50 shadow-sm relative overflow-hidden">
                <div class="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-slate-200 transition-all group-has-[:checked]:border-[5px] group-has-[:checked]:border-slate-900 bg-white opacity-0 group-has-[:checked]:opacity-100"></div>
                <img src="${avatar}" class="w-14 h-14 rounded-full mb-3 object-cover border border-slate-100 group-has-[:checked]:ring-2 group-has-[:checked]:ring-slate-900 group-has-[:checked]:ring-offset-2 transition-all">
                <h4 class="font-bold text-slate-900 text-[11px] truncate w-full">${st.name}</h4>
                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">${st.exp} Năm KN</p>
            </div>
        </label>`;
    }).join('');
    nextStep();
}

function selectStaff(id) {
    selection.staff = db.staff.find(st => st.id === id);
    selection.time = null;
    document.getElementById('timeSlotGrid').innerHTML = '';
    nextStep();
}

function selectTime(timeStr) {
    selection.time = timeStr;
}

function renderDateSelector() {
    let html = '';
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const today = new Date(Date.now() - tzOffset);
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 0; i < 30; i++) {
        let d = new Date(today);
        d.setDate(today.getDate() + i);
        const isoDate = d.toISOString().split('T')[0];
        const dayName = i === 0 ? 'Hôm nay' : dayNames[d.getDay()];

        html += `
        <label class="group shrink-0 cursor-pointer snap-start">
            <input type="radio" name="date" class="hidden" value="${isoDate}" onclick="window.selectDate('${isoDate}')">
            <div class="flex flex-col items-center justify-center w-[60px] h-[80px] rounded-[1.25rem] border-2 border-slate-100 bg-white shadow-sm transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-900">
                <span class="text-[9px] font-black uppercase text-slate-400 mb-1 group-has-[:checked]:text-slate-300 transition-colors">${dayName}</span>
                <span class="text-lg font-black text-slate-800 group-has-[:checked]:text-white transition-colors">${d.getDate()}</span>
            </div>
        </label>`;
    }
    document.getElementById('customDatePicker').innerHTML = html;
}

function jumpToToday() {
    const todayIso = new Date(Date.now() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    selectDate(todayIso);
    document.getElementById('customDatePicker').scrollTo({ left: 0, behavior: 'smooth' });
}

function selectDate(isoDate) {
    selection.date = isoDate;
    selection.time = null;
    const radio = document.querySelector(`input[name="date"][value="${isoDate}"]`);
    if (radio) {
        radio.checked = true;
        radio.closest('label').scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    fetchTimeSlots();
}

async function fetchTimeSlots() {
    if (!selection.date) return;
    document.getElementById('timeSlotGrid').innerHTML = '';
    document.getElementById('timeLoading').classList.remove('hidden');

    try {
        const res = await fetch(`${API_URL}?action=getBusy&date=${selection.date}&staffName=${encodeURIComponent(selection.staff.name)}`);
        const result = await res.json();
        generateGrid(result.busySlots || []);
    } catch (e) {
        generateGrid([]);
    }
    document.getElementById('timeLoading').classList.add('hidden');
}

function generateGrid(busySlots) {
    const grid = document.getElementById('timeSlotGrid');
    const dur = parseInt(selection.service.duration);
    const parseTime = str => parseInt(String(str).split(':')[0] || 0) * 60 + parseInt(String(str).split(':')[1] || 0);
    const branch = db.branches.find(b => b.id === selection.branch.id) || { openTime: "08:00", closeTime: "20:00" };
    const openMins = parseTime(branch.openTime);
    const closeMins = parseTime(branch.closeTime);
    const now = new Date(Date.now() - (new Date().getTimezoneOffset() * 60000));
    const currentMins = now.getUTCHours() * 60 + now.getUTCMinutes();
    const isToday = selection.date === now.toISOString().split('T')[0];

    let html = "";
    for (let m = openMins; m <= closeMins - dur; m += 30) {
        const timeLabel = `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`;
        const slotStart = new Date(`${selection.date}T${timeLabel}:00+07:00`).getTime();
        let isBusy = false;

        if (isToday && m <= currentMins) isBusy = true;
        for (let busy of busySlots) {
            if (slotStart < busy.end && (slotStart + dur * 60000) > busy.start) isBusy = true;
        }

        html += `
        <label class="group block ${isBusy ? 'opacity-30 pointer-events-none' : 'cursor-pointer'}">
            <input type="radio" name="time" class="hidden" onclick="window.selectTime('${timeLabel}')" ${isBusy ? 'disabled' : ''}>
            <div class="border-2 border-slate-100 rounded-[1rem] py-3 text-center bg-white transition-all group-has-[:checked]:border-slate-900 group-has-[:checked]:bg-slate-900 group-has-[:checked]:shadow-md">
                <span class="font-bold text-xs text-slate-700 group-has-[:checked]:text-white transition-colors">${timeLabel}</span>
            </div>
        </label>`;
    }
    grid.innerHTML = html || '<p class="col-span-4 text-center text-[10px] font-bold text-slate-400 py-4 bg-slate-50 rounded-xl uppercase tracking-widest border border-slate-100">Kín lịch hôm nay</p>';
}

function nextStep() {
    if (currentStep === 1 && !selection.branch) return;
    if (currentStep === 2 && !selection.service) return;
    if (currentStep === 3 && !selection.staff) return;

    if (currentStep === 4 && (!selection.date || !selection.time)) {
        CustomModal.alert("Vui lòng chọn ngày và giờ.", "warning");
        return;
    }

    if (currentStep === 5) return document.getElementById('finalForm').dispatchEvent(new Event('submit'));
    if (currentStep === 3 && !selection.date) jumpToToday();

    currentStep++; updateStepUI();
    document.getElementById('booking-flow-container').scrollTo(0, 0);
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--; updateStepUI();
    }
}

function updateStepUI() {
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById(`step${i}`);
        if (i === currentStep) { step.classList.remove('hidden'); step.classList.add('flex'); }
        else { step.classList.add('hidden'); step.classList.remove('flex'); }
    }

    const dots = document.getElementById('progressDots').children;
    for (let i = 0; i < 5; i++) {
        dots[i].className = i < currentStep ? "w-4 h-2 rounded-full bg-slate-900 transition-all" : "w-2 h-2 rounded-full bg-slate-200 transition-all";
    }
    document.getElementById('stepCounter').innerText = currentStep;

    const btnBack = document.getElementById('btnBack');
    if (currentStep === 1) { btnBack.classList.add('opacity-0', 'pointer-events-none'); btnBack.classList.remove('opacity-100', 'pointer-events-auto'); }
    else { btnBack.classList.remove('opacity-0', 'pointer-events-none'); btnBack.classList.add('opacity-100', 'pointer-events-auto'); }

    const actionBtn = document.getElementById('bookingAction');
    if (currentStep === 1) actionBtn.classList.add('hidden');
    else actionBtn.classList.remove('hidden');

    if (currentStep === 5) {
        document.getElementById('btnNext').innerHTML = 'XÁC NHẬN ĐẶT LỊCH <i class="fa-solid fa-check ml-1"></i>';
        const dP = selection.date.split('-');
        const dateObj = new Date(selection.date);
        const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

        document.getElementById('sumDayOfWeek').innerText = `${dayNames[dateObj.getDay()]}, ${dP[2]}/${dP[1]}/${dP[0]}`;
        document.getElementById('sumTime').innerText = selection.time;
        document.getElementById('sumBranch').innerText = selection.branch.name;
        document.getElementById('sumService').innerText = selection.service.name;
        document.getElementById('sumStaff').innerText = selection.staff.name;
    } else { document.getElementById('btnNext').innerText = 'TIẾP TỤC'; }
}

async function submitBooking() {
    if (!selection.time) {
        CustomModal.alert("Vui lòng chọn giờ hẹn.", "warning");
        return;
    }

    const btn = document.getElementById('btnNext');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ĐANG XỬ LÝ';
    btn.disabled = true;

    const startTime = new Date(`${selection.date}T${selection.time}:00+07:00`);
    const payload = {
        action: 'book',
        data: {
            branchName: selection.branch.name,
            serviceName: selection.service.name,
            staffName: selection.staff.name,
            startTime: startTime.toISOString(),
            endTime: new Date(startTime.getTime() + selection.service.duration * 60000).toISOString(),
            name: document.getElementById('cusName').value,
            phone: document.getElementById('cusPhone').value,
            email: document.getElementById('cusEmail').value
        }
    };

    try {
        await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) });
        await CustomModal.alert("ĐẶT LỊCH THÀNH CÔNG! Hẹn gặp bạn tại Salon.", "success");

        document.getElementById('finalForm').reset();
        selection = { branch: null, service: null, staff: null, date: null, time: null };

        document.getElementById('listService').innerHTML = '';
        document.getElementById('listStaff').innerHTML = '';
        document.getElementById('timeSlotGrid').innerHTML = '';

        document.querySelectorAll('input[name="branch"]').forEach(el => el.checked = false);
        document.querySelectorAll('input[name="date"]').forEach(el => el.checked = false);

        currentStep = 1;
        updateStepUI();
        document.getElementById('booking-flow-container').scrollTo({ top: 0, behavior: 'smooth' });

    } catch (e) {
        CustomModal.alert("Lỗi kết nối. Vui lòng thử lại!", "error");
    } finally {
        btn.innerHTML = 'XÁC NHẬN ĐẶT LỊCH <i class="fa-solid fa-check ml-1"></i>';
        btn.disabled = false;
    }
}

async function lookupBooking() {
    const phone = document.getElementById('lookupPhone').value;
    if (!phone) return;
    const btn = document.getElementById('btnLookup');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    try {
        const res = await fetch(`${API_URL}?action=lookup&phone=${encodeURIComponent(phone)}`);
        const result = await res.json();
        const container = document.getElementById('lookupResults');

        if (!result.bookings || result.bookings.length === 0) {
            container.innerHTML = '<div class="bg-white p-4 rounded-xl text-center text-[11px] font-bold text-slate-400 uppercase border border-slate-100">Không tìm thấy lịch hẹn nào</div>';
        } else {
            container.innerHTML = result.bookings.map(b => `
                <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <p class="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest"><i class="fa-solid fa-location-dot mr-1"></i>${b.branch}</p>
                    <h4 class="font-black text-slate-800 text-base mb-3">${b.service}</h4>
                    <div class="bg-slate-50 p-3 rounded-xl flex flex-col gap-2 mb-4">
                        <div class="text-[11px] font-bold text-slate-600"><i class="fa-regular fa-clock mr-2 text-slate-400"></i>${b.timeStr}</div>
                        <div class="text-[11px] font-bold text-slate-600"><i class="fa-solid fa-user-tie mr-2 text-slate-400"></i>${b.staff}</div>
                    </div>
                    <button onclick="window.cancelBooking('${b.eventId}')" class="w-full py-3 text-rose-500 font-bold text-[10px] uppercase tracking-widest bg-white border border-rose-100 rounded-xl shadow-sm hover:bg-rose-50 active:scale-95 transition-all">Huỷ Lịch Này</button>
                </div>`).join('');
        }
    } catch (e) {
        CustomModal.alert("Lỗi tra cứu thông tin!", "error");
    } finally { btn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>'; }
}

async function cancelBooking(id) {
    const isConfirmed = await CustomModal.confirm("Bạn có chắc chắn muốn huỷ lịch hẹn này?");
    if (!isConfirmed) return;

    try {
        await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'cancel', eventId: id }) });
        await CustomModal.alert("Đã huỷ thành công!", "success");
        lookupBooking();
    } catch (e) {
        CustomModal.alert("Lỗi huỷ lịch, vui lòng thử lại sau!", "error");
    }
}

function rateStar(index) {
    const stars = document.getElementById('starContainer').children; document.getElementById('fbRating').value = index;
    for (let i = 0; i < 5; i++) { if (i < index) { stars[i].classList.add('active', 'text-[#f59e0b]'); stars[i].classList.remove('text-slate-200'); } else { stars[i].classList.remove('active', 'text-[#f59e0b]'); stars[i].classList.add('text-slate-200'); } }
}

async function submitFeedback(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitFeedback');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ĐANG GỬI...'; btn.disabled = true;

    const payload = { action: 'feedback', data: { rating: document.getElementById('fbRating').value, name: document.getElementById('fbName').value, phone: document.getElementById('fbPhone').value, message: document.getElementById('fbMessage').value } };
    try {
        await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) });
        await CustomModal.alert("Cảm ơn bạn đã đóng góp ý kiến!", "success");
        document.getElementById('nativeFeedbackForm').reset(); rateStar(5);
    }
    catch (error) {
        await CustomModal.alert("Cảm ơn bạn đã đóng góp ý kiến!", "success");
        document.getElementById('nativeFeedbackForm').reset(); rateStar(5);
    } finally {
        btn.innerHTML = 'GỬI GÓP Ý'; btn.disabled = false;
    }
}

// ==========================================
// 5. HÀM KHỞI TẠO CHÍNH
// ==========================================
async function init() {
    startLoadingAnimation();

    try {
        // Kéo dữ liệu từ Cloud Firestore
        const docRef = doc(firebaseDb, 'artifacts', 'maitay-app', 'public', 'data', 'config', 'main');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            appConfig = docSnap.data();
            console.log("Đã đồng bộ cấu hình từ Firebase Cloud.");
        } else {
            console.warn("Chưa có data trên Cloud, dùng Fallback mặc định.");
        }

        const currentVersion = appConfig.general?.version || FALLBACK_CONFIG.general.version;
        const localVersion = localStorage.getItem('MAITAY_APP_VERSION');

        const versionEl = document.getElementById('loading-version-display');
        if (versionEl) {
            versionEl.innerText = currentVersion;
            versionEl.classList.remove('opacity-0');
        }

        // Logic cập nhật PWA nếu version khác nhau
        if (localVersion && localVersion !== currentVersion) {
            localStorage.setItem('MAITAY_APP_VERSION', currentVersion);
            localStorage.removeItem('blinkHintSeen');

            const minimalText = document.querySelector('.minimal-text');
            if (minimalText) minimalText.innerText = `Cập nhật ${currentVersion}...`;

            setTimeout(() => {
                const cleanUrl = window.location.href.split('?')[0];
                window.location.replace(`${cleanUrl}?v=${new Date().getTime()}`);
            }, 600);
            return;
        } else if (!localVersion) {
            localStorage.setItem('MAITAY_APP_VERSION', currentVersion);
        }

        // Gắn dữ liệu lên UI
        applyConfig();
        renderHeroSlider();
        renderDynamicHero();
        renderHomeFeatures();
        renderOffers();
        renderFeed();
        if (typeof renderStoreList === "function") renderStoreList();

        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800));
        await minLoadingTime;
        finishLoadingAnimation();

        // Tải ngầm dữ liệu GAS
        // Tải ngầm dữ liệu GAS
        fetch(`${API_URL}?action=init`)
            .then(res => res.json())
            .then(data => {
                // SỬA LẠI THÀNH DÒNG NÀY: Gán thẳng vào biến db cũ
                db = data; 
                renderBranches();
                renderDateSelector();
            })
            .catch(e => console.error("GAS Load Error:", e));
    } catch (e) {
        console.error("Lỗi khởi tạo hoặc mất kết nối:", e);
        // Nếu lỗi Firebase, giao diện vẫn load tiếp với FALLBACK_CONFIG
        applyConfig();
        renderHeroSlider();
        renderDynamicHero();
        renderHomeFeatures();
        renderOffers();
        renderFeed();
        if (typeof renderStoreList === "function") renderStoreList();
        finishLoadingAnimation();
    }
}

init();

function initAboutAnimations() {
    const viewAbout = document.getElementById('view-about');
    const heroBg = document.getElementById('about-hero-bg');
    const innerParallaxImages = document.querySelectorAll('.about-img-parallax');
    if (viewAbout) {
        viewAbout.addEventListener('scroll', () => {
            window.requestAnimationFrame(() => {
                let scrollY = viewAbout.scrollTop;
                if (heroBg) { heroBg.style.transform = `translateY(${scrollY * 0.4}px)`; let blurVal = Math.min(scrollY * 0.015, 10); heroBg.style.filter = `blur(${blurVal}px) brightness(0.7)`; }
                innerParallaxImages.forEach(img => {
                    const rect = img.parentElement.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) { let yOffset = (rect.top / window.innerHeight - 0.5) * 60; img.style.transform = `scale(1.15) translateY(${yOffset}px)`; }
                });
            });
        });
    }
    const revealElements = document.querySelectorAll('.glass-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); } });
    }, { root: viewAbout, threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    setTimeout(() => { revealElements.forEach(el => revealObserver.observe(el)); }, 200);
}
initAboutAnimations();

function updateTOCActiveState() {
    const sections = ['sec-intro', 'sec-journey', 'sec-stylists', 'sec-contact'];
    const tocItems = document.querySelectorAll('.toc-item');
    const viewAbout = document.getElementById('view-about');
    if (!viewAbout) return;
    viewAbout.addEventListener('scroll', () => {
        let current = "";
        const isBottom = viewAbout.scrollHeight - viewAbout.scrollTop <= viewAbout.clientHeight + 50;
        if (isBottom) { current = 'sec-contact'; } else {
            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) { if (viewAbout.scrollTop >= section.offsetTop - 250) { current = sectionId; } }
            });
        }
        tocItems.forEach((item) => {
            item.classList.remove('active');
            const onclickAttr = item.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes(current)) { item.classList.add('active'); }
        });
    });
}
updateTOCActiveState();

// ==========================================
// RENDER CỬA HÀNG (ĐÃ TÍCH HỢP VÀO APP_CONFIG)
// ==========================================
function renderStoreList() {
    const container = document.getElementById('storeContainer');
    // Kiểm tra xem container và dữ liệu store có tồn tại không
    if (!container || !appConfig.store || appConfig.store.length === 0) return;

    // Trỏ tới appConfig.store thay vì storeData tĩnh
    container.innerHTML = appConfig.store.map((p) => `
        <div class="w-full h-screen snap-center flex flex-col justify-center items-center relative px-6 pt-10 pb-20">
            <div class="text-center mb-8 relative z-20">
                <p class="text-[10px] font-bold uppercase tracking-[0.4em] mb-3" style="color: ${p.themeColor}">${p.brand}</p>
                <h3 class="text-[34px] font-black text-slate-900 tracking-tighter mb-2 leading-none">${p.name}</h3>
                <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">${p.sub}</p>
            </div>
            <div class="relative flex justify-center items-end w-full h-[320px] mb-12 z-10">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full blur-[80px] opacity-20" style="background-color: ${p.themeColor}"></div>
                <div class="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[200px] h-[40px] bg-white rounded-[100%] border border-slate-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] z-0 flex items-center justify-center">
                    <div class="absolute inset-2 border border-slate-50 rounded-[100%] opacity-50"></div>
                </div>
                <img src="${p.img}" alt="${p.name}" class="h-[280px] object-contain relative z-10 animate-floating" style="filter: drop-shadow(0 20px 30px rgba(0,0,0,0.1));">
                <div class="absolute bottom-[5px] w-20 h-4 bg-black/5 blur-md rounded-full scale-x-150"></div>
            </div>
            <div class="text-center relative z-20 w-full max-w-[320px]">
                <p class="text-[13px] text-slate-500 leading-relaxed font-medium mb-10">${p.desc}</p>
                <div class="flex items-center justify-between bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl p-2 pl-6 shadow-xl shadow-slate-200/50">
                    <span class="text-xl font-black text-slate-900 italic">${p.price}</span>
                    <button onclick="window.switchTab('booking')" class="bg-slate-900 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform">
                        Tư vấn & Mua
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    const plxBlocks = document.querySelectorAll('.store-plx');
    container.onscroll = () => {
        window.requestAnimationFrame(() => {
            const scrollY = container.scrollTop;
            plxBlocks.forEach(block => {
                const speed = parseFloat(block.getAttribute('data-speed'));
                const rot = block.getAttribute('data-rot');
                const yOffset = -(scrollY * speed);
                block.style.transform = `translateY(${yOffset}px) rotate(${rot}deg)`;
            });
        });
    };
}
renderStoreList();

// Tính năng: Auto-active Table of Contents cho tab Giới thiệu
function initAboutScrollSpy() {
    const aboutView = document.getElementById('view-about');
    const tocLinks = document.querySelectorAll('.toc-minimal a');
    const sections = ['sec-intro', 'sec-journey', 'sec-stylists', 'sec-contact']
        .map(id => document.getElementById(id))
        .filter(el => el !== null);

    if (!aboutView || tocLinks.length === 0 || sections.length === 0) return;

    // Cấu hình vùng kích hoạt (Trigger zone)
    const observerOptions = {
        root: aboutView, // Chỉ theo dõi trong vùng cuộn của tab About
        rootMargin: '-20% 0px -40% 0px', // Đẩy điểm bắt kiện vào giữa màn hình để mượt hơn
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                
                // Xóa active cũ và gán active mới
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    // Kiểm tra xem link nào chứa id của section đang hiển thị
                    if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(currentId)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    // Kích hoạt theo dõi cho từng section
    sections.forEach(section => observer.observe(section));
}

// Chạy hàm này khi DOM tải xong
document.addEventListener('DOMContentLoaded', () => {
    initAboutScrollSpy();
});