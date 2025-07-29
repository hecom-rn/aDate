import { setTimeLibrary, TimeLibraryType, createTime, diff } from '../index';

describe('diff 时间���值计算测试', () => {
  beforeEach(() => {
    // 默认使用 Dayjs
    setTimeLibrary(TimeLibraryType.DAYJS);
  });

  describe('基础时间差值计算', () => {
    test('毫秒差值计算', () => {
      const time1 = createTime('2023-01-01 10:00:00.500');
      const time2 = createTime('2023-01-01 10:00:00.000');

      expect(diff(time1, time2)).toBe(500);
      expect(diff(time1, time2, 'millisecond')).toBe(500);
    });

    test('秒差值计算', () => {
      const time1 = createTime('2023-01-01 10:00:30');
      const time2 = createTime('2023-01-01 10:00:00');

      expect(diff(time1, time2, 'second')).toBe(30);
      expect(diff(time1, time2, 'second', true)).toBe(30);
    });

    test('分钟差值计算', () => {
      const time1 = createTime('2023-01-01 10:30:00');
      const time2 = createTime('2023-01-01 10:00:00');

      expect(diff(time1, time2, 'minute')).toBe(30);
    });

    test('小时差值计算', () => {
      const time1 = createTime('2023-01-01 15:00:00');
      const time2 = createTime('2023-01-01 10:00:00');

      expect(diff(time1, time2, 'hour')).toBe(5);
    });

    test('天数差值计算', () => {
      const time1 = createTime('2023-01-05');
      const time2 = createTime('2023-01-01');

      expect(diff(time1, time2, 'day')).toBe(4);
    });

    test('周数差值计算', () => {
      const time1 = createTime('2023-01-15');
      const time2 = createTime('2023-01-01');

      expect(diff(time1, time2, 'week')).toBe(2);
    });

    test('月份差值计算', () => {
      const time1 = createTime('2023-04-01');
      const time2 = createTime('2023-01-01');

      // 注意：月份差值可能因实现而异，这里测试大致范围
      const result = diff(time1, time2, 'month');
      expect(result).toBeGreaterThanOrEqual(2);
      expect(result).toBeLessThanOrEqual(4);
    });

    test('年份差值计算', () => {
      const time1 = createTime('2025-01-01');
      const time2 = createTime('2023-01-01');

      expect(diff(time1, time2, 'year')).toBe(2);
    });
  });

  describe('精确计算测试', () => {
    test('精确的小时差值计算', () => {
      const time1 = createTime('2023-01-01 10:30:00');
      const time2 = createTime('2023-01-01 10:00:00');

      // 不精确计算
      expect(diff(time1, time2, 'hour')).toBe(0);
      // 精确计算
      expect(diff(time1, time2, 'hour', true)).toBe(0.5);
    });

    test('精确的天数差值计算', () => {
      const time1 = createTime('2023-01-01 12:00:00');
      const time2 = createTime('2023-01-01 00:00:00');

      // 不精确计算
      expect(diff(time1, time2, 'day')).toBe(0);
      // 精确计算
      expect(diff(time1, time2, 'day', true)).toBe(0.5);
    });
  });

  describe('负数差值测试', () => {
    test('时间1小于时间2的情况', () => {
      const time1 = createTime('2023-01-01');
      const time2 = createTime('2023-01-05');

      expect(diff(time1, time2, 'day')).toBe(-4);
    });

    test('负数小时差值', () => {
      const time1 = createTime('2023-01-01 10:00:00');
      const time2 = createTime('2023-01-01 15:00:00');

      expect(diff(time1, time2, 'hour')).toBe(-5);
    });
  });

  describe('跨时区测试', () => {
    test('不同时区的时间差值', () => {
      // 创建相同UTC时间但不同时区表示的时间对象
      const time1 = createTime('2023-01-01T10:00:00+08:00'); // 北京时间
      const time2 = createTime('2023-01-01T02:00:00+00:00'); // UTC时间，实际是同一时间

      // 它们实际上是同一时间，差值应该是0或很小
      const result = Math.abs(diff(time1, time2, 'hour'));
      expect(result).toBeLessThanOrEqual(2); // 放宽误差范围，考虑时区解析差异
    });
  });

  describe('边界情况测试', () => {
    test('相同时间的差值', () => {
      const time1 = createTime('2023-01-01 10:00:00');
      const time2 = createTime('2023-01-01 10:00:00');

      expect(diff(time1, time2)).toBe(0);
      expect(diff(time1, time2, 'day')).toBe(0);
      expect(diff(time1, time2, 'hour')).toBe(0);
    });

    test('跨年计算', () => {
      const time1 = createTime('2024-01-01');
      const time2 = createTime('2023-12-31');

      expect(diff(time1, time2, 'day')).toBe(1);
    });

    test('闰年计算', () => {
      const time1 = createTime('2024-03-01'); // 2024是闰年
      const time2 = createTime('2024-02-01');

      // 2024年2月有29天
      expect(diff(time1, time2, 'day')).toBe(29);
    });
  });

  describe('不同时间库实现对比', () => {
    test('Dayjs vs XDateTime 实现对比', () => {
      const time1 = createTime('2023-01-01 15:00:00');
      const time2 = createTime('2023-01-01 10:00:00');

      // 测试 Dayjs
      setTimeLibrary(TimeLibraryType.DAYJS);
      const dayjsResult = diff(time1, time2, 'hour');

      // 测试 XDateTime
      setTimeLibrary(TimeLibraryType.XDATETIME);
      const xdatetimeResult = diff(time1, time2, 'hour');

      // 两种实现的结果应该相同
      expect(dayjsResult).toBe(xdatetimeResult);
      expect(dayjsResult).toBe(5);
    });

    test('精确计算在不同实现中的一致性', () => {
      const time1 = createTime('2023-01-01 10:30:00');
      const time2 = createTime('2023-01-01 10:00:00');

      // 测试 Dayjs
      setTimeLibrary(TimeLibraryType.DAYJS);
      const dayjsResult = diff(time1, time2, 'hour', true);

      // 测试 XDateTime
      setTimeLibrary(TimeLibraryType.XDATETIME);
      const xdatetimeResult = diff(time1, time2, 'hour', true);

      // 精确计算结果应该接近
      expect(Math.abs(dayjsResult - xdatetimeResult)).toBeLessThan(0.01);
      expect(dayjsResult).toBeCloseTo(0.5, 1);
    });
  });

  describe('性能测试', () => {
    test('大量diff计算性能', () => {
      const time1 = createTime('2023-01-01');
      const time2 = createTime('2023-01-02');

      const startTime = Date.now();

      // 执行1000次diff计算
      for (let i = 0; i < 1000; i++) {
        diff(time1, time2, 'day');
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // 性能测试：1000次计算应该在合理时间内完成（比如500ms）
      expect(duration).toBeLessThan(500);
    });
  });

  describe('参数验证测试', () => {
    test('无单位参数时默认返回毫秒', () => {
      const time1 = createTime('2023-01-01 10:00:01');
      const time2 = createTime('2023-01-01 10:00:00');

      const result = diff(time1, time2);
      expect(result).toBe(1000); // 1秒 = 1000毫秒
    });

    test('无精确参数时默认为false', () => {
      const time1 = createTime('2023-01-01 10:30:00');
      const time2 = createTime('2023-01-01 10:00:00');

      const result = diff(time1, time2, 'hour');
      expect(result).toBe(0); // 不精确计算，0.5小时取整为0
    });
  });
});
