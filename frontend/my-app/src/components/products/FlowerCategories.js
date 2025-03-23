import React from 'react';
import Link from 'next/link';
import styles from '@/styles/FlowerCategories.module.css';

const FlowerCategories = ({ categories }) => {
  return (
    <div className={styles.categoriesContainer}>
      <h2 className={styles.sectionTitle}>DANH MỤC SẢN PHẨM</h2>
      <div className={styles.categoriesList}>
        {categories && categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/san-pham/danh-muc/${category.id}`}
            className={styles.categoryItem}
          >
            <div className={styles.categoryImage}>
              {category.imageUrl ? (
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                />
              ) : (
                <img 
                  src="/images/placeholder.jpg" 
                  alt="Placeholder" 
                />
              )}
            </div>
            <div className={styles.categoryName}>
              {category.name}
            </div>
            {category.productCount > 0 && (
              <div className={styles.categoryCount}>
                ({category.productCount})
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

// Dữ liệu mẫu
FlowerCategories.defaultProps = {
  categories: [
    { id: 1, name: 'Tổ Yến Thô', imageUrl: '/images/categories/to-yen-tho.jpg', productCount: 5 },
    { id: 2, name: 'Tổ Yến Tinh Chế', imageUrl: '/images/categories/to-yen-tinh-che.jpg', productCount: 8 },
    { id: 3, name: 'Yến Chưng Sẵn', imageUrl: '/images/categories/yen-chung-san.jpg', productCount: 12 },
    { id: 4, name: 'Yến Dạng Nước', imageUrl: '/images/categories/yen-dang-nuoc.jpg', productCount: 7 },
    { id: 5, name: 'Yến Cho Trẻ Em', imageUrl: '/images/categories/yen-cho-tre-em.jpg', productCount: 4 },
    { id: 6, name: 'Yến Cho Người Cao Tuổi', imageUrl: '/images/categories/yen-cho-nguoi-cao-tuoi.jpg', productCount: 3 },
  ]
};

export default FlowerCategories;
