import { useState } from "react";
import { GanttDataProps, GanttHeadProps } from "../types";
import "./GanttOverview.css";
import Arrow from "./Arrow";

const GanttOverview: React.FC<{
  head: GanttHeadProps[];
  list: GanttDataProps[];
  headWidth: string;
  headBodyPaddingY: number;
  headBodyPaddingX: number;
  scrollBarHeight: number;
  open: boolean;
  onChange: (e: boolean) => void;
}> = ({
  head,
  list,
  headWidth,
  headBodyPaddingY,
  headBodyPaddingX,
  open,
  scrollBarHeight,
  onChange,
}) => {
  const [openStatus, setOpenStatus] = useState(open);

  return (
    <div className="ganttOverview-box">
      {/* 展开收起按钮 */}
      {open && (
        <div
          className="ganttOverview-arrrow-box"
          onClick={() => {
            setOpenStatus(!openStatus);
            onChange(!openStatus);
          }}
        >
          <div className="ganttOverview-arrrow">
            <Arrow isOpen={!openStatus} color="#696B6C" />
          </div>
        </div>
      )}
      <div
        style={{
          width: headWidth,
        }}
        className={openStatus ? "ganttOverview" : "ganttOverview-close"}
      >
        <div
          style={{
            width: headWidth,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div className="ganttOverview-head">
            {head.map((item, index) => {
              return (
                <div
                  key={index}
                  className="ganttOverview-head-item"
                  style={{
                    textAlign: item.align ? item.align : "center",
                    width: item.width ? item.width : "auto",
                    maxWidth: item.width ? item.width : "auto",
                    minWidth: item.width ? item.width : "auto",
                  }}
                >
                  {item.renderTableHead ? item.renderTableHead() : item.title}
                </div>
              );
            })}
          </div>
          <div className="ganttOverview-body">
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div
                className="ganttOverview-body-height"
                style={{
                  paddingLeft: headBodyPaddingX + "px",
                  paddingRight: headBodyPaddingX + "px",
                  paddingTop: headBodyPaddingY + "px",
                  paddingBottom: headBodyPaddingY + "px",
                }}
              >
                {list.map((item, index) => {
                  return (
                    <div key={index} className="ganttOverview-body-cell">
                      <div
                        key={index}
                        className="ganttOverview-body-cell-filed"
                      >
                        {item.renderHead ? (
                          <div className="ganttOverview-body-cell-item">
                            {item.renderHead()}
                          </div>
                        ) : (
                          head.map((i, n) => {
                            return (
                              <div
                                key={n}
                                style={{
                                  textAlign: i.align ? i.align : "center",
                                  width: i.width ? i.width : "auto",
                                  maxWidth: i.width ? i.width : "auto",
                                  minWidth: i.width ? i.width : "auto",
                                }}
                                className="ganttOverview-body-cell-item"
                              >
                                {i.key ? item[i.key] : ""}
                              </div>
                            );
                          })
                        )}
                      </div>
                      {item.children && (
                        <div className="ganttOverview-body-cell-open">
                          {item.children.map((i, n) => (
                            <div
                              key={n}
                              className="ganttOverview-body-cell-open-cell"
                            >
                              {i.renderHeadChild ? (
                                <div className="ganttOverview-body-cell-open-cell-item-first ganttOverview-body-cell-open-cell-item">
                                  <div className="quan"></div>
                                  <div className="">{i.renderHeadChild()}</div>
                                </div>
                              ) : (
                                head.map((headItem, headIndex) => {
                                  return headIndex === 0 ? (
                                    <div
                                      key={headIndex}
                                      className="ganttOverview-body-cell-open-cell-item  ganttOverview-body-cell-open-cell-item-first"
                                    >
                                      <div className="quan"></div>
                                      <div
                                        style={{
                                          width: headItem.width
                                            ? headItem.width
                                            : "auto",
                                          maxWidth: headItem.width
                                            ? headItem.width
                                            : "auto",
                                          minWidth: headItem.width
                                            ? headItem.width
                                            : "auto",
                                        }}
                                      >
                                        {headItem.key ? i[headItem.key] : ""}
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      key={headIndex}
                                      style={{
                                        width: headItem.width
                                          ? headItem.width
                                          : "auto",
                                        maxWidth: headItem.width
                                          ? headItem.width
                                          : "auto",
                                        minWidth: headItem.width
                                          ? headItem.width
                                          : "auto",
                                      }}
                                      className="ganttOverview-body-cell-open-cell-item"
                                    >
                                      <div>
                                        {headItem.key ? i[headItem.key] : ""}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ height: scrollBarHeight + "px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GanttOverview;
