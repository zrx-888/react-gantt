import { memo } from "react";
import { BodyRectProps, YearListIF } from "../types";

const Mark: React.FC<{
  days: YearListIF[];
  width: number;
  bodyRect: BodyRectProps;
}> = memo(({ days, width, bodyRect }) => {
  return (
    <div className="gantt-right-body-content-mark">
      {days.map((item, index) => {
        return (
          <div
            style={{
              width: width * item.length + "px",
              minWidth: width * item.length + "px",
              height: bodyRect.scrollHeight
                ? bodyRect.scrollHeight + "px"
                : "100%",
            }}
            className="gantt-right-body-content-mark-item"
            key={index}
          ></div>
        );
      })}
    </div>
  );
});
export default Mark;
