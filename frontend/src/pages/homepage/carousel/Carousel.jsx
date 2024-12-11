import tomato from "./cropsImages/tomato.svg";
import potato from "./cropsImages/potato.svg";
import bellPepper from "./cropsImages/bellpepper.svg";
import apple from "./cropsImages/apple.svg";
import blueberry from "./cropsImages/blueberry.svg";
import cherry from "./cropsImages/cherry.svg";
import corn from "./cropsImages/corn.svg";
import grapes from "./cropsImages/grapes.svg";
import orange from "./cropsImages/orange.svg";
import peach from "./cropsImages/peach.svg";
import rasberry from "./cropsImages/raspberry.svg";
import strawberry from "./cropsImages/strawberry.svg";
import "./Carousel.css";

export default function Carousel() {
  const images = [
    { id: 1, src: tomato, name: "Tomato" },
    { id: 2, src: potato, name: "Potato" },
    { id: 3, src: bellPepper, name: "Bell Pepper" },
    { id: 4, src: apple, name: "Apple" },
    { id: 5, src: blueberry, name: "Blueberry" },
    { id: 6, src: cherry, name: "Cherry" },
    { id: 7, src: corn, name: "Corn" },
    { id: 8, src: grapes, name: "Grapes" },
    { id: 9, src: orange, name: "Orange" },
    { id: 10, src: peach, name: "Peach" },
    { id: 11, src: rasberry, name: "Raspberry" },
    { id: 12, src: strawberry, name: "Strawberry" },
  ];

  return (
    <div className="cropsForDiagnoseContainer">
      <div className="context" style={{ color: "rgb(22, 152, 5)" }}>
        Crops Available for Diagnosis
      </div>
      <div className="carouselWrapper">
        {images.map(({ id, src, name }, index) => (
          <span
            key={id}
            className="crops"
            style={{ "--n": index + 1 }}
            alt={`Slide ${index + 1}`}
          >
            <img src={src} draggable={false} />
            <p>{name}</p>
          </span>
        ))}
      </div>
    </div>
  );
}
