import { TimeUtils, setTimeLibrary, TimeLibraryType, getCurrentTimeLibrary } from './index';
import moment from 'moment-timezone';

// 设置使用MOMENT
setTimeLibrary(TimeLibraryType.MOMENT);

console.log('当前使用的时间库:', getCurrentTimeLibrary());

// 测试所有失败测试中的日期
const testDates = [
  '2025-01-01', // 年初
  '2025-03-31', // Q1末
  '2025-04-01', // Q2初
  '2025-07-24', // 年中
  '2025-09-30', // Q3末
  '2025-10-01', // Q4初
  '2025-12-31', // 年末
  '2024-02-29', // 闰年
];

console.log('\n=== 详细测试所有日期 ===');
testDates.forEach(date => {
  const timeInstance = TimeUtils.create(date);
  const momentInstance = moment(date);

  const timeUtilsQuarter = timeInstance.startOfQuarter().valueOf();
  const momentQuarter = momentInstance.startOf('quarter').valueOf();

  console.log(`\n日期: ${date}`);
  console.log(`  TimeUtils: ${timeUtilsQuarter} (${timeInstance.startOfQuarter().format('YYYY-MM-DD HH:mm:ss')})`);
  console.log(`  Moment: ${momentQuarter} (${momentInstance.startOf('quarter').format('YYYY-MM-DD HH:mm:ss')})`);
  console.log(`  匹配: ${timeUtilsQuarter === momentQuarter ? '✓' : '✗'}`);

  if (timeUtilsQuarter !== momentQuarter) {
    console.log(`  *** 不匹配！差值: ${timeUtilsQuarter - momentQuarter}ms ***`);
  }
});
