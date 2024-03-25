import { useRef, useState } from "react";
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
const list: GanttDataProps[] = [
  {
    startTime: "2024-03-10 00:00:00",
    endTime: "2024-03-30 00:00:00",
    finishTime: null,
    dept: "技术部",
    num: "2人",
    time: "2天",
    start: true,
    time2: "结束时间",
    renderHead: () => <div>自定义渲染噢噢噢噢</div>,
    renderoBar: (_, activeWidth, surplusWidth) => {
      return (
        <div
          style={{
            display: "flex",
          }}
        >
          <div style={{ width: activeWidth + "px" }}>
            我的宽度是：{activeWidth}px
          </div>
          <div style={{ width: surplusWidth + "px" }}>
            我的宽度是：{surplusWidth.toFixed(2)}px
          </div>
        </div>
      );
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
    renderoBar: (_, activeWidth) => {
      return (
        <div
          style={{
            display: "flex",
          }}
        >
          <div
            style={{ width: activeWidth + "px" }}
            onClick={() => alert(`我的宽度是：${activeWidth}px`)}
          >
            点我弹窗
          </div>
        </div>
      );
    },
    children: [
      {
        start: false,
        startTime: "2024-03-22 00:00:00",
        endTime: "2024-04-20 12:00:00",
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
    renderoBar: (_, activeWidth, surplusWidth) => {
      return (
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: activeWidth + "px",
            }}
          >
            自定义内容哦
          </div>
          <div
            style={{
              width: surplusWidth + "px",
            }}
          >
            我是剩余宽度哦
          </div>
        </div>
      );
    },
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
    endTime: "2024-03-20 12:00:00",
    finishTime: "2024-03-27 00:00:00",
    dept: "技术部",
    num: "2人",
    time: "2天",
    start: true,
    time2: "结束时间",
    renderoBar: (width, _, __, overtimeWidth) => {
      return (
        <div style={{ display: "flex" }}>
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
          <div
            style={{
              fontSize: "12px",
              color: "#fff",
              paddingLeft: "10px",
              width: overtimeWidth + "px",
            }}
          >
            自定义超出内容
          </div>
        </div>
      );
    },
    children: [
      {
        start: true,
        startTime: "2024-03-12 00:00:00",
        endTime: "2024-03-19 12:00:00",
        finishTime: "2024-03-25 12:00:00",
        renderHeadChild: () => <div>自定义render</div>,
        renderoBar: () => {
          return <div> 任务标题</div>;
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
        startTime: "2024-04-13 09:00:00",
        endTime: "2024-04-15 17:00:00",
        finishTime: null,
        dept: "前端手收尸",
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
    align: "left",
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
  const [show, setShow] = useState(true);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={() => setShow(!show)}>
          {show ? "默认" : "滚动条"}
        </button>
      </div>
      {show ? (
        <>
          <div>
            <h1>默认</h1>
            <button
              onClick={() => {
                ganttRef.current?.initGantt();
              }}
            >
              刷新
            </button>
          </div>
          <Gantt data={list} head={head} ref={ganttRef} />
        </>
      ) : (
        <>
          <h1>带滚动条</h1>
          <Gantt height="400px" data={list} head={head} />
        </>
      )}
    </div>
  );
}

export default App;
