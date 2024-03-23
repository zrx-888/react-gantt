import { useEffect, useRef } from "react";
import "./index.css";

interface Props {
  isOpen?: boolean;
  color?: string;
}

const Arrow: React.FC<Props> = ({ isOpen, color = "#000000" }) => {
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (arrowRef.current && color) {
      arrowRef.current.style.setProperty("--bg-color", color);
    }
  }, [arrowRef, color]);

  return (
    <div ref={arrowRef} className={"w-[20px] h-[20px] inline-block relative main-arrow" + (isOpen ? " arrow_open" : "")}></div>
  );
};

export default Arrow;
