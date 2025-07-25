import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import {
  TimeUtils,
  createTime,
  addTime,
  subtractTime,
  setTimeLibrary,
  TimeLibraryType
} from '../index';

// 启用 dayjs 插件
dayjs.extend(weekOfYear);
dayjs.extend(quarterOfYear);

describe('add 和 subtract 方法 week/quarter 参数测试', () => {
  beforeEach(() => {
    setTimeLibrary(TimeLibraryType.DAYJS);
  });

  describe('add 方法 week 参数测试', () => {
    test('应该正确添加周数', () => {
      const testCases = [
        {
          baseDate: '2025-07-24', // 星期四
          weeks: 1,
          expected: '2025-07-31', // 下周四
          description: '添加1周'
        },
        {
          baseDate: '2025-07-24',
          weeks: 2,
          expected: '2025-08-07', // 2周后
          description: '添加2周'
        },
        {
          baseDate: '2025-07-24',
          weeks: 4,
          expected: '2025-08-21', // 4周后
          description: '添加4周'
        },
        {
          baseDate: '2025-07-24',
          weeks: 0,
          expected: '2025-07-24', // 无变化
          description: '添加0周'
        }
      ];

      testCases.forEach(({ baseDate, weeks, expected, description }) => {
        // 测试 TimeInstance 的 add 方法
        const timeInstanceResult = TimeUtils.create(baseDate)
          .add(weeks, 'week');

        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(expected);

        // 测试函数式 API
        const functionalResult = addTime(createTime(baseDate), weeks, 'week');
        expect(dayjs(functionalResult).format('YYYY-MM-DD')).toBe(expected);

        // 与 dayjs 对比
        const dayjsResult = dayjs(baseDate).add(weeks, 'week');
        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(
          dayjsResult.format('YYYY-MM-DD')
        );
      });
    });

    test('跨月的周数添加', () => {
      const testCases = [
        {
          baseDate: '2025-07-28', // 7月最后一周
          weeks: 1,
          expected: '2025-08-04', // 8月第一周
          description: '跨月添加1周'
        },
        {
          baseDate: '2025-01-27', // 1月最后一周
          weeks: 2,
          expected: '2025-02-10', // 2月第二周
          description: '跨月添加2周'
        }
      ];

      testCases.forEach(({ baseDate, weeks, expected, description }) => {
        const timeInstanceResult = TimeUtils.create(baseDate).add(weeks, 'week');
        const dayjsResult = dayjs(baseDate).add(weeks, 'week');

        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(expected);
        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(
          dayjsResult.format('YYYY-MM-DD')
        );
      });
    });

    test('跨年的周数添加', () => {
      const testCases = [
        {
          baseDate: '2024-12-26', // 2024年最后一周
          weeks: 1,
          expected: '2025-01-02', // 2025年第一周
          description: '跨年添加1周'
        },
        {
          baseDate: '2024-12-19',
          weeks: 3,
          expected: '2025-01-09', // 跨年添加3周
          description: '跨年添加3周'
        }
      ];

      testCases.forEach(({ baseDate, weeks, expected, description }) => {
        const timeInstanceResult = TimeUtils.create(baseDate).add(weeks, 'week');
        const dayjsResult = dayjs(baseDate).add(weeks, 'week');

        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(expected);
        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(
          dayjsResult.format('YYYY-MM-DD')
        );

        // 验证年份变化
        if (baseDate.startsWith('2024') && expected.startsWith('2025')) {
          expect(timeInstanceResult.getYear()).toBe(2025);
        }
      });
    });

    test('大量周数添加', () => {
      const baseDate = '2025-07-24';
      const largeWeeks = [10, 26, 52, 104]; // 10周、半年、1年、2年

      largeWeeks.forEach(weeks => {
        const timeInstanceResult = TimeUtils.create(baseDate).add(weeks, 'week');
        const dayjsResult = dayjs(baseDate).add(weeks, 'week');

        expect(timeInstanceResult.valueOf()).toBe(dayjsResult.valueOf());
        expect(timeInstanceResult.format('YYYY-MM-DD HH:mm:ss')).toBe(
          dayjsResult.format('YYYY-MM-DD HH:mm:ss')
        );
      });
    });

    test('带时间的周数添加', () => {
      const baseDate = '2025-07-24 15:30:45.123';
      const weeks = 3;

      const timeInstanceResult = TimeUtils.create(baseDate).add(weeks, 'week');
      const dayjsResult = dayjs(baseDate).add(weeks, 'week');

      // 日期应该变化，但时间部分应该保持
      expect(timeInstanceResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
        dayjsResult.format('YYYY-MM-DD HH:mm:ss.SSS')
      );
      expect(timeInstanceResult.format('HH:mm:ss.SSS')).toBe('15:30:45.123');
    });
  });

  describe('add 方法 quarter 参数测试', () => {
    test('应该正确添加季度', () => {
      const testCases = [
        {
          baseDate: '2025-01-15', // Q1
          quarters: 1,
          expected: '2025-04-15', // Q2
          description: 'Q1添加1季度到Q2'
        },
        {
          baseDate: '2025-04-20', // Q2
          quarters: 1,
          expected: '2025-07-20', // Q3
          description: 'Q2添加1季度到Q3'
        },
        {
          baseDate: '2025-07-24', // Q3
          quarters: 1,
          expected: '2025-10-24', // Q4
          description: 'Q3添加1季度到Q4'
        },
        {
          baseDate: '2025-10-10', // Q4
          quarters: 1,
          expected: '2026-01-10', // 下年Q1
          description: 'Q4添加1季度到下年Q1'
        },
        {
          baseDate: '2025-07-24',
          quarters: 0,
          expected: '2025-07-24', // 无变化
          description: '添加0季度'
        }
      ];

      testCases.forEach(({ baseDate, quarters, expected, description }) => {
        // 测试 TimeInstance 的 add 方法
        const timeInstanceResult = TimeUtils.create(baseDate)
          .add(quarters, 'quarter');

        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(expected);

        // 测试函数式 API
        const functionalResult = addTime(createTime(baseDate), quarters, 'quarter');
        expect(dayjs(functionalResult).format('YYYY-MM-DD')).toBe(expected);

        // 与 dayjs 对比
        const dayjsResult = dayjs(baseDate).add(quarters, 'quarter');
        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(
          dayjsResult.format('YYYY-MM-DD')
        );
      });
    });

    test('跨年的季度添加', () => {
      const testCases = [
        {
          baseDate: '2025-10-15', // Q4
          quarters: 2,
          expected: '2026-04-15', // 下年Q2
          description: '跨年添加2季度'
        },
        {
          baseDate: '2025-01-31', // Q1最后一天
          quarters: 4,
          expected: '2026-01-31', // 下年同一天
          description: '添加4季度（1年）'
        },
        {
          baseDate: '2024-12-15', // 上年Q4
          quarters: 1,
          expected: '2025-03-15', // 当年Q1
          description: '从上年Q4到当年Q1'
        }
      ];

      testCases.forEach(({ baseDate, quarters, expected, description }) => {
        const timeInstanceResult = TimeUtils.create(baseDate).add(quarters, 'quarter');
        const dayjsResult = dayjs(baseDate).add(quarters, 'quarter');

        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(expected);
        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(
          dayjsResult.format('YYYY-MM-DD')
        );

        // 验证季度计算
        const resultQuarter = dayjs(timeInstanceResult.toObject()).quarter();
        const expectedQuarter = dayjs(expected).quarter();
        expect(resultQuarter).toBe(expectedQuarter);
      });
    });

    test('多季度添加', () => {
      const baseDate = '2025-07-24';
      const multipleQuarters = [2, 3, 4, 8, 12]; // 2季度、3季度、1年、2年、3年

      multipleQuarters.forEach(quarters => {
        const timeInstanceResult = TimeUtils.create(baseDate).add(quarters, 'quarter');
        const dayjsResult = dayjs(baseDate).add(quarters, 'quarter');

        expect(timeInstanceResult.valueOf()).toBe(dayjsResult.valueOf());
        expect(timeInstanceResult.format('YYYY-MM-DD HH:mm:ss')).toBe(
          dayjsResult.format('YYYY-MM-DD HH:mm:ss')
        );
      });
    });

    test('特殊日期的季度添加', () => {
      const testCases = [
        {
          baseDate: '2024-02-29', // 闰年2月29日
          quarters: 1,
          expected: '2024-05-29', // Q2
          description: '闰年2月29日添加1季度'
        },
        {
          baseDate: '2025-01-31', // 1月31日
          quarters: 1,
          expected: '2025-04-30', // 4月30日（因为没有4月31日）
          description: '1月31日添加1季度，自动调整为4月30日'
        },
        {
          baseDate: '2025-03-31', // 3月31日
          quarters: 1,
          expected: '2025-06-30', // 6月30日（因为没有6月31日）
          description: '3月31日添加1季度，自动调整为6月30日'
        }
      ];

      testCases.forEach(({ baseDate, quarters, expected, description }) => {
        const timeInstanceResult = TimeUtils.create(baseDate).add(quarters, 'quarter');
        const dayjsResult = dayjs(baseDate).add(quarters, 'quarter');

        // 与 dayjs 行为保持一致
        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(
          dayjsResult.format('YYYY-MM-DD')
        );
      });
    });

    test('带时间的季度添加', () => {
      const baseDate = '2025-07-24 15:30:45.123';
      const quarters = 2;

      const timeInstanceResult = TimeUtils.create(baseDate).add(quarters, 'quarter');
      const dayjsResult = dayjs(baseDate).add(quarters, 'quarter');

      // 日期应该变化，但时间部分应该保持
      expect(timeInstanceResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
        dayjsResult.format('YYYY-MM-DD HH:mm:ss.SSS')
      );
      expect(timeInstanceResult.format('HH:mm:ss.SSS')).toBe('15:30:45.123');
    });
  });

  describe('subtract 方法 week 参数测试', () => {
    test('应该正确减去周数', () => {
      const testCases = [
        {
          baseDate: '2025-07-24', // 星期四
          weeks: 1,
          expected: '2025-07-17', // 上周四
          description: '减去1周'
        },
        {
          baseDate: '2025-07-24',
          weeks: 2,
          expected: '2025-07-10', // 2周前
          description: '减去2周'
        },
        {
          baseDate: '2025-07-24',
          weeks: 4,
          expected: '2025-06-26', // 4周前
          description: '减去4周'
        }
      ];

      testCases.forEach(({ baseDate, weeks, expected, description }) => {
        const timeInstanceResult = TimeUtils.create(baseDate).subtract(weeks, 'week');
        const functionalResult = subtractTime(createTime(baseDate), weeks, 'week');
        const dayjsResult = dayjs(baseDate).subtract(weeks, 'week');

        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(expected);
        expect(dayjs(functionalResult).format('YYYY-MM-DD')).toBe(expected);
        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(
          dayjsResult.format('YYYY-MM-DD')
        );
      });
    });

    test('跨年的周数减法', () => {
      const testCases = [
        {
          baseDate: '2025-01-09', // 2025年第二周
          weeks: 2,
          expected: '2024-12-26', // 2024年最后一周
          description: '跨年减去2周'
        },
        {
          baseDate: '2025-01-16',
          weeks: 4,
          expected: '2024-12-19',
          description: '跨年减去4周'
        }
      ];

      testCases.forEach(({ baseDate, weeks, expected, description }) => {
        const timeInstanceResult = TimeUtils.create(baseDate).subtract(weeks, 'week');
        const dayjsResult = dayjs(baseDate).subtract(weeks, 'week');

        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(expected);
        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(
          dayjsResult.format('YYYY-MM-DD')
        );

        // 验证年份变化
        if (baseDate.startsWith('2025') && expected.startsWith('2024')) {
          expect(timeInstanceResult.getYear()).toBe(2024);
        }
      });
    });
  });

  describe('subtract 方法 quarter 参数测试', () => {
    test('应该正确减去季度', () => {
      const testCases = [
        {
          baseDate: '2025-07-24', // Q3
          quarters: 1,
          expected: '2025-04-24', // Q2
          description: 'Q3减去1季度到Q2'
        },
        {
          baseDate: '2025-04-15', // Q2
          quarters: 1,
          expected: '2025-01-15', // Q1
          description: 'Q2减去1季度到Q1'
        },
        {
          baseDate: '2025-01-20', // Q1
          quarters: 1,
          expected: '2024-10-20', // 上年Q4
          description: 'Q1减去1季度到上年Q4'
        }
      ];

      testCases.forEach(({ baseDate, quarters, expected, description }) => {
        const timeInstanceResult = TimeUtils.create(baseDate).subtract(quarters, 'quarter');
        const functionalResult = subtractTime(createTime(baseDate), quarters, 'quarter');
        const dayjsResult = dayjs(baseDate).subtract(quarters, 'quarter');

        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(expected);
        expect(dayjs(functionalResult).format('YYYY-MM-DD')).toBe(expected);
        expect(timeInstanceResult.format('YYYY-MM-DD')).toBe(
          dayjsResult.format('YYYY-MM-DD')
        );
      });
    });

    test('多季度减法', () => {
      const baseDate = '2025-07-24';
      const multipleQuarters = [2, 4, 8]; // 2季度、1年、2年

      multipleQuarters.forEach(quarters => {
        const timeInstanceResult = TimeUtils.create(baseDate).subtract(quarters, 'quarter');
        const dayjsResult = dayjs(baseDate).subtract(quarters, 'quarter');

        expect(timeInstanceResult.valueOf()).toBe(dayjsResult.valueOf());
        expect(timeInstanceResult.format('YYYY-MM-DD HH:mm:ss')).toBe(
          dayjsResult.format('YYYY-MM-DD HH:mm:ss')
        );
      });
    });
  });

  describe('week 和 quarter 组合测试', () => {
    test('链式调用组合week和quarter', () => {
      const baseDate = '2025-07-24';

      // 添加1季度，然后添加2周
      const result1 = TimeUtils.create(baseDate)
        .add(1, 'quarter')
        .add(2, 'week');

      const dayjsResult1 = dayjs(baseDate)
        .add(1, 'quarter')
        .add(2, 'week');

      expect(result1.format('YYYY-MM-DD HH:mm:ss')).toBe(
        dayjsResult1.format('YYYY-MM-DD HH:mm:ss')
      );

      // 减去1季度，然后减去3周
      const result2 = TimeUtils.create(baseDate)
        .subtract(1, 'quarter')
        .subtract(3, 'week');

      const dayjsResult2 = dayjs(baseDate)
        .subtract(1, 'quarter')
        .subtract(3, 'week');

      expect(result2.format('YYYY-MM-DD HH:mm:ss')).toBe(
        dayjsResult2.format('YYYY-MM-DD HH:mm:ss')
      );
    });

    test('复杂的week和quarter混合操作', () => {
      const baseDate = '2025-01-01';

      // 复杂链式：+2季度 -4周 +1季度 +3周
      const complexResult = TimeUtils.create(baseDate)
        .add(2, 'quarter')    // 2025-07-01
        .subtract(4, 'week')  // 2025-06-03
        .add(1, 'quarter')    // 2025-09-03
        .add(3, 'week');      // 2025-09-24

      const dayjsComplexResult = dayjs(baseDate)
        .add(2, 'quarter')
        .subtract(4, 'week')
        .add(1, 'quarter')
        .add(3, 'week');

      expect(complexResult.format('YYYY-MM-DD HH:mm:ss')).toBe(
        dayjsComplexResult.format('YYYY-MM-DD HH:mm:ss')
      );
    });
  });

  describe('边界情况和性能测试', () => {
    test('负数参数测试', () => {
      const baseDate = '2025-07-24';

      // 添加负数周等于减法
      const negativeWeekAdd = TimeUtils.create(baseDate).add(-2, 'week');
      const positiveWeekSubtract = TimeUtils.create(baseDate).subtract(2, 'week');
      expect(negativeWeekAdd.valueOf()).toBe(positiveWeekSubtract.valueOf());

      // 添加负数季度等于减法
      const negativeQuarterAdd = TimeUtils.create(baseDate).add(-1, 'quarter');
      const positiveQuarterSubtract = TimeUtils.create(baseDate).subtract(1, 'quarter');
      expect(negativeQuarterAdd.valueOf()).toBe(positiveQuarterSubtract.valueOf());
    });

    test('大量week/quarter操作性能测试', () => {
      const iterations = 1000;
      const baseDate = '2025-07-24';

      const startTime = Date.now();

      for (let i = 0; i < iterations; i++) {
        TimeUtils.create(baseDate)
          .add(i % 10, 'week')
          .add(i % 4, 'quarter')
          .subtract(i % 5, 'week')
          .format('YYYY-MM-DD');
      }

      const duration = Date.now() - startTime;

      // 1000次操作应该在合理时间内完成
      expect(duration).toBeLessThan(500);

      console.log(`week/quarter add/subtract 性能测试: ${iterations}次操作耗时 ${duration}ms`);
    });
  });
});
