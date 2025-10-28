import moment, { Moment } from 'moment-timezone';
import { ITimeLibrary, TimeUnit, TimeObject } from '../interfaces/ITimeLibrary';
import { zoneConfig } from '../config';
import 'moment/locale/zh-cn';

/**
 * Moment 时间库实现
 */
export class MomentTimeLibrary extends ITimeLibrary {
  private lib: typeof moment;

  constructor() {
    super();
    this.lib = moment;
  }

  /** 获取时间戳（毫秒） */
  getTime(timeObj: TimeObject, isDate: boolean = false): number {
    const targetTime: Moment = timeObj.tz ? timeObj.clone().tz(zoneConfig.timezone) : timeObj;
    if (isDate) {
      const currentOffset: number = targetTime.utcOffset();
      const systemOffset: number = timeObj.clone().tz(zoneConfig.systemZone).utcOffset();
      const offsetDiff: number = currentOffset - systemOffset; // 分钟
      return targetTime.valueOf() + offsetDiff * 60 * 1000;
    }
    return targetTime.valueOf();
  }

  /** 创建时间对象 */
  create(input?: string | number | Date, formatOrOptions?: string | object, timezone?: string): TimeObject {
    if (timezone) {
        return this.lib.tz(input as any, formatOrOptions as any, timezone);
    }
    if (typeof formatOrOptions === 'string') {
      return this.lib(input as any, formatOrOptions);
    }
    return this.lib(input as any);
  }

  /** 创建UTC时间对象 */
  createUtc(timeObj: TimeObject, input?: string | number | Date): TimeObject {
    if (timeObj) {
      return timeObj.clone().utc();
    }
    return this.lib.utc(input as any);
  }

  /** 格式化时间 */
  format(timeObj: TimeObject, format?: string, timezone?: string): string {
    if (timezone) {
      return timeObj.clone().tz(timezone).format(format);
    }
    return timeObj.format(format);
  }

  /** 解析时间字符串 */
  parse(timeStr: string, format?: string, timezone?: string): TimeObject {
    let parsed: Moment;
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

  /** 时间加法 */
  add(timeObj: TimeObject, amount: number, unit: TimeUnit): TimeObject {
    return timeObj.clone().add(amount, unit as moment.unitOfTime.DurationConstructor);
  }

  /** 时间减法 */
  subtract(timeObj: TimeObject, amount: number, unit: TimeUnit): TimeObject {
    return timeObj.clone().subtract(amount, unit as moment.unitOfTime.DurationConstructor);
  }

  /** 时间比较 */
  compare(timeObj1: TimeObject, timeObj2: TimeObject): number {
    const time1 = timeObj1.valueOf();
    const time2 = timeObj2.valueOf();
    if (time1 < time2) return -1;
    if (time1 > time2) return 1;
    return 0;
  }

  /** 获取时间戳 */
  valueOf(timeObj: TimeObject): number {
    return timeObj.valueOf();
  }

  /** 设置默认时区 */
  setDefaultTimezone(timezone: string): void {
    zoneConfig.timezone = timezone;
    this.lib.tz.setDefault(timezone);
  }

  /** 设置系统时区 */
  setSystemTimezone(timezone: string): void {
    zoneConfig.systemZone = timezone;
  }

  /** 转换时区 */
  toTimezone(timeObj: TimeObject, timezone: string): TimeObject {
    return timeObj.clone().tz(timezone);
  }

  /** 获取UTC偏移量（分钟） */
  getUtcOffset(timeObj: TimeObject): number {
    return timeObj.utcOffset();
  }

  /** 获取年份 */
  year(timeObj: TimeObject, timezone?: string): number {
    if (timezone) return timeObj.clone().tz(timezone).year();
    return timeObj.year();
  }

  /** 获取月份（0-11） */
  month(timeObj: TimeObject, timezone?: string): number {
    if (timezone) return timeObj.clone().tz(timezone).month();
    return timeObj.month();
  }

  /** 获取日期（1-31） */
  date(timeObj: TimeObject, timezone?: string): number {
    if (timezone) return timeObj.clone().tz(timezone).date();
    return timeObj.date();
  }

  /** 获取星期几（0-6，0表示星期日） */
  day(timeObj: TimeObject, timezone?: string): number {
    if (timezone) return timeObj.clone().tz(timezone).day();
    return timeObj.day();
  }

  /** 获取年份中的第几周 */
  week(timeObj: TimeObject, timezone?: string): number {
    if (timezone) return timeObj.clone().tz(timezone).week();
    return timeObj.week();
  }

  /** 获取小时（0-23） */
  hour(timeObj: TimeObject, timezone?: string): number {
    if (timezone) return timeObj.clone().tz(timezone).hour();
    return timeObj.hour();
  }

  /** 获取分钟（0-59） */
  minute(timeObj: TimeObject, timezone?: string): number {
    if (timezone) return timeObj.clone().tz(timezone).minute();
    return timeObj.minute();
  }

  /** 获取秒（0-59） */
  second(timeObj: TimeObject): number {
    return timeObj.second();
  }

  /** 获取毫秒（0-999） */
  millisecond(timeObj: TimeObject): number {
    return timeObj.millisecond();
  }

  /** 设置年份 */
  setYear(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.clone().year(value);
  }

  /** 设置月份（0-11） */
  setMonth(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.clone().month(value);
  }

  /** 设置日期（1-31） */
  setDate(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.clone().date(value);
  }

  /** 设置小时（0-23） */
  setHour(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.clone().hour(value);
  }

  /** 设置分钟（0-59） */
  setMinute(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.clone().minute(value);
  }

  /** 设置秒（0-59） */
  setSecond(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.clone().second(value);
  }

  /** 设置毫秒（0-999） */
  setMillisecond(timeObj: TimeObject, value: number): TimeObject {
    return timeObj.clone().millisecond(value);
  }

  /** 获取当前月的开始时间 */
  startOfMonth(timeObj: TimeObject): TimeObject {
    return timeObj.clone().startOf('month');
  }

  /** 获取当前月的结束时间 */
  endOfMonth(timeObj: TimeObject): TimeObject {
    return timeObj.clone().endOf('month');
  }

  /** 获取当前日的开始时间 */
  startOfDay(timeObj: TimeObject): TimeObject {
    return timeObj.clone().startOf('day');
  }

  /** 获取当前日的结束时间 */
  endOfDay(timeObj: TimeObject): TimeObject {
    return timeObj.clone().endOf('day');
  }

  /** 获取当前周的开始时间 */
  startOfWeek(timeObj: TimeObject): TimeObject {
    return timeObj.clone().startOf('week');
  }

  /** 获取当前周的结束时间 */
  endOfWeek(timeObj: TimeObject): TimeObject {
    return timeObj.clone().endOf('week');
  }

  /** 获取当前季度的开始时间 */
  startOfQuarter(timeObj: TimeObject): TimeObject {
    return timeObj.clone().startOf('quarter');
  }

  /** 获取当前年的开始时间 */
  startOfYear(timeObj: TimeObject): TimeObject {
    return timeObj.clone().startOf('year');
  }

  /** 判断是否为闰年 */
  isLeapYear(timeObj: TimeObject): boolean {
    const year = timeObj.year();
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /** 获取当前月的天数 */
  daysInMonth(timeObj: TimeObject): number {
    return timeObj.daysInMonth();
  }

  /** 判断是否为今天 */
  isToday(timeObj: TimeObject): boolean {
    return timeObj.isSame(this.lib(), 'day');
  }

  /** 判断时间是否在指定时间之前 */
  isBefore(timeObj1: TimeObject, timeObj2: TimeObject): boolean {
    return timeObj1.isBefore(timeObj2);
  }

  /** 判断时间是否在指定时间之后 */
  isAfter(timeObj1: TimeObject, timeObj2: TimeObject): boolean {
    return timeObj1.isAfter(timeObj2);
  }

  /** 判断两个时间是否相同 */
  isSame(timeObj1: TimeObject, timeObj2: TimeObject): boolean {
    return timeObj1.isSame(timeObj2);
  }

  /** 计算两个时间的差值 */
  diff(timeObj1: TimeObject, timeObj2: TimeObject, unit?: TimeUnit, precise?: boolean): number {
    return timeObj1.diff(timeObj2, unit as moment.unitOfTime.Diff, precise);
  }

  /** 判断时间对象是否有效 */
  isValid(timeObj: TimeObject): boolean {
    return timeObj.isValid();
  }

  /** 获取 unix 时间戳（秒） */
  unix(timeObj: TimeObject): number {
    return timeObj.unix();
  }

  /** 转为 ISO 字符串 */
  toISOString(timeObj: TimeObject): string {
    return timeObj.toISOString();
  }

  /** 克隆时间对象 */
  clone(timeObj: TimeObject): TimeObject {
    return timeObj.clone();
  }

  /** 获取星期几的名称数组 */
  weekdays(localOrder: boolean = false): string[] {
    return this.lib.weekdays(localOrder);
  }

  /** 获取星期几的简短名称数组 */
  weekdaysShort(localOrder: boolean = false): string[] {
    return this.lib.weekdaysShort(localOrder);
  }

  /** 获取星期几的最短名称数组 */
  weekdaysMin(localOrder: boolean = false): string[] {
    return this.lib.weekdaysMin(localOrder);
  }

  /** 获取月份的简短名称数组 */
  monthsShort(): string[] {
    return this.lib.monthsShort();
  }

  /** 获取月份的名称数组 */
  months(): string[] {
    return this.lib.months();
  }

  /** 设置全局本地化设置 */
  locale(localeStr?: string, timeObj?: TimeObject): string {
    if (timeObj) {
      return timeObj.locale(localeStr);
    }
    return this.lib.locale(localeStr);
  }
}

