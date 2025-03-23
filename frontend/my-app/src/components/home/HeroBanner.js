import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/HeroBanner.module.css';

const HeroBanner = ({ banners }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Chuyển slide tự động
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [banners]);
  
  // Chuyển đến slide cụ thể
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  // Xử lý nút prev
  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? banners.length - 1 : prevSlide - 1));
  };
  
  // Xử lý nút next
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
  };

  if (!banners || banners.length === 0) {
    return null; // Không hiển thị gì nếu không có banner
  }

  return (
    <div className={styles.heroBanner}>
      <div className={styles.slideContainer}>
        {banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          >
            <img 
              src={banner.imageUrl} 
              alt={banner.title} 
              className={styles.bannerImage} 
            />
            <div className={styles.bannerContent}>
              <h2 className={styles.bannerTitle}>{banner.title}</h2>
              <p className={styles.bannerDescription}>{banner.description}</p>
              {banner.buttonText && banner.buttonLink && (
                <Link href={banner.buttonLink} className={styles.bannerButton}>
                  {banner.buttonText}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button className={`${styles.slideNav} ${styles.prevSlide}`} onClick={prevSlide}>
        <i className="fas fa-chevron-left"></i>
      </button>
      
      <button className={`${styles.slideNav} ${styles.nextSlide}`} onClick={nextSlide}>
        <i className="fas fa-chevron-right"></i>
      </button>
      
      <div className={styles.slideDots}>
        {banners.map((_, index) => (
          <button 
            key={index}
            className={`${styles.slideDot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

// Dữ liệu banner thực cho cửa hàng hoa
HeroBanner.defaultProps = {
  banners: [
    {
      id: 1,
      title: "BLOOM GARDEN - CỬA HÀNG HOA TƯƠI",
      description: "Chuyên cung cấp các loại hoa tươi chất lượng cao, bó hoa đẹp cho mọi dịp, giao hàng nhanh chóng trong ngày.",
      imageUrl: "/images/flowers/rose/rose1.jpg",
      buttonText: "Mua Ngay",
      buttonLink: "/products"
    },
    {
      id: 2,
      title: "BỘ SƯU TẬP HOA CƯỚI",
      description: "Thiết kế bó hoa cưới độc đáo, sang trọng theo yêu cầu. Đặt trước để nhận ưu đãi đặc biệt cho ngày trọng đại.",
      imageUrl: "/images/flowers/lily/lily1.jpg",
      buttonText: "Khám Phá",
      buttonLink: "/products/category/special_occasion"
    },
    {
      id: 3,
      title: "ƯU ĐÃI MÙA HOA",
      description: "Giảm giá đến 25% cho các bó hoa và giỏ hoa nhân dịp mùa xuân. Chương trình có hạn, đặt hàng ngay hôm nay!",
      imageUrl: "/images/flowers/sunflower/sunflower1.jpg",
      buttonText: "Xem Ưu Đãi",
      buttonLink: "/promotion"
    }
  ]
};

export default HeroBanner; 