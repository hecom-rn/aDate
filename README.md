# 时间库抽象层使用指南

## 概述

这是一个时间库的中间层抽象实现，允许你在不同的时间库（如 dayjs、xDate、moment 等）之间无缝切换，而应用层代码无需修改。

## 架构设计

```
应用层 (Application Layer)
    ↓
统一API层 (index.js)
    ↓
工厂模式 (TimeLibraryFactory.js)
    ↓
具体实现 (implementations/)
    ├── DayjsTimeLibrary.js
    ├── XDateTimeLibrary.js
    └── ...其他时间库实现
    ↑
抽象接口 (interfaces/ITimeLibrary.js)
```

## 核心文件说明

### 1. `interfaces/ITimeLibrary.js`
定义了所有时间库实现必须遵循的统一接口，包括：
- 时间创建、格式化、解析
- 时间计算（加减）
- 时间比较
- 时区转换
- 时间戳获取等

### 2. `implementations/DayjsTimeLibrary.js`
dayjs 时间库的具体实现，实现了 ITimeLibrary 接口的所有方法。

### 3. `implementations/XDateTimeLibrary.js`
xDate 时间库的实现示例（需要安装 xDate 库后完善）。

### 4. `TimeLibraryFactory.js`
工厂模式实现，负责创建和管理不同的时间库实例。

### 5. `index.js`
统一的 API 入口，为应用层提供简洁的函数接口。

## 基本使用方法

### 1. 导入和基本操作

```javascript
import { 
  setDefaultTimezone,
  setSystemTimezone,
  getTime,
  now,
  formatTime,
  addTime,
  TimeUtils
} from './aDate/index.js';

// 设置时区
setDefaultTimezone('Asia/Shanghai');
setSystemTimezone('UTC');

// 获取当前时间戳
const timestamp = getTime();

// 创建时间对象并格式化
const currentTime = now();
const formatted = formatTime(currentTime, 'YYYY-MM-DD HH:mm:ss');
console.log(formatted); // 2025-07-24 15:30:00

// 时间计算
const tomorrow = addTime(currentTime, 1, 'day');
const nextWeek = addTime(currentTime, 1, 'week');
```

### 2. 切换时间库

```javascript
import { setTimeLibrary, TimeLibraryType } from './aDate/index.js';

// 默认使用 dayjs
console.log(getCurrentTimeLibrary()); // 'dayjs'

// 切换到 xDate（需要先安装并完善 xDate 实现）
setTimeLibrary(TimeLibraryType.XDATE);
console.log(getCurrentTimeLibrary()); // 'xdate'

// 切换回 dayjs
setTimeLibrary(TimeLibraryType.DAYJS);
```

### 3. 链式调用

```javascript
import { TimeUtils } from './aDate/index.js';

// 使用 TimeUtils 进行链式调用
const result = TimeUtils.now()
  .add(3, 'day')
  .subtract(2, 'hour')
  .tz('America/New_York')
  .format('YYYY-MM-DD HH:mm:ss');
```

### 4. 时区转换

```javascript
import { now, convertToTimezone, formatTime } from './aDate/index.js';

const beijingTime = now('Asia/Shanghai');
const newYorkTime = convertToTimezone(beijingTime, 'America/New_York');

console.log('北京时间:', formatTime(beijingTime, 'YYYY-MM-DD HH:mm:ss'));
console.log('纽约时间:', formatTime(newYorkTime, 'YYYY-MM-DD HH:mm:ss'));
```

## 如何添加新的时间库

### 步骤1: 创建新的实现类

在 `implementations/` 目录下创建新文件，例如 `MomentTimeLibrary.js`：

```javascript
import { ITimeLibrary } from '../interfaces/ITimeLibrary.js';
import moment from 'moment-timezone';

export class MomentTimeLibrary extends ITimeLibrary {
  constructor() {
    super();
    this.lib = moment;
  }

  create(input, timezone) {
    if (timezone) {
      return this.lib.tz(input, timezone);
    }
    return this.lib(input);
  }

  format(timeObj, format, timezone) {
    if (timezone) {
      return timeObj.tz(timezone).format(format);
    }
    return timeObj.format(format);
  }

  // ... 实现其他必需的方法
}
```

### 步骤2: 在工厂中注册

修改 `TimeLibraryFactory.js`：

```javascript
import { MomentTimeLibrary } from './implementations/MomentTimeLibrary.js';

export const TimeLibraryType = {
  DAYJS: 'dayjs',
  XDATE: 'xdate',
  MOMENT: 'moment', // 新增
};

// 在 _createInstance 方法中添加
case TimeLibraryType.MOMENT:
  this.instance = new MomentTimeLibrary();
  break;
```

## 迁移现有代码

### 从 dayjs 迁移

如果你现有代码直接使用 dayjs：

```javascript
// 原代码
import dayjs from 'dayjs';
const time = dayjs().format('YYYY-MM-DD');

// 迁移后
import { now, formatTime } from './aDate/index.js';
const time = formatTime(now(), 'YYYY-MM-DD');
```

### 从 Date 迁移

```javascript
// 原代码
const now = new Date();
const timestamp = now.getTime();

// 迁移后
import { now, getTimestamp } from './aDate/index.js';
const currentTime = now();
const timestamp = getTimestamp(currentTime);
```

## 配置文件

确保你的 `config.js` 文件包含时区配置：

```javascript
export const zoneConfig = {
  timezone: 'Asia/Shanghai',    // 默认时区
  systemZone: 'UTC'            // 系统时区
};
```

## TypeScript 支持

项目包含完整的 TypeScript 声明文件 (`index.d.ts`)，提供类型安全：

```typescript
import { TimeUtils, TimeLibraryType } from './aDate/index.js';

const time: string = TimeUtils.now().format('YYYY-MM-DD');
```

## 优势

1. **解耦**: 应用层代码与具体时间库解耦
2. **可替换**: 轻松切换不同的时间库实现
3. **统一接口**: 所有时间操作使用相同的API
4. **类型安全**: 完整的 TypeScript 类型定义
5. **链式调用**: 支持流畅的链式操作
6. **扩展性**: 容易添加新的时间库支持

## 注意事项

1. 切换时间库时，确保新库已正确安装和配置
2. 不同时间库的格式化字符串可能略有差异，需要在实现类中处理
3. 时区支持程度因库而异，在实现时需要注意兼容性
4. 性能特性可能因底层库而异，建议根据实际需求选择合适的库

这样的设计让你可以根据项目需求、性能要求或团队偏好来选择最适合的时间库，而不需要修改应用层的任何代码。
