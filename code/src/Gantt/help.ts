import dayjs from "dayjs";
import { YearListIF } from "./types";

export const getYearMonth = (
  startTime: string,
  endTime: string,
  showDateType: string
): YearListIF[] => {
  const startDate = new Date(startTime);
  const endDate = new Date(new Date(endTime).getTime() + 86400000 * 30);
  const dateArray = [];
  const currentDate = startDate;
  const yearList: YearListIF[] = [];

  if (showDateType === "day") {
    while (currentDate <= endDate) {
      dateArray.push(dayjs(currentDate).format("YYYY-MM"));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    dateArray.forEach((item, index) => {
      const year = Number(item.split("-")[0]);
      const month = Number(item.split("-")[1]);
      if (index === 0) {
        yearList.push({
          year: `${year}-${month}`,
          length:
            dayjs(startTime).endOf("month").date() -
            dayjs(startTime).date() +
            1,
        });
      } else if (index === dateArray.length - 1) {
        yearList.push({
          year: `${year}-${month}`,
          length: new Date(endTime).getDate(),
        });
      } else {
        yearList.push({
          year: `${year}-${month}`,
          length: new Date(year, month, 0).getDate(),
        });
      }
    });
  } else if (showDateType === "month") {
    while (currentDate <= endDate) {
      dateArray.push(dayjs(currentDate).format("YYYY-MM"));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    dateArray.forEach((item) => {
      const year = Number(item.split("-")[0]);
      const month = Number(item.split("-")[1]);
      yearList.push({
        year: `${year}-${month}`,
        length: new Date(year, month, 0).getDate(),
      });
    });
  }

  return yearList;
};

export const getDaysList = (start: string, end: string) => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const datesInRange: string[] = [];
  for (
    let currentDate = startDate;
    currentDate.isBefore(endDate);
    currentDate = currentDate.add(1, "day")
  ) {
    datesInRange.push(currentDate.format("YYYY-MM-DD"));
  }
  datesInRange.push(end);

  return datesInRange;
};

export const getStartEndHours = (start: string, end: string) => {
  if (start) {
    return (new Date(start).getTime() - new Date(end).getTime()) / 1000 / 3600;
  } else {
    return (new Date().getTime() - new Date(end).getTime()) / 1000 / 3600;
  }
};

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return function (this: unknown, ...args: Parameters<T>): void {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
