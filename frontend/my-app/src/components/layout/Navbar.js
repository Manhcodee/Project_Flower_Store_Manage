import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/Navbar.module.css';

const Navbar = () => {
  const router = useRouter();
  const [showCategories, setShowCategories] = useState(false);
  
  const isActive = (path) => {
    return router.pathname === path ? styles.active : '';
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <ul className={styles.navList}>
          <li className={`${styles.navItem} ${isActive('/')}`}>
            <Link href="/">TRANG CHỦ</Link>
          </li>
          <li className={`${styles.navItem} ${isActive('/gioi-thieu')}`}>
            <Link href="/gioi-thieu">GIỚI THIỆU</Link>
          </li>
          <li className={`${styles.navItem} ${isActive('/san-pham')} ${styles.hasDropdown}`}>
            <Link href="/san-pham">SẢN PHẨM</Link>
            <button 
              className={styles.dropdownToggle} 
              onClick={toggleCategories}
              aria-label="Toggle categories dropdown"
            >
              <i className={`fas fa-chevron-down ${showCategories ? styles.rotated : ''}`}></i>
            </button>
            {showCategories && (
              <div className={styles.dropdown}>
                <ul className={styles.dropdownMenu}>
                  <li className={styles.dropdownItem}>
                    <Link href="/san-pham/danh-muc/hoa-hong">Hoa Hồng</Link>
                  </li>
                  <li className={styles.dropdownItem}>
                    <Link href="/san-pham/danh-muc/hoa-lan">Hoa Lan</Link>
                  </li>
                  <li className={styles.dropdownItem}>
                    <Link href="/san-pham/danh-muc/hoa-cuc">Hoa Cúc</Link>
                  </li>
                  <li className={styles.dropdownItem}>
                    <Link href="/san-pham/danh-muc/hoa-huong-duong">Hoa Hướng Dương</Link>
                  </li>
                  <li className={styles.dropdownItem}>
                    <Link href="/san-pham/danh-muc/hoa-tulip">Hoa Tulip</Link>
                  </li>
                  <li className={styles.dropdownItem}>
                    <Link href="/san-pham/danh-muc/hoa-ly">Hoa Ly</Link>
                  </li>
                  <li className={styles.dropdownItem}>
                    <Link href="/san-pham/danh-muc/bo-hoa">Bó Hoa</Link>
                  </li>
                  <li className={styles.dropdownItem}>
                    <Link href="/san-pham/danh-muc/gio-hoa">Giỏ Hoa</Link>
                  </li>
                  <li className={styles.dropdownItem}>
                    <Link href="/san-pham/danh-muc/hoa-chuc-mung">Hoa Chúc Mừng</Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li className={`${styles.navItem} ${isActive('/tin-tuc')}`}>
            <Link href="/tin-tuc">TIN TỨC</Link>
          </li>
          <li className={`${styles.navItem} ${isActive('/lien-he')}`}>
            <Link href="/lien-he">LIÊN HỆ</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 