# react-gantt-lightweight

react 轻量级甘特图
目前只能精确到日,月 后期年会加上

## Install

```bash
npm i react-gantt-lightweight
或者
 yarn add react-gantt-lightweight
```

## demo

[https://react-gantt.vercel.app/](https://react-gantt.vercel.app/)

![](public/gantt.png)

```js
import { useRef } from "react";
import {
  Gantt,
  GanttDataProps,
  GanttHeadProps,
  GanttPropsRefProps,
} from "react-gantt-lightweight";
const list: GanttDataProps[] = [
  {
    startTime: "2024-03-10 00:00:00",
    endTime: "2024-03-30 00:00:00",
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
  const ganttRef = useRef < GanttPropsRefProps > null;
  return (
    <div>
      <Gantt height="400px" data={list} head={head} ref={ganttRef} />
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
```

## API

### props

<table class="table table-bordered table-striped">
 <tr>
  <thead>
    <tr>
      <th >参数</th>
      <th >类型</th>
      <th >默认值</th>
      <th>描述</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>data</th>
      <th>GanttDataProps[]</th>
      <th>[]</th>
      <th>数据</th>
    </tr>
    <tr>
      <th>head</th>
      <th>GanttHeadProps[]</th>
      <th>[]</th>
      <th>左侧表头</th>
    </tr>
    <tr>
      <th>ganttType</th>
      <th> "day" | "month"</th>
      <th>day</th>
      <th>
        <div>day日期</div>
        <div>month月份</div>
      </th>
    </tr>
    <tr>
      <th>height</th>
      <th>string</th>
      <th>auto</th>
      <th>甘特图高度</th>
    </tr>
    <tr>
      <th>headWidth</th>
      <th>string</th>
      <th>400px</th>
      <th>左侧宽度</th>
    </tr>
    <tr>
      <th>showLine</th>
      <th>boolean</th>
      <th>true</th>
      <th>鼠标悬浮进度条查看时间线</th>
    </tr>
    <tr>
      <th>headBodyPaddingY</th>
      <th>number</th>
      <th>10</th>
      <th>左侧表格body区域Y轴内边距</th>
    </tr>
    <tr>
      <th>headBodyPaddingX</th>
      <th>number</th>
      <th>0</th>
      <th>左侧表格body区域X轴内边距</th>
    </tr>
    <tr>
      <th>open</th>
      <th>boolean</th>
      <th>true</th>
      <th>是否显示左侧收起按钮</th>
    </tr>
    <tr>
      <th>ref</th>
      <th>GanttPropsRefProps</th>
      <th>null</th>
      <th>ref</th>
    </tr>
  </tbody>
</table>

### GanttDataProps

<table class="table table-bordered table-striped">
  <tr>
    <thead>
      <tr>
        <th>参数</th>
        <th>类型</th>
        <th>默认值</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>start</td>
        <td>boolean</td>
        <td>true</td>
        <td>任务是否开始</td>
      </tr>
      <tr>
        <td>startTime</td>
        <td>YYYY-MM-dd HH:mm:ss</td>
        <td>必传</td>
        <td>任务开始时间</td>
      </tr>
      <tr>
        <td>endTime</td>
        <td>YYYY-MM-dd HH:mm:ss</td>
        <td>必传</td>
        <td>任务结束时间</td>
      </tr>
      <tr>
        <td>finishTime</td>
        <td>YYYY-MM-dd HH:mm:ss | null</td>
        <td>必传</td>
        <td>任务结束时间</td>
      </tr>
      <tr>
        <td>children</td>
        <td>GanttDataProps[]</td>
        <td>[]</td>
        <td>子级任务</td>
      </tr>
      <tr>
        <td>renderoBar</td>
        <td>()=>JSX.Element</td>
        <td>
          <div> width 进度条宽度(不包含超出的宽度)</div>
          <div>
           activeWidth 选中进度条宽度
          </div>
          <div>
           surplusWidth 剩余进度条宽度
          </div>
          <div>
           overflowWidth 超出的宽度(超时的宽度)
          </div>
           <div>
           renderoBar?: ( width:number, activeWidth: number, surplusWidth: number, overflowWidth?:
          number ) => JSX.Element;
          </div>
        </td>
        <td>自定义进度条的宽度</td>
      </tr>
       <tr>
        <td>renderHead</td>
        <td>()=>JSX.Element</td>
        <td>()=>JSX.Element</td>
        <td>左侧表头 body 第一级渲染内容</td>
      </tr>
       <tr>
        <td>renderHeadChild</td>
        <td>()=>JSX.Element</td>
        <td>()=>JSX.Element</td>
        <td> 左侧表头 body 第二级级渲染内容</td>
      </tr>
    </tbody>
  </tr>
</table>

### GanttHeadProps

<table class="table table-bordered table-striped">
  <tr>
    <thead>
      <tr>
        <th>参数</th>
        <th>类型</th>
        <th>默认值</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
       <tr>
        <td>title</td>
        <td>string</td>
        <td></td>
        <td>表格标题</td>
      </tr>
       <tr>
        <td>width</td>
        <td>string</td>
        <td>aotu</td>
        <td>标题宽度</td>
      </tr>
       <tr>
        <td>key</td>
        <td>string</td>
        <td></td>
        <td>对应data的key</td>
      </tr>
       <tr>
        <td>align</td>
        <td>"center" | "left" | "right"</td>
        <td>center</td>
        <td>对齐方式</td>
      </tr>
       <tr>
        <td>renderTableHead</td>
        <td>() => JSX.Element</td>
        <td>() => JSX.Element</td>
        <td>自定义内容</td>
      </tr>
    </tbody>
  </tr>
</table>

### GanttPropsRefProps

<table class="table table-bordered table-striped">
  <tr>
    <thead>
      <tr>
        <th>参数</th>
        <th>类型</th>
        <th>默认值</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
       <tr>
        <td>initGantt</td>
        <td>()=>{}</td>
        <td>()=>{}</td>
        <td>初始化甘特图</td>
      </tr>
       <tr>
        <td>setGanttType</td>
        <td>(type:"day" | "month")=>void</td>
        <td>(type:"day" | "month")=>void</td>
        <td>切换显示类型</td>
      </tr>
    </tbody>
  </tr>
</table>
