import React from 'react';
import Footer from '../Footer';
import Header from '../Header';
import './style.css';

const Layout = ({ children }: any) => {
    return (
        <React.Fragment>
            {/* Header */}
            <Header />
            <main className="layout">{children}</main>
            {/* Footer */}
            <Footer />
        </React.Fragment>
    );
};

export default Layout;
