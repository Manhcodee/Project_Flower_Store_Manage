import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../../styles/Layout.module.css';

const Layout = ({ children, title = 'Flower Shop - Cửa hàng hoa tươi', description = 'Cửa hàng hoa tươi trực tuyến với nhiều mẫu hoa đẹp, giao hàng nhanh chóng.' }) => {
  return (
    <div className={styles.layout}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      </Head>

      <Header />
      <Navbar />
      
      <main className={styles.main}>
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout; 