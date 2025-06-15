import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="w-full border-t border-border bg-background text-muted px-6 py-6 mt-20">
    <div className="container flex flex-col md:flex-row gap-2 md:justify-between items-center text-sm">
      <span>© {new Date().getFullYear()} AutoMart</span>
      <span>
        Crafted for modern auto retail.{' '}
        <a href="/" className="underline text-accent hover:text-accent/80">
          Home
        </a>
      </span>
    </div>
  </footer>
);

export default Footer;
