import { useEffect, useState } from "react";
import tomato from "../../images/cropsImages/tomato.svg";
import potato from "../../images/cropsImages/potato.svg";
import bellPepper from "../../images/cropsImages/bellpepper.svg";
import paddy from "../../images/cropsImages/paddy.svg";
import cotton from "../../images/cropsImages/cotton.png";
import apple from "../../images/cropsImages/apple.svg";
import blueberry from "../../images/cropsImages/blueberry.svg";
import cherry from "../../images/cropsImages/cherry.svg";
import corn from "../../images/cropsImages/corn.svg";
import grapes from "../../images/cropsImages/grapes.svg";
import orange from "../../images/cropsImages/orange.svg";
import peach from "../../images/cropsImages/peach.svg";
import rasberry from "../../images/cropsImages/raspberry.svg";
import strawberry from "../../images/cropsImages/strawberry.svg";
import "../../styles/carousel.css";

export default function Carousel() {
  const images = [
    { id: 1, src: tomato },
    { id: 2, src: potato },
    { id: 3, src: bellPepper },
    { id: 4, src: paddy },
    { id: 5, src: cotton },
    { id: 6, src: apple },
    { id: 7, src: blueberry },
    { id: 8, src: cherry },
    { id: 9, src: corn },
    { id: 10, src: grapes },
    { id: 11, src: orange },
    { id: 12, src: peach },
    { id: 13, src: rasberry },
    { id: 14, src: strawberry },
  ];
  const [ScreenSize, setScreenSize] = useState(window.innerWidth);
  useEffect(() => {
    const handleScreen = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener("resize", handleScreen);
    return () => {
      window.removeEventListener("resize", handleScreen);
    };
  }, [ScreenSize]);

  return (
    <div className="cropsForDiagnoseContainer">
      <div className="context" style={{ color: "rgb(22, 152, 5)" }}>
        Crops Available for Diagnosis
      </div>
      <div className="carouselWrapper">
        {images.map(({ id, src }, index) => {
          return (
            <img
              key={id}
              data-tooltip="Tooltip text here"
              className="crops tooltip"
              style={{ "--n": index + 1 }}
              draggable={false}
              src={src}
              alt={`Slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
