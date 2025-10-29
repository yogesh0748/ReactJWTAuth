import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import face1 from "../assets/face1.png";
import face2 from "../assets/face2.jpeg";
import face3 from "../assets/face3.jpeg";
import face4 from "../assets/face4.jpeg";
import face5 from "../assets/face5.png";
import face6 from "../assets/face6.png";

export default function RealisticCube() {
  const faces = [face1, face2, face3, face4, face5, face6];
  const [size, setSize] = useState(280); // default desktop size

  // compute responsive cube size
  const computeSize = () => {
    const w = window.innerWidth;
    if (w < 420) {
      // small phones: use ~60% of screen, limit to 160
      return Math.min(160, Math.floor(w * 0.62));
    }
    if (w < 768) {
      // tablets / small screens: use ~50% of screen, limit to 220
      return Math.min(220, Math.floor(w * 0.5));
    }
    if (w < 1200) {
      // medium screens: use ~35% of screen, limit to 260
      return Math.min(260, Math.floor(w * 0.35));
    }
    // large screens: fixed max size
    return 300;
  };

  useEffect(() => {
    // set initial size
    const handleResize = () => setSize(computeSize());
    handleResize();

    // update on resize with small debounce
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(handleResize, 80);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const halfSize = size / 2;

  const rotations = [
    `rotateY(0deg) translateZ(${halfSize}px)`,
    `rotateY(90deg) translateZ(${halfSize}px)`,
    `rotateY(180deg) translateZ(${halfSize}px)`,
    `rotateY(-90deg) translateZ(${halfSize}px)`,
    `rotateX(90deg) translateZ(${halfSize}px)`,
    `rotateX(-90deg) translateZ(${halfSize}px)`,
  ];

  return (
    <div className="flex items-center justify-center perspective-1000 w-full">
      <motion.div
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: [0, 360],
          rotateX: [0, 360],
          x: [0, 8, -8, 0],
          y: [0, -8, 8, 0],
        }}
        transition={{
          rotateY: { repeat: Infinity, duration: 12, ease: "linear" },
          rotateX: { repeat: Infinity, duration: 15, ease: "linear" },
          x: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
        }}
      >
        {faces.map((face, index) => (
          <div
            key={index}
            className="absolute rounded-lg overflow-hidden"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: rotations[index],
              backfaceVisibility: "hidden",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4), 0 0 25px rgba(0,0,0,0.25)",
            }}
          >
            <img
              src={face}
              alt={`face-${index}`}
              className="w-full h-full object-cover"
              style={{ filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.4))" }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
