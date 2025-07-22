import * as dayjs from "dayjs";

declare module "dayjs" {
  interface Dayjs {
    tz(timezone?: string): dayjs.Dayjs;
    convertDayjs(isDate: boolean): Dayjs
  }
}

declare private const node: {
  timezone: string;
  systemZone: string;
};

/**
 * 设置全局默认时区
 * @param timezone - 时区名称（如 "Asia/Shanghai"）
 */
export function setDefaultTimezone(timezone: string): void;

/**
 * 设置服务时区
 * @param timezone - 时区名称（如 "Asia/Shanghai"）
 */
export function setSystemTimezone(timezone: string): void;

/**
 * 获取当前时间戳（单位：毫秒）
 * @param isDate - 是否根据系统时区调整时间戳
 * @returns 当前时间戳
 */
export function getTime(isDate?: boolean): number;

/**
 * 将时间戳格式化为指定时区的字符串
 * @param timestamp - 时间戳（毫秒），默认当前时间
 * @param format - 格式字符串
 * @returns 格式化后的时间字符串
 */
export function toString(timestamp?: number, format?: string): string;

/**
 * 获取当天0点0分0秒的时间戳（基于当前时区）
 * @param timestamp - 可选时间戳（毫秒），默认当前时间
 * @returns 当天零点的时间戳（毫秒）
 */
export function getTodayStartTimestamp(timestamp?: number): number;

declare const _default: dayjs.Dayjs;
export default _default;
