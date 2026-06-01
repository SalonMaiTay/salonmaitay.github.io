/**
 * PWA Force Add to Home Screen - CHỈ DÀNH CHO IPHONE/IOS
 * Tích hợp: Nhận diện In-App, Video PiP (đã fix lỗi source), Icon chuẩn iOS, Bố cục tối ưu.
 */

(function() {
    const PWAManager = {
        injectStyles() {
            const style = document.createElement('style');
            style.textContent = `
                :root {
                    --pwa-primary: #0f172a;
                    --pwa-danger: #ef4444;
                    --pwa-warning: #f59e0b;
                    --pwa-bg: #f8fafc;
                    --pwa-text: #0f172a;
                    --pwa-text-sec: #64748b;
                }
                .pwa-fullscreen {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: var(--pwa-bg); z-index: 9999999; 
                    display: flex; flex-direction: column; align-items: center; 
                    justify-content: flex-start;
                    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; box-sizing: border-box;
                    padding: 16px; 
                    padding-top: calc(20px + env(safe-area-inset-top, 0px));
                    text-align: center; overscroll-behavior: none;
                }
                .pwa-icon-box {
                    width: 48px; height: 48px; background: #ffffff; border-radius: 14px;
                    margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;
                    color: var(--pwa-primary); box-shadow: 0 4px 15px -5px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
                }
                .pwa-title { font-size: 18px; font-weight: 800; color: var(--pwa-text); margin: 0 0 4px; letter-spacing: -0.5px; }
                .pwa-desc { font-size: 12px; color: var(--pwa-text-sec); margin: 0 0 12px; line-height: 1.4; max-width: 280px; font-weight: 500; }
                
                /* VIDEO CONTAINER STYLES */
                .pwa-video-card {
                    width: 100%; max-width: 280px; background: #000; border-radius: 14px; 
                    margin-bottom: 12px; position: relative; overflow: hidden;
                    aspect-ratio: 16 / 9; box-shadow: 0 8px 20px -8px rgba(0,0,0,0.15);
                }
                .pwa-video-card video { width: 100%; height: 100%; object-fit: cover; }
                .pwa-video-overlay {
                    position: absolute; inset: 0; background: rgba(0,0,0,0.4);
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    color: white; transition: opacity 0.3s; cursor: pointer;
                }
                .pwa-video-overlay i { font-size: 28px; margin-bottom: 4px; }
                .pwa-video-overlay span { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }

                /* STEPS & IOS ICONS STYLES */
                .pwa-steps { width: 100%; max-width: 300px; text-align: left; padding: 14px 16px; border-radius: 16px; background: #ffffff; border: 1px solid #f1f5f9; box-sizing: border-box; margin-bottom: 14px; box-shadow: 0 4px 15px -5px rgba(0,0,0,0.03); }
                .pwa-step { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
                .pwa-step:last-child { margin-bottom: 0; }
                .pwa-s-icon { 
                    width: 32px; height: 32px; background: #ffffff; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.06); border: 1px solid #f8fafc;
                }
                .pwa-s-text { font-size: 11.5px; color: var(--pwa-text-sec); margin: 0; line-height: 1.4; }
                .pwa-s-text strong { color: var(--pwa-text); font-weight: 800; }
                
                .pwa-btn { width: 100%; max-width: 300px; background: var(--pwa-primary); color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; box-shadow: 0 8px 16px -4px rgba(15,23,42,0.2); }
                .pwa-btn:active { transform: scale(0.97); }

                /* IN-APP / NON-SAFARI SPECIFIC */
                .pwa-icon-box.danger { background: #fef2f2; color: var(--pwa-danger); border-color: #fee2e2; }
                .pwa-icon-box.warning { background: #fffbeb; color: var(--pwa-warning); border-color: #fef3c7; }
                .pwa-copy-box { background: #f8fafc; padding: 10px; border-radius: 10px; border: 1px solid #e2e8f0; word-break: break-all; font-size: 12px; margin-bottom: 12px; text-align: center; color: var(--pwa-text-sec); font-family: monospace; }
                
                body.pwa-locked { overflow: hidden !important; }
            `;
            document.head.appendChild(style);
        },

        createElements(state) {
            const host = document.createElement('div');
            host.id = 'pwa-guide-container';
            let content = '';

            // Thêm CSS riêng cho Bottom Sheet và Animation trực tiếp vào head
            const customStyle = document.createElement('style');
            customStyle.textContent = `
                @keyframes bounceDown {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(10px); }
                }
                .animate-bounce-down { animation: bounceDown 1.5s infinite ease-in-out; }
                .liquid-glass-sheet {
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                    border-top: 1px solid rgba(255, 255, 255, 0.5);
                }
                #pwa-guide-container {
                    position: relative;
                    z-index: 9999999;
                }
            `;
            document.head.appendChild(customStyle);

            if (state === 'in_app') {
                content = `
                    <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999999] flex items-center justify-center p-6">
                        <div class="bg-white p-8 rounded-[2rem] shadow-2xl text-center border border-slate-100 max-w-sm w-full relative overflow-hidden">
                            <div class="absolute -top-10 -right-10 w-32 h-32 bg-amber-100 rounded-full blur-2xl opacity-60"></div>
                            
                            <div class="relative z-10">
                                <div class="w-16 h-16 bg-amber-50 text-amber-500 rounded-[1.25rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-100">
                                    <i class="fa-solid fa-compass text-3xl"></i>
                                </div>
                                <h3 class="text-xl font-black text-slate-900 mb-2 tracking-tight">Trình duyệt hạn chế</h3>
                                <p class="text-[13px] text-slate-500 font-medium mb-6 leading-relaxed">
                                    Bạn đang mở app trong mạng xã hội. Để đặt lịch và trải nghiệm mượt mà nhất, vui lòng mở bằng trình duyệt gốc.
                                </p>
                                <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left mb-6">
                                    <p class="text-sm font-medium text-slate-700 leading-relaxed">
                                        Nhấn vào biểu tượng <strong>Ba chấm (...)</strong> hoặc <strong>Mũi tên chia sẻ</strong> ở góc màn hình và chọn:<br><br>
                                        <span class="font-black text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm block text-center uppercase tracking-widest text-[10px]">Mở bằng trình duyệt</span>
                                    </p>
                                </div>
                                <button onclick="document.getElementById('pwa-guide-container').remove(); document.body.classList.remove('pwa-locked');" class="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Bỏ qua</button>
                            </div>
                        </div>
                    </div>
                `;
            } else if (state === 'non_safari') {
                content = `
                    <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999999] flex items-center justify-center p-6">
                        <div class="bg-white p-8 rounded-[2rem] shadow-2xl text-center border border-slate-100 max-w-sm w-full relative overflow-hidden">
                            <div class="absolute -top-10 -right-10 w-32 h-32 bg-rose-100 rounded-full blur-2xl opacity-60"></div>

                            <div class="relative z-10">
                                <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-[1.25rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-rose-100">
                                    <i class="fa-brands fa-safari text-3xl"></i>
                                </div>
                                <h3 class="text-xl font-black text-slate-900 mb-2 tracking-tight">Sử dụng Safari</h3>
                                <p class="text-[13px] text-slate-500 font-medium mb-6 leading-relaxed">
                                    Apple chỉ cho phép cài đặt ứng dụng vào màn hình chính thông qua trình duyệt Safari mặc định.
                                </p>
                                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 flex items-center justify-between gap-3">
                                    <span class="text-xs text-slate-400 font-mono truncate bg-white py-2 px-3 rounded-xl border border-slate-100 flex-1 text-left" id="pwa-current-url">${window.location.href}</span>
                                    <button id="pwa-copy-btn" class="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-md">
                                        <i class="fa-regular fa-copy"></i>
                                    </button>
                                </div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Hãy copy link và dán vào Safari</p>
                                <button onclick="document.getElementById('pwa-guide-container').remove(); document.body.classList.remove('pwa-locked');" class="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Bỏ qua</button>
                            </div>
                        </div>
                    </div>
                `;
            } else if (state === 'safari') {
                content = `
                    <div class="fixed inset-0 bg-slate-900/40 z-[999999] flex flex-col justify-end transition-opacity">
                        <div class="flex-1 w-full cursor-pointer" onclick="document.getElementById('pwa-guide-container').remove(); document.body.classList.remove('pwa-locked');"></div>
                        
                        <div class="liquid-glass-sheet w-full rounded-t-[2.5rem] p-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative">
                            
                            <div class="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-6"></div>
                            
                            <div class="flex items-center gap-4 mb-6">
                                <img src="/Asset/logo/iconApps.png" class="w-14 h-14 rounded-2xl shadow-md border border-white" onerror="this.src='https://ui-avatars.com/api/?name=MT&background=0f172a&color=fff'">
                                <div>
                                    <h3 class="text-xl font-black text-slate-900 tracking-tight">Cài đặt Mai Tây App</h3>
                                    <p class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Trải nghiệm mượt mà hơn</p>
                                </div>
                                <button onclick="document.getElementById('pwa-guide-container').remove(); document.body.classList.remove('pwa-locked');" class="ml-auto w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center active:scale-95 transition-transform"><i class="fa-solid fa-xmark"></i></button>
                            </div>

                            <div class="space-y-4 mb-6 bg-white/50 p-5 rounded-2xl border border-white shadow-sm">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 shadow-sm border border-white"><i class="fa-solid fa-arrow-up-from-bracket"></i></div>
                                    <p class="text-sm font-medium text-slate-700">1. Nhấn nút <strong>Chia sẻ</strong> ở thanh menu dưới cùng.</p>
                                </div>
                                <div class="w-[1px] h-4 bg-slate-200 ml-4"></div>
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 shadow-sm border border-white"><i class="fa-solid fa-plus text-sm"></i></div>
                                    <p class="text-sm font-medium text-slate-700">2. Chọn <strong>Thêm vào MH chính</strong> (Add to Home Screen).</p>
                                </div>
                            </div>

                            <button id="pwa-share-btn" class="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-[0_8px_20px_-5px_rgba(15,23,42,0.3)] hover:bg-slate-800 flex items-center justify-center gap-2 mb-4">
                                <i class="fa-solid fa-arrow-up-from-bracket text-[13px] mb-[1px]"></i> Mở Bảng Chia Sẻ Ngay
                            </button>

                            <div class="flex flex-col items-center justify-center text-blue-500 animate-bounce-down mt-2">
                                <span class="text-[10px] font-black uppercase tracking-widest mb-2">Hoặc nhấn vào đây</span>
                                <i class="fa-solid fa-arrow-down text-2xl"></i>
                            </div>
                        </div>
                    </div>
                `;
            }

            host.innerHTML = content;
            document.body.appendChild(host);
            document.body.classList.add('pwa-locked');

            // Gắn sự kiện cho nút Copy ở non_safari
            if (state === 'non_safari') {
                const copyBtn = document.getElementById('pwa-copy-btn');
                if (copyBtn) {
                    copyBtn.addEventListener('click', () => {
                        navigator.clipboard.writeText(window.location.href).then(() => {
                            const icon = copyBtn.querySelector('i');
                            icon.className = 'fa-solid fa-check';
                            copyBtn.classList.replace('bg-slate-900', 'bg-emerald-500');
                            setTimeout(() => {
                                icon.className = 'fa-regular fa-copy';
                                copyBtn.classList.replace('bg-emerald-500', 'bg-slate-900');
                            }, 3000);
                        });
                    });
                }
            }

            // Gắn sự kiện cho nút Web Share API ở safari
            if (state === 'safari') {
                const shareBtn = document.getElementById('pwa-share-btn');
                if (shareBtn) {
                    shareBtn.addEventListener('click', () => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'Mai Tây Studio',
                                text: 'Ứng dụng đặt lịch Mai Tây Hair Salon',
                                url: window.location.href
                            }).catch((error) => console.log('Chia sẻ bị hủy hoặc lỗi:', error));
                        }
                    });
                }
            }
        },
        init() {
            const ua = navigator.userAgent;
            const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            if (!isIOS) return;

            const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
            if (isStandalone) return;

            const isInApp = /FBAV|FBAN|Zalo|Instagram|TikTok|Messenger/i.test(ua);
            const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|OPiOS|mercury|EdgiOS/i.test(ua) && !isInApp;

            this.injectStyles();
            if (isInApp) this.createElements('in_app');
            else if (!isSafari) this.createElements('non_safari');
            else this.createElements('safari');
        }
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') PWAManager.init();
    else window.addEventListener('load', () => PWAManager.init());
})();