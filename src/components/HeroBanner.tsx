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
    image: "/images/men-kurta.jpg",
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

  return (
    <div className="hero-banner">
      {/* Background layers */}
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`hero-slide ${idx === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${s.image})` }}
        >
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-tag-pill" style={{ background: s.accent }}>{s.tag}</span>
            <h1>{s.title}</h1>
            <p>{s.subtitle}</p>
            <div className="hero-actions">
              <button onClick={() => onNavigate("category")}>{s.cta}</button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button className="hero-arrow left" onClick={() => goTo((current - 1 + slides.length) % slides.length)}>
        <FiChevronLeft />
      </button>
      <button className="hero-arrow right" onClick={() => goTo((current + 1) % slides.length)}>
        <FiChevronRight />
      </button>

      {/* Navigation Dots */}
      <div className="hero-dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`hero-dot ${idx === current ? "active" : ""}`}
            onClick={() => goTo(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;