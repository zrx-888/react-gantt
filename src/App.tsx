import { useRef } from "react";
// import {
//   Gantt,
//   GanttDataProps,
//   GanttHeadProps,
//   GanttPropsRefProps,
// } from "react-gantt-lightweight";
import Gantt from "./Gantt";
import {
  GanttDataProps,
  GanttHeadProps,
  GanttPropsRefProps,
} from "./Gantt/types";
import dayjs from "dayjs";
const list: GanttDataProps[] = [
  {
    startTime: "2024-03-22 00:00:00",
    endTime: "2024-03-25 00:00:00",
    finishTime: null,
    dept: "技术部",
    num: "2人",
    time: "2天",
    start: false,
    time2: "结束时间",
    renderHead: () => <div>略略略</div>,
    renderoBar: (width, activeWidth, surplusWidth, overtimeWidth) => {
      console.log(width + "进度条宽度");
      console.log(activeWidth + "选中进度条宽度");
      console.log(surplusWidth + "剩余进度条宽度");
      console.log(overtimeWidth + "超出的宽度");
      return <div></div>;
    },
  },
  {
    startTime: "2024-03-11 00:00:00",
    endTime: "2024-03-25 12:00:00",
    finishTime: null,
    dept: "技术部",
    num: "2人",
    time: "2天",
    start: true,
    time2: "结束时间",

    children: [
      {
        start: false,
        startTime: "2024-03-22 00:00:00",
        endTime: "2024-04-20 00:00:00",
        finishTime: null,
        dept: "前端",
        num: "2人",
        time: "2天",
        time2: "结束时间",
      },
    ],
  },
  {
    startTime: "2024-03-11 00:00:00",
    endTime: "2024-03-25 12:00:00",
    finishTime: "2024-03-22 00:00:00",
    dept: "技术部",
    num: "2人",
    time: "2天",
    start: true,
    time2: "结束时间",
  },
  {
    startTime: "2024-03-07 00:00:00",
    endTime: "2024-03-27 12:00:00",
    finishTime: null,
    dept: "技术部",
    num: "2人",
    time: "2天",
    start: true,
    time2: "结束时间",
  },
  {
    startTime: "2024-03-11 00:00:00",
    endTime: "2024-03-25 12:00:00",
    finishTime: "2024-03-27 00:00:00",
    dept: "技术部",
    num: "2人",
    time: "2天",
    start: true,
    time2: "结束时间",
    renderoBar: (width) => {
      return (
        <div
          style={{
            fontSize: "12px",
            color: "#fff",
            paddingLeft: "10px",
            width: width + "px",
          }}
        >
          自定义任务内容-哈哈哈哈哈
        </div>
      );
    },
    children: [
      {
        start: true,
        startTime: "2024-03-12 00:00:00",
        endTime: "2024-03-19 12:00:00",
        finishTime: "2024-03-15 12:00:00",
        renderHeadChild: () => <div>自定义render</div>,
        renderoBar: () => {
          return <div> 任务标题</div>;
        },
        renderOvertime: () => {
          return <div className="h-[18px]"> </div>;
        },
        dept: "前端",
        num: "2人",
        time: "2天",
        time2: "结束时间",
      },
      {
        start: true,
        startTime: "2024-03-13 00:00:00",
        endTime: "2024-03-24 17:00:00",
        finishTime: "2024-03-29 12:00:00",
        dept: "前端",
        num: "2人",
        time: "2天",
        time2: "结束时间",
      },
      {
        start: true,
        startTime: "2024-04-13 09:00:00",
        endTime: "2024-04-15 17:00:00",
        finishTime: null,
        dept: "前端",
        num: "2人",
        time: "2天",
        time2: "结束时间",
        renderoBar: () => {
          return <div> 任务标题</div>;
        },
      },

      {
        start: false,
        startTime: dayjs(1711188728000).format("YYYY-MM-DD HH:mm:ss"),
        endTime: dayjs(1711036800000).format("YYYY-MM-DD HH:mm:ss"),
        finishTime: null,
        dept: "前端",
        num: "2人",
        time: "2天",
        time2: "结束时间",
      },
    ],
  },
];

const head: GanttHeadProps[] = [
  {
    title: "部门",
    key: "dept",
  },
  {
    title: "人数",
    key: "num",
  },
  {
    title: "已用工时",
  },
  {
    title: "任务时间",
  },
];

function App() {
  const ganttRef = useRef<GanttPropsRefProps>(null);
  return (
    <div
      style={{
        height: "200px",
        overflowY: "auto",
      }}
    >
      <Gantt data={list} head={head} ref={ganttRef} />
      <button
        onClick={() => {
          ganttRef.current?.initGantt();
        }}
      >
        刷新
      </button>
    </div>
  );
}

export default App;
