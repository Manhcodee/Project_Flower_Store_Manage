import React from 'react';
import Link from 'next/link';
import styles from '../../styles/ProductCard.module.css';

const ProductCard = ({ product }) => {
  // Định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productImageContainer}>
        {/* Badges hiển thị các thông tin đặc biệt */}
        {product.isNew && (
          <div className={`${styles.productBadge} ${styles.newBadge}`}>Mới</div>
        )}
        {product.isBestSeller && (
          <div className={`${styles.productBadge} ${styles.bestSellerBadge}`}>Best Seller</div>
        )}
        {product.discount > 0 && (
          <div className={`${styles.productBadge} ${styles.discountBadge}`}>-{product.discount}%</div>
        )}
        
        {/* Hình ảnh sản phẩm */}
        <Link href={`/san-pham/${product.slug}`}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className={styles.productImage} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/products/placeholder.jpg";
            }}
          />
        </Link>
        
        {/* Các nút hành động nhanh khi hover */}
        <div className={styles.quickActions}>
          <button className={styles.quickActionBtn} title="Thêm vào giỏ hàng">
            <i className="fas fa-shopping-cart"></i>
          </button>
          <button className={styles.quickActionBtn} title="Yêu thích">
            <i className="fas fa-heart"></i>
          </button>
          <button className={styles.quickActionBtn} title="Xem nhanh">
            <i className="fas fa-eye"></i>
          </button>
        </div>
      </div>

      <div className={styles.productInfo}>
        {/* Tên sản phẩm */}
        <h3 className={styles.productName}>
          <Link href={`/san-pham/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        
        {/* Đánh giá sản phẩm */}
        <div className={styles.productRating}>
          <div className={styles.ratingStars}>
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              return (
                <span key={i} className={
                  starValue <= product.rating
                    ? styles.starFilled
                    : starValue <= product.rating + 0.5 && product.rating % 1 !== 0
                    ? styles.starHalf
                    : styles.starEmpty
                }>
                  <i className={
                    starValue <= product.rating
                      ? "fas fa-star"
                      : starValue <= product.rating + 0.5 && product.rating % 1 !== 0
                      ? "fas fa-star-half-alt"
                      : "far fa-star"
                  }></i>
                </span>
              );
            })}
          </div>
          <span className={styles.reviewCount}>({product.reviewCount} đánh giá)</span>
        </div>

        {/* Giá sản phẩm */}
        <div className={styles.productPrice}>
          {product.originalPrice ? (
            <>
              <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
              <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
            </>
          ) : (
            <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Nút mua hàng */}
        <div className={styles.productActions}>
          <button className={styles.addToCartButton}>
            <i className="fas fa-shopping-cart"></i> Thêm vào giỏ
          </button>
          <Link href={`/san-pham/${product.slug}`} className={styles.buyNowButton}>
            <i className="fas fa-bolt"></i> Mua ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 