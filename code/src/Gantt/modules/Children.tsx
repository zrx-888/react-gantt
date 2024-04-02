import { memo } from "react";
import { IListIF } from "../types";
import HelpLine from "./HelpLine";

const Children: React.FC<{
  item: IListIF;
  index: number;
  showLine: boolean;
  ganttProgressBarId: string;
  onMouseEnter: (e: string) => void;
  handleMouseLeave: () => void;
}> = memo(
  ({
    item,
    index,
    showLine,
    ganttProgressBarId,
    onMouseEnter,
    handleMouseLeave,
  }) => {
    return (
      <div
        key={index}
        className="gantt-right-body-cell gantt-right-body-cell-isParent-false"
      >
        <div
          id={"gantt-progressBar-Id" + index}
          onMouseEnter={() => onMouseEnter("gantt-progressBar-Id" + index)}
          onMouseLeave={handleMouseLeave}
          className={`progressBar progressBar-${item.status}`}
          style={{
            padding: "5px",
            border: "0",
            background: "transparent",
            left: item.left + "px",
          }}
        >
          <div className="progressBar-box">
            <div className="progressBar-render progressBar-render-child">
              {item.renderoBar &&
                item.renderoBar(
                  item.width,
                  item.width * item.progress,
                  item.width - item.width * item.progress,
                  item.overtimeWidth
                )}
            </div>
            <div
              className="progressBar-default progressBar-default-child"
              style={{ width: item.width + "px" }}
            >
              <div
                className="progressBar-active progressBar-active-child"
                style={{
                  width: item.progress * 100 + "%",
                }}
              ></div>
            </div>
            {(item.status === "overtime" || item.status === "finishOvertime") &&
              item.overtimeWidth && (
                <div
                  className="progressBar-overTimeWidth progressBar-overTimeWidth-child"
                  style={{
                    width: item.overtimeWidth + "px",
                  }}
                >
                  <div className="overtimeRender"></div>
                </div>
              )}
          </div>
        </div>
        {showLine && ganttProgressBarId === `gantt-progressBar-Id${index}` && (
          <HelpLine
            ganttProgressBarId={ganttProgressBarId}
            item={{
              ...item,
              ganttProgressBarId: "gantt-progressBar-Id" + index,
            }}
          />
        )}
      </div>
    );
  }
);
export default Children;
