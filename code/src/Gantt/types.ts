export type GanttDataStatusProps =
  | "finish"
  | "wait"
  | "progress"
  | "overtime"
  | "finishOvertime";

export interface GanttStatusListProps {
  status: GanttDataStatusProps;
  text: string;
}
export interface GanttPropsRefProps {
  initGantt: () => void;
}
export interface GanttDataProps {
  finishTime: string | null;
  startTime: string;
  endTime: string;
  start: boolean;
  children?: GanttDataProps[];
  /**
   *
   * @param width 进度条宽度（不包含超出的宽度）
   * @param activeWidth 选中进度条宽度
   * @param surplusWidth 剩余进度条宽度
   * @param overflowWidth 超出的宽度
   * @returns 自定义进度条的宽度
   */
  renderoBar?: (
    width: number,
    activeWidth: number,
    surplusWidth: number,
    overflowWidth?: number
  ) => JSX.Element;
  /**
   *
   * 左侧表头body第一级渲染内容
   */
  renderHead?: () => JSX.Element;
  /**
   *
   * 左侧表头body第二级级渲染内容
   */
  renderHeadChild?: () => JSX.Element;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface GanttHeadProps {
  title: string;
  width?: string;
  key?: string;
  align?: "center" | "left" | "right";
  renderTableHead?: () => JSX.Element;
}

export interface IListIF extends GanttDataProps {
  status?: GanttDataStatusProps;
  left: number;
  width: number;
  progress: number;
  isParent: boolean;
  parentIsEmpty: boolean;
  isEmpty: boolean;
  overtimeWidth?: number;
}

export interface GanttProps {
  /**
   * 数据
   */
  data: GanttDataProps[];
  /**
   * 表头
   */
  head: GanttHeadProps[];
  /**
   * 表头宽度
   */
  headWidth?: string;
  /**
   * 显示竖线
   */
  showLine?: boolean;

  /**
   * 左侧表格body区域Y轴内边距
   */
  headBodyPaddingY?: number;
  /**
   * 左侧表格body区域X轴内边距
   */
  headBodyPaddingX?: number;
  /**
   * 是否显示左侧收起按钮
   */
  open?: boolean;
}

export interface YearListIF {
  yaer: string;
  length: number;
}
