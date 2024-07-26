import React, { useEffect, useState } from "react";
import Button from "../Button";

const RegulationBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  const [bannerStyle, setBannerStyle] = useState({
    opacity: 0,
    transform: "translateY(100%)",
    transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
  });

  useEffect(() => {
    const riskAccepted = localStorage.getItem("riskAccepted");
    const visible = riskAccepted !== "true";
    setIsVisible(visible);

    if (visible) {
      setTimeout(() => {
        setBannerStyle({
          opacity: 1,
          transform: "translateY(0)",
          transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
        });
      }, 10);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("riskAccepted", "true");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.removeItem("riskAccepted");
    setIsVisible(false);
  };

  return (
    isVisible ? (
      <div className="banner" style={bannerStyle}>
        <p className="bannerTitle">Attention - Important Notice</p>
        <p className="bannerText">
          {/* Aimagine banner content here */}
        </p>
        <div className="buttons">
          <Button
            white
            onClick={handleAccept}
            className="ml-0 md:ml-0 w-full md:w-auto"
          >
            Accept
          </Button>
          <Button
            secondaryBtn
            onClick={handleReject}
            className="ml-5 md:ml-5 w-full md:w-auto"
          >
            Reject
          </Button>
        </div>
      </div>
    ) : null
  );
};

export default RegulationBanner;
