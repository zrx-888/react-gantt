import { memo, useState } from "react";
import { GanttStatusListProps, IListIF } from "../types";
import HelpLine from "./HelpLine";

const Parent: React.FC<{
  item: IListIF;
  index: number;
  showLine: boolean;
  statusList: GanttStatusListProps[];
  onClickText: (e: IListIF) => void;
}> = memo(({ item, index, showLine, statusList, onClickText }) => {
  const [parentItem] = useState(item);
  const [ganttProgressBarId, setGanttProgressBarId] = useState("");

  const handleMouseEnter = (id: string) => {
    setGanttProgressBarId(id);
  };

  const handleMouseLeave = () => {
    setGanttProgressBarId("");
  };

  return (
    <div
      key={index}
      className="gantt-right-body-cell gantt-right-body-cell-isParent-true"
    >
      <div
        id={"gantt-progressBar-Id" + index}
        onMouseEnter={() => handleMouseEnter("gantt-progressBar-Id" + index)}
        onMouseLeave={handleMouseLeave}
        className={`progressBar progressBar-${parentItem.status}`}
        style={{
          left: parentItem.left + "px",
        }}
      >
        <div className="progressBar-box">
          <div className="progressBar-render">
            {parentItem.renderoBar &&
              parentItem.renderoBar(
                parentItem.width,
                parentItem.width * parentItem.progress,
                parentItem.width - parentItem.width * parentItem.progress,
                parentItem.overtimeWidth
              )}
          </div>
          <div
            className="progressBar-default"
            style={{
              width: parentItem.width + "px",
            }}
          >
            <div
              className="progressBar-active"
              style={{
                width: parentItem.progress * 100 + "%",
              }}
            ></div>
          </div>
          {(parentItem.status === "overtime" ||
            parentItem.status === "finishOvertime") &&
            parentItem.overtimeWidth && (
              <div
                className="progressBar-overTimeWidth"
                style={{
                  width: parentItem.overtimeWidth + "px",
                }}
              >
                <div className="overtimeRender"></div>
              </div>
            )}
        </div>
        <div className="progress-text" onClick={() => onClickText(item)}>
          {statusList.filter((e) => parentItem.status === e.status)[0].text}
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
});
export default Parent;
