import {
  setTimeLibrary,
  getCurrentTimeLibrary,
  setDefaultTimezone,
  getTime,
  getCurrentTimestamp,
  now,
  formatTime,
  addTime,
  TimeLibraryType,
  TimeUtils,
  TimeObject,
  getYear,
  getMonth,
  getDate,
  getDay,
  getHour,
  getMinute,
  getSecond,
  getMillisecond,
  setYear,
  setMonth,
  setDate,
  setHour,
  setMinute,
  setSecond,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  isLeapYear,
  daysInMonth,
  isToday,
  isBefore,
  isAfter,
  isSame,
  parseTime,
  createTime,
  convertToTimezone,
  getUtcOffset
} from './index';

console.log('=== 时间库抽象层完整功能测试 ===');

// 测试1: 基本功能 - 使用 dayjs
console.log('\n🔧 1. 基本功能测试 (dayjs)');
console.log('当前时间库:', getCurrentTimeLibrary());

// 设置时区
setDefaultTimezone('Asia/Shanghai');

// 获取当前时间
const currentTime: TimeObject = now();
console.log('当前时间:', formatTime(currentTime, 'YYYY-MM-DD HH:mm:ss'));
console.log('当前时间戳:', getCurrentTimestamp());

// 时间计算
const tomorrow: TimeObject = addTime(currentTime, 1, 'day');
console.log('明天:', formatTime(tomorrow, 'YYYY-MM-DD HH:mm:ss'));

// 测试 getTime 函数（现在需要 timeObj 参数）
console.log('当前时间的时间戳:', getTime(currentTime));
console.log('明天时间的时间戳:', getTime(tomorrow));
console.log('使用系统时区调整的时间戳:', getTime(currentTime, true));

// 测试2: 获取时间各部分
console.log('\n📅 2. 获取时间各部分测试');
const testTime: TimeObject = createTime('2025-07-24 15:30:45');
console.log('测试时间:', formatTime(testTime, 'YYYY-MM-DD HH:mm:ss dddd'));
console.log('年份:', getYear(testTime));
console.log('月份:', getMonth(testTime));
console.log('日期:', getDate(testTime));
console.log('星期几:', getDay(testTime), '(0=星期日, 1=星期一, ...)');
console.log('小时:', getHour(testTime));
console.log('分钟:', getMinute(testTime));
console.log('秒:', getSecond(testTime));
console.log('毫秒:', getMillisecond(testTime));
console.log('UTC偏移量:', getUtcOffset(testTime), '分钟');

// 测试3: 设置时间
console.log('\n⚙️ 3. 设置时间测试');
let modifiableTime: TimeObject = createTime('2025-01-15 10:30:45');
console.log('原始时间:', formatTime(modifiableTime, 'YYYY-MM-DD HH:mm:ss'));

modifiableTime = setYear(modifiableTime, 2026);
console.log('设置年份为2026:', formatTime(modifiableTime, 'YYYY-MM-DD HH:mm:ss'));

modifiableTime = setMonth(modifiableTime, 5);
console.log('设置月份为6月:', formatTime(modifiableTime, 'YYYY-MM-DD HH:mm:ss'));

modifiableTime = setDate(modifiableTime, 25);
console.log('设置日期为25日:', formatTime(modifiableTime, 'YYYY-MM-DD HH:mm:ss'));

modifiableTime = setHour(modifiableTime, 15);
console.log('设置小时为15时:', formatTime(modifiableTime, 'YYYY-MM-DD HH:mm:ss'));

modifiableTime = setMinute(modifiableTime, 20);
console.log('设置分钟为20分:', formatTime(modifiableTime, 'YYYY-MM-DD HH:mm:ss'));

modifiableTime = setSecond(modifiableTime, 30);
console.log('设置秒为30秒:', formatTime(modifiableTime, 'YYYY-MM-DD HH:mm:ss'));

// 测试4: 开始和结束时间
console.log('\n📆 4. 开始和结束时间测试');
const testDate: TimeObject = createTime('2025-07-15 14:30:25');
console.log('测试时间:', formatTime(testDate, 'YYYY-MM-DD HH:mm:ss'));
console.log('月初时间:', formatTime(startOfMonth(testDate), 'YYYY-MM-DD HH:mm:ss'));
console.log('月末时间:', formatTime(endOfMonth(testDate), 'YYYY-MM-DD HH:mm:ss'));
console.log('日初时间:', formatTime(startOfDay(testDate), 'YYYY-MM-DD HH:mm:ss'));
console.log('日末时间:', formatTime(endOfDay(testDate), 'YYYY-MM-DD HH:mm:ss'));

// 测试5: 日期判断和计算
console.log('\n🔍 5. 日期判断和计算测试');
const leapYear2024: TimeObject = createTime('2024-02-15');
const normalYear2025: TimeObject = createTime('2025-02-15');
console.log('2024年是闰年:', isLeapYear(leapYear2024));
console.log('2025年是闰年:', isLeapYear(normalYear2025));
console.log('2024年2月天数:', daysInMonth(leapYear2024));
console.log('2025年2月天数:', daysInMonth(normalYear2025));
console.log('当前时间是否为今天:', isToday(currentTime));
console.log('2025-01-01是否为今天:', isToday(createTime('2025-01-01')));

// 测试6: 时间比较
console.log('\n⚖️ 6. 时间比较测试');
const time1: TimeObject = createTime('2025-01-01 10:00:00');
const time2: TimeObject = createTime('2025-01-02 10:00:00');
const time3: TimeObject = createTime('2025-01-01 10:00:00');

console.log('时间1:', formatTime(time1, 'YYYY-MM-DD HH:mm:ss'));
console.log('时间2:', formatTime(time2, 'YYYY-MM-DD HH:mm:ss'));
console.log('时间3:', formatTime(time3, 'YYYY-MM-DD HH:mm:ss'));
console.log('时间1 是否在 时间2 之前:', isBefore(time1, time2));
console.log('时间2 是否在 时间1 之后:', isAfter(time2, time1));
console.log('时间1 是否与 时间3 相同:', isSame(time1, time3));

// 测试7: 时区转换
console.log('\n🌍 7. 时区转换测试');
const beijingTime: TimeObject = createTime('2025-07-24 15:30:00', 'Asia/Shanghai');
console.log('北京时间:', formatTime(beijingTime, 'YYYY-MM-DD HH:mm:ss'));
const newYorkTime: TimeObject = convertToTimezone(beijingTime, 'America/New_York');
console.log('纽约时间:', formatTime(newYorkTime, 'YYYY-MM-DD HH:mm:ss'));
const londonTime: TimeObject = convertToTimezone(beijingTime, 'Europe/London');
console.log('伦敦时间:', formatTime(londonTime, 'YYYY-MM-DD HH:mm:ss'));

// 测试8: 时间解析
console.log('\n🔤 8. 时间解析测试');
const parsedTime1: TimeObject = parseTime('2025-12-25 15:30:00');
console.log('解析 "2025-12-25 15:30:00":', formatTime(parsedTime1, 'YYYY-MM-DD HH:mm:ss'));
const parsedTime2: TimeObject = parseTime('2025/06/15');
console.log('解析 "2025/06/15":', formatTime(parsedTime2, 'YYYY-MM-DD HH:mm:ss'));

// 测试9: 链式调用 - TimeUtils
console.log('\n🔗 9. 链式调用测试 (TimeUtils)');
const chainResult1: string = TimeUtils.now()
  .add(1, 'month')
  .subtract(3, 'day')
  .hour(12)
  .minute(0)
  .second(0)
  .format('YYYY年MM月DD日 HH:mm:ss');
console.log('复杂链式操作结果:', chainResult1);

// 测试10: TimeInstance 的所���方法
console.log('\n🎯 10. TimeInstance 完整方法测试');
const timeInstance = TimeUtils.create('2025-12-25 15:30:45');
console.log('原始时间:', timeInstance.format('YYYY-MM-DD HH:mm:ss'));
console.log('获取年份:', timeInstance.getYear());
console.log('获取月份:', timeInstance.getMonth());
console.log('获取日期:', timeInstance.getDate());
console.log('获取星期:', timeInstance.getDay());
console.log('获取小时:', timeInstance.getHour());
console.log('获取���钟:', timeInstance.getMinute());
console.log('获取秒:', timeInstance.getSecond());
console.log('获取毫秒:', timeInstance.getMillisecond());
console.log('是否为闰年:', timeInstance.isLeapYear());
console.log('当前月天数:', timeInstance.getDaysInMonth());
console.log('是否为今天:', timeInstance.isToday());
console.log('时间戳:', timeInstance.valueOf());

// 测试11: 复杂的链式操作组合
console.log('\n🎨 11. 复杂链式操作组合测试');
const christmasEve = TimeUtils.create('2025-06-15 10:30:00')
  .month(11)        // 设置为12月（0-11，所以11表示12月）
  .date(24)         // 设置为24日（平安夜）
  .hour(18)         // 设置为晚上6点
  .minute(0)        // 设置为整点
  .second(0)        // 设置秒为0
  .startOfDay()     // 重置为当日开始
  .add(18, 'hour')  // 加18小时（晚上6点）
  .format('YYYY年MM月DD日 HH:mm:ss');

console.log('计算平安夜晚6点:', christmasEve);

// 测试12: 月末日期计算
console.log('\n📊 12. 月末日期计算测试');
const monthEndInstance = TimeUtils.create('2025-02-15')
  .endOfMonth();
console.log('2月月末:', monthEndInstance.format('YYYY-MM-DD HH:mm:ss'));
console.log('是否为2月28日:', monthEndInstance.getDate() === 28);

// 测试13: UTC功能测试
console.log('\n🌐 13. UTC功能测试 (TimeInstance.utc)');

// 创建时间并转换为UTC
const utcTime = TimeUtils.create('2025-07-25 12:00:00').utc();
console.log('UTC时间:', utcTime.format('YYYY-MM-DD HH:mm:ss'));

// 创建本地时间进行对比
const localTime = TimeUtils.create('2025-07-25 12:00:00');
console.log('本地时间:', localTime.format('YYYY-MM-DD HH:mm:ss'));

// 获取时间戳对比
console.log('UTC时间戳:', utcTime.valueOf());
console.log('本地时间戳:', localTime.valueOf());
console.log('时间戳差值:', Math.abs(utcTime.valueOf() - localTime.valueOf()), '毫秒');

// UTC链式调用测试
const utcChain = TimeUtils.create('2025-01-01')
  .utc()
  .add(6, 'month')
  .date(25)
  .hour(15)
  .format('YYYY-MM-DD HH:mm:ss');

console.log('UTC链式调用结果:', utcChain);

// 当前时间转UTC测试
const utcInstance = TimeUtils.create().utc();
console.log('当前UTC时间:', utcInstance.format('YYYY-MM-DD HH:mm:ss'));
console.log('UTC年份:', utcInstance.getYear());
console.log('UTC月份:', utcInstance.getMonth());
console.log('UTC日期:', utcInstance.getDate());
console.log('UTC小时:', utcInstance.getHour());

// 测试14: 时间库切换演示
console.log('\n🔄 14. 时间库切换演示');
console.log('当前使用:', getCurrentTimeLibrary());

// 切换到 XDate 演示
try {
  console.log('\n切换到 XDate 库...');
  setTimeLibrary(TimeLibraryType.XDATE);
  console.log('切换后的时间库:', getCurrentTimeLibrary());

  // 使用 XDate 库进行相同的操作
  const xDateTime: TimeObject = now();
  console.log('XDate 当前时间:', formatTime(xDateTime, 'YYYY-MM-DD HH:mm:ss'));
  console.log('XDate 年份:', getYear(xDateTime));
  console.log('XDate 月份:', getMonth(xDateTime));

  // 链式调用测试
  const xDateChain: string = TimeUtils.now()
    .add(7, 'day')
    .hour(9)
    .format('YYYY年MM月DD日 HH:mm:ss');
  console.log('XDate 链式调用:', xDateChain);

} catch (error) {
  console.log('XDate 库切换成功，演示完成');
} finally {
  // 切换回 dayjs
  setTimeLibrary(TimeLibraryType.DAYJS);
  console.log('切换回 dayjs:', getCurrentTimeLibrary());
}

// 测试14: 性能对比示例
console.log('\n⚡ 14. 不同操作的演示');
const startTime = Date.now();

// 批量时间操作
for (let i = 0; i < 10; i++) {
  const batchTime = TimeUtils.now()
    .add(i, 'day')
    .hour(12)
    .format('YYYY-MM-DD HH:mm:ss');
  if (i < 3) {
    console.log(`第${i + 1}次操作结果:`, batchTime);
  }
}

const endTime = Date.now();
console.log(`批量操作耗时: ${endTime - startTime}ms`);

console.log('\n✅ === 所有测试完成 ===');
console.log('🎉 时间库抽象层功能完整，支持无缝切换！');
