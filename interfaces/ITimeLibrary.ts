/**
 * 时间单位类型
 */
export type TimeUnit = 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

/**
 * 时间对象类型（通用）
 */
export type TimeObject = any;

/**
 * 时间库抽象接口
 * 定义了所有时间库实现必须遵循的统一接口
 */
export abstract class ITimeLibrary {
  /**
   * 获取当前时间戳（毫秒）
   * @param timeObj - 时间对象
   * @param isDate - 是否根据系统时区调整时间戳
   * @returns 时间戳
   */
  abstract getTime(timeObj: TimeObject, isDate?: boolean): number;

  /**
   * 创建时间对象
   * @param input - 输入时间
   * @param timezone - 时区
   * @returns 时间对象
   */
  abstract create(input?: string | number | Date, timezone?: string): TimeObject;

  /**
   * 创建UTC时间对象
   * @param input - 输入时间
   * @returns UTC时间对象
   */
  abstract createUtc(input?: string | number | Date): TimeObject;

  /**
   * 格式化时间
   * @param timeObj - 时间对象
   * @param format - 格式字符串
   * @param timezone - 时区
   * @returns 格式化后的时间字符串
   */
  abstract format(timeObj: TimeObject, format: string, timezone?: string): string;

  /**
   * 解析时间字符串
   * @param timeStr - 时间字符串
   * @param format - 格式字符串
   * @param timezone - 时区
   * @returns 时间对象
   */
  abstract parse(timeStr: string, format?: string, timezone?: string): TimeObject;

  /**
   * 时间加法
   * @param timeObj - 时间对象
   * @param amount - 数量
   * @param unit - 单位 (year, month, day, hour, minute, second, millisecond)
   * @returns 新的时间对象
   */
  abstract add(timeObj: TimeObject, amount: number, unit: TimeUnit): TimeObject;

  /**
   * 时间减法
   * @param timeObj - 时间对象
   * @param amount - 数量
   * @param unit - 单位
   * @returns 新的时间对象
   */
  abstract subtract(timeObj: TimeObject, amount: number, unit: TimeUnit): TimeObject;

  /**
   * 时间比较
   * @param timeObj1 - 时间对象1
   * @param timeObj2 - 时间对象2
   * @returns -1: timeObj1 < timeObj2, 0: 相等, 1: timeObj1 > timeObj2
   */
  abstract compare(timeObj1: TimeObject, timeObj2: TimeObject): number;

  /**
   * 获取时间戳
   * @param timeObj - 时间对象
   * @returns 时间戳（毫秒）
   */
  abstract valueOf(timeObj: TimeObject): number;

  /**
   * 设置默认时区
   * @param timezone - 时区名称
   */
  abstract setDefaultTimezone(timezone: string): void;

  /**
   * 设置系统时区
   * @param timezone - 时区名称
   */
  abstract setSystemTimezone(timezone: string): void;

  /**
   * 转换时区
   * @param timeObj - 时间对象
   * @param timezone - 目标时区
   * @returns 转换后的时间对象
   */
  abstract toTimezone(timeObj: TimeObject, timezone: string): TimeObject;

  /**
   * 获取UTC偏移量（分钟）
   * @param timeObj - 时间对象
   * @returns UTC偏移量
   */
  abstract getUtcOffset(timeObj: TimeObject): number;

  /**
   * 获取年份
   * @param timeObj - 时间对象
   * @returns 年份
   */
  abstract year(timeObj: TimeObject, timezone?: string): number;

  /**
   * 获取月份（0-11）
   * @param timeObj - 时间对象
   * @returns 月份
   */
  abstract month(timeObj: TimeObject, timezone?: string): number;

  /**
   * 获取日期（1-31）
   * @param timeObj - 时间对象
   * @returns 日期
   */
  abstract date(timeObj: TimeObject, timezone?: string): number;

  /**
   * 获取星期几（0-6，0表示星期日）
   * @param timeObj - 时间对象
   * @returns 星期几
   */
  abstract day(timeObj: TimeObject, timezone?: string): number;

  /**
   * 获取年份中的第几周
   * @param timeObj - 时间对象
   * @returns 周数
   */
  abstract week(timeObj: TimeObject, timezone?: string): number;

  /**
   * 获取小时（0-23）
   * @param timeObj - 时间对象
   * @returns 小时
   */
  abstract hour(timeObj: TimeObject, timezone?: string): number;

  /**
   * 获取分钟（0-59）
   * @param timeObj - 时间对象
   * @returns 分钟
   */
  abstract minute(timeObj: TimeObject): number;

  /**
   * 获取秒（0-59）
   * @param timeObj - 时间对象
   * @returns 秒
   */
  abstract second(timeObj: TimeObject): number;

  /**
   * 获取毫秒（0-999）
   * @param timeObj - 时间对象
   * @returns 毫秒
   */
  abstract millisecond(timeObj: TimeObject): number;

  /**
   * 设置年份
   * @param timeObj - 时间对象
   * @param value - 年份值
   * @returns 新的时间对象
   */
  abstract setYear(timeObj: TimeObject, value: number): TimeObject;

  /**
   * 设置月份（0-11）
   * @param timeObj - 时间对象
   * @param value - 月份值
   * @returns 新的时间对象
   */
  abstract setMonth(timeObj: TimeObject, value: number): TimeObject;

  /**
   * 设置日期（1-31）
   * @param timeObj - 时间对象
   * @param value - 日期值
   * @returns 新的时间对象
   */
  abstract setDate(timeObj: TimeObject, value: number): TimeObject;

  /**
   * 设置小时（0-23）
   * @param timeObj - 时间对象
   * @param value - 小时值
   * @returns 新的时间对象
   */
  abstract setHour(timeObj: TimeObject, value: number): TimeObject;

  /**
   * 设置分钟（0-59）
   * @param timeObj - 时间对象
   * @param value - 分钟值
   * @returns 新的时间对象
   */
  abstract setMinute(timeObj: TimeObject, value: number): TimeObject;

  /**
   * 设置秒（0-59）
   * @param timeObj - 时间对象
   * @param value - 秒值
   * @returns 新的时间对象
   */
  abstract setSecond(timeObj: TimeObject, value: number): TimeObject;

  /**
   * 设置毫秒（0-999）
   * @param timeObj - 时间对象
   * @param value - 毫秒值
   * @returns 新的时间对象
   */
  abstract setMillisecond(timeObj: TimeObject, value: number): TimeObject;

  /**
   * 获取当前月的开始时间
   * @param timeObj - 时间对象
   * @returns 月初时间对象
   */
  abstract startOfMonth(timeObj: TimeObject): TimeObject;

  /**
   * 获取当前月的结束时间
   * @param timeObj - 时间对象
   * @returns 月末时间对象
   */
  abstract endOfMonth(timeObj: TimeObject): TimeObject;

  /**
   * 获取当前日的开始时间
   * @param timeObj - 时间对象
   * @returns 日初时间对象
   */
  abstract startOfDay(timeObj: TimeObject): TimeObject;

  /**
   * 获取当前日的结束时间
   * @param timeObj - 时间对象
   * @returns 日末时间对象
   */
  abstract endOfDay(timeObj: TimeObject): TimeObject;

  /**
   * 获取当前周的开始时间
   * @param timeObj - 时间对象
   * @returns 周初时间对象
   */
  abstract startOfWeek(timeObj: TimeObject): TimeObject;

  /**
   * 获取当前周的结束时间
   * @param timeObj - 时间对象
   * @returns 周末时间对象
   */
  abstract endOfWeek(timeObj: TimeObject): TimeObject;

  /**
   * 获取当前季度的开始时间
   * @param timeObj - 时间对象
   * @returns 季度初时间对象
   */
  abstract startOfQuarter(timeObj: TimeObject): TimeObject;

  /**
   * 获取当前年的开始时间
   * @param timeObj - 时间对象
   * @returns 年初时间对象
   */
  abstract startOfYear(timeObj: TimeObject): TimeObject;

  /**
   * 判断是否为闰年
   * @param timeObj - 时间对象
   * @returns 是否为闰年
   */
  abstract isLeapYear(timeObj: TimeObject): boolean;

  /**
   * 获取当前月的天数
   * @param timeObj - 时间对象
   * @returns 当前月的天数
   */
  abstract daysInMonth(timeObj: TimeObject): number;

  /**
   * 判断是否为今天
   * @param timeObj - 时间对象
   * @returns 是否为今天
   */
  abstract isToday(timeObj: TimeObject): boolean;

  /**
   * 判断时间是否在指定时间之前
   * @param timeObj1 - 时间对象1
   * @param timeObj2 - 时间对象2
   * @returns 是否在之前
   */
  abstract isBefore(timeObj1: TimeObject, timeObj2: TimeObject): boolean;

  /**
   * 判断时间是否在指定时间之后
   * @param timeObj1 - 时间对象1
   * @param timeObj2 - 时间对象2
   * @returns 是否在之后
   */
  abstract isAfter(timeObj1: TimeObject, timeObj2: TimeObject): boolean;

  /**
   * 判断两个时间是否相同
   * @param timeObj1 - 时间对象1
   * @param timeObj2 - 时间对象2
   * @returns 是否相同
   */
  abstract isSame(timeObj1: TimeObject, timeObj2: TimeObject): boolean;
}
