/**
 * 时区配置接口
 */
export interface ZoneConfig {
  timezone: string;    // 默认（个人）时区
  systemZone: string;  // 系统（租户）时区
}

/**
 * 时区配置
 */
export const zoneConfig: ZoneConfig = {
  timezone: 'Asia/Shanghai',    // 默认（个人）时区
  systemZone: 'Asia/Shanghai'      // 系统（租户）时区
};
