import { ITimeLibrary, TimeUnit, TimeObject } from '../interfaces/ITimeLibrary';
import { zoneConfig } from '../config';
import { format as dfFormat, parse as dfParse, add as dfAdd, sub as dfSub, startOfMonth as dfStartOfMonth, endOfMonth as dfEndOfMonth, startOfDay as dfStartOfDay, endOfDay as dfEndOfDay, startOfWeek as dfStartOfWeek, endOfWeek as dfEndOfWeek, startOfQuarter as dfStartOfQuarter, startOfYear as dfStartOfYear, isLeapYear as dfIsLeapYear, getDaysInMonth as dfGetDaysInMonth, isSameDay as dfIsSameDay, isBefore as dfIsBefore, isAfter as dfIsAfter, differenceInYears, differenceInMonths, differenceInQuarters, differenceInWeeks, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, differenceInMilliseconds, getYear as dfGetYear, getMonth as dfGetMonth, getDate as dfGetDate, getDay as dfGetDay, getWeek as dfGetWeek, getHours as dfGetHours, getMinutes as dfGetMinutes, getSeconds as dfGetSeconds, getMilliseconds as dfGetMilliseconds } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
// 使用路径导入避免命名导出类型问题
// @ts-ignore
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
// @ts-ignore
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import { enUS, zhCN } from 'date-fns/locale';

interface DateFnsWrapper {
  _d: Date;
  _tz?: string;
  _locale?: any; // 使用 any 简化 locale 类型兼容
  tz?: (timezone: string) => DateFnsWrapper;
  locale?: (localeStr?: string) => DateFnsWrapper;
}

const localeMap: Record<string, any> = {
  'en': enUS,
  'en-US': enUS,
  'zh-cn': zhCN,
  'zh-CN': zhCN,
};

let globalLocale: string = 'en';

function buildWrapper(date: Date, tz?: string, localeStr?: string): DateFnsWrapper {
  const wrapper: DateFnsWrapper = {
    _d: date,
    _tz: tz,
    _locale: localeStr ? localeMap[localeStr] : localeMap[globalLocale],
  };
  wrapper.tz = (timezone: string) => buildWrapper(wrapper._d, timezone, wrapper._locale ? (wrapper._locale as any).code : globalLocale);
  wrapper.locale = (localeStr?: string) => {
    if (!localeStr) return wrapper;
    return buildWrapper(wrapper._d, wrapper._tz, localeStr);
  };
  return wrapper;
}

function ensureWrapper(timeObj: TimeObject): DateFnsWrapper {
  return timeObj as DateFnsWrapper;
}

function normalizeFormatTokens(fmt: string): string {
  // 将 Dayjs/Moment 风格的 YYYY / DD 大写 token 转换为 date-fns 的小写；并将 [literal] 转成 'literal'
  let result = '';
  let i = 0;
  while (i < fmt.length) {
    const ch = fmt[i];
    if (ch === '[') {
      const end = fmt.indexOf(']', i + 1);
      if (end !== -1) {
        const literalContent = fmt.slice(i + 1, end).replace(/'/g, "''");
        result += `'${literalContent}'`;
        i = end + 1;
        continue;
      }
      // 未闭合，按普通字符处理
    }
    if (ch === 'Y') {
      result += 'y';
    } else if (ch === 'D') {
      result += 'd';
    } else {
      result += ch;
    }
    i++;
  }
  return result;
}

export class DateFnsTimeLibrary extends ITimeLibrary {
  constructor() { super(); }

  getTime(timeObj: TimeObject, isDate: boolean = false): number {
    const w = ensureWrapper(timeObj);
    // isDate 暂时不进行系统时区校正，保持与 Date 基础行为一致
    return w._d.getTime();
  }

  create(input?: string | number | Date, formatOrOptions?: string | object, timezone?: string): TimeObject {
    let date: Date;
    if (input instanceof Date) {
      date = new Date(input.getTime());
    } else if (typeof input === 'number') {
      date = new Date(input);
    } else if (typeof input === 'string') {
      if (typeof formatOrOptions === 'string') {
        try { date = dfParse(input, formatOrOptions, new Date()); } catch { date = new Date(input); }
      } else {
        date = new Date(input);
      }
    } else {
      date = new Date();
    }
    if (timezone) {
      const zoned = utcToZonedTime(date, timezone);
      return buildWrapper(zoned, timezone, globalLocale);
    }
    return buildWrapper(date, undefined, globalLocale);
  }

  createUtc(timeObj: TimeObject, input?: string | number | Date): TimeObject {
    if (timeObj) {
      const w = ensureWrapper(timeObj);
      const utcDate = zonedTimeToUtc(w._d, w._tz || 'UTC');
      return buildWrapper(utcDate, 'UTC', w._locale ? (w._locale as any).code : globalLocale);
    }
    const date = input ? new Date(input instanceof Date ? input.getTime() : input) : new Date();
    return buildWrapper(date, 'UTC', globalLocale);
  }

  format(timeObj: TimeObject, format?: string, timezone?: string): string {
    const w = ensureWrapper(timeObj);
    const rawFmt = format || 'yyyy-MM-dd HH:mm:ss';
    const fmt = normalizeFormatTokens(rawFmt);
    const tz = timezone || w._tz || zoneConfig.timezone;
    return formatInTimeZone(w._d, tz, fmt, { locale: w._locale });
  }

  parse(timeStr: string, format?: string, timezone?: string): TimeObject {
    let date: Date;
    if (format) {
      try { date = dfParse(timeStr, format, new Date()); } catch { date = new Date(timeStr); }
    } else {
      date = new Date(timeStr);
    }
    if (timezone) {
      const zoned = utcToZonedTime(date, timezone);
      return buildWrapper(zoned, timezone, globalLocale);
    }
    return buildWrapper(date, undefined, globalLocale);
  }

  add(timeObj: TimeObject, amount: number, unit: TimeUnit): TimeObject {
    const w = ensureWrapper(timeObj);
    let newDate: Date = w._d;
    switch (unit) {
      case 'year': newDate = dfAdd(w._d, { years: amount }); break;
      case 'quarter': newDate = dfAdd(w._d, { months: amount * 3 }); break; // quarters -> months
      case 'month': newDate = dfAdd(w._d, { months: amount }); break;
      case 'week': newDate = dfAdd(w._d, { weeks: amount }); break;
      case 'day': newDate = dfAdd(w._d, { days: amount }); break;
      case 'hour': newDate = dfAdd(w._d, { hours: amount }); break;
      case 'minute': newDate = dfAdd(w._d, { minutes: amount }); break;
      case 'second': newDate = dfAdd(w._d, { seconds: amount }); break;
      case 'millisecond': newDate = new Date(w._d.getTime() + amount); break; // manual ms
    }
    return buildWrapper(newDate, w._tz, w._locale ? (w._locale as any).code : globalLocale);
  }

  subtract(timeObj: TimeObject, amount: number, unit: TimeUnit): TimeObject {
    const w = ensureWrapper(timeObj);
    let newDate: Date = w._d;
    switch (unit) {
      case 'year': newDate = dfSub(w._d, { years: amount }); break;
      case 'quarter': newDate = dfSub(w._d, { months: amount * 3 }); break;
      case 'month': newDate = dfSub(w._d, { months: amount }); break;
      case 'week': newDate = dfSub(w._d, { weeks: amount }); break;
      case 'day': newDate = dfSub(w._d, { days: amount }); break;
      case 'hour': newDate = dfSub(w._d, { hours: amount }); break;
      case 'minute': newDate = dfSub(w._d, { minutes: amount }); break;
      case 'second': newDate = dfSub(w._d, { seconds: amount }); break;
      case 'millisecond': newDate = new Date(w._d.getTime() - amount); break;
    }
    return buildWrapper(newDate, w._tz, w._locale ? (w._locale as any).code : globalLocale);
  }

  compare(timeObj1: TimeObject, timeObj2: TimeObject): number {
    const t1 = ensureWrapper(timeObj1)._d.getTime();
    const t2 = ensureWrapper(timeObj2)._d.getTime();
    return t1 < t2 ? -1 : t1 > t2 ? 1 : 0;
  }

  valueOf(timeObj: TimeObject): number {
    return ensureWrapper(timeObj)._d.getTime();
  }

  setDefaultTimezone(timezone: string): void { zoneConfig.timezone = timezone; }
  setSystemTimezone(timezone: string): void { zoneConfig.systemZone = timezone; }

  toTimezone(timeObj: TimeObject, timezone: string): TimeObject {
    const w = ensureWrapper(timeObj);
    const zoned = utcToZonedTime(w._d, timezone);
    return buildWrapper(zoned, timezone, w._locale ? (w._locale as any).code : globalLocale);
  }

  getUtcOffset(timeObj: TimeObject): number {
    const w = ensureWrapper(timeObj);
    const tz = w._tz || zoneConfig.timezone;
    try {
      const utcDate = zonedTimeToUtc(w._d, tz);
      const diffMs = w._d.getTime() - utcDate.getTime();
      return diffMs / 60000;
    } catch {
      // Fallback: use current Date offset (approximation)
      return -new Date().getTimezoneOffset();
    }
  }

  year(timeObj: TimeObject): number { return dfGetYear(ensureWrapper(timeObj)._d); }
  month(timeObj: TimeObject): number { return dfGetMonth(ensureWrapper(timeObj)._d); }
  date(timeObj: TimeObject): number { return dfGetDate(ensureWrapper(timeObj)._d); }
  day(timeObj: TimeObject): number { return dfGetDay(ensureWrapper(timeObj)._d); }
  week(timeObj: TimeObject): number { return dfGetWeek(ensureWrapper(timeObj)._d); }
  hour(timeObj: TimeObject): number { return dfGetHours(ensureWrapper(timeObj)._d); }
  minute(timeObj: TimeObject): number { return dfGetMinutes(ensureWrapper(timeObj)._d); }
  second(timeObj: TimeObject): number { return dfGetSeconds(ensureWrapper(timeObj)._d); }
  millisecond(timeObj: TimeObject): number { return dfGetMilliseconds(ensureWrapper(timeObj)._d); }

  setYear(timeObj: TimeObject, value: number): TimeObject { const w = ensureWrapper(timeObj); const d = new Date(w._d); d.setFullYear(value); return buildWrapper(d, w._tz, w._locale ? (w._locale as any).code : globalLocale); }
  setMonth(timeObj: TimeObject, value: number): TimeObject { const w = ensureWrapper(timeObj); const d = new Date(w._d); d.setMonth(value); return buildWrapper(d, w._tz, w._locale ? (w._locale as any).code : globalLocale); }
  setDate(timeObj: TimeObject, value: number): TimeObject { const w = ensureWrapper(timeObj); const d = new Date(w._d); d.setDate(value); return buildWrapper(d, w._tz, w._locale ? (w._locale as any).code : globalLocale); }
  setHour(timeObj: TimeObject, value: number): TimeObject { const w = ensureWrapper(timeObj); const d = new Date(w._d); d.setHours(value); return buildWrapper(d, w._tz, w._locale ? (w._locale as any).code : globalLocale); }
  setMinute(timeObj: TimeObject, value: number): TimeObject { const w = ensureWrapper(timeObj); const d = new Date(w._d); d.setMinutes(value); return buildWrapper(d, w._tz, w._locale ? (w._locale as any).code : globalLocale); }
  setSecond(timeObj: TimeObject, value: number): TimeObject { const w = ensureWrapper(timeObj); const d = new Date(w._d); d.setSeconds(value); return buildWrapper(d, w._tz, w._locale ? (w._locale as any).code : globalLocale); }
  setMillisecond(timeObj: TimeObject, value: number): TimeObject { const w = ensureWrapper(timeObj); const d = new Date(w._d); d.setMilliseconds(value); return buildWrapper(d, w._tz, w._locale ? (w._locale as any).code : globalLocale); }

  startOfMonth(timeObj: TimeObject): TimeObject { const d = dfStartOfMonth(ensureWrapper(timeObj)._d); return buildWrapper(d, ensureWrapper(timeObj)._tz, ensureWrapper(timeObj)._locale ? (ensureWrapper(timeObj)._locale as any).code : globalLocale); }
  endOfMonth(timeObj: TimeObject): TimeObject { const d = dfEndOfMonth(ensureWrapper(timeObj)._d); return buildWrapper(d, ensureWrapper(timeObj)._tz, ensureWrapper(timeObj)._locale ? (ensureWrapper(timeObj)._locale as any).code : globalLocale); }
  startOfDay(timeObj: TimeObject): TimeObject { const d = dfStartOfDay(ensureWrapper(timeObj)._d); return buildWrapper(d, ensureWrapper(timeObj)._tz, ensureWrapper(timeObj)._locale ? (ensureWrapper(timeObj)._locale as any).code : globalLocale); }
  endOfDay(timeObj: TimeObject): TimeObject { const d = dfEndOfDay(ensureWrapper(timeObj)._d); return buildWrapper(d, ensureWrapper(timeObj)._tz, ensureWrapper(timeObj)._locale ? (ensureWrapper(timeObj)._locale as any).code : globalLocale); }
  startOfWeek(timeObj: TimeObject): TimeObject { const d = dfStartOfWeek(ensureWrapper(timeObj)._d); return buildWrapper(d, ensureWrapper(timeObj)._tz, ensureWrapper(timeObj)._locale ? (ensureWrapper(timeObj)._locale as any).code : globalLocale); }
  endOfWeek(timeObj: TimeObject): TimeObject { const d = dfEndOfWeek(ensureWrapper(timeObj)._d); return buildWrapper(d, ensureWrapper(timeObj)._tz, ensureWrapper(timeObj)._locale ? (ensureWrapper(timeObj)._locale as any).code : globalLocale); }
  startOfQuarter(timeObj: TimeObject): TimeObject { const d = dfStartOfQuarter(ensureWrapper(timeObj)._d); return buildWrapper(d, ensureWrapper(timeObj)._tz, ensureWrapper(timeObj)._locale ? (ensureWrapper(timeObj)._locale as any).code : globalLocale); }
  startOfYear(timeObj: TimeObject): TimeObject { const d = dfStartOfYear(ensureWrapper(timeObj)._d); return buildWrapper(d, ensureWrapper(timeObj)._tz, ensureWrapper(timeObj)._locale ? (ensureWrapper(timeObj)._locale as any).code : globalLocale); }

  isLeapYear(timeObj: TimeObject): boolean { return dfIsLeapYear(ensureWrapper(timeObj)._d); }
  daysInMonth(timeObj: TimeObject): number { return dfGetDaysInMonth(ensureWrapper(timeObj)._d); }
  isToday(timeObj: TimeObject): boolean { return dfIsSameDay(ensureWrapper(timeObj)._d, new Date()); }
  isBefore(timeObj1: TimeObject, timeObj2: TimeObject): boolean { return dfIsBefore(ensureWrapper(timeObj1)._d, ensureWrapper(timeObj2)._d); }
  isAfter(timeObj1: TimeObject, timeObj2: TimeObject): boolean { return dfIsAfter(ensureWrapper(timeObj1)._d, ensureWrapper(timeObj2)._d); }
  isSame(timeObj1: TimeObject, timeObj2: TimeObject): boolean { return ensureWrapper(timeObj1)._d.getTime() === ensureWrapper(timeObj2)._d.getTime(); }

  diff(timeObj1: TimeObject, timeObj2: TimeObject, unit?: TimeUnit, precise?: boolean): number {
    const d1 = ensureWrapper(timeObj1)._d;
    const d2 = ensureWrapper(timeObj2)._d;
    switch (unit) {
      case 'year': return differenceInYears(d1, d2);
      case 'quarter': return differenceInQuarters(d1, d2);
      case 'month': return differenceInMonths(d1, d2);
      case 'week': return differenceInWeeks(d1, d2);
      case 'day': return differenceInDays(d1, d2);
      case 'hour': return precise ? (d1.getTime() - d2.getTime()) / 3600000 : differenceInHours(d1, d2);
      case 'minute': return precise ? (d1.getTime() - d2.getTime()) / 60000 : differenceInMinutes(d1, d2);
      case 'second': return precise ? (d1.getTime() - d2.getTime()) / 1000 : differenceInSeconds(d1, d2);
      case 'millisecond':
      default: return differenceInMilliseconds(d1, d2);
    }
  }

  isValid(timeObj: TimeObject): boolean { const t = ensureWrapper(timeObj)._d.getTime(); return !Number.isNaN(t); }
  unix(timeObj: TimeObject): number { return Math.floor(ensureWrapper(timeObj)._d.getTime() / 1000); }
  toISOString(timeObj: TimeObject): string { return ensureWrapper(timeObj)._d.toISOString(); }
  clone(timeObj: TimeObject): TimeObject { const w = ensureWrapper(timeObj); return buildWrapper(new Date(w._d.getTime()), w._tz, w._locale ? (w._locale as any).code : globalLocale); }

  weekdays(): string[] {
    const base = dfStartOfWeek(new Date(2023,0,1));
    return Array.from({ length: 7 }).map((_, i) => dfFormat(dfAdd(base,{ days: i }), 'EEEE', { locale: localeMap[globalLocale] }));
  }
  weekdaysShort(): string[] {
    const base = dfStartOfWeek(new Date(2023,0,1));
    return Array.from({ length: 7 }).map((_, i) => dfFormat(dfAdd(base,{ days: i }), 'EEE', { locale: localeMap[globalLocale] }));
  }
  weekdaysMin(): string[] { return this.weekdaysShort().map(w => w.slice(0,2)); }
  monthsShort(): string[] { return Array.from({ length: 12 }).map((_, i) => dfFormat(new Date(2023,i,1), 'MMM', { locale: localeMap[globalLocale] })); }
  months(): string[] { return Array.from({ length: 12 }).map((_, i) => dfFormat(new Date(2023,i,1), 'MMMM', { locale: localeMap[globalLocale] })); }

  locale(localeStr?: string, timeObj?: TimeObject): string {
    if (timeObj) {
      const w = ensureWrapper(timeObj);
      if (!localeStr) {
        return (w._locale as any)?.code || globalLocale;
      }
      // 返回包装对象供链式继续使用（与 Dayjs 行为保持一致）
      return buildWrapper(w._d, w._tz, localeStr) as any;
    }
    if (!localeStr) return globalLocale;
    globalLocale = localeStr;
    return globalLocale;
  }
}
