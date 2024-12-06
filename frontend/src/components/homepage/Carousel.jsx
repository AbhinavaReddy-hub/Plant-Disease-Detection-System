  import { useEffect, useState } from "react";
import tomato from "../../images/cropsImages/tomato.svg";
import potato from "../../images/cropsImages/potato.svg";
import bellPepper from "../../images/cropsImages/bellpepper.svg";
import paddy from "../../images/cropsImages/paddy.svg";
import cotton from "../../images/cropsImages/cotton.png";
import leftArrow from "../../images/homepage/carousel/leftArrow.svg";
import rightArrow from "../../images/homepage/carousel/rightArrow.svg";
import "../../styles/carousel.css";
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
    <div className="cropsForDiagnoseContainer">
      <div className="context">Crops Available for Diagnosis:</div>
      <div className="carouselContainer">
        <button
        draggable="false"
          className="l arrow"
          onClick={handlePrevious}
          disabled={startIndex === 0}
        >
          <img draggable="false" src={leftArrow} width={30} alt="Left Arrow" />
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
        draggable="false"
          className="r arrow"
          onClick={handleNext}
          disabled={startIndex + imagesToShow >= images.length}
        >
          <img draggable="false" src={rightArrow} width={30} alt="Right Arrow" />
        </button>
      </div>
    </div>
  );
}
