import GanttOverview from "./modules/GanttOverview";
import "./index.css";
import GanttTime from "./modules/GanttTime";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { GanttProps, GanttPropsRefProps } from "./types";

const Gantt = forwardRef(
  (
    {
      data,
      head,
      showLine = true,
      headWidth = "400px",
      height = "auto",
      headBodyPaddingY = 10,
      headBodyPaddingX = 0,
      open = true,
    }: GanttProps,
    ref: React.ForwardedRef<GanttPropsRefProps>
  ) => {
    const [openStatus, setOpenStatus] = useState(open);
    const [isInit, setInit] = useState(false);
    const [scrollBarHeight, setScrollBarHeight] = useState(0);
    useImperativeHandle(ref, () => ({
      initGantt,
    }));
    const initGantt = () => {
      setInit(!isInit);
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
          onChange={(e) => {
            setOpenStatus(e);
          }}
        />
        <GanttTime
          showLine={showLine}
          isInit={isInit}
          openStatus={openStatus}
          list={data}
          headBodyPaddingY={headBodyPaddingY}
          onChangeScrollBarHeight={setScrollBarHeight}
        />
      </div>
    );
  }
);
export default Gantt;
