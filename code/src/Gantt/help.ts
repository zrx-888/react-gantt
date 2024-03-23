import dayjs from "dayjs";
import { YearListIF } from "./types";

export const getYearMonth = (startTime: string, endTime: string): YearListIF[] => {
  const startNum = startTime.split("-").map(e => Number(e));
  const endNum = endTime.split("-").map(e => Number(e));
  const yearList = [];
  for (let index = startNum[1]; index <= endNum[1]; index++) {
    const obj = {
      yaer: `${startNum[0]}-${index}`,
      length: 0
    };
    if (index === startNum[1]) {
      obj.length = dayjs(startTime).endOf("month").date() - dayjs(startTime).date() + 1;
    } else if (index === endNum[1]) {
      obj.length = new Date(endTime).getDate();
    } else {
      obj.length = new Date(startNum[0], index, 0).getDate();
    }
    yearList.push(obj);
  }

  return yearList;
};

export const getDaysList = (start: string, end: string) => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const datesInRange: string[] = [];
  for (let currentDate = startDate; currentDate.isBefore(endDate); currentDate = currentDate.add(1, "day")) {
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

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return function (this: unknown, ...args: Parameters<T>): void {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
