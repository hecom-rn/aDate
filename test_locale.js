// 测试 locale 功能
import { TimeUtils } from './index.js';

console.log('=== Locale 功能测试 ===');

// 测试获取当前 locale
console.log('当前 locale:', TimeUtils.locale());

// 测试设置中文 locale
console.log('设置 locale 为 zh-cn:', TimeUtils.locale('zh-cn'));

// 测试 weekdays 等方法在中文环境下的输出
console.log('中文星期名称:', TimeUtils.weekdays());
console.log('中文星期简称:', TimeUtils.weekdaysShort());
console.log('中文星期精简称:', TimeUtils.weekdaysMin());
console.log('中文月份名称:', TimeUtils.months());
console.log('中文月份简称:', TimeUtils.monthsShort());

// 测试 TimeInstance 的 locale 方法
console.log('通过 TimeInstance 获取当前 locale:', TimeUtils.locale());

// 测试设置英文 locale
console.log('设置 locale 为 en:', TimeUtils.locale('en'));
console.log('英文星期名称:', TimeUtils.weekdays());
console.log('英文月份名称:', TimeUtils.months());

console.log('=== 测试完成 ===');
