import dayjs from "dayjs";
import { zoneConfig } from './config.js';

// 函数convertDayjs，用于将dayJs转换为指定时区的时间
function convertDayjs(dayJs: dayjs.Dayjs, isDate = false) {
    // 获取当前时区的时间
    const now = dayJs.tz(zoneConfig.timezone);

    if (isDate) {
        // 计算时区差（分钟）
        const currentOffset = now.utcOffset();
        const systemOffset = dayJs.tz(zoneConfig.systemZone).utcOffset();
        const offsetDiff = systemOffset - currentOffset;

        // 调整时间戳
        return dayjs(now.valueOf() + offsetDiff * 60 * 1000);
    }

    return now;
}

// convertDayjs插件定义
export const convertDayjsPlugin = (option, dayjsClass, dayjsFactory) => {
    // 在dayjs原型上添加convertDayjs方法
    dayjsClass.prototype.convertDayjs = function(isDate = false) {
        return convertDayjs(this, isDate);
    };
};

export default convertDayjsPlugin;
