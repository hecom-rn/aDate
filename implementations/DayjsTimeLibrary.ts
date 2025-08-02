import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ITimeLibrary, TimeUnit, TimeObject } from '../interfaces/ITimeLibrary';
import { zoneConfig } from '../config';

// 启用插件
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekOfYear);
dayjs.extend(quarterOfYear);
dayjs.extend(customParseFormat);

/**
 * Dayjs 时间库实现
 */
export class DayjsTimeLibrary extends ITimeLibrary {
  private lib: typeof dayjs;

  constructor() {
    super();
    this.lib = dayjs;
  }

  /**
   * 获取时间戳（毫秒）
   */
  getTime(timeObj: TimeObject, isDate: boolean = false): number {
    const targetTime: Dayjs = timeObj.tz ? timeObj.tz(zoneConfig.timezone) : timeObj;

    if (isDate) {
      // 计算时区差（分钟）
      const currentOffset: number = targetTime.utcOffset();
      const systemOffset: number = timeObj.tz(zoneConfig.systemZone).utcOffset();
      const offsetDiff: number = currentOffset - systemOffset;

      // 调整时间戳
      return targetTime.valueOf() + offsetDiff * 60 * 1000;
    }

    return targetTime.valueOf();
  }

  /**
   * 创建时间对象
   */
  create(input?: string | number | Date, formatOrOptions?: string | object, timezone?: string): TimeObject {
    if (timezone) {
      return this.lib(input, formatOrOptions).tz(timezone);
    }
    return this.lib(input, formatOrOptions);
  }

  /**
   * 创建UTC时间对象
   */
  createUtc(input?: string | number | Date): TimeObject {
    return this.lib.utc(input);
  }

  /**
   * 格式化时间
   */
  format(timeObj: TimeObject, format: string, timezone?: string): string {
    if (timezone) {
      return timeObj.tz(timezone).format(format);
    }
    return timeObj.format(format);
  }

  /**
   * 解析时间字符串
   */
  parse(timeStr: string, format?: string, timezone?: string): TimeObject {
    let parsed: Dayjs;
    if (format) {
      parsed = this.lib(timeStr, format);
    } else {
      parsed = this.lib(timeStr);
    }

    if (timezone) {
      return parsed.tz(timezone);
    }
    return parsed;
  }

  /**
   * 时间加法
   */
  add(timeObj: TimeObject, amount: number, unit: TimeUnit): TimeObject {
    return timeObj.add(amount, unit);
  }

  /**
   * 时间减法
   */
  subtract(timeObj: TimeObject, amount: number, unit: TimeUnit): TimeObject {
    return timeObj.subtract(amount, unit);
  }

  /**
   * 时间比较
   */
  compare(timeObj1: TimeObject, timeObj2: TimeObject): number {
    const time1: number = timeObj1.valueOf();
    const time2: number = timeObj2.valueOf();

    if (time1 < time2) return -1;
    if (time1 > time2) return 1;
    return 0;
  }

  /**
   * 获取时间戳
   */
  valueOf(timeObj: TimeObject): number {
    return timeObj.valueOf();
  }

  /**
   * 设置默认时区
   */
  setDefaultTimezone(timezone: string): void {
    zoneConfig.timezone = timezone;
    this.lib.tz.setDefault(timezone);
  }

  /**
   * 设置系统时区
   */
  setSystemTimezone(timezone: string): void {
    zoneConfig.systemZone = timezone;
  }

  /**
   * 转换时区
   */
  toTimezone(timeObj: TimeObject, timezone: string): TimeObject {
    return timeObj.tz(timezone);
  }

  /**
   * 获取UTC偏移量（分钟）
   */
  getUtcOffset(timeObj: TimeObject): number {
    return timeObj.utcOffset();
  }

  /**
   * 获取年份
   */
  year(timeObj: TimeObject, timezone?: string): number {
    if (timezone) {
      return timeObj.tz(timezone).year();
    }
    return timeObj.year();
  }

  /**
   * 获取月份（0-11）
   */
  month(timeObj: TimeObject, timezone?: string): number {
    if (timezone) {
      return timeObj.tz(timezone).month();
    }
    return timeObj.month(); // dayjs 月份是 0-11，直接返回
  }

  /**
   * 获取日期（1-31）
   */
  date(timeObj: TimeObject, timezone?: string): number {
    if (timezone) {
      return timeObj.tz(timezone).date();
    }
    return timeObj.date();
  }

  /**
   * 获取星期几（0-6，0表示星期日）
   */
  day(timeObj: TimeObject, timezone?: string): number {
    if (timezone) {
      return timeObj.tz(timezone).day();
    }
    return timeObj.day();
  }

  /**
   * 获取年份中的第几周
   */
  week(timeObj: TimeObject, timezone?: string): number {
    if (timezone) {
      return timeObj.tz(timezone).week();
    }
    return timeObj.week();
  }

  /**
   * 获取小时（0-23）
   */
  hour(timeObj: TimeObject, timezone?: string): number {
    if (timezone) {
      return timeObj.tz(timezone).hour();
    }
    return timeObj.hour();
  }

  /**
   * 获取分钟（0-59）
   */
  minute(timeObj: TimeObject): number {
    return timeObj.minute();
  }

  /**
   * 获取秒（0-59）
   */
  second(timeObj: TimeObject): number {
    return timeObj.second();
  }

  /**
   * 获取毫秒（0-999）
   */
  millisecond(timeObj: TimeObject): number {
    return timeObj.millisecond();
  }

  /**
   * 设置年份
   */
  setYear(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.year(value);
  }

  /**
   * 设置月份（0-11）
   */
  setMonth(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.month(value); // dayjs 月份是 0-11，直接设置
  }

  /**
   * 设置日期（1-31）
   */
  setDate(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.date(value);
  }

  /**
   * 设置小时（0-23）
   */
  setHour(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.hour(value);
  }

  /**
   * 设置分钟（0-59）
   */
  setMinute(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.minute(value);
  }

  /**
   * 设置秒（0-59）
   */
  setSecond(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.second(value);
  }

  /**
   * 设置毫秒（0-999）
   */
  setMillisecond(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.millisecond(value);
  }

  /**
   * 获取当前月的开始时间
   */
  startOfMonth(timeObj: TimeObject): TimeObject {
    return timeObj.startOf('month');
  }

  /**
   * 获取当前月的结束时间
   */
  endOfMonth(timeObj: TimeObject): TimeObject {
    return timeObj.endOf('month');
  }

  /**
   * 获取当前日的开始时间
   */
  startOfDay(timeObj: TimeObject): TimeObject {
    return timeObj.startOf('day');
  }

  /**
   * 获取当前日的结束时间
   */
  endOfDay(timeObj: TimeObject): TimeObject {
    return timeObj.endOf('day');
  }

  /**
   * 获取当前周的开始时间
   */
  startOfWeek(timeObj: TimeObject): TimeObject {
    return timeObj.startOf('week');
  }

  /**
   * 获取当前周的结束时间
   */
  endOfWeek(timeObj: TimeObject): TimeObject {
    return timeObj.endOf('week');
  }

  /**
   * 获取当前季度的开始时间
   */
  startOfQuarter(timeObj: TimeObject): TimeObject {
    return timeObj.startOf('quarter');
  }

  /**
   * 获取当前年的开始时间
   */
  startOfYear(timeObj: TimeObject): TimeObject {
    return timeObj.startOf('year');
  }

  /**
   * 判断是否为闰年
   */
  isLeapYear(timeObj: TimeObject): boolean {
    const year: number = timeObj.year();
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /**
   * 获取当前月的天数
   */
  daysInMonth(timeObj: TimeObject): number {
    return timeObj.daysInMonth();
  }

  /**
   * 判断是否为今天
   */
  isToday(timeObj: TimeObject): boolean {
    return timeObj.isSame(this.lib(), 'day');
  }

  /**
   * 判断时间是否在指定时间之前
   */
  isBefore(timeObj1: TimeObject, timeObj2: TimeObject): boolean {
    return timeObj1.isBefore(timeObj2);
  }

  /**
   * 判断时间是否在指定时间之后
   */
  isAfter(timeObj1: TimeObject, timeObj2: TimeObject): boolean {
    return timeObj1.isAfter(timeObj2);
  }

  /**
   * 判断两个时间是否相同
   */
  isSame(timeObj1: TimeObject, timeObj2: TimeObject): boolean {
    return timeObj1.isSame(timeObj2);
  }

  /**
   * 计算两个时间的差值
   */
  diff(timeObj1: TimeObject, timeObj2: TimeObject, unit?: TimeUnit, precise?: boolean): number {
    return timeObj1.diff(timeObj2, unit, precise);
  }

  /**
   * 判断时间对象是否有效
   */
  isValid(timeObj: TimeObject): boolean {
    return timeObj.isValid();
  }

  /**
   * 获取 unix 时间戳（秒）
   */
  unix(timeObj: TimeObject): number {
    return timeObj.unix();
  }

  /**
   * 转为 ISO 字符串
   */
  toISOString(timeObj: TimeObject): string {
    return timeObj.toISOString();
  }
}
