  import { useEffect, useState } from "react";
import "./Carousel.css";
import tomato from "./cropsImages/tomato.svg";
import potato from "./cropsImages/potato.svg";
import bellPepper from "./cropsImages/bellPepper.svg";
import paddy from "./cropsImages/paddy.svg";
import cotton from "./cropsImages/cotton.png";
import leftArrow from "./images/left.svg";
import rightArrow from "./images/right.svg";

export default function Carousel() {
  const images = [
    { id: 1, src: tomato },
    { id: 2, src: potato },
    { id: 3, src: bellPepper },
    { id: 4, src: paddy },
    { id: 5, src: cotton },
  ];
  const[ScreenSize,setScreenSize]=useState(window.innerWidth);
  useEffect(()=>{
    const handleScreen=()=>{setScreenSize(window.innerWidth)};
    window.addEventListener("resize",handleScreen);
    return ()=>{
      window.removeEventListener("resize",handleScreen);
    }
  },[ScreenSize]);
  const [startIndex, setStartIndex] = useState(0);
  const imagesToShow = ScreenSize<=950?3:4;

  const handleNext = () => {
    if (startIndex + imagesToShow < images.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="cropsForDiagnose">
      <div className="context">Crops Available for Diagnosis:</div>
      <div className="carouselContainer">
        <button
          className="l arrow"
          onClick={handlePrevious}
          disabled={startIndex === 0}
        >
          <img src={leftArrow} width={30} alt="Left Arrow" />
        </button>
        <div className="carouselWrapper">
          <div
            className="images"
            style={ScreenSize<=390?{transform:`translateX(-${startIndex * 70}px)`}:{transform: `translateX(-${startIndex * 90}px)` }}
          >
            {images.map(({ id, src }, index) => { 
              return (
                <img
                  key={id}
                  className="crops"
                  draggable={false}
                  src={src}
                  alt={`Slide ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
        <button
          className="r arrow"
          onClick={handleNext}
          disabled={startIndex + imagesToShow >= images.length}
        >
          <img src={rightArrow} width={30} alt="Right Arrow" />
        </button>
      </div>
    </div>
  );
}
