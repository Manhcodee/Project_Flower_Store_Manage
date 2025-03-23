import React from 'react';
import Link from 'next/link';
import styles from '../../styles/NewsSection.module.css';

const NewsSection = ({ newsItems }) => {
  return (
    <div className={styles.newsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>TIN TỨC & BÀI VIẾT</h2>
        <Link href="/tin-tuc" className={styles.viewAllLink}>
          Xem tất cả <i className="fas fa-chevron-right"></i>
        </Link>
      </div>
      
      <div className={styles.newsGrid}>
        {newsItems && newsItems.map((item) => (
          <div key={item.id} className={styles.newsCard}>
            <div className={styles.newsImageContainer}>
              <Link href={`/tin-tuc/${item.slug}`}>
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className={styles.newsImage} 
                />
              </Link>
              <span className={styles.newsDate}>{item.date}</span>
            </div>
            
            <div className={styles.newsContent}>
              <h3 className={styles.newsTitle}>
                <Link href={`/tin-tuc/${item.slug}`}>
                  {item.title}
                </Link>
              </h3>
              
              <p className={styles.newsExcerpt}>{item.excerpt}</p>
              
              <Link href={`/tin-tuc/${item.slug}`} className={styles.readMoreLink}>
                Đọc tiếp <i className="fas fa-long-arrow-alt-right"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Dữ liệu tin tức với ảnh thực
NewsSection.defaultProps = {
  newsItems: [
    {
      id: 1,
      title: 'Cách chăm sóc hoa hồng tươi lâu trong nhà',
      slug: 'cach-cham-soc-hoa-hong-tuoi-lau-trong-nha',
      excerpt: 'Khám phá các bí quyết đơn giản giúp giữ cho hoa hồng tươi lâu hơn và giữ được vẻ đẹp rực rỡ trong nhiều ngày.',
      date: '15/06/2023',
      imageUrl: '/images/flowers/rose/rose_03.jpg',
    },
    {
      id: 2,
      title: 'Ý nghĩa của các loài hoa trong văn hóa Việt Nam',
      slug: 'y-nghia-cua-cac-loai-hoa-trong-van-hoa-viet-nam',
      excerpt: 'Tìm hiểu về ý nghĩa sâu sắc và biểu tượng của các loài hoa phổ biến trong văn hóa truyền thống Việt Nam.',
      date: '02/06/2023',
      imageUrl: '/images/flowers/lotus/lotus_01.jpg',
    },
    {
      id: 3,
      title: 'Xu hướng trang trí hoa cho đám cưới 2023',
      slug: 'xu-huong-trang-tri-hoa-cho-dam-cuoi-2023',
      excerpt: 'Cập nhật những xu hướng trang trí hoa đám cưới mới nhất năm 2023, từ màu sắc đến kiểu dáng và cách bố trí.',
      date: '28/05/2023',
      imageUrl: '/images/arrangements/wedding/wedding_02.jpg',
    }
  ]
};

export default NewsSection; 