import { TimeUtils, weekdays, weekdaysShort, weekdaysMin, monthsShort, months } from '../index';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

// 启用 dayjs 插件
dayjs.extend(localeData);

describe('LocaleData 功能测试', () => {
  describe('静态方法测试', () => {
    test('weekdays() 应该返回星期几名称数组', () => {
      const result = weekdays();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与 dayjs 对比
      const dayjsResult = dayjs.weekdays();
      expect(result).toEqual(dayjsResult);
    });

    test('weekdays(true) 应该按本地顺序返回星期几名称数组', () => {
      const result = weekdays(true);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与 dayjs 对比
      const dayjsResult = dayjs.weekdays(true);
      expect(result).toEqual(dayjsResult);
    });

    test('weekdaysShort() 应该返回星期几简短名称数组', () => {
      const result = weekdaysShort();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与 dayjs 对比
      const dayjsResult = dayjs.weekdaysShort();
      expect(result).toEqual(dayjsResult);
    });

    test('weekdaysShort(true) 应该按本地顺序返回星期几简短名称数组', () => {
      const result = weekdaysShort(true);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与 dayjs 对比
      const dayjsResult = dayjs.weekdaysShort(true);
      expect(result).toEqual(dayjsResult);
    });

    test('weekdaysMin() 应该返回星期几最短名称数组', () => {
      const result = weekdaysMin();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与 dayjs 对比
      const dayjsResult = dayjs.weekdaysMin();
      expect(result).toEqual(dayjsResult);
    });

    test('weekdaysMin(true) 应该按本地顺序返回星期几最短名称数组', () => {
      const result = weekdaysMin(true);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与 dayjs 对比
      const dayjsResult = dayjs.weekdaysMin(true);
      expect(result).toEqual(dayjsResult);
    });

    test('months() 应该返回月份名称数组', () => {
      const result = months();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(12);

      // 与 dayjs 对比
      const dayjsResult = dayjs.months();
      expect(result).toEqual(dayjsResult);
    });

    test('monthsShort() 应该返回月份简短名称数组', () => {
      const result = monthsShort();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(12);

      // 与 dayjs 对比
      const dayjsResult = dayjs.monthsShort();
      expect(result).toEqual(dayjsResult);
    });
  });

  describe('TimeInstance 方法测试', () => {
    test('TimeInstance.weekdays() 应该返回星期几名称数组', () => {
      const timeInstance = TimeUtils.create('2024-01-01');
      const result = timeInstance.weekdays();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与静态方法对比
      const staticResult = weekdays();
      expect(result).toEqual(staticResult);
    });

    test('TimeInstance.weekdays(true) 应该按本地顺序返回星期几名称数组', () => {
      const timeInstance = TimeUtils.create('2024-01-01');
      const result = timeInstance.weekdays(true);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与静态方法对比
      const staticResult = weekdays(true);
      expect(result).toEqual(staticResult);
    });

    test('TimeInstance.weekdaysShort() 应该返回星期几简短名称数组', () => {
      const timeInstance = TimeUtils.create('2024-01-01');
      const result = timeInstance.weekdaysShort();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与静态方法对比
      const staticResult = weekdaysShort();
      expect(result).toEqual(staticResult);
    });

    test('TimeInstance.weekdaysMin() 应该返回星期几最短名称数组', () => {
      const timeInstance = TimeUtils.create('2024-01-01');
      const result = timeInstance.weekdaysMin();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与静态方法对比
      const staticResult = weekdaysMin();
      expect(result).toEqual(staticResult);
    });

    test('TimeInstance.months() 应该返回月份名称数组', () => {
      const timeInstance = TimeUtils.create('2024-01-01');
      const result = timeInstance.months();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(12);

      // 与静态方法对比
      const staticResult = months();
      expect(result).toEqual(staticResult);
    });

    test('TimeInstance.monthsShort() 应该返回月份简短名称数组', () => {
      const timeInstance = TimeUtils.create('2024-01-01');
      const result = timeInstance.monthsShort();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(12);

      // 与静态方法对比
      const staticResult = monthsShort();
      expect(result).toEqual(staticResult);
    });
  });

  describe('不同 locale 下的测试', () => {
    test('设置中文 locale 后，应该返回中文的星期几和月份名称', () => {
      // 设置中文 locale
      dayjs.locale('zh-cn');

      const weekdaysResult = weekdays();
      const monthsResult = months();

      // 验证返回的是中文名称
      expect(weekdaysResult).toContain('星期日');
      expect(monthsResult).toContain('一月');

      // 与 dayjs 对比
      expect(weekdaysResult).toEqual(dayjs.weekdays());
      expect(monthsResult).toEqual(dayjs.months());
    });

    test('设置英文 locale 后，应该返回英文的星期几和月份名称', () => {
      // 设置英文 locale
      dayjs.locale('en');

      const weekdaysResult = weekdays();
      const monthsResult = months();

      // 验证返回的是英文名称
      expect(weekdaysResult).toContain('Sunday');
      expect(monthsResult).toContain('January');

      // 与 dayjs 对比
      expect(weekdaysResult).toEqual(dayjs.weekdays());
      expect(monthsResult).toEqual(dayjs.months());
    });

    test('TimeInstance 在不同 locale 下应该返回正确的名称', () => {
      const timeInstance = TimeUtils.create('2024-01-01');

      // 测试中文
      dayjs.locale('zh-cn');
      const zhWeekdays = timeInstance.weekdays();
      const zhMonths = timeInstance.months();

      expect(zhWeekdays).toContain('星期日');
      expect(zhMonths).toContain('一月');

      // 测试英文
      dayjs.locale('en');
      const enWeekdays = timeInstance.weekdays();
      const enMonths = timeInstance.months();

      expect(enWeekdays).toContain('Sunday');
      expect(enMonths).toContain('January');
    });
  });

  describe('链式调用测试', () => {
    test('应该能够在链式调用中使用 locale 相关方法', () => {
      const timeInstance = TimeUtils.create('2024-01-01');

      // 这些方法不应该影响链式调用
      const weekdaysResult = timeInstance.add(1, 'day').weekdays();
      const monthsResult = timeInstance.subtract(1, 'day').months();

      expect(Array.isArray(weekdaysResult)).toBe(true);
      expect(Array.isArray(monthsResult)).toBe(true);
      expect(weekdaysResult.length).toBe(7);
      expect(monthsResult.length).toBe(12);
    });

    test('locale 相关方法不应该修改原始时间实例', () => {
      const timeInstance = TimeUtils.create('2024-01-01');
      const originalFormat = timeInstance.format('YYYY-MM-DD');

      // 调用 locale 相关方法
      timeInstance.weekdays();
      timeInstance.months();
      timeInstance.weekdaysShort();
      timeInstance.monthsShort();
      timeInstance.weekdaysMin();

      // 验证原始时间没有改变
      expect(timeInstance.format('YYYY-MM-DD')).toBe(originalFormat);
    });
  });

  describe('边界情况测试', () => {
    test('localOrder 参数为 false 时应该正常工作', () => {
      const weekdaysResult = weekdays(false);
      const weekdaysShortResult = weekdaysShort(false);
      const weekdaysMinResult = weekdaysMin(false);

      expect(Array.isArray(weekdaysResult)).toBe(true);
      expect(Array.isArray(weekdaysShortResult)).toBe(true);
      expect(Array.isArray(weekdaysMinResult)).toBe(true);

      // 与 dayjs 对比
      expect(weekdaysResult).toEqual(dayjs.weekdays(false));
      expect(weekdaysShortResult).toEqual(dayjs.weekdaysShort(false));
      expect(weekdaysMinResult).toEqual(dayjs.weekdaysMin(false));
    });

    test('不同的 TimeInstance 实例应该返回相同的 locale 数据', () => {
      const instance1 = TimeUtils.create('2024-01-01');
      const instance2 = TimeUtils.create('2024-12-31');

      expect(instance1.weekdays()).toEqual(instance2.weekdays());
      expect(instance1.months()).toEqual(instance2.months());
      expect(instance1.weekdaysShort()).toEqual(instance2.weekdaysShort());
      expect(instance1.monthsShort()).toEqual(instance2.monthsShort());
      expect(instance1.weekdaysMin()).toEqual(instance2.weekdaysMin());
    });
  });

  describe('性能测试', () => {
    test('locale 相关方法应该有良好的性能', () => {
      const iterations = 1000;

      const startTime = Date.now();
      for (let i = 0; i < iterations; i++) {
        weekdays();
        weekdaysShort();
        weekdaysMin();
        months();
        monthsShort();
      }
      const duration = Date.now() - startTime;

      // 1000次调用应该在合理时间内完成（比如 100ms）
      expect(duration).toBeLessThan(100);
    });

    test('TimeInstance 的 locale 方法应该有良好的性能', () => {
      const timeInstance = TimeUtils.create('2024-01-01');
      const iterations = 1000;

      const startTime = Date.now();
      for (let i = 0; i < iterations; i++) {
        timeInstance.weekdays();
        timeInstance.weekdaysShort();
        timeInstance.weekdaysMin();
        timeInstance.months();
        timeInstance.monthsShort();
      }
      const duration = Date.now() - startTime;

      // 1000次调用应该在合理时间内完成
      expect(duration).toBeLessThan(100);
    });
  });

  describe('与 dayjs 行为对比测试', () => {
    test('所有 locale 方法都应该与 dayjs 完全一致', () => {
      // 测试多种 locale
      const locales = ['en', 'zh-cn'];

      locales.forEach(loc => {
        dayjs.locale(loc);

        // 对比所有方法
        expect(weekdays()).toEqual(dayjs.weekdays());
        expect(weekdays(true)).toEqual(dayjs.weekdays(true));
        expect(weekdays(false)).toEqual(dayjs.weekdays(false));

        expect(weekdaysShort()).toEqual(dayjs.weekdaysShort());
        expect(weekdaysShort(true)).toEqual(dayjs.weekdaysShort(true));
        expect(weekdaysShort(false)).toEqual(dayjs.weekdaysShort(false));

        expect(weekdaysMin()).toEqual(dayjs.weekdaysMin());
        expect(weekdaysMin(true)).toEqual(dayjs.weekdaysMin(true));
        expect(weekdaysMin(false)).toEqual(dayjs.weekdaysMin(false));

        expect(months()).toEqual(dayjs.months());
        expect(monthsShort()).toEqual(dayjs.monthsShort());
      });
    });

    test('TimeInstance 方法应该与对应的静态方法返回相同结果', () => {
      const timeInstance = TimeUtils.create('2024-01-01');

      expect(timeInstance.weekdays()).toEqual(weekdays());
      expect(timeInstance.weekdays(true)).toEqual(weekdays(true));
      expect(timeInstance.weekdays(false)).toEqual(weekdays(false));

      expect(timeInstance.weekdaysShort()).toEqual(weekdaysShort());
      expect(timeInstance.weekdaysShort(true)).toEqual(weekdaysShort(true));
      expect(timeInstance.weekdaysShort(false)).toEqual(weekdaysShort(false));

      expect(timeInstance.weekdaysMin()).toEqual(weekdaysMin());
      expect(timeInstance.weekdaysMin(true)).toEqual(weekdaysMin(true));
      expect(timeInstance.weekdaysMin(false)).toEqual(weekdaysMin(false));

      expect(timeInstance.months()).toEqual(months());
      expect(timeInstance.monthsShort()).toEqual(monthsShort());
    });
  });
});
