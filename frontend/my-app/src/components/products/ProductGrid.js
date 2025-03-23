import React from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import styles from '../../styles/ProductGrid.module.css';

const ProductGrid = ({ title, products, viewAllLink, viewAllText = "Xem tất cả" }) => {
  return (
    <div className={styles.productSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className={styles.viewAllLink}>
            {viewAllText} <i className="fas fa-chevron-right"></i>
          </Link>
        )}
      </div>
      
      <div className={styles.productGrid}>
        {products && products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Dữ liệu sản phẩm nổi bật dựa trên database
const featuredProducts = [
  {
    id: 1,
    name: "Bó Hoa Hồng Đỏ 'Passionate Love'",
    slug: "bo-hoa-hong-do-passionate-love",
    imageUrl: "/images/flowers/rose/rose_01.jpg",
    price: 550000,
    originalPrice: 650000,
    discount: 15,
    isNew: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 124,
    categoryType: "ROSE"
  },
  {
    id: 2,
    name: "Bó Hoa Hồng Pastel 'Sweet Dream'",
    slug: "bo-hoa-hong-pastel-sweet-dream",
    imageUrl: "/images/flowers/rose/rose_02.jpg",
    price: 680000,
    originalPrice: null,
    discount: 0,
    isNew: true,
    isBestSeller: false,
    rating: 4.5,
    reviewCount: 86,
    categoryType: "ROSE"
  },
  {
    id: 3,
    name: "Bó Hoa Tulip Mix 'Spring Beauty'",
    slug: "bo-hoa-tulip-mix-spring-beauty",
    imageUrl: "/images/flowers/tulip/tulip_01.jpg",
    price: 750000,
    originalPrice: 850000,
    discount: 12,
    isNew: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 152,
    categoryType: "TULIP"
  },
  {
    id: 4,
    name: "Hoa Hướng Dương 'Sunshine'",
    slug: "hoa-huong-duong-sunshine",
    imageUrl: "/images/flowers/sunflower/sunflower_01.jpg",
    price: 480000,
    originalPrice: null,
    discount: 0,
    isNew: false,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 93,
    categoryType: "SUNFLOWER"
  },
  {
    id: 5,
    name: "Bó Hoa Lan Tím 'Purple Elegance'",
    slug: "bo-hoa-lan-tim-purple-elegance",
    imageUrl: "/images/flowers/orchid/orchid_01.jpg",
    price: 1200000,
    originalPrice: 1350000,
    discount: 11,
    isNew: true,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 67,
    categoryType: "ORCHID"
  }
];

// Dữ liệu sản phẩm bán chạy dựa trên database
const bestSellingProducts = [
  {
    id: 6,
    name: "Bó Hoa Cưới 'Bridal Romance'",
    slug: "bo-hoa-cuoi-bridal-romance",
    imageUrl: "/images/arrangements/wedding/wedding_01.jpg",
    price: 1500000,
    originalPrice: null,
    discount: 0,
    isNew: false,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 218,
    categoryType: "WEDDING_FLOWERS"
  },
  {
    id: 7,
    name: "Giỏ Hoa Mix 'Colorful Surprise'",
    slug: "gio-hoa-mix-colorful-surprise",
    imageUrl: "/images/arrangements/basket/basket_01.jpg",
    price: 780000,
    originalPrice: 920000,
    discount: 15,
    isNew: false,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 156,
    categoryType: "BASKET"
  },
  {
    id: 8,
    name: "Hộp Hoa Hồng 'Timeless Beauty'",
    slug: "hop-hoa-hong-timeless-beauty",
    imageUrl: "/images/arrangements/box/box_01.jpg",
    price: 850000,
    originalPrice: 950000,
    discount: 10,
    isNew: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 142,
    categoryType: "BOX"
  },
  {
    id: 9,
    name: "Bó Hoa Baby 'Pure Love'",
    slug: "bo-hoa-baby-pure-love",
    imageUrl: "/images/flowers/baby_breath/baby_breath_01.jpg",
    price: 520000,
    originalPrice: null,
    discount: 0,
    isNew: false,
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 98,
    categoryType: "BABY_BREATH"
  },
  {
    id: 10,
    name: "Kệ Hoa Khai Trương 'Success Growth'",
    slug: "ke-hoa-khai-truong-success-growth",
    imageUrl: "/images/arrangements/congratulation/congratulation_01.jpg",
    price: 1800000,
    originalPrice: 2000000,
    discount: 10,
    isNew: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 87,
    categoryType: "CONGRATULATION_FLOWERS"
  }
];

// Thiết lập defaultProps cho component
ProductGrid.defaultProps = {
  title: "SẢN PHẨM NỔI BẬT",
  products: featuredProducts,
  viewAllLink: "/san-pham",
  viewAllText: "Xem tất cả"
};

// Export cả component và dữ liệu mẫu
export { ProductGrid, featuredProducts, bestSellingProducts };
export default ProductGrid; 