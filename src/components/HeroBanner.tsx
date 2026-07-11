import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Slide {
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  buttonText: string;
}

const slides: Slide[] = [
  {
    title: "Women's Ethnic Collection",
    subtitle: "Handcrafted kurtis and anarkalis starting from",
    tag: "FROM ₹399",
    image: "/images/kurti-maroon.jpg",
    buttonText: "Shop Women's",
  },
  {
    title: "Men's Kurta Collection",
    subtitle: "Premium cotton kurtas and Nehru jackets",
    tag: "UPTO 40% OFF",
    image: "/images/kurti-blue.jpg",
    buttonText: "Shop Men's",
  },
  {
    title: "Festive Season Special",
    subtitle: "Designer picks for weddings and celebrations",
    tag: "EXCLUSIVE DESIGNS",
    image: "/images/kurti-peach.jpg",
    buttonText: "View Collection",
  },
];

const HeroBanner: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="hero-banner">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`hero-slide ${idx === current ? "active" : ""}`}
          style={{ backgroundImage: slide.image ? `url(${slide.image})` : undefined }}
        >
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-tag-pill">{slide.tag}</span>
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <button onClick={() => onNavigate("category")}>{slide.buttonText}</button>
          </div>
        </div>
      ))}

      <button className="hero-arrow left" onClick={prevSlide}><FiChevronLeft /></button>
      <button className="hero-arrow right" onClick={nextSlide}><FiChevronRight /></button>

      <div className="hero-dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`hero-dot ${idx === current ? "active" : ""}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;