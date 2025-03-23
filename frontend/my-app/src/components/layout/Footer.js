import React from 'react';
import Link from 'next/link';
import styles from '../../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>THÔNG TIN LIÊN HỆ</h3>
            <ul className={styles.contactList}>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Nguyễn Huệ, Quận 1, TP.HCM</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>0123 456 789</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>info@flowershop.com</span>
              </li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>CHÍNH SÁCH</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/chinh-sach-van-chuyen">Chính sách vận chuyển</Link>
              </li>
              <li>
                <Link href="/chinh-sach-doi-tra">Chính sách đổi trả</Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link href="/dieu-khoan-dich-vu">Điều khoản dịch vụ</Link>
              </li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>HỖ TRỢ KHÁCH HÀNG</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/huong-dan-mua-hang">Hướng dẫn mua hàng</Link>
              </li>
              <li>
                <Link href="/huong-dan-thanh-toan">Hướng dẫn thanh toán</Link>
              </li>
              <li>
                <Link href="/cau-hoi-thuong-gap">Câu hỏi thường gặp</Link>
              </li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>KẾT NỐI VỚI CHÚNG TÔI</h3>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
            
            <h3 className={styles.footerTitle}>PHƯƠNG THỨC THANH TOÁN</h3>
            <div className={styles.paymentMethods}>
              <img src="/images/payment/visa.png" alt="Visa" />
              <img src="/images/payment/mastercard.png" alt="Mastercard" />
              <img src="/images/payment/momo.png" alt="MoMo" />
              <img src="/images/payment/zalopay.png" alt="ZaloPay" />
            </div>
          </div>
        </div>
        
        <div className={styles.copyright}>
          <p>© {new Date().getFullYear()} Flower Shop. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 