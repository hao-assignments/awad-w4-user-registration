# Hướng dẫn chạy (ngắn gọn)

Mục tiêu: chạy nhanh frontend + backend + MongoDB bằng Docker Compose.

1) Build và chạy (PowerShell):

```powershell
docker compose up --build -d
```

2) Kiểm tra logs:

```powershell
docker compose logs -f
```

3) Dừng và xóa containers + volumes:

```powershell
docker compose down -v
```

Thông tin nhanh:
- Frontend: http://localhost:5173 (nginx)
- Backend:  http://localhost:3000
- MongoDB (nếu cần truy cập trực tiếp): mongodb://localhost:27018

Env và tuỳ chỉnh:
- `user-registration-be/.env.template` được nạp; nếu muốn dùng MongoDB Atlas, chỉnh `MONGO_URI` trong file `.env.template` hoặc đặt biến môi trường tương ứng trước khi chạy.

Ghi chú:
- Nếu gặp lỗi kết nối DB, kiểm tra `MONGO_URI` và trạng thái service `mongo`.
- Muốn rebuild lại image: thêm `--no-cache` vào lệnh `docker compose build`.

Hết.
