import { motion } from "framer-motion";
import face1 from "../assets/face1.png";
import face2 from "../assets/face2.jpeg";
import face3 from "../assets/face3.jpeg";
import face4 from "../assets/face4.jpeg";
import face5 from "../assets/face5.png";
import face6 from "../assets/face6.png";

export default function RealisticCube() {
  const faces = [face1, face2, face3, face4, face5, face6];
  const cubeSize = 300;
  const halfSize = cubeSize / 2;

  return (
    <div className="flex items-center justify-center perspective-1000">
      <motion.div
        className="relative"
        style={{
          width: `${cubeSize}px`,
          height: `${cubeSize}px`,
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
        {faces.map((face, index) => {
          const rotations = [
            `rotateY(0deg) translateZ(${halfSize}px)`,
            `rotateY(90deg) translateZ(${halfSize}px)`,
            `rotateY(180deg) translateZ(${halfSize}px)`,
            `rotateY(-90deg) translateZ(${halfSize}px)`,
            `rotateX(90deg) translateZ(${halfSize}px)`,
            `rotateX(-90deg) translateZ(${halfSize}px)`,
          ];
          return (
            <div
              key={index}
              className="absolute rounded-lg overflow-hidden"
              style={{
                width: `${cubeSize}px`,
                height: `${cubeSize}px`,
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
          );
        })}
      </motion.div>
    </div>
  );
}
