import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Slide {
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  accent: string;
}

const slides: Slide[] = [
  {
    tag: "New Collection",
    title: "Women's Ethnic Wear",
    subtitle: "Premium Kurtis & Anarkalis crafted from handpicked fabrics",
    cta: "Shop Women's",
    image: "/images/kurti-maroon.jpg",
    accent: "#c9a24b",
  },
  {
    tag: "Trending Now",
    title: "Men's Kurta Collection",
    subtitle: "Classic cuts. Premium cotton. Made for every occasion.",
    cta: "Shop Men's",
    image: "/images/kurti-blue.jpg",
    accent: "#3a5a8c",
  },
  {
    tag: "Festive Season",
    title: "Party Wear Specials",
    subtitle: "Designer pieces for weddings, festivities and celebrations",
    cta: "View Collection",
    image: "/images/kurti-peach.jpg",
    accent: "#c9a24b",
  },
];

const HeroBanner: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  };

  const slide = slides[current];

  return (
    <div className="hero-v2">
      {/* Background layers */}
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`hero-v2-bg ${idx === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${s.image})` }}
        />
      ))}
      <div className="hero-v2-overlay" />

      {/* Content */}
      <div className={`hero-v2-content ${animating ? "fade-out" : "fade-in"}`}>
        <span className="hero-v2-tag" style={{ background: slide.accent }}>{slide.tag}</span>
        <h1 className="hero-v2-title">{slide.title}</h1>
        <p className="hero-v2-sub">{slide.subtitle}</p>
        <div className="hero-v2-actions">
          <button className="hero-v2-cta" onClick={() => onNavigate("category")}>
            {slide.cta}
          </button>
          <button className="hero-v2-cta-ghost" onClick={() => onNavigate("category")}>
            View All
          </button>
        </div>
      </div>

      {/* Arrows */}
      <button className="hero-v2-arrow left" onClick={() => goTo((current - 1 + slides.length) % slides.length)}>
        <FiChevronLeft />
      </button>
      <button className="hero-v2-arrow right" onClick={() => goTo((current + 1) % slides.length)}>
        <FiChevronRight />
      </button>

      {/* Dots */}
      <div className="hero-v2-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`hero-v2-dot ${idx === current ? "active" : ""}`}
            onClick={() => goTo(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;