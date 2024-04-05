import GanttOverview from "./modules/GanttOverview";
import "./index.css";
import GanttTime from "./modules/GanttTime";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { GanttProps, GanttPropsRefProps, GanttType } from "./types";

const Gantt = forwardRef(
  (
    {
      data,
      head,
      showLine = true,
      headWidth = "400px",
      height = "auto",
      ganttType = "day",
      headBodyPaddingY = 10,
      headBodyPaddingX = 0,
      open = true,
      onClickText,
    }: GanttProps,
    ref: React.ForwardedRef<GanttPropsRefProps>
  ) => {
    const [refresh, setRefresh] = useState(false);
    const [myGanttType, setMyGanttType] = useState(ganttType);
    const [scrollBarHeight, setScrollBarHeight] = useState(0);
    useImperativeHandle(ref, () => ({
      initGantt,
      setGanttType,
    }));
    const initGantt = () => {
      setRefresh(!refresh);
    };
    const setGanttType = (type: GanttType) => {
      setMyGanttType(type);
    };
    return (
      <div
        className="gantt"
        style={{
          height: height,
        }}
      >
        <GanttOverview
          head={head}
          list={data}
          open={open}
          headBodyPaddingY={headBodyPaddingY}
          headBodyPaddingX={headBodyPaddingX}
          headWidth={headWidth}
          scrollBarHeight={scrollBarHeight}
          onChange={initGantt}
        />
        <GanttTime
          showLine={showLine}
          refresh={refresh}
          ganttType={myGanttType}
          list={data}
          headBodyPaddingY={headBodyPaddingY}
          onChangeScrollBarHeight={setScrollBarHeight}
          onClickText={(e) => onClickText && onClickText(e)}
        />
      </div>
    );
  }
);
export default Gantt;
