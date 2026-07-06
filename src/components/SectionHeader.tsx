import React from "react";
import { FiArrowRight } from "react-icons/fi";

interface SectionHeaderProps {
  title: string;
  onViewAll: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onViewAll }) => {
  return (
    <div className="section-header-row">
      <h2 className="section-title">{title}</h2>
      <span className="view-all-link" onClick={onViewAll}>
        View All <FiArrowRight />
      </span>
    </div>
  );
};

export default SectionHeader;