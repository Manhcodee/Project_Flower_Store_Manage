import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../../styles/Header.module.css';

const Header = () => {
  const router = useRouter();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.search.value;
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <div className={styles.logo}>
              <img 
                src="/favicon.ico" 
                alt="Flower Shop - Cửa hàng hoa tươi" 
                width="60"
                height="60"
              />
              <div className={styles.logoText}>
                <h1>FLOWER SHOP - CỬA HÀNG HOA TƯƠI TRÀN NGẬP SẮC HƯƠNG</h1>
              </div>
            </div>
          </Link>
        </div>
        
        <div className={styles.searchAndActions}>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input 
              type="text" 
              name="search" 
              placeholder="Tìm kiếm" 
              className={styles.searchInput} 
            />
            <button type="submit" className={styles.searchButton}>
              <i className="fa fa-search"></i>
            </button>
          </form>
          
          <div className={styles.actions}>
            <div className={styles.userWrapper}>
              <button 
                className={styles.userButton} 
                onClick={toggleUserDropdown}
                aria-label="Tài khoản người dùng"
              >
                <i className="fas fa-user"></i>
              </button>
              
              {showUserDropdown && (
                <div className={styles.userDropdown}>
                  <div className={styles.userDropdownHeader}>
                    <h3>Tài khoản</h3>
                  </div>
                  <div className={styles.userDropdownContent}>
                    <Link href="/dang-nhap" className={styles.userDropdownItem}>
                      <i className="fas fa-sign-in-alt"></i> Đăng nhập
                    </Link>
                    <Link href="/dang-ky" className={styles.userDropdownItem}>
                      <i className="fas fa-user-plus"></i> Đăng ký
                    </Link>
                    <div className={styles.divider}></div>
                    <Link href="/quen-mat-khau" className={styles.userDropdownItem}>
                      <i className="fas fa-key"></i> Quên mật khẩu
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.cartWrapper}>
              <Link href="/cart" className={styles.cartButton}>
                <i className="fas fa-shopping-cart"></i>
                <span className={styles.cartCount}>0</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 