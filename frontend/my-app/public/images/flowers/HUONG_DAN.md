# Hướng dẫn tải và quản lý ảnh hoa cho dự án Flower Shop

## Các tài liệu và công cụ đã tạo

1. **README.md**: Danh sách các trang web cung cấp ảnh hoa miễn phí chất lượng cao và hướng dẫn tổ chức ảnh.
2. **download_images.py**: Script Python để tải xuống ảnh hoa từ URL và lưu vào thư mục tương ứng.
3. **preview.html**: Trang web đơn giản để xem trước tất cả ảnh hoa đã tải lên.
4. **Cấu trúc thư mục**: Các thư mục đã được tạo sẵn theo từng loại hoa và kiểu cắm hoa.

## Cách tải ảnh hoa

### Cách 1: Tải thủ công

1. Truy cập một trong các trang web được liệt kê trong file `README.md` (Unsplash, Pexels, Pixabay, v.v.)
2. Tìm kiếm loại hoa bạn cần (ví dụ: "rose", "lily", "orchid", v.v.)
3. Tải xuống 10 ảnh cho mỗi loại hoa
4. Đổi tên file theo định dạng: `<loại_hoa>_<số>.jpg` (ví dụ: `rose_01.jpg`, `lily_02.jpg`, v.v.)
5. Lưu vào thư mục tương ứng trong `frontend/my-app/public/images/flowers/[tên_loại_hoa]`

### Cách 2: Sử dụng script Python

1. Mở file `download_images.py` và thêm URL ảnh vào các mảng tương ứng.
2. Ví dụ:
   ```python
   FLOWER_TYPES = {
       "rose": [
           "https://example.com/rose1.jpg",
           "https://example.com/rose2.jpg",
           # Thêm URL khác...
       ],
       "lily": [
           "https://example.com/lily1.jpg",
           "https://example.com/lily2.jpg",
           # Thêm URL khác...
       ],
       # Các loại hoa khác...
   }
   ```
3. Cài đặt các thư viện Python cần thiết: `pip install requests`
4. Chạy script: `python download_images.py`

## Xem trước ảnh đã tải

1. Mở file `preview.html` trong trình duyệt web
2. Trang này sẽ hiển thị tất cả ảnh đã được tải lên, được phân loại theo loại hoa
3. Nhấp vào ảnh để xem chi tiết

## Cấu trúc thư mục

```
frontend/my-app/public/
├── images/
│   ├── flowers/
│   │   ├── rose/             # Ảnh hoa hồng
│   │   ├── lily/             # Ảnh hoa ly
│   │   ├── orchid/           # Ảnh hoa lan
│   │   ├── ...               # Các loại hoa khác
│   │   ├── README.md         # Danh sách trang web ảnh miễn phí
│   │   ├── download_images.py # Script tải ảnh
│   │   ├── preview.html      # Trang xem trước ảnh
│   │   └── HUONG_DAN.md      # File này
│   └── arrangements/
│       ├── bouquet/          # Ảnh bó hoa
│       ├── basket/           # Ảnh giỏ hoa
│       ├── box/              # Ảnh hộp hoa
│       ├── ...               # Các kiểu cắm hoa khác
```

## Lưu ý khi sử dụng ảnh

1. **Kích thước ảnh**: Nên sử dụng ảnh có kích thước đủ lớn (tối thiểu 1000x1000 pixel) nhưng không quá lớn để tránh làm chậm trang web.
2. **Định dạng ảnh**: Nên sử dụng định dạng JPEG hoặc WEBP cho ảnh hoa để đảm bảo chất lượng tốt và kích thước file hợp lý.
3. **Tối ưu hóa ảnh**: Nên sử dụng các công cụ như TinyPNG, ImageOptim để nén ảnh trước khi sử dụng trên trang web.
4. **Bản quyền ảnh**: Luôn đảm bảo bạn có quyền sử dụng ảnh. Các ảnh từ Unsplash, Pexels, Pixabay thường có giấy phép cho phép sử dụng miễn phí cho cả mục đích cá nhân và thương mại.

## Sử dụng ảnh trong dự án

Khi đã tải đủ ảnh, bạn có thể sử dụng chúng trong các component React của dự án:

```jsx
import Image from 'next/image';

const FlowerCard = ({ flower }) => {
  return (
    <div className="flower-card">
      <Image 
        src={`/images/flowers/${flower.type}/${flower.image}`} 
        alt={flower.name}
        width={300}
        height={300}
        className="flower-image"
      />
      <h3>{flower.name}</h3>
      <p>{flower.price}</p>
    </div>
  );
};
```

## Quản lý ảnh theo nhóm sản phẩm

Mỗi loại hoa trong cửa hàng có thể được hiển thị với nhiều ảnh khác nhau. Bạn nên tổ chức dữ liệu sản phẩm để tham chiếu đến ảnh tương ứng:

```javascript
const flowerProducts = [
  {
    id: 1,
    name: "Hoa Hồng Đỏ",
    type: "rose",
    image: "rose_01.jpg",
    price: "250.000 VNĐ",
    // Các thông tin khác...
  },
  {
    id: 2,
    name: "Hoa Ly Trắng",
    type: "lily",
    image: "lily_02.jpg",
    price: "350.000 VNĐ",
    // Các thông tin khác...
  },
  // Các sản phẩm khác...
];
```

## Hỗ trợ

Nếu bạn gặp vấn đề khi tải hoặc sử dụng ảnh, hãy tham khảo:
1. Tài liệu hướng dẫn của Next.js về [tối ưu hóa hình ảnh](https://nextjs.org/docs/basic-features/image-optimization)
2. Tài liệu về các thư viện hình ảnh miễn phí như Unsplash, Pexels, Pixabay 