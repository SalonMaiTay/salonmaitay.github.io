# Chính sách Bảo mật (Security Policy)

Chào mừng bạn đến với hệ thống ứng dụng **Mai Tây Hair Salon**. Chúng tôi luôn ưu tiên đặt sự an toàn dữ liệu lịch hẹn, thông tin đóng góp ý kiến và trải nghiệm của khách hàng lên hàng đầu.

Tài liệu này hướng dẫn cách thức báo cáo các lỗ hổng bảo mật được phát hiện trong hệ thống một cách an toàn và có trách nhiệm.

---

## 1. Các phiên bản được hỗ trợ bảo mật

Hiện tại, chúng tôi chỉ tập trung vá lỗi và hỗ trợ bảo mật toàn diện cho các phiên bản ứng dụng chính thức đang vận hành thực tế trên môi trường Production:

| Phiên bản (Version) | Hỗ trợ bảo mật (Supported) |
| ------------------- | -------------------------- |
| v1.0.3 (Mới nhất)   | ✅ Có hỗ trợ                |
| < v1.0.0            | ❌ Không hỗ trợ            |

---

## 2. Quy trình báo cáo lỗ hổng an toàn

**Vui lòng KHÔNG công khai lỗi bảo mật lên các mục thảo luận công cộng (như GitHub Issues hay mạng xã hội) trước khi lỗi đó được khắc phục.** 

Nếu bạn phát hiện ra bất kỳ sự cố, nguy cơ dính mã độc, hay lỗ hổng khai thác dữ liệu nào liên quan đến hệ thống quản lý lịch hẹn hoặc phân vùng lưu trữ thông tin phản hồi, hãy thực hiện theo quy trình sau:

1. **Gửi thông tin kín:** Vui lòng gửi email mô tả chi tiết lỗi kèm theo các bước tái diễn (Proof of Concept) về địa chỉ hòm thư quản trị trực tiếp: `admin@mhung.site` (Hoặc liên hệ qua Hotline/Zalo chính thức của Salon).
2. **Nội dung cung cấp:**
   * Mô tả ngắn gọn về lỗ hổng an toàn bảo mật.
   * Các bước cụ thể hoặc đoạn mã minh họa để tái hiện lỗi.
   * Đánh giá mức độ ảnh hưởng đến trải nghiệm người dùng hoặc rò rỉ thông tin dữ liệu (nếu có).

---

## 3. Cam kết xử lý từ Ban quản trị

Sau khi nhận được email hoặc thông tin thông báo từ bạn, đội ngũ kỹ thuật của chúng tôi sẽ:

* **Xác nhận tiếp nhận:** Gửi phản hồi xác nhận đã nhận được đơn báo cáo của bạn trong vòng **24 giờ** làm việc.
* **Xác minh & Phân tích:** Tiến hành chạy thử ngầm, cô lập phân lớp xử lý và đánh giá chi tiết lỗ hổng.
* **Vá lỗi biên dịch:** Triển khai bản sửa lỗi (Hotfix), thực hiện biên dịch nén (Build Production) lại hệ thống và cập nhật phiên bản mới trực tiếp lên hosting GitHub Pages trong thời gian sớm nhất.
* **Phản hồi kết quả:** Thông báo lại trạng thái đã khắc phục triệt để tới bạn để cùng kiểm tra lại.

Cảm ơn sự chung tay và đóng góp có trách nhiệm của các bạn nhằm giúp hệ thống Mai Tây Hair Salon ngày một hoàn thiện và an toàn hơn!
