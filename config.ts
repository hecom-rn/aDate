/**
 * 时区配置接口
 */
export interface ZoneConfig {
  timezone: string;    // 默认时区
  systemZone: string;  // 系统时区
}

/**
 * 时区配置
 */
export const zoneConfig: ZoneConfig = {
  timezone: 'Asia/Shanghai',    // 默认时区
  systemZone: 'Asia/Seoul'            // 系统时区
};
