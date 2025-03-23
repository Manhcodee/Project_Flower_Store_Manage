import React from 'react';
import Link from 'next/link';
import styles from '../../styles/FlowerCategories.module.css';

const FlowerCategories = ({ categories }) => {
  return (
    <div className={styles.categoriesSection}>
      <h2 className={styles.sectionTitle}>DANH MỤC HOA</h2>
      
      <div className={styles.categoriesGrid}>
        {categories && categories.map((category) => (
          <Link key={category.id} href={`/danh-muc/${category.slug}`} className={styles.categoryCard}>
            <div className={styles.categoryImageContainer}>
              <img 
                src={category.imageUrl} 
                alt={category.name} 
                className={styles.categoryImage} 
              />
            </div>
            <h3 className={styles.categoryName}>{category.name}</h3>
            <span className={styles.productCount}>{category.productCount} sản phẩm</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Dữ liệu thực tế dựa trên cơ sở dữ liệu
FlowerCategories.defaultProps = {
  categories: [
    {
      id: 1,
      name: 'Hoa Hồng',
      slug: 'hoa-hong',
      imageUrl: '/images/flowers/rose/rose_01.jpg',
      productCount: 24,
      categoryType: 'ROSE'
    },
    {
      id: 8,
      name: 'Hoa Lan',
      slug: 'hoa-lan',
      imageUrl: '/images/flowers/orchid/orchid_01.jpg',
      productCount: 18,
      categoryType: 'ORCHID'
    },
    {
      id: 12,
      name: 'Hoa Tulip',
      slug: 'hoa-tulip',
      imageUrl: '/images/flowers/tulip/tulip_01.jpg',
      productCount: 15,
      categoryType: 'TULIP'
    },
    {
      id: 4,
      name: 'Hoa Hướng Dương',
      slug: 'hoa-huong-duong',
      imageUrl: '/images/flowers/sunflower/sunflower_01.jpg',
      productCount: 12,
      categoryType: 'SUNFLOWER'
    },
    {
      id: 5,
      name: 'Hoa Cúc',
      slug: 'hoa-cuc',
      imageUrl: '/images/flowers/chrysanthemum/chrysanthemum_01.jpg',
      productCount: 20,
      categoryType: 'CHRYSANTHEMUM'
    },
    {
      id: 7,
      name: 'Hoa Ly',
      slug: 'hoa-ly',
      imageUrl: '/images/flowers/lily/lily_01.jpg',
      productCount: 16,
      categoryType: 'LILY'
    },
    {
      id: 9,
      name: 'Hoa Cẩm Tú Cầu',
      slug: 'hoa-cam-tu-cau',
      imageUrl: '/images/flowers/hydrangea/hydrangea_01.jpg',
      productCount: 10,
      categoryType: 'HYDRANGEA'
    },
    {
      id: 10,
      name: 'Hoa Baby',
      slug: 'hoa-baby',
      imageUrl: '/images/flowers/baby_breath/baby_breath_01.jpg',
      productCount: 8,
      categoryType: 'BABY_BREATH'
    }
  ]
};

export default FlowerCategories; 