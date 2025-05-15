import React from "react";
import "./CardComponent.css";

// Import icons directly
// import customsIcon from "../../assets/img/icons/common/customs-icon.svg";

const CardComponent = ({ heading, subheading, iconPath, arrowIconPath }) => {
  return (
    <div className="card-container">
      <img src={iconPath} alt="Card Icon" className="card-icon" />
      <div className="card-content">
        <h1 className="card-heading">{heading}</h1>
        <p className="card-subheading">{subheading}</p>
      </div>
      <img src={arrowIconPath} alt="Arrow Icon" className="arrow-icon" />
    </div>
  );
};

export default CardComponent;
