import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BodyRectProps,
  GanttDataProps,
  GanttStatusListProps,
  GanttType,
  IListIF,
  YearListIF,
} from "../types";
import {
  getDaysList,
  getYearMonth,
  getStartEndHours,
  debounce,
  defaultStatus,
  getUUID,
} from "../help";
import Mark from "./Mark";
import Parent from "./Parent";
import Children from "./Children";

interface MaxMinDate {
  startDate: string;
  endDate: string;
}

const GanttTime: React.FC<{
  list: GanttDataProps[];
  headBodyPaddingY: number;
  refresh: boolean;
  showLine: boolean;
  ganttType: GanttType;
  statusList?: GanttStatusListProps[];
  onChangeScrollBarHeight: (e: number) => void;
  onClickText: (e: GanttDataProps) => void;
}> = ({
  list,
  headBodyPaddingY,
  refresh,
  showLine,
  ganttType,
  statusList = defaultStatus,
  onChangeScrollBarHeight,
  onClickText,
}) => {
  const [yaerList, setYaerList] = useState<YearListIF[]>([]);
  const [days, setDays] = useState<YearListIF[]>([]);
  const [data, setData] = useState<IListIF[]>([]);
  const [ganttProgressBarId, setGanttProgressBarId] = useState("");
  const bodyContentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [headWidth, setHeadWidth] = useState(0);
  const [bodyRect, setBodyRect] = useState<BodyRectProps>({
    height: 0,
    scrollWidth: 0,
    scrollHeight: 0,
  });
  // 计算显示位置
  const resetPosition = (
    chunkWidth: number,
    maxMinDate: MaxMinDate,
    newList: IListIF[]
  ) => {
    const itemWidthEqually = chunkWidth / 24;
    const newData = newList.map((e) => {
      const endDate = dayjs(e.startTime);
      const numDays = endDate.diff(maxMinDate.startDate, "day");
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
        left: numDays * chunkWidth + startHours * itemWidthEqually - 5,
      };
    });
    setData(newData);
  };
  // 计算顶部最多显示多少个
  const resetSize = (maxMinDate: MaxMinDate, newList: IListIF[]) => {
    const headWidth = document.getElementById("gantt-right")?.offsetWidth;
    let contentHeight = headBodyPaddingY * 2;
    newList.forEach((item) => {
      contentHeight += item.height;
    });

    if (headWidth) {
      const year = getYearMonth(
        maxMinDate.startDate,
        maxMinDate.endDate,
        ganttType
      );
      let width = 0;
      setYaerList(year);
      if (ganttType === "day") {
        const day = getDaysList(maxMinDate.startDate, maxMinDate.endDate);
        const itemWidth = headWidth / day.length;
        width = itemWidth > 40 ? itemWidth : 40;
        const newDay = day.map((e) => {
          return {
            year: e,
            length: 1,
          };
        });
        setHeadWidth(headWidth);
        setDays(newDay);
      } else if (ganttType === "month") {
        let allDayNum = 0;
        year.forEach((item) => (allDayNum += item.length));
        const itemWidth = headWidth / allDayNum;
        width = itemWidth > 3 ? itemWidth : 3;
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
        setHeadWidth(headWidth);
        setDays(year);
        setYaerList(showYear);
      }
      // 计算位置
      resetPosition(width, maxMinDate, newList);
      setWidth(width);
    }
  };
  const handleWindowResize = () => {
    setData([]);
    initGantt();
  };

  const initGantt = () => {
    const newlist: IListIF[] = [];
    list.forEach((item, index) => {
      if (index > 0) {
        newlist.push({
          ...item,
          ganttId: getUUID(),
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
        ganttId: getUUID(),
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
              ganttId: getUUID(),
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
            ganttId: getUUID(),
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
    let isOvertime = false;
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
            isOvertime = true;
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
    const maxMinDate = {
      startDate: "",
      endDate: "",
    };
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
        maxMinDate.startDate = dayjs(startDate[0]).format("YYYY-MM") + "-01";
        // 如果加2天还等于当前月份 则取当前月份最后一天 否则获取下个月份2天后的值
        maxMinDate.endDate =
          nextTwoEndDateMonth === lastDateMonth
            ? nowMonthLastDayTime
            : dayjs(endDate[0] + 86400000 * 2).format("YYYY-MM-DD");
      } else {
        maxMinDate.startDate = dayjs(startDate[0] - 86400000).format(
          "YYYY-MM-DD"
        );
        maxMinDate.endDate = dayjs(endDate[0] + 86400000 * 2).format(
          "YYYY-MM-DD"
        );
      }
    } else if (ganttType === "month") {
      const now = dayjs(startDate[0]);
      const lastMonth = now.subtract(1, "month");

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
        maxMinDate.startDate =
          dayjs(startDate[0]).format("YYYY") +
          "-" +
          lastMonth.format("MM") +
          "-01";
        maxMinDate.endDate =
          nextTwoEndDateMonth === lastDateMonth
            ? nowMonthLastDayTime
            : dayjs(endDate[0]).format("YYYY-MM-DD");
      } else {
        maxMinDate.startDate =
          dayjs(startDate[0]).format("YYYY") +
          "-" +
          lastMonth.format("MM") +
          "-01";
        maxMinDate.endDate = dayjs(endDate[0] + 86400000 * 5).format(
          "YYYY-MM-DD"
        );
      }
    }
    if (
      isOvertime &&
      new Date(maxMinDate.endDate).getTime() < new Date().getTime()
    ) {
      maxMinDate.endDate = dayjs(new Date().getTime() + 86400000 * 3).format(
        "YYYY-MM-DD"
      );
    }

    resetSize(maxMinDate, listTime);
  };

  const handleMouseLeave = () => {
    setGanttProgressBarId("");
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
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
  };
  useEffect(() => {
    if (list.length) {
      handleWindowResize();
      window.addEventListener("resize", debounce(handleWindowResize, 200));
    }
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [list, refresh, ganttType]);
  useEffect(() => {
    if (bodyContentRef.current) {
      const barHeight =
        bodyContentRef.current.offsetHeight -
        bodyContentRef.current.clientHeight;
      setBodyRect({
        scrollHeight:
          bodyContentRef.current.scrollHeight >
          bodyContentRef.current.clientHeight
            ? bodyContentRef.current.scrollHeight
            : 0,
        height: bodyContentRef.current.offsetHeight,
        scrollWidth:
          bodyContentRef.current.offsetWidth -
          bodyContentRef.current.clientWidth,
      });
      onChangeScrollBarHeight(barHeight);
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
            <Children
              key={item.ganttId}
              item={item}
              index={index}
              showLine={showLine}
              ganttProgressBarId={ganttProgressBarId}
              onMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />
          ) : item.isParent ? (
            <Parent
              key={item.ganttId}
              item={item}
              index={index}
              showLine={showLine}
              ganttProgressBarId={ganttProgressBarId}
              statusList={statusList}
              onMouseEnter={handleMouseEnter}
              onClickText={onClickText}
              handleMouseLeave={handleMouseLeave}
            />
          ) : (
            <></>
          );
        })}
      </>
    );
  }, [data, ganttProgressBarId]);

  const Placeholder = useMemo(() => {
    return (
      <div
        className="gantt-right-body-cell"
        style={{
          height: headBodyPaddingY + "px",
        }}
      ></div>
    );
  }, [headBodyPaddingY]);

  return (
    <>
      <div className="gantt-right" id="gantt-right">
        <div
          className="gantt-right-body"
          id="gantt-right-body"
          style={{ width: headWidth + "px" }}
        >
          <div className="gantt-right-body-head-box ">
            <div className="gantt-right-body-head">
              <div id="top-time-width"></div>
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
              <div className="gantt-right-body-head-list">
                {days.map((item, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        width: width * item.length + "px",
                        minWidth: width * item.length + "px",
                      }}
                      className="gantt-right-head-item-day"
                    >
                      {ganttType === "day"
                        ? item.year.split("-")[2]
                        : item.year.split("-")[1]}
                    </div>
                  );
                })}
              </div>
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
                onScroll={handleScroll}
                id="gantt-right-body-content"
              >
                <Mark days={days} width={width} bodyRect={bodyRect} />
                {Placeholder}
                {DataMome}
                {Placeholder}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default GanttTime;
