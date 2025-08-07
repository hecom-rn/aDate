import { timeLibraryFactory, TimeLibraryType, TimeLibraryTypeValue } from './TimeLibraryFactory';
import { TimeUnit, TimeObject } from './interfaces/ITimeLibrary';
import { zoneConfig } from './config';

/**
 * 时间库统一API
 * 为应用层提供统一的时间操作接口
 */

/**
 * 切换时间库实现
 * @param type - 时间库类型 (TimeLibraryType 中的值)
 */
export function setTimeLibrary(type: TimeLibraryTypeValue): void {
  timeLibraryFactory.setLibraryType(type);
}

/**
 * 获取当前使用的时间库类型
 * @returns 时间库类型
 */
export function getCurrentTimeLibrary(): TimeLibraryTypeValue {
  return timeLibraryFactory.getCurrentType();
}

/**
 * 设置全局默认时区
 * @param timezone - 时区名称（如 "Asia/Shanghai"）
 */
export function setDefaultTimezone(timezone: string): void {
  timeLibraryFactory.getInstance().setDefaultTimezone(timezone);
}

/**
 * 设置系统时区
 * @param timezone - 时区名称（如 "Asia/Shanghai"）
 */
export function setSystemTimezone(timezone: string): void {
  timeLibraryFactory.getInstance().setSystemTimezone(timezone);
}

/**
 * 获取时间戳（单位：毫秒）
 * @param timeObj - 时间对象
 * @param isDate - 是否根据系统时区调整时间戳
 * @returns 时间戳
 */
export function getTime(timeObj: TimeObject, isDate: boolean = false): number {
  return timeLibraryFactory.getInstance().getTime(timeObj, isDate);
}

/**
 * 获取当前时间戳（单位：毫秒）
 * @param isDate - 是否根据系统时区调整时间戳
 * @returns 当前时间戳
 */
export function getCurrentTimestamp(isDate: boolean = false): number {
  const currentTime = timeLibraryFactory.getInstance().create();
  return timeLibraryFactory.getInstance().getTime(currentTime, isDate);
}

/**
 * 创建时间对象
 * @param input - 输入时间
 * @param formatOrOptions - dayjs的第二个参数（格式字符串或配置对象）
 * @param timezone - 时区
 * @returns 时间对象
 */
export function createTime(input?: string | number | Date, formatOrOptions?: string | object, timezone?: string): TimeObject {
  return timeLibraryFactory.getInstance().create(input, formatOrOptions, timezone);
}

export function locale(localeStr?: string): string {
    return timeLibraryFactory.getInstance().locale(localeStr);
}

/**
 * 创建UTC时间对象
 * @param input - 输入时间
 * @returns UTC时间对象
 */
export function createUtcTime(input?: string | number | Date): TimeObject {
  return timeLibraryFactory.getInstance().createUtc(input);
}

/**
 * 获取当前时间对象
 * @param timezone - 时区
 * @returns 当前时间对象
 */
export function now(timezone?: string): TimeObject {
  return timeLibraryFactory.getInstance().create(undefined, timezone);
}

/**
 * 格式化时间
 * @param timeObj - 时间对象
 * @param format - 格式字符串
 * @param timezone - 时区
 * @param isDate - 是否根据系统时区调整
 * @returns 格式化后的时间字符串
 */
export function formatTime(timeObj: TimeObject, format?: string, isDate: boolean = false, timezone?: string): string {
  return timeLibraryFactory.getInstance().format(timeObj, format, timezone ? timezone : isDate ? zoneConfig.systemZone : undefined);
}

/**
 * 解析时间字符串
 * @param timeStr - 时间字符串
 * @param format - 格式字符串
 * @param timezone - 时区
 * @returns 时间对象
 */
export function parseTime(timeStr: string, format?: string, timezone?: string): TimeObject {
  return timeLibraryFactory.getInstance().parse(timeStr, format, timezone);
}

/**
 * 时间加法
 * @param timeObj - 时间对象
 * @param amount - 数量
 * @param unit - 单位 (year, month, day, hour, minute, second, millisecond)
 * @returns 新的时间对象
 */
export function addTime(timeObj: TimeObject, amount: number, unit: TimeUnit): TimeObject {
  return timeLibraryFactory.getInstance().add(timeObj, amount, unit);
}

/**
 * 时间减法
 * @param timeObj - 时间对象
 * @param amount - 数量
 * @param unit - 单位
 * @returns 新的时间对象
 */
export function subtractTime(timeObj: TimeObject, amount: number, unit: TimeUnit): TimeObject {
  return timeLibraryFactory.getInstance().subtract(timeObj, amount, unit);
}

/**
 * 时间比较
 * @param timeObj1 - 时间对象1
 * @param timeObj2 - 时间对象2
 * @returns -1: timeObj1 < timeObj2, 0: 相等, 1: timeObj1 > timeObj2
 */
export function compareTime(timeObj1: TimeObject, timeObj2: TimeObject): number {
  return timeLibraryFactory.getInstance().compare(timeObj1, timeObj2);
}
/**
 * 转换时区
 * @param timeObj - 时间对象
 * @param timezone - 目标时区
 * @returns 转换后的时间对象
 */
export function convertToTimezone(timeObj: TimeObject, timezone: string): TimeObject {
  return timeLibraryFactory.getInstance().toTimezone(timeObj, timezone);
}

/**
 * 获取UTC偏移量（分钟）
 * @param timeObj - 时间对象
 * @returns UTC偏移量
 */
export function getUtcOffset(timeObj: TimeObject): number {
  return timeLibraryFactory.getInstance().getUtcOffset(timeObj);
}

/**
 * 获取年份
 * @param timeObj - 时间对象
 * @returns 年份
 */
export function getYear(timeObj: TimeObject, isDate: boolean = false): number {
  return timeLibraryFactory.getInstance().year(timeObj, isDate ? zoneConfig.systemZone : undefined);
}

/**
 * 获取月份（0-11）
 * @param timeObj - 时间对象
 * @param isDate - 是否根据系统时区调整
 * @returns 月份
 */
export function getMonth(timeObj: TimeObject, isDate: boolean = false): number {
  return timeLibraryFactory.getInstance().month(timeObj, isDate ? zoneConfig.systemZone : undefined);
}

/**
 * 获取日期（1-31）
 * @param timeObj - 时间对象
 * @param isDate - 是否根据系统时区调整
 * @returns 日期
 */
export function getDate(timeObj: TimeObject, isDate: boolean = false): number {
  return timeLibraryFactory.getInstance().date(timeObj, isDate ? zoneConfig.systemZone : undefined);
}

/**
 * 获取星期几（0-6，0表示星期日）
 * @param timeObj - 时间对象
 * @param isDate - 是否根据系统时区调整
 * @returns 星期几
 */
export function getDay(timeObj: TimeObject, isDate: boolean = false): number {
  return timeLibraryFactory.getInstance().day(timeObj, isDate ? zoneConfig.systemZone : undefined);
}

/**
 * 获取年份中的第几周
 * @param timeObj - 时间对象
 * @param isDate - 是否根据系统时区调整
 * @returns 周数
 */
export function getWeek(timeObj: TimeObject, isDate: boolean = false): number {
  return timeLibraryFactory.getInstance().week(timeObj, isDate ? zoneConfig.systemZone : undefined);
}

/**
 * 获取小时（0-23）
 * @param timeObj - 时间对象
 * @param isDate - 是否根据系统时区调整
 * @returns 小时
 */
export function getHour(timeObj: TimeObject, isDate: boolean = false): number {
  return timeLibraryFactory.getInstance().hour(timeObj, isDate ? zoneConfig.systemZone : undefined);
}

/**
 * 获取分钟（0-59）
 * @param timeObj - 时间对象
 * @returns 分钟
 */
export function getMinute(timeObj: TimeObject): number {
  return timeLibraryFactory.getInstance().minute(timeObj);
}

/**
 * 获取秒（0-59）
 * @param timeObj - 时间对象
 * @returns 秒
 */
export function getSecond(timeObj: TimeObject): number {
  return timeLibraryFactory.getInstance().second(timeObj);
}

/**
 * 获取毫秒（0-999）
 * @param timeObj - 时间对象
 * @returns 毫秒
 */
export function getMillisecond(timeObj: TimeObject): number {
  return timeLibraryFactory.getInstance().millisecond(timeObj);
}

/**
 * 设置年份
 * @param timeObj - 时间对象
 * @param value - 年份值
 * @returns 新的时间对象
 */
export function setYear(timeObj: TimeObject, value: number): TimeObject {
  return timeLibraryFactory.getInstance().setYear(timeObj, value);
}

/**
 * 设置月份（0-11）
 * @param timeObj - 时间对象
 * @param value - 月份值
 * @returns 新的时间对象
 */
export function setMonth(timeObj: TimeObject, value: number): TimeObject {
  return timeLibraryFactory.getInstance().setMonth(timeObj, value);
}

/**
 * 设置日期（1-31）
 * @param timeObj - 时间对象
 * @param value - 日期值
 * @returns 新的时间对象
 */
export function setDate(timeObj: TimeObject, value: number): TimeObject {
  return timeLibraryFactory.getInstance().setDate(timeObj, value);
}

/**
 * 设置小时（0-23）
 * @param timeObj - 时间对象
 * @param value - 小时值
 * @returns 新的时间对象
 */
export function setHour(timeObj: TimeObject, value: number): TimeObject {
  return timeLibraryFactory.getInstance().setHour(timeObj, value);
}

/**
 * 设置分钟（0-59）
 * @param timeObj - 时间对象
 * @param value - 分钟值
 * @returns 新的时间对象
 */
export function setMinute(timeObj: TimeObject, value: number): TimeObject {
  return timeLibraryFactory.getInstance().setMinute(timeObj, value);
}

/**
 * 设置秒（0-59）
 * @param timeObj - 时间对象
 * @param value - 秒值
 * @returns 新的时间对象
 */
export function setSecond(timeObj: TimeObject, value: number): TimeObject {
  return timeLibraryFactory.getInstance().setSecond(timeObj, value);
}

/**
 * 设置毫秒（0-999）
 * @param timeObj - 时间对象
 * @param value - 毫秒值
 * @returns 新的时间对象
 */
export function setMillisecond(timeObj: TimeObject, value: number): TimeObject {
  return timeLibraryFactory.getInstance().setMillisecond(timeObj, value);
}

/**
 * 获取当前月的开始时间
 * @param timeObj - 时间对象
 * @returns 月初时间对象
 */
export function startOfMonth(timeObj: TimeObject): TimeObject {
  return timeLibraryFactory.getInstance().startOfMonth(timeObj);
}

/**
 * 获取当前周的开始时间
 * @param timeObj - 时间对象
 * @returns 周初时间对象
 */
export function startOfWeek(timeObj: TimeObject): TimeObject {
  return timeLibraryFactory.getInstance().startOfWeek(timeObj);
}

/**
 * 获取当前周的结束时间
 * @param timeObj - 时间对象
 * @returns 周末时间对象
 */
export function endOfWeek(timeObj: TimeObject): TimeObject {
  return timeLibraryFactory.getInstance().endOfWeek(timeObj);
}

/**
 * 获取当前季度的开始时间
 * @param timeObj - 时间对象
 * @returns 季度初时间对象
 */
export function startOfQuarter(timeObj: TimeObject): TimeObject {
  return timeLibraryFactory.getInstance().startOfQuarter(timeObj);
}

/**
 * 获取当前年的开始时间
 * @param timeObj - 时间对象
 * @returns 年初时间对象
 */
export function startOfYear(timeObj: TimeObject): TimeObject {
  return timeLibraryFactory.getInstance().startOfYear(timeObj);
}

/**
 * 获取当前月的结束时间
 * @param timeObj - 时间对象
 * @returns 月末时间对象
 */
export function endOfMonth(timeObj: TimeObject): TimeObject {
  return timeLibraryFactory.getInstance().endOfMonth(timeObj);
}

/**
 * 获取当前日的开始时间
 * @param timeObj - 时间对象
 * @returns 日初时间对象
 */
export function startOfDay(timeObj: TimeObject): TimeObject {
  return timeLibraryFactory.getInstance().startOfDay(timeObj);
}

/**
 * 获取当前日的结束时间
 * @param timeObj - 时间对象
 * @returns 日末时间对象
 */
export function endOfDay(timeObj: TimeObject): TimeObject {
  return timeLibraryFactory.getInstance().endOfDay(timeObj);
}

/**
 * 判断是否为闰年
 * @param timeObj - 时间对象
 * @returns 是否为闰年
 */
export function isLeapYear(timeObj: TimeObject): boolean {
  return timeLibraryFactory.getInstance().isLeapYear(timeObj);
}

/**
 * 获取当前月的天数
 * @param timeObj - 时间对象
 * @returns 当前月的天数
 */
export function daysInMonth(timeObj: TimeObject): number {
  return timeLibraryFactory.getInstance().daysInMonth(timeObj);
}

/**
 * 判断是否为今天
 * @param timeObj - 时间对象
 * @returns 是否为今天
 */
export function isToday(timeObj: TimeObject): boolean {
  return timeLibraryFactory.getInstance().isToday(timeObj);
}

/**
 * 克隆时间对象
 * @param timeObj - 时间对象
 * @returns 克隆的时间对象
 */
export function cloneTime(timeObj: TimeObject): TimeObject {
  return timeLibraryFactory.getInstance().clone(timeObj);
}

/**
 * 获取星期几的名称数组
 * @param localOrder - 是否按本地顺序排列
 * @returns 星期几名称数组
 */
export function weekdays(localOrder?: boolean): string[] {
  return timeLibraryFactory.getInstance().weekdays(localOrder);
}

/**
 * 获取星期几的简短名称数组
 * @param localOrder - 是否按本地顺序排列
 * @returns 星期几简短名称数组
 */
export function weekdaysShort(localOrder?: boolean): string[] {
  return timeLibraryFactory.getInstance().weekdaysShort(localOrder);
}

/**
 * 获取星期几的最短名称数组
 * @param localOrder - 是否按本地顺序排列
 * @returns 星期几最短名称数组
 */
export function weekdaysMin(localOrder?: boolean): string[] {
  return timeLibraryFactory.getInstance().weekdaysMin(localOrder);
}

/**
 * 获取月份的简短名称数组
 * @returns 月份简短名称数组
 */
export function monthsShort(): string[] {
  return timeLibraryFactory.getInstance().monthsShort();
}

/**
 * 获取月份的名称数组
 * @returns 月份名称数组
 */
export function months(): string[] {
  return timeLibraryFactory.getInstance().months();
}

/**
 * 判断时间是否在指定时间之前
 * @param timeObj1 - 时间对象1
 * @param timeObj2 - 时间对象2
 * @returns 是否在之前
 */
export function isBefore(timeObj1: TimeObject, timeObj2: TimeObject): boolean {
  return timeLibraryFactory.getInstance().isBefore(timeObj1, timeObj2);
}

/**
 * 判断时间是否在指定时间之后
 * @param timeObj1 - 时间对象1
 * @param timeObj2 - 时间对象2
 * @returns 是否在之后
 */
export function isAfter(timeObj1: TimeObject, timeObj2: TimeObject): boolean {
  return timeLibraryFactory.getInstance().isAfter(timeObj1, timeObj2);
}

/**
 * 判断两个时间是否相同
 * @param timeObj1 - 时间对象1
 * @param timeObj2 - 时间对象2
 * @returns 是否相同
 */
export function isSame(timeObj1: TimeObject, timeObj2: TimeObject): boolean {
  return timeLibraryFactory.getInstance().isSame(timeObj1, timeObj2);
}

/**
 * 计算两个时间的差值
 * @param timeObj1 - 时间对象1
 * @param timeObj2 - 时间对象2
 * @param unit - 单位（year, month, day, hour, minute, second, millisecond）
 * @param precise - 是否精确计算（包含小数部分）
 * @returns 时间差值
 */
export function diff(timeObj1: TimeObject, timeObj2: TimeObject, unit?: TimeUnit, precise?: boolean): number {
  return timeLibraryFactory.getInstance().diff(timeObj1, timeObj2, unit, precise);
}

/**
 * 判断时间对象是否有效
 * @param timeObj - 时间对象
 * @returns 是否为有效时间
 */
export function isValid(timeObj: TimeObject): boolean {
  return timeLibraryFactory.getInstance().isValid(timeObj);
}

/**
 * 获取 unix 时间戳（秒）
 * @param timeObj - 时间对象
 * @returns unix 时间戳（秒）
 */
export function unix(timeObj: TimeObject): number {
  return timeLibraryFactory.getInstance().unix(timeObj);
}

/**
 * 导出时间库类型常量，供应用层使用
 */
export { TimeLibraryType };
export type { TimeLibraryTypeValue, TimeUnit, TimeObject };

/**
 * 时间实例类，支持链式调用
 */
export class TimeInstance {
  private timeObj: TimeObject;

  constructor(timeObj: TimeObject) {
    this.timeObj = timeObj;
  }

  /**
   * 转换为UTC时间
   */
  utc(): TimeInstance {
    const utcTimeObj: TimeObject = timeLibraryFactory.getInstance().createUtc(this.timeObj);
    return new TimeInstance(utcTimeObj);
  }

  /**
   * 获取UTC偏移量（分钟）
   */
  utcOffset(): number {
    return getUtcOffset(this.timeObj);
  }

  /**
   * 格式化
   */
  format(format?: string, isDate: boolean = false, timezone?: string): string {
    return formatTime(this.timeObj, format, isDate, timezone);
  }

  /**
   * 加法
   */
  add(amount: number, unit: TimeUnit): TimeInstance {
    this.timeObj = addTime(this.timeObj, amount, unit);
    return this;
  }

  /**
   * 减法
   */
  subtract(amount: number, unit: TimeUnit): TimeInstance {
    this.timeObj = subtractTime(this.timeObj, amount, unit);
    return this;
  }

  /**
   * 转换时区
   */
  tz(timezone: string): TimeInstance {
    this.timeObj = convertToTimezone(this.timeObj, timezone);
    return this;
  }

  /**
   * 比较
   */
  compare(other: TimeInstance | TimeObject): number {
    const otherTimeObj: TimeObject = other instanceof TimeInstance ? other.timeObj : other;
    return compareTime(this.timeObj, otherTimeObj);
  }

  /**
   * 获取时间戳
   */
  valueOf(isDate: boolean = false): number {
    return getTime(this.timeObj, isDate);
  }

  /**
   * 获取原始时间对象
   */
  toObject(): TimeObject {
    return this.timeObj;
  }

  /**
   * 获取年份
   */
  getYear(isDate: boolean = false): number {
    return getYear(this.timeObj, isDate);
  }

  /**
   * 获取月份（0-11）
   */
  getMonth(isDate: boolean = false): number {
    return getMonth(this.timeObj, isDate);
  }

  /**
   * 获取日期（1-31）
   */
  getDate(isDate: boolean = false): number {
    return getDate(this.timeObj, isDate);
  }

  /**
   * 获取星期几（0-6，0表示星期日）
   */
  getDay(isDate: boolean = false): number {
    return getDay(this.timeObj, isDate);
  }

  /**
   * 获取年份中的第几周
   */
  getWeek(isDate: boolean = false): number {
    return getWeek(this.timeObj, isDate);
  }

  /**
   * 获取小时（0-23）
   */
  getHour(isDate: boolean = false): number {
    return getHour(this.timeObj, isDate);
  }

  /**
   * 获取分钟（0-59）
   */
  getMinute(): number {
    return getMinute(this.timeObj);
  }

  /**
   * 获取秒（0-59）
   */
  getSecond(): number {
    return getSecond(this.timeObj);
  }

  /**
   * 获取毫秒（0-999）
   */
  getMillisecond(): number {
    return getMillisecond(this.timeObj);
  }

  /**
   * 设置年份
   */
  year(value: number): TimeInstance {
    this.timeObj = setYear(this.timeObj, value);
    return this;
  }

  /**
   * 设置月份（0-11）
   */
  month(value: number): TimeInstance {
    this.timeObj = setMonth(this.timeObj, value);
    return this;
  }

  /**
   * 设置日期（1-31）
   */
  date(value: number): TimeInstance {
    this.timeObj = setDate(this.timeObj, value);
    return this;
  }

  /**
   * 设置小时（0-23）
   */
  hour(value: number): TimeInstance {
    this.timeObj = setHour(this.timeObj, value);
    return this;
  }

  /**
   * 设置分钟（0-59）
   */
  minute(value: number): TimeInstance {
    this.timeObj = setMinute(this.timeObj, value);
    return this;
  }

  /**
   * 设置秒（0-59）
   */
  second(value: number): TimeInstance {
    this.timeObj = setSecond(this.timeObj, value);
    return this;
  }

  /**
   * 设置毫秒（0-999）
   */
  millisecond(value: number): TimeInstance {
    this.timeObj = setMillisecond(this.timeObj, value);
    return this;
  }

  /**
   * 获取当前月的开始时间
   */
  startOfMonth(): TimeInstance {
    this.timeObj = startOfMonth(this.timeObj);
    return this;
  }

  /**
   * 获取本周的开始时间（星期日 00:00:00）
   */
  startOfWeek(): TimeInstance {
    const newTimeObj = startOfWeek(this.timeObj);
    return new TimeInstance(newTimeObj);
  }

  /**
   * 获取本周的结束时间（星期六 23:59:59.999）
   */
  endOfWeek(): TimeInstance {
    const newTimeObj = endOfWeek(this.timeObj);
    return new TimeInstance(newTimeObj);
  }

  /**
   * 获取当前季度的开始时间
   */
  startOfQuarter(): TimeInstance {
    const newTimeObj = startOfQuarter(this.timeObj);
    return new TimeInstance(newTimeObj);
  }

  /**
   * 获取当前年的开始时间
   */
  startOfYear(): TimeInstance {
    const newTimeObj = startOfYear(this.timeObj);
    return new TimeInstance(newTimeObj);
  }

  /**
   * 获取当前月的结束时间
   */
  endOfMonth(): TimeInstance {
    this.timeObj = endOfMonth(this.timeObj);
    return this;
  }

  /**
   * 获取当前日的开始时间
   */
  startOfDay(): TimeInstance {
    this.timeObj = startOfDay(this.timeObj);
    return this;
  }

  /**
   * 获取当前日的结束时间
   */
  endOfDay(): TimeInstance {
    this.timeObj = endOfDay(this.timeObj);
    return this;
  }

  /**
   * 判断是否为闰年
   */
  isLeapYear(): boolean {
    return isLeapYear(this.timeObj);
  }

  /**
   * 获取当前月的天数
   */
  getDaysInMonth(): number {
    return daysInMonth(this.timeObj);
  }

  /**
   * 判断是否为今天
   */
  isToday(): boolean {
    return isToday(this.timeObj);
  }

  /**
   * 判断时间是否在指定时间之前
   */
  isBefore(other: TimeInstance | TimeObject): boolean {
    const otherTimeObj: TimeObject = other instanceof TimeInstance ? other.timeObj : other;
    return isBefore(this.timeObj, otherTimeObj);
  }

  /**
   * 判断时间是否在指定时间之后
   */
  isAfter(other: TimeInstance | TimeObject): boolean {
    const otherTimeObj: TimeObject = other instanceof TimeInstance ? other.timeObj : other;
    return isAfter(this.timeObj, otherTimeObj);
  }

  /**
   * 判断两个时间是否相同
   */
  isSame(other: TimeInstance | TimeObject): boolean {
    const otherTimeObj: TimeObject = other instanceof TimeInstance ? other.timeObj : other;
    return isSame(this.timeObj, otherTimeObj);
  }

  /**
   * 判断时间对象是否有效
   */
  isValid(): boolean {
    return isValid(this.timeObj);
  }

  unix(): number {
    return unix(this.timeObj);
  }

  /**
   * 计算与另一个时间的差值
   * @param other - 另一个时间对象
   * @param unit - 单位（year, month, day, hour, minute, second, millisecond）
   * @param precise - 是否精确计算（包含小数部分）
   * @returns 时间差值
   */
  diff(other: TimeInstance | TimeObject, unit?: TimeUnit, precise?: boolean): number {
    const otherTimeObj: TimeObject = other instanceof TimeInstance ? other.timeObj : other;
    return diff(this.timeObj, otherTimeObj, unit, precise);
  }

  /**
   * 转为 ISO 字符串
   */
  toISOString(): string {
    return timeLibraryFactory.getInstance().toISOString(this.timeObj);
  }

  /**
   * 克隆时间实例
   * @returns 克隆的时间实例
   */
  clone(): TimeInstance {
    const clonedTimeObj = timeLibraryFactory.getInstance().clone(this.timeObj);
    return new TimeInstance(clonedTimeObj);
  }
}

/**
 * 便捷的时间操作对象
 * 提供链式调用的方式
 */
export const TimeUtils = {
  /**
   * 创建时间工具实例
   * @param input - 输入时间
   * @param timezone - 时区
   * @returns 时间工具实例
   */
  create(input?: string | number | Date, formatOrOptions?: string | object, timezone?: string): TimeInstance {
    const timeObj: TimeObject = createTime(input, formatOrOptions, timezone);
    return new TimeInstance(timeObj);
  },

  /**
   * 获取当前时间工具实例
   * @param timezone - 时区
   * @returns 时间工具实例
   */
  now(timezone?: string): TimeInstance {
    const timeObj: TimeObject = now(timezone);
    return new TimeInstance(timeObj);
  },

  /**
   * 获取星期几的名称数组
   * @param localOrder - 是否按本地顺序排列
   * @returns 星期几名称数组
   */
  weekdays(localOrder?: boolean): string[] {
    return weekdays(localOrder);
  },

  /**
   * 获取星期几的简短名称数组
   * @param localOrder - 是否按本地顺序排列
   * @returns 星期几简短名称数组
   */
  weekdaysShort(localOrder?: boolean): string[] {
    return weekdaysShort(localOrder);
  },

  /**
   * 获取星期几的最短名称数组
   * @param localOrder - 是否按本地顺序排列
   * @returns 星期几最短名称数组
   */
  weekdaysMin(localOrder?: boolean): string[] {
    return weekdaysMin(localOrder);
  },

  /**
   * 获取月份的简短名称数组
   * @returns 月份简短名称数组
   */
  monthsShort(): string[] {
    return monthsShort();
  },

  /**
   * 获取月份的名称数组
   * @returns 月份名称数组
   */
  months(): string[] {
    return months();
  },

  /**
   * 当前全局本地化设置
   * @returns 当前本地化字符串
   */
  locale(localeStr?: string): string {
    return locale(localeStr);
  },
};
