# react-cascader-popover

react 级联选择器/支持多选/单选

src/Type 有完整演示

## Install

```bash
 npm   i react-cascader-popover
或者
 yarn add react-cascader-popover
```

## 单选

![](https://gitee.com/zhouruixin_0/react-cascader-popover/raw/master/public/1.png)

```js
import { useRef, useState } from "react";
import { province } from "../data";
import {
  Cascader,
  CascaderOption,
  CascaderRefProps,
} from "react-cascader-popover";

function Default() {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const [valueAllPath, setValueAllPath] = useState<CascaderOption[]>([]);

  const [value, setValue] = useState("120103");

  const cascaderRef = useRef<CascaderRefProps>(null);

  // 点击展开
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  // change 事件
  const handleChange = (
    value: CascaderOption | null,
    valueAll: CascaderOption[]
  ) => {
    setValue(value ? value.value : "");
    setValueAllPath(valueAll);
  };
  // 清空选中
  const handleClear = () => {
    setValueAllPath([]);
    // 两种都可以清空
    // setValue("");
    cascaderRef.current?.clearValue();
  };

  // 设置选中
  const handleSet = () => {
    setValue("11010333555");
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <div style={{ width: "500px" }}>
        <div className="cascader">
          <div className="cascader_input_box" onClick={handleClick}>
            {valueAllPath.length ? (
              <div className="cascader_input">
                {valueAllPath.map((e) => e.label).join(" - ")}
              </div>
            ) : (
              <div className="placeholder">请选择</div>
            )}
          </div>
        </div>
      </div>

      <Cascader
        ref={cascaderRef}
        value={value}
        open={open}
        anchorEl={anchorEl}
        options={province}
        onClose={() => setAnchorEl(null)}
        onChange={handleChange}
      />
    </>
  );
}

export default Default;

```

## 多选

![](https://gitee.com/zhouruixin_0/react-cascader-popover/raw/master/public/2.png)

```js

  import { useRef, useState } from "react";
import {
  Cascader,
  CascaderOption,
  CascaderRefProps,
} from "react-cascader-popover";
import { province } from "../data";

function Multiple() {
  const value = "130102";
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [valueAll, setValueAll] = useState<CascaderOption[]>([]);
  const cascaderRef = useRef<CascaderRefProps>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChange = (
    _: CascaderOption | null,
    valueAll: CascaderOption[]
  ) => {
    console.log(valueAll);

    setValueAll(valueAll);
  };
  const handleClear = () => {
    // cascaderRef.current?.setValue([]);
    cascaderRef.current?.clearValue();
  };
  const handleSetValue = () => {
    const data = [
      {
        value: "120101",
        label: "和平区",
      },
      {
        value: "120102",
        label: "河东区",
      },
    ];
    cascaderRef.current?.setValue(data.map((e) => e.value));
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <div style={{ width: "500px" }}>
        <h3>多选 </h3>
        {valueAll.length ? (
          <>
            <button onClick={handleClear}>清空VALUE</button>
            <div>
              当前选中【{valueAll.map((e) => JSON.stringify(e) + ",")}】
            </div>
          </>
        ) : (
          <button onClick={handleSetValue}>设置VALUE选中</button>
        )}

        <div className="cascader">
          <div className="cascader_input_box" onClick={handleClick}>
            {valueAll.length ? (
              <div className="cascader_input">
                {valueAll.map((e) => e.label).join(" , ")}
              </div>
            ) : (
              <div className="placeholder">请选择</div>
            )}
          </div>
        </div>
      </div>

      <Cascader
        ref={cascaderRef}
        value={value}
        open={open}
        anchorEl={anchorEl}
        multiple
        options={province}
        onClose={() => setAnchorEl(null)}
        onChange={handleChange}
      />
    </>
  );
}

export default Multiple;


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
      <th>value</th>
      <th>string</th>
      <th></th>
      <th>选中的值</th>
    </tr>
    <tr>
      <th>options</th>
      <th>CascaderOption[]</th>
      <th>[]</th>
      <th>数据</th>
    </tr>
    <tr>
      <th>open</th>
      <th>boolean</th>
      <th>false</th>
      <th>是否弹出选择器</th>
    </tr>
    <tr>
      <th>anchorEl</th>
      <th>HTMLDivElement | null</th>
      <th>null</th>
      <th>HTMLDivElement元素 用于展示窗口的位置</th>
    </tr>
    <tr>
      <th>multiple</th>
      <th>boolean</th>
      <th>false</th>
      <th>是否开启多选</th>
    </tr>
    <tr>
      <th>search</th>
      <th>boolean</th>
      <th>false</th>
      <th>是否开启搜索</th>
    </tr>
    <tr>
      <th>searchPlaceholder</th>
      <th>string</th>
      <th>请输入关键词</th>
      <th>搜索框提示语</th>
    </tr>
    <tr>
      <th>onChange</th>
      <th> (value: CascaderOption | null, valueAll: CascaderOption[]) => void</th>
      <th></th>
      <th>点击后的事件</th>
    </tr>
    <tr>
      <th>onClose</th>
      <th> () => void</th>
      <th></th>
      <th>隐藏选择器事件</th>
    </tr>
    <tr>
      <th>ref</th>
      <th>CascaderRefProps</th>
      <th></th>
     <th>
         <div>setValue: (value: string[]) => void; </div>
         <div>clearValue: () => void; </div>
         用户多选时使用
     </th>
    </tr>
  </tbody>
</table>

### option

<table class="table table-bordered table-striped">
 <tr>
  <thead>
    <tr>
      <th >参数</th>
      <th>类型</th>
      <th >默认值</th>
      <th>描述</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>label</th>
      <th>string</th>
      <th></th>
      <th>展示的文字</th>
    </tr>
    <tr>
      <th>value</th>
      <th>string</th>
      <th></th>
      <th>对应的value</th>
    </tr>
    <tr>
      <th>children</th>
      <th>Array</th>
      <th></th>
      <th>children</th>
    </tr>
  </tbody>
</table>

## 更新说明

1.0.6 更新项目

1.0.7 多选时展开列表默认展示第一个数据

1.1.0 增加输入框筛选 修复 onChange 触发问题
