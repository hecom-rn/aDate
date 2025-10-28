import {
  TimeUtils,
  createTime,
  formatTime,
  startOfWeek,
  endOfWeek,
  startOfQuarter,
  startOfYear,
  setTimeLibrary,
  TimeLibraryType
} from '../index';
import moment from 'moment-timezone';

describe('边界时间方法测试', () => {
  beforeEach(() => {
    setTimeLibrary(TimeLibraryType.MOMENT);
  });

  describe('startOfWeek 方法测试', () => {
    test('应该返回一周的开始时间（星期日）', () => {
      const testCases = [
        {
          input: '2025-07-20', // 星期日
          expected: '2025-07-20 00:00:00.000',
          description: '星期日应该返回自身的开始时间'
        },
        {
          input: '2025-07-21', // 星期一
          expected: '2025-07-20 00:00:00.000',
          description: '星期一应该返回上一个星期日'
        },
        {
          input: '2025-07-24', // 星期四
          expected: '2025-07-20 00:00:00.000',
          description: '星期四应该返回本周星期日'
        },
        {
          input: '2025-07-26', // 星期六
          expected: '2025-07-20 00:00:00.000',
          description: '星期六应该返回本周星期日'
        }
      ];

      testCases.forEach(({ input, expected, description }) => {
        // 测试函数式 API
        const functionalResult = startOfWeek(createTime(input));
        expect(formatTime(functionalResult, 'YYYY-MM-DD HH:mm:ss.SSS')).toBe(expected);

        // 测试 TimeInstance 方法
        const instanceResult = TimeUtils.create(input).startOfWeek();
        expect(instanceResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(expected);

        // 与 moment 对比
        const momentResult = moment(input).startOf('week');
        expect(instanceResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
            momentResult.format('YYYY-MM-DD HH:mm:ss.SSS')
        );
      });
    });

    test('跨年边界的周开始时间', () => {
      const testCases = [
        {
          input: '2024-12-31', // 2024年最后一天
          description: '2024年最后一天的周开始'
        },
        {
          input: '2025-01-01', // 2025年第一天
          description: '2025年第一天的周开始'
        },
        {
          input: '2025-01-05', // 2025年第一个星期日
          description: '2025年第一个星期日'
        }
      ];

      testCases.forEach(({ input, description }) => {
        const timeUtilsResult = TimeUtils.create(input).startOfWeek();
        const momentResult = moment(input).startOf('week');

        expect(timeUtilsResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
          momentResult.format('YYYY-MM-DD HH:mm:ss.SSS')
        );

        // 验证返回的是星期日
        expect(timeUtilsResult.getDay()).toBe(0);
      });
    });

    test('带时间的日期应该返回当天00:00:00的周开始', () => {
      const input = '2025-07-24 15:30:45.123';
      const timeUtilsResult = TimeUtils.create(input).startOfWeek();
      const momentResult = moment(input).startOf('week');

      expect(timeUtilsResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
        momentResult.format('YYYY-MM-DD HH:mm:ss.SSS')
      );

      // 应该是00:00:00.000
      expect(timeUtilsResult.format('HH:mm:ss.SSS')).toBe('00:00:00.000');
    });
  });

  describe('endOfWeek 方法测试', () => {
    test('应该返回一周的结束时间（星期六 23:59:59.999）', () => {
      const testCases = [
        {
          input: '2025-07-20', // 星期日
          expected: '2025-07-26 23:59:59.999',
          description: '星期日应该返回本周星期六的结束时间'
        },
        {
          input: '2025-07-24', // 星期四
          expected: '2025-07-26 23:59:59.999',
          description: '星期四应该返回本周星期六的结束时间'
        },
        {
          input: '2025-07-26', // 星期六
          expected: '2025-07-26 23:59:59.999',
          description: '星期六应该返回自身的结束时间'
        }
      ];

      testCases.forEach(({ input, expected, description }) => {
        // 测试函数式 API
        const functionalResult = endOfWeek(createTime(input));
        expect(formatTime(functionalResult, 'YYYY-MM-DD HH:mm:ss.SSS')).toBe(expected);

        // 测试 TimeInstance 方法
        const instanceResult = TimeUtils.create(input).endOfWeek();
        expect(instanceResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(expected);

        // 与 moment 对比
        const momentResult = moment(input).endOf('week');
        expect(instanceResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
          momentResult.format('YYYY-MM-DD HH:mm:ss.SSS')
        );

        // 验证是星期六
        expect(instanceResult.getDay()).toBe(6);
      });
    });

    test('跨年边界的周结束时间', () => {
      const testCases = [
        {
          input: '2024-12-29', // 2024年最后一个星期日
          description: '2024年最后一个星期日的周结束'
        },
        {
          input: '2025-01-01', // 2025年第一天
          description: '2025年第一天的周结束'
        }
      ];

      testCases.forEach(({ input, description }) => {
        const timeUtilsResult = TimeUtils.create(input).endOfWeek();
        const momentResult = moment(input).endOf('week');

        expect(timeUtilsResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
          momentResult.format('YYYY-MM-DD HH:mm:ss.SSS')
        );

        // 验证返回的是星期六
        expect(timeUtilsResult.getDay()).toBe(6);
        // 验证时间是23:59:59.999
        expect(timeUtilsResult.format('HH:mm:ss.SSS')).toBe('23:59:59.999');
      });
    });
  });

  describe('startOfQuarter 方法测试', () => {
    test('应该返回季度的开始时间', () => {
      const testCases = [
        {
          input: '2025-01-15', // Q1
          expected: '2025-01-01 00:00:00.000',
          quarter: 1,
          description: '第一季度'
        },
        {
          input: '2025-03-31', // Q1最后一天
          expected: '2025-01-01 00:00:00.000',
          quarter: 1,
          description: '第一季度最后一天'
        },
        {
          input: '2025-04-01', // Q2第一天
          expected: '2025-04-01 00:00:00.000',
          quarter: 2,
          description: '第二季度第一天'
        },
        {
          input: '2025-06-15', // Q2
          expected: '2025-04-01 00:00:00.000',
          quarter: 2,
          description: '第二季度'
        },
        {
          input: '2025-07-24', // Q3
          expected: '2025-07-01 00:00:00.000',
          quarter: 3,
          description: '第三季度'
        },
        {
          input: '2025-10-15', // Q4
          expected: '2025-10-01 00:00:00.000',
          quarter: 4,
          description: '第四季度'
        },
        {
          input: '2025-12-31', // Q4最后一天
          expected: '2025-10-01 00:00:00.000',
          quarter: 4,
          description: '第四季度最后一天'
        }
      ];

      testCases.forEach(({ input, expected, quarter, description }) => {
        // 测试函数式 API
        const functionalResult = startOfQuarter(createTime(input));
        expect(formatTime(functionalResult, 'YYYY-MM-DD HH:mm:ss.SSS')).toBe(expected);

        // 测试 TimeInstance 方法
        const instanceResult = TimeUtils.create(input).startOfQuarter();
        expect(instanceResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(expected);

        // 与 moment 对比
        const momentResult = moment(input).startOf('quarter');
        expect(instanceResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
          momentResult.format('YYYY-MM-DD HH:mm:ss.SSS')
        );

        // 验证季度
        expect(moment(instanceResult.toObject()).quarter()).toBe(quarter);
      });
    });

    test('跨年的季度开始时间', () => {
      const testCases = [
        {
          input: '2024-12-31', // 2024年Q4最后一天
          expected: '2024-10-01 00:00:00.000',
          description: '2024年最后一天'
        },
        {
          input: '2025-01-01', // 2025年Q1第一天
          expected: '2025-01-01 00:00:00.000',
          description: '2025年第一天'
        }
      ];

      testCases.forEach(({ input, expected, description }) => {
        const timeUtilsResult = TimeUtils.create(input).startOfQuarter();
        const momentResult = moment(input).startOf('quarter');

        expect(timeUtilsResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(expected);
        expect(timeUtilsResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
          momentResult.format('YYYY-MM-DD HH:mm:ss.SSS')
        );
      });
    });

    test('带时间的日期应该返回季度开始的00:00:00', () => {
      const input = '2025-07-24 15:30:45.123'; // Q3
      const timeUtilsResult = TimeUtils.create(input).startOfQuarter();
      const momentResult = moment(input).startOf('quarter');

      expect(timeUtilsResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
        momentResult.format('YYYY-MM-DD HH:mm:ss.SSS')
      );

      // 应该是07-01 00:00:00.000
      expect(timeUtilsResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2025-07-01 00:00:00.000');
    });
  });

  describe('startOfYear 方法测试', () => {
    test('应该返回年份的开始时间', () => {
      const testCases = [
        {
          input: '2025-01-01', // 年初
          expected: '2025-01-01 00:00:00.000',
          description: '年初第一天'
        },
        {
          input: '2025-07-24', // 年中
          expected: '2025-01-01 00:00:00.000',
          description: '年中某天'
        },
        {
          input: '2025-12-31', // 年末
          expected: '2025-01-01 00:00:00.000',
          description: '年末最后一天'
        },
        {
          input: '2024-02-29', // 闰年
          expected: '2024-01-01 00:00:00.000',
          description: '闰年2月29日'
        }
      ];

      testCases.forEach(({ input, expected, description }) => {
        // 测试函数式 API
        const functionalResult = startOfYear(createTime(input));
        expect(formatTime(functionalResult, 'YYYY-MM-DD HH:mm:ss.SSS')).toBe(expected);

        // 测试 TimeInstance 方法
        const instanceResult = TimeUtils.create(input).startOfYear();
        expect(instanceResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(expected);

        // 与 moment 对比
        const momentResult = moment(input).startOf('year');
        expect(instanceResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
          momentResult.format('YYYY-MM-DD HH:mm:ss.SSS')
        );

        // 验证是1月1日
        expect(instanceResult.getMonth()).toBe(0); // 0-based month
        expect(instanceResult.getDate()).toBe(1);
      });
    });

    test('不同年份的年开始时间', () => {
      const testCases = [
        { year: 2020, description: '闰年' },
        { year: 2021, description: '平年' },
        { year: 2024, description: '闰年' },
        { year: 2025, description: '平年' }
      ];

      testCases.forEach(({ year, description }) => {
        const input = `${year}-06-15 12:30:45`;
        const expected = `${year}-01-01 00:00:00.000`;

        const timeUtilsResult = TimeUtils.create(input).startOfYear();
        const momentResult = moment(input).startOf('year');

        expect(timeUtilsResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(expected);
        expect(timeUtilsResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
          momentResult.format('YYYY-MM-DD HH:mm:ss.SSS')
        );

        // 验证年份
        expect(timeUtilsResult.getYear()).toBe(year);
      });
    });

    test('带时间的日期应该返回年开始的00:00:00', () => {
      const input = '2025-07-24 15:30:45.123';
      const timeUtilsResult = TimeUtils.create(input).startOfYear();
      const momentResult = moment(input).startOf('year');

      expect(timeUtilsResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
        momentResult.format('YYYY-MM-DD HH:mm:ss.SSS')
      );

      // 应该是01-01 00:00:00.000
      expect(timeUtilsResult.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2025-01-01 00:00:00.000');
    });
  });

  describe('边界方法链式调用测试', () => {
    test('应该支持链式调用组合', () => {
      const baseDate = '2025-07-24 15:30:45';

      // 测试周开始 -> 年开始
      const weekToYear = TimeUtils.create(baseDate)
        .startOfWeek()
        .startOfYear();

      const momentWeekToYear = moment(baseDate)
        .startOf('week')
        .startOf('year');

      expect(weekToYear.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
        momentWeekToYear.format('YYYY-MM-DD HH:mm:ss.SSS')
      );

      // 测试季度开始 -> 周结束
      const quarterToWeekEnd = TimeUtils.create(baseDate)
        .startOfQuarter()
        .endOfWeek();

      const momentQuarterToWeekEnd = moment(baseDate)
        .startOf('quarter')
        .endOf('week');

      expect(quarterToWeekEnd.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
        momentQuarterToWeekEnd.format('YYYY-MM-DD HH:mm:ss.SSS')
      );
    });

    test('复杂的边界时间操作链', () => {
      const baseDate = '2025-07-24';

      // 复杂链式：年开始 -> 加3个季度 -> 季度开始 -> 周结束
      const complexChain = TimeUtils.create(baseDate)
        .startOfYear()      // 2025-01-01
        .add(3, 'quarter')  // 2025-10-01
        .startOfQuarter()   // 2025-10-01 (Q4开始)
        .endOfWeek();       // 该周的星期六结束

      const momentChain = moment(baseDate)
        .startOf('year')
        .add(3, 'quarter')
        .startOf('quarter')
        .endOf('week');

      expect(complexChain.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
        momentChain.format('YYYY-MM-DD HH:mm:ss.SSS')
      );
    });
  });

  describe('边界方法性能测试', () => {
    test('大量边界操作性能应该可接受', () => {
      const iterations = 1000;
      const testDate = '2025-07-24 15:30:45';

      const startTime = Date.now();

      for (let i = 0; i < iterations; i++) {
        TimeUtils.create(testDate)
          .startOfYear()
          .startOfQuarter()
          .startOfWeek()
          .endOfWeek()
          .format('YYYY-MM-DD HH:mm:ss');
      }

      const duration = Date.now() - startTime;

      // 1000次操作应该在合理时间内完成（比如500ms）
      expect(duration).toBeLessThan(500);

      console.log(`边界方法性能测试: ${iterations}次操作耗时 ${duration}ms`);
    });
  });

  describe('边界方法与 moment 一致性验证', () => {
    test('所有边界方法都应与 moment 保持一致', () => {
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

      testDates.forEach(date => {
        const timeInstance = TimeUtils.create(date);
        const momentInstance = moment(date);

        // startOfWeek
        expect(timeInstance.startOfWeek().valueOf()).toBe(
          momentInstance.clone().startOf('week').valueOf()
        );

        // endOfWeek
        expect(timeInstance.endOfWeek().valueOf()).toBe(
          momentInstance.clone().endOf('week').valueOf()
        );

        // startOfQuarter - 添加调试信息
        const timeUtilsQuarter = timeInstance.startOfQuarter().valueOf();
        const momentQuarter = momentInstance.clone().startOf('quarter').valueOf();

        if (timeUtilsQuarter !== momentQuarter) {
          console.log(`Quarter mismatch for ${date}:`);
          console.log(`  TimeUtils: ${timeUtilsQuarter} (${timeInstance.startOfQuarter().format('YYYY-MM-DD HH:mm:ss')})`);
          console.log(`  Moment: ${momentQuarter} (${momentInstance.clone().startOf('quarter').format('YYYY-MM-DD HH:mm:ss')})`);
        }

        expect(timeUtilsQuarter).toBe(momentQuarter);

        // startOfYear
        expect(timeInstance.startOfYear().valueOf()).toBe(
          momentInstance.clone().startOf('year').valueOf()
        );
      });
    });
  });
});
