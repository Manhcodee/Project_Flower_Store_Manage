import React from 'react';
import Layout from '../components/layout/Layout';
import HeroBanner from '../components/home/HeroBanner';
import FlowerCategories from '../components/home/FlowerCategories';
import { ProductGrid, featuredProducts, bestSellingProducts } from '../components/products/ProductGrid';
import NewsSection from '../components/home/NewsSection';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <Layout title="Flower Shop - Cửa hàng hoa tươi" description="Cửa hàng hoa tươi trực tuyến với đa dạng mẫu hoa đẹp, giao hàng nhanh chóng toàn quốc.">
      <HeroBanner />
      
      <div className={styles.container}>
        <FlowerCategories />
        
        <ProductGrid 
          title="SẢN PHẨM NỔI BẬT" 
          products={featuredProducts}
          viewAllLink="/san-pham"
        />
        
        <ProductGrid 
          title="SẢN PHẨM BÁN CHẠY" 
          products={bestSellingProducts}
          viewAllLink="/san-pham/ban-chay"
        />
        
        <NewsSection />
      </div>
    </Layout>
  );
}
