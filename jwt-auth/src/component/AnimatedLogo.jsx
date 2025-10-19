import { motion } from "framer-motion";
import busLogo from "../assets/download.png";

export default function AnimatedLogo({ className }) {
    return (
        <div className={`flex items-center overflow-hidden ${className}`}>
            {/* Bus icon animation */}
            <motion.img
                src={busLogo}
                alt="GoGoBus logo"
                className="w-10 h-auto" // smaller for navbar
                initial={{ x: 0 }}
                animate={{ x: -5 }} // small slide
                transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Text animation */}
            <motion.span
                className="text-[#00C4B4] text-xl font-bold tracking-wide ml-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
                GoGoBus
            </motion.span>
        </div>
    );
}
