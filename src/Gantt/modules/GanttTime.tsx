import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  GanttDataProps,
  GanttStatusListProps,
  IListIF,
  YearListIF,
} from "../types";
import Loading from "./Loading";
import { getDaysList, getYearMonth, getStartEndHours, debounce } from "../help";
import HelpLine from "./HelpLine";

const defaultStatus: GanttStatusListProps[] = [
  {
    status: "finish",
    text: "已完成",
  },
  {
    status: "finishOvertime",
    text: "已完成",
  },
  {
    status: "overtime",
    text: "已超时",
  },
  {
    status: "progress",
    text: "进行中",
  },
  {
    status: "wait",
    text: "待接受",
  },
];

const GanttTime: React.FC<{
  list: GanttDataProps[];
  headBodyPaddingY: number;
  openStatus: boolean;
  isInit: boolean;
  showLine: boolean;
  ganttType: string;
  statusList?: GanttStatusListProps[];
  onChangeScrollBarHeight: (e: number) => void;
}> = ({
  list,
  headBodyPaddingY,
  openStatus,
  isInit,
  showLine,
  ganttType,
  statusList = defaultStatus,
  onChangeScrollBarHeight,
}) => {
  const [showYearList, setSowYearList] = useState<YearListIF[]>([]);
  const [yaerList, setYaerList] = useState<YearListIF[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [data, setData] = useState<IListIF[]>([]);
  const [newList, setNewList] = useState<IListIF[]>([]);
  const [ganttProgressBarId, setGanttProgressBarId] = useState("");
  const bodyContentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [headWidth, setHeadWidth] = useState(0);
  const [bodyRect, setBodyRect] = useState({
    height: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    scrollBarHeight: 0,
  });

  const [maximumDate, setMaximumDate] = useState({
    startDate: "",
    endDate: "",
  });

  // 计算显示位置
  const initData = () => {
    const itemWidthEqually = width / 24;
    const newData = newList.map((e) => {
      const endDate = dayjs(e.startTime);
      const numDays = endDate.diff(maximumDate.startDate, "day");
      const startHours = new Date(e.startTime).getHours();
      let progressHours = getStartEndHours("", e.startTime);
      const endHours = getStartEndHours(e.endTime, e.startTime);
      let overtimeHours = 0;
      if (e.status === "finishOvertime") {
        progressHours = endHours;
        overtimeHours = e.finishTime
          ? getStartEndHours(e.finishTime, e.endTime)
          : 0;
      } else if (e.status === "overtime") {
        progressHours = endHours;
        overtimeHours = getStartEndHours("", e.endTime);
      } else if (e.status === "finish") {
        progressHours = e.finishTime
          ? getStartEndHours(e.finishTime, e.startTime)
          : 0;
      } else if (e.status === "wait") {
        progressHours = endHours;
      } else {
        if (new Date(e.startTime).getTime() > new Date().getTime()) {
          progressHours = 0;
        } else {
          progressHours = getStartEndHours("", e.startTime);
        }
      }
      const progress = progressHours / endHours;
      return {
        ...e,
        startTime: e.startTime,
        endTime: e.endTime,
        finishTime: e.finishTime,
        overtimeWidth: overtimeHours * itemWidthEqually,
        progress: progress,
        status: e.status,
        width: endHours * itemWidthEqually,
        left: numDays * width + startHours * itemWidthEqually - 5,
      };
    });
    setData(newData);
  };

  useEffect(() => {
    initData();
  }, [days]);

  useEffect(() => {
    setHeadWidth(0);
    setTimeout(() => {
      resetSize();
    }, 300);
  }, [maximumDate, openStatus]);

  // 计算顶部最多显示多少个
  const resetSize = () => {
    const headWidth = document.getElementById("gantt-right")?.offsetWidth;
    if (headWidth) {
      const year = getYearMonth(
        maximumDate.startDate,
        maximumDate.endDate,
        ganttType
      );
      setYaerList(year);
      if (ganttType === "day") {
        const day = getDaysList(maximumDate.startDate, maximumDate.endDate);
        const itemWidth = headWidth / day.length;
        setHeadWidth(headWidth);
        setWidth(itemWidth > 40 ? itemWidth : 40);
        setDays(day);
      } else if (ganttType === "month") {
        let allDayNum = 0;
        year.forEach((item) => (allDayNum += item.length));
        const itemWidth = headWidth / allDayNum;
        setHeadWidth(headWidth);
        setWidth(itemWidth > 3 ? itemWidth : 3);

        setDays(year.map((e) => e.year));
        const noRepeatYear: { [key: string]: YearListIF } = {};
        const showYear: YearListIF[] = [];
        year.forEach((item) => {
          const year = Number(item.year.split("-")[0]);
          const month = Number(item.year.split("-")[1]);
          if (noRepeatYear[year]) {
            noRepeatYear[year].length += new Date(year, month, 0).getDate();
          } else {
            noRepeatYear[year] = {
              length: new Date(year, month, 0).getDate(),
              year: item.year.slice(0, 4),
            };
          }
        });
        for (const key in noRepeatYear) {
          showYear.push(noRepeatYear[key]);
        }
        setSowYearList(showYear);
      }
    }
  };

  useEffect(() => {
    setData([]);
    initGantt();
  }, [list, isInit, ganttType]);

  const initGantt = () => {
    const newlist: IListIF[] = [];
    list.forEach((item, index) => {
      if (index > 0) {
        newlist.push({
          ...item,
          isParent: true,
          isEmpty: false,
          parentIsEmpty: true,
          left: 0,
          width: 0,
          progress: 0,
        });
      }
      newlist.push({
        ...item,
        isParent: true,
        isEmpty: false,
        parentIsEmpty: false,
        left: 0,
        width: 0,
        progress: 0,
      });

      item.children &&
        item.children.forEach((i, n) => {
          if (n === 0) {
            newlist.push({
              ...i,
              isParent: false,
              parentIsEmpty: false,
              isEmpty: true,
              left: 0,
              width: 0,
              progress: 0,
            });
          }
          newlist.push({
            ...i,
            parentIsEmpty: false,
            isParent: false,
            isEmpty: false,
            left: 0,
            width: 0,
            progress: 0,
          });
        });
    });
    initList(newlist);
  };

  const handleMouseEnter = (id: string) => {
    setGanttProgressBarId(id);
  };
  // 初始数组的处理
  const initList = (list: IListIF[]) => {
    const listTime = [...list];
    listTime.forEach((item) => {
      if (item.start) {
        const startTime = new Date(item.startTime).getTime();
        const endTime = new Date(item.endTime).getTime();
        const finishTime = item.finishTime
          ? new Date(item.finishTime).getTime()
          : null;
        if (!finishTime) {
          if (new Date().getTime() > endTime) {
            item.status = "overtime";
          } else {
            item.status = "progress";
          }
        } else if (startTime < finishTime && finishTime <= endTime) {
          item.status = "finish";
        } else if (startTime < finishTime && finishTime > endTime) {
          item.status = "finishOvertime";
        }
      } else {
        item.status = "wait";
      }
    });
    const startDate = listTime
      .map((item) => new Date(item.startTime).getTime())
      .sort((e, e2) => e - e2);
    const endDate = listTime
      .map((item) => new Date(item.endTime).getTime())
      .sort((e, e2) => e2 - e);
    // 如果当前开始月份===结束月份 则是当前月份
    if (ganttType === "day") {
      if (
        dayjs(startDate[0]).format("YYYY-MM") ===
        dayjs(endDate[0]).format("YYYY-MM")
      ) {
        // 取两天后的月份
        const nextTwoEndDateMonth = dayjs(endDate[0] + 86400000 * 2).format(
          "YYYY-MM"
        );
        // 取结束时间的月份
        const lastDateMonth = dayjs(endDate[0]).format("YYYY-MM");
        // 当前月份最后一天
        const nowMonthLastDayTime = dayjs(endDate[0] + 86400000 * 2)
          .endOf("month")
          .format("YYYY-MM-DD");
        setMaximumDate({
          startDate: dayjs(startDate[0]).format("YYYY-MM") + "-01",
          // 如果加2天还等于当前月份 则取当前月份最后一天 否则获取下个月份2天后的值
          endDate:
            nextTwoEndDateMonth === lastDateMonth
              ? nowMonthLastDayTime
              : dayjs(endDate[0] + 86400000 * 2).format("YYYY-MM-DD"),
        });
      } else {
        setMaximumDate({
          startDate: dayjs(startDate[0] - 86400000).format("YYYY-MM-DD"),
          endDate: dayjs(endDate[0] + 86400000 * 2).format("YYYY-MM-DD"),
        });
      }
    } else if (ganttType === "month") {
      if (
        dayjs(startDate[0]).format("YYYY") === dayjs(endDate[0]).format("YYYY")
      ) {
        // 取两个月后的年份
        const nextTwoEndDateMonth = dayjs(endDate[0] + 86400000 * 5).format(
          "YYYY-MM-DD"
        );
        // 取结束时间的年份
        const lastDateMonth = dayjs(endDate[0]).format("YYYY-MM-DD");
        // 当前年份最后一个月
        const nowMonthLastDayTime = dayjs(endDate[0] + 86400000 * 5)
          .endOf("month")
          .format("YYYY-MM-DD");

        setMaximumDate({
          startDate: dayjs(startDate[0]).format("YYYY") + "-01-01",
          //  如果加2天还等于当前月份 则取当前月份最后一天 否则获取下个月份2天后的值
          endDate:
            nextTwoEndDateMonth === lastDateMonth
              ? nowMonthLastDayTime
              : dayjs(endDate[0]).format("YYYY-MM-DD"),
        });
      } else {
        setMaximumDate({
          startDate: dayjs(startDate[0] - 86400000).format("YYYY-MM") + "-01",
          // startDate: dayjs(startDate[0])
          //   .add(-1, "month")
          //   .startOf("month")
          //   .format("YYYY-MM-DD"),
          endDate: dayjs(endDate[0] + 86400000 * 5).format("YYYY-MM-DD"),
        });
      }
    }

    setNewList(listTime);
    return listTime;
  };

  const handleMouseLeave = () => {
    setGanttProgressBarId("");
  };

  useEffect(() => {
    const handleWindowResize = () => {
      initGantt();
    };
    window.addEventListener("resize", debounce(handleWindowResize, 200));
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (bodyContentRef.current) {
      setBodyRect({
        scrollHeight: bodyContentRef.current.scrollHeight,
        height: bodyContentRef.current.offsetHeight,
        scrollWidth:
          bodyContentRef.current.offsetWidth -
          bodyContentRef.current.clientWidth,
        scrollBarHeight:
          bodyContentRef.current.offsetHeight -
          bodyContentRef.current.clientHeight,
      });
      onChangeScrollBarHeight(
        bodyContentRef.current.offsetHeight -
          bodyContentRef.current.clientHeight
      );
      bodyContentRef.current.addEventListener("scroll", (event) => {
        if (event.target) {
          document.getElementsByClassName(
            "gantt-right-body-head"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
          )[0].scrollLeft = event.target.scrollLeft;
          document.getElementsByClassName(
            "ganttOverview-body-height"
            // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
            // @ts-expect-error
          )[0].scrollTop = event.target.scrollTop;
        }
      });
    }
  }, [bodyContentRef.current]);
  const DataMome = useMemo(() => {
    return (
      <>
        {data.map((item, index) => {
          return item.isEmpty ? (
            <div
              key={index}
              className="gantt-right-body-cell gantt-right-body-cell-isEmpty"
            ></div>
          ) : item.parentIsEmpty ? (
            <div
              key={index}
              className="gantt-right-body-cell gantt-right-body-cell-parentIsEmpty"
            ></div>
          ) : !item.isParent ? (
            <div
              key={index}
              className="gantt-right-body-cell gantt-right-body-cell-isParent-false"
            >
              <div
                id={"gantt-progressBar-Id" + index}
                onMouseEnter={() =>
                  handleMouseEnter("gantt-progressBar-Id" + index)
                }
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
                  {(item.status === "overtime" ||
                    item.status === "finishOvertime") &&
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
              {showLine &&
                ganttProgressBarId === `gantt-progressBar-Id${index}` && (
                  <HelpLine
                    ganttProgressBarId={ganttProgressBarId}
                    item={{
                      ...item,
                      ganttProgressBarId: "gantt-progressBar-Id" + index,
                    }}
                  />
                )}
            </div>
          ) : item.isParent ? (
            <div
              key={index}
              className="gantt-right-body-cell gantt-right-body-cell-isParent-true"
            >
              <div
                id={"gantt-progressBar-Id" + index}
                onMouseEnter={() =>
                  handleMouseEnter("gantt-progressBar-Id" + index)
                }
                onMouseLeave={handleMouseLeave}
                className={`progressBar progressBar-${item.status}`}
                style={{
                  left: item.left + "px",
                }}
              >
                <div className="progressBar-box">
                  <div className="progressBar-render">
                    {item.renderoBar &&
                      item.renderoBar(
                        item.width,
                        item.width * item.progress,
                        item.width - item.width * item.progress,
                        item.overtimeWidth
                      )}
                  </div>
                  <div
                    className="progressBar-default"
                    style={{
                      width: item.width + "px",
                    }}
                  >
                    <div
                      className="progressBar-active"
                      style={{
                        width: item.progress * 100 + "%",
                      }}
                    ></div>
                  </div>
                  {(item.status === "overtime" ||
                    item.status === "finishOvertime") &&
                    item.overtimeWidth && (
                      <div
                        className="progressBar-overTimeWidth"
                        style={{
                          width: item.overtimeWidth + "px",
                        }}
                      >
                        <div className="overtimeRender"></div>
                      </div>
                    )}
                </div>
                <div className="progress-text">
                  {statusList.filter((e) => item.status === e.status)[0].text}
                </div>
              </div>
              {showLine &&
                ganttProgressBarId === `gantt-progressBar-Id${index}` && (
                  <HelpLine
                    ganttProgressBarId={ganttProgressBarId}
                    item={{
                      ...item,
                      ganttProgressBarId: "gantt-progressBar-Id" + index,
                    }}
                  />
                )}
            </div>
          ) : (
            <></>
          );
        })}
      </>
    );
  }, [data, ganttProgressBarId]);

  return (
    <>
      <div className="gantt-right" id="gantt-right">
        {headWidth > 0 ? (
          <div
            className="gantt-right-body"
            id="gantt-right-body"
            style={{ width: headWidth + "px" }}
          >
            <div className="gantt-right-body-head-box ">
              <div className="gantt-right-body-head">
                <div id="top-time-width"></div>
                {ganttType === "day" ? (
                  <div className="gantt-right-body-head-list gantt-right-body-head-year">
                    {yaerList.map((item, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            width: width * item.length + "px",
                            minWidth: width * item.length + "px",
                          }}
                          className="gantt-right-body-head-year-item"
                        >
                          {item.year}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="gantt-right-body-head-list gantt-right-body-head-year">
                    {showYearList.map((item, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            width: width * item.length + "px",
                            minWidth: width * item.length + "px",
                          }}
                          className="gantt-right-body-head-year-item"
                        >
                          {item.year}
                        </div>
                      );
                    })}
                  </div>
                )}

                {ganttType === "day" ? (
                  <div className="gantt-right-body-head-list">
                    {days.map((item, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            width: width + "px",
                            minWidth: width + "px",
                          }}
                          className="gantt-right-head-item-day"
                        >
                          {item.split("-")[2]}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="gantt-right-body-head-list">
                    {yaerList.map((item, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            width: width * item.length + "px",
                            minWidth: width * item.length + "px",
                          }}
                          className="gantt-right-head-item-day"
                        >
                          {item.year.split("-")[1]}月
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div
                className="gantt-right-head-scrollBarWidth"
                style={{ width: bodyRect.scrollWidth }}
              ></div>
            </div>

            <div className="gantt-right-body-body">
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div
                  className="gantt-right-body-content"
                  ref={bodyContentRef}
                  id="gantt-right-body-content"
                >
                  {ganttType === "day" ? (
                    <div className="gantt-right-body-content-mark">
                      {days.map((_, index) => {
                        return (
                          <div
                            style={{
                              width: width + "px",
                              minWidth: width + "px",
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
                  ) : (
                    <div className="gantt-right-body-content-mark">
                      {yaerList.map((item, index) => {
                        return (
                          <div
                            style={{
                              width: width * item.length + "px",
                              minWidth: width * item.length + "px",
                              height: "100%",
                            }}
                            className="gantt-right-body-content-mark-item"
                            key={index}
                          ></div>
                        );
                      })}
                    </div>
                  )}

                  <div
                    className="gantt-right-body-cell"
                    style={{
                      height: headBodyPaddingY + "px",
                    }}
                  ></div>
                  {DataMome}
                  <div
                    className="gantt-right-body-cell"
                    style={{
                      height: headBodyPaddingY + "px",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="gantt-loading">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
};

export default GanttTime;
