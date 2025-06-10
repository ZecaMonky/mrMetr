"use client";

import Link from 'next/link';

import CategoryList from './components/categoryList';
import Slider_banners from './components/slider';
import "./globals.css";

function App() {

  return (
    <div className="container mx-auto">
      <Slider_banners />
      <div className="mt-12">
        <CategoryList />
      </div>
    </div>
  );
}

export default App;
