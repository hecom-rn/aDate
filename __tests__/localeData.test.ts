import { TimeUtils, weekdays, weekdaysShort, weekdaysMin, monthsShort, months } from '../index';
import moment from 'moment-timezone';

describe('LocaleData 功能测试', () => {
  describe('静态方法测试', () => {
    test('weekdays() 应该返回星期几名称数组', () => {
      const result = weekdays();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与 moment 对比
      const momentResult = moment.weekdays();
      expect(result).toEqual(momentResult);
    });

    test('weekdays(true) 应该按本地顺序返回星期几名称数组', () => {
      const result = weekdays(true);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与 moment 对比
      const momentResult = moment.weekdays(true);
      expect(result).toEqual(momentResult);
    });

    test('weekdaysShort() 应该返回星期几简短名称数组', () => {
      const result = weekdaysShort();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与 moment 对比
      const momentResult = moment.weekdaysShort();
      expect(result).toEqual(momentResult);
    });

    test('weekdaysShort(true) 应该按本地顺序返回星期几简短名称数组', () => {
      const result = weekdaysShort(true);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与 moment 对比
      const momentResult = moment.weekdaysShort(true);
      expect(result).toEqual(momentResult);
    });

    test('weekdaysMin() 应该返回星期几最短名称数组', () => {
      const result = weekdaysMin();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与 moment 对比
      const momentResult = moment.weekdaysMin();
      expect(result).toEqual(momentResult);
    });

    test('weekdaysMin(true) 应该按本地顺序返回星期几最短名称数组', () => {
      const result = weekdaysMin(true);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与 moment 对比
      const momentResult = moment.weekdaysMin(true);
      expect(result).toEqual(momentResult);
    });

    test('months() 应该返回月份名称数组', () => {
      const result = months();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(12);

      // 与 moment 对比
      const momentResult = moment.months();
      expect(result).toEqual(momentResult);
    });

    test('monthsShort() 应该返回月份简短名称数组', () => {
      const result = monthsShort();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(12);

      // 与 moment 对比
      const momentResult = moment.monthsShort();
      expect(result).toEqual(momentResult);
    });
  });

  describe('TimeInstance 方法测试', () => {
    test('TimeUtils.weekdays() 应该返回星期几名称数组', () => {
      const result = TimeUtils.weekdays();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与静态方法对比
      const staticResult = weekdays();
      expect(result).toEqual(staticResult);
    });

    test('TimeUtils.weekdays(true) 应该按本地顺序返回星期几名称数组', () => {
      const result = TimeUtils.weekdays(true);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与静态方法对比
      const staticResult = weekdays(true);
      expect(result).toEqual(staticResult);
    });

    test('TimeUtils.weekdaysShort() 应该返回星期几简短名称数组', () => {
      const result = TimeUtils.weekdaysShort();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与静态方法对比
      const staticResult = weekdaysShort();
      expect(result).toEqual(staticResult);
    });

    test('TimeUtils.weekdaysMin() 应该返回星期几最短名称数组', () => {
      const result = TimeUtils.weekdaysMin();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7);

      // 与静态方法对比
      const staticResult = weekdaysMin();
      expect(result).toEqual(staticResult);
    });

    test('TimeUtils.months() 应该返回月份名称数组', () => {
      const result = TimeUtils.months();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(12);

      // 与静态方法对比
      const staticResult = months();
      expect(result).toEqual(staticResult);
    });

    test('TimeUtils.monthsShort() 应该返回月份简短名称数组', () => {
      const result = TimeUtils.monthsShort();
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
      moment.locale('zh-cn');

      const weekdaysResult = weekdays();
      const monthsResult = months();

      // 验证返回的是中文名称
      expect(weekdaysResult).toContain('星期日');
      expect(monthsResult).toContain('一月');

      // 与 moment 对比
      expect(weekdaysResult).toEqual(moment.weekdays());
      expect(monthsResult).toEqual(moment.months());
    });

    test('设置英文 locale 后，应该返回英文的星期几和月份名称', () => {
      // 设置英文 locale
      moment.locale('en');

      const weekdaysResult = weekdays();
      const monthsResult = months();

      // 验证返回的是英文名称
      expect(weekdaysResult).toContain('Sunday');
      expect(monthsResult).toContain('January');

      // 与 moment 对比
      expect(weekdaysResult).toEqual(moment.weekdays());
      expect(monthsResult).toEqual(moment.months());
    });

    test('TimeUtils 在不同 locale 下应该返回正确的名称', () => {
      // 测试中文
      moment.locale('zh-cn');
      const zhWeekdays = TimeUtils.weekdays();
      const zhMonths = TimeUtils.months();

      expect(zhWeekdays).toContain('星期日');
      expect(zhMonths).toContain('一月');

      // 测试英文
      moment.locale('en');
      const enWeekdays = TimeUtils.weekdays();
      const enMonths = TimeUtils.months();

      expect(enWeekdays).toContain('Sunday');
      expect(enMonths).toContain('January');
    });
  });

  describe('链式调用测试', () => {
    test('TimeUtils 方法应该独立于时间实例正常工作', () => {
      const timeInstance = TimeUtils.create('2024-01-01');

      // 时间操作不应该影响 locale 相关方法
      timeInstance.add(1, 'day');
      const weekdaysResult = TimeUtils.weekdays();
      const monthsResult = TimeUtils.months();

      expect(Array.isArray(weekdaysResult)).toBe(true);
      expect(Array.isArray(monthsResult)).toBe(true);
      expect(weekdaysResult.length).toBe(7);
      expect(monthsResult.length).toBe(12);
    });

    test('locale 相关方法不应该修改时间实例', () => {
      const timeInstance = TimeUtils.create('2024-01-01');
      const originalFormat = timeInstance.format('YYYY-MM-DD');

      // 调用 locale 相关方法
      TimeUtils.weekdays();
      TimeUtils.months();
      TimeUtils.weekdaysShort();
      TimeUtils.monthsShort();
      TimeUtils.weekdaysMin();

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

      // 与 moment 对比
      expect(weekdaysResult).toEqual(moment.weekdays(false));
      expect(weekdaysShortResult).toEqual(moment.weekdaysShort(false));
      expect(weekdaysMinResult).toEqual(moment.weekdaysMin(false));
    });

    test('不同的 TimeInstance 实例应该返回相同的 locale 数据', () => {
      const instance1 = TimeUtils.create('2024-01-01');
      const instance2 = TimeUtils.create('2024-12-31');

      expect(TimeUtils.weekdays()).toEqual(TimeUtils.weekdays());
      expect(TimeUtils.months()).toEqual(TimeUtils.months());
      expect(TimeUtils.weekdaysShort()).toEqual(TimeUtils.weekdaysShort());
      expect(TimeUtils.monthsShort()).toEqual(TimeUtils.monthsShort());
      expect(TimeUtils.weekdaysMin()).toEqual(TimeUtils.weekdaysMin());
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
      expect(duration).toBeLessThan(1000);
    });

    test('TimeUtils 的 locale 方法应该有良好的性能', () => {
      const iterations = 1000;

      const startTime = Date.now();
      for (let i = 0; i < iterations; i++) {
        TimeUtils.weekdays();
        TimeUtils.weekdaysShort();
        TimeUtils.weekdaysMin();
        TimeUtils.months();
        TimeUtils.monthsShort();
      }
      const duration = Date.now() - startTime;

      // 1000次调用应该在合理时间内完成
      expect(duration).toBeLessThan(600);
    });
  });

  describe('与 moment 行为对比测试', () => {
    test('所有 locale 方法都应该与 moment 完全一致', () => {
      // 测试多种 locale
      const locales = ['en', 'zh-cn'];

      locales.forEach(loc => {
        moment.locale(loc);

        // 对比所有方法
        expect(weekdays()).toEqual(moment.weekdays());
        expect(weekdays(true)).toEqual(moment.weekdays(true));
        expect(weekdays(false)).toEqual(moment.weekdays(false));

        expect(weekdaysShort()).toEqual(moment.weekdaysShort());
        expect(weekdaysShort(true)).toEqual(moment.weekdaysShort(true));
        expect(weekdaysShort(false)).toEqual(moment.weekdaysShort(false));

        expect(weekdaysMin()).toEqual(moment.weekdaysMin());
        expect(weekdaysMin(true)).toEqual(moment.weekdaysMin(true));
        expect(weekdaysMin(false)).toEqual(moment.weekdaysMin(false));

        expect(months()).toEqual(moment.months());
        expect(monthsShort()).toEqual(moment.monthsShort());
      });
    });

    test('TimeUtils 方法应该与对应的静态方法返回相同结果', () => {
      expect(TimeUtils.weekdays()).toEqual(weekdays());
      expect(TimeUtils.weekdays(true)).toEqual(weekdays(true));
      expect(TimeUtils.weekdays(false)).toEqual(weekdays(false));

      expect(TimeUtils.weekdaysShort()).toEqual(weekdaysShort());
      expect(TimeUtils.weekdaysShort(true)).toEqual(weekdaysShort(true));
      expect(TimeUtils.weekdaysShort(false)).toEqual(weekdaysShort(false));

      expect(TimeUtils.weekdaysMin()).toEqual(weekdaysMin());
      expect(TimeUtils.weekdaysMin(true)).toEqual(weekdaysMin(true));
      expect(TimeUtils.weekdaysMin(false)).toEqual(weekdaysMin(false));

      expect(TimeUtils.months()).toEqual(months());
      expect(TimeUtils.monthsShort()).toEqual(monthsShort());
    });
  });
});
