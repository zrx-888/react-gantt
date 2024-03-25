import { memo, useEffect, useState } from "react";
import { IListIF } from "../types";

const HelpLine: React.FC<{
  item: IListIF;
  ganttProgressBarId: string;
}> = memo(({ item, ganttProgressBarId }) => {
  const [rect, setRect] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    height: 0,
  });
  useEffect(() => {
    const elements = document.getElementsByClassName("progressBar");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.id != ganttProgressBarId) {
        element.classList.add("gantt-animation");
      }
    }
    return () => {
      const elements = document.getElementsByClassName("progressBar");
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.classList.remove("gantt-animation");
      }
    };
  }, [ganttProgressBarId]);
  useEffect(() => {
    const rightBodyDom = document.getElementById("gantt-right-body-content");
    const ganttProgressBarDom = document.getElementById(
      item.ganttProgressBarId
    );
    if (rightBodyDom && ganttProgressBarDom) {
      const top =
        rightBodyDom.getBoundingClientRect().top -
        ganttProgressBarDom.getBoundingClientRect().top;

      setRect({
        ...rect,
        top: top - 1,
        height: rightBodyDom.clientHeight || 0,
      });
    }
  }, [item]);
  // useEffect(() => {
  //   const ganttProgressBarDom = document.getElementById(
  //     item.ganttProgressBarId
  //   );
  //   const elements = document.getElementsByClassName("progressBar");
  //   const parentHeight =
  //     document.getElementById("gantt-right-body")?.clientHeight;

  //   if (ganttProgressBarDom && parentHeight) {
  //     const { left, top, bottom } = ganttProgressBarDom.getBoundingClientRect();
  //     console.log(left);

  //     setRect({ ...rect, left, top, bottom, height: parentHeight });
  //     for (let i = 0; i < elements.length; i++) {
  //       const element = elements[i];
  //       if (element.id != ganttProgressBarDom.id) {
  //         element.classList.add("gantt-animation");
  //       }
  //     }
  //   }
  //   return () => {
  //     for (let i = 0; i < elements.length; i++) {
  //       const element = elements[i];
  //       element.classList.remove("gantt-animation");
  //     }
  //   };
  // }, [item]);
  return (
    <>
      {/* 开始时间 */}
      <div
        className={`helpLine-line helpLine-line-${item.status}`}
        style={{
          // left: rect.left + 5 + "px",
          top: rect.top + "px",
          left: item.left + 5 + "px",
          height: rect.height + "px",
        }}
      ></div>

      {/* 结束时间 */}
      <div
        className={`helpLine-line helpLine-line-${item.status}`}
        style={{
          left: item.left + 5 + item.width + "px",
          top: rect.top + "px",
          height: rect.height + "px",
        }}
      ></div>

      {/* 超时红线 */}
      {(item.status === "finishOvertime" || item.status === "overtime") &&
        item.overtimeWidth && (
          <div
            className={`helpLine-line helpLine-line-${item.status}`}
            style={{
              top: rect.top + "px",
              borderColor: "#f54040",
              left:
                item.left +
                rect.left +
                5 +
                item.width +
                item.overtimeWidth +
                "px",
              height: rect.height + "px",
            }}
          ></div>
        )}
    </>
  );
});
export default HelpLine;
