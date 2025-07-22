import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import convertDayjsPlugin from './convertDayjs';
import { zoneConfig } from './config.js';

// 启用插件
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(convertDayjsPlugin);

/**
 * 设置全局默认时区
 * @param {string} timezone - 时区名称（如 "Asia/Shanghai"）
 */
export function setDefaultTimezone(timezone) {
    zoneConfig.timezone = timezone;
    dayjs.tz.setDefault(timezone);
}

/**
 * 设置服务时区
 * @param {string} timezone - 时区名称（如 "Asia/Shanghai"）
 */
export function setSystemTimezone(timezone) {
    zoneConfig.systemZone = timezone;
}

/**
 * 获取当前时间戳（单位：毫秒）
 * @param {boolean} [isDate=false] - 是否根据系统时区调整时间戳
 * @returns {number} 当前时间戳
 */
export function getTime(isDate = false) {
    const now = dayjs().tz(node.timezone);

    if (isDate) {
        // 计算时区差（分钟）
        const currentOffset = now.utcOffset();
        const systemOffset = dayjs().tz(node.systemZone).utcOffset();
        const offsetDiff = systemOffset - currentOffset;

        // 调整时间戳
        return now.valueOf() + offsetDiff * 60 * 1000;
    }

    return now.valueOf();
}

/**
 * 将时间戳格式化为指定时区的字符串
 * @param {number} [timestamp] - 时间戳（毫秒），默认当前时间
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] - 格式字符串
 * @returns {string} 格式化后的时间字符串
 */
export function toString(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    const time = timestamp !== undefined ? dayjs(timestamp) : dayjs();
    return time.tz(zoneConfig.timezone).format(format);
}


/**
 * 获取当天0点0分0秒的时间戳（基于当前时区）
 * @returns {number} 当天零点的时间戳（毫秒）
 */
export function getTodayStartTimestamp(timestamp) {
  // 1. 获取当前时区的当前日期
  const today = dayjs(timestamp).tz(node.timezone).format('YYYY-MM-DD');

  // 2. 创建当天0点的dayjs对象（在当前时区）
  const startOfDay = dayjs.tz(today, 'YYYY-MM-DD', node.timezone);

  // 3. 返回时间戳
  return startOfDay.valueOf();
}

export default dayjs;
