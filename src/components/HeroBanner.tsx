import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Slide {
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
}

const slides: Slide[] = [
  { title: "Elegant Kurti Collection", subtitle: "STARTING FROM ₹399", image: "", buttonText: "Shop Now" },
  { title: "New Arrivals This Week", subtitle: "UPTO 50% OFF", image: "", buttonText: "Explore" },
  { title: "Party Wear Special", subtitle: "DESIGNER PICKS", image: "", buttonText: "View Collection" },
];

const HeroBanner: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
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