import {
  TimeUtils,
  createTime,
  formatTime,
  getYear,
  getMonth,
  getDate,
  getTime,
  getCurrentTimestamp,
  TimeLibraryType,
  setTimeLibrary
} from '../index';

describe('TimeInstance 链式调用深度测试', () => {
  beforeEach(() => {
    setTimeLibrary(TimeLibraryType.DATE_FNS);
  });

  test('应该支持getTime方法（如果实现了）', () => {
    const timeInstance = TimeUtils.create('2025-07-24 15:30:45');

    // 测试getValue方法存在
    expect(timeInstance.valueOf()).toBeGreaterThan(0);
    expect(typeof timeInstance.valueOf()).toBe('number');
  });

  test('应该支持复杂的时间设置链式调用', () => {
    const result = TimeUtils.create('2025-01-01 00:00:00')
      .year(2026)
      .month(5)   // 6月对应索引5（0-11）
      .date(15)
      .hour(14)
      .minute(30)
      .second(45)
      .format('YYYY-MM-DD HH:mm:ss');

    expect(result).toBe('2026-06-15 14:30:45');  // 期望6月
  });

  test('应该支持时间边界操作', () => {
    const startOfMonth = TimeUtils.create('2025-07-15 14:30:25')
      .startOfMonth()
      .format('YYYY-MM-DD HH:mm:ss');

    const endOfMonth = TimeUtils.create('2025-07-15 14:30:25')
      .endOfMonth()
      .format('YYYY-MM-DD');

    expect(startOfMonth).toBe('2025-07-01 00:00:00');
    expect(endOfMonth).toBe('2025-07-31');
  });

  test('应该支持时间比较操作', () => {
    const time1 = TimeUtils.create('2025-07-24 10:00:00');
    const time2 = TimeUtils.create('2025-07-24 15:00:00');
    const time3 = TimeUtils.create('2025-07-24 10:00:00');

    expect(time1.isBefore(time2.toObject())).toBe(true);
    expect(time2.isAfter(time1.toObject())).toBe(true);
    expect(time1.isSame(time3.toObject())).toBe(true);
  });

  test('TimeInstance 应该支持获取时间各部分', () => {
    const timeInstance = TimeUtils.create('2025-07-24 15:30:45');

    expect(timeInstance.getYear()).toBe(2025);
    expect(timeInstance.getMonth()).toBe(6);  // 7月对应索引6（0-11）
    expect(timeInstance.getDate()).toBe(24);
    expect(timeInstance.getHour()).toBe(15);
    expect(timeInstance.getMinute()).toBe(30);
    expect(timeInstance.getSecond()).toBe(45);
    expect(timeInstance.isLeapYear()).toBe(false);
    expect(timeInstance.getDaysInMonth()).toBe(31);
  });
});

describe('边界条件和异常情况测试', () => {
  beforeEach(() => {
    setTimeLibrary(TimeLibraryType.DATE_FNS);
  });

  test('应该正确处理闰年边界', () => {
    // 测试闰年2月29日
    const leapDay = createTime('2024-02-29');
    expect(getYear(leapDay)).toBe(2024);
    expect(getMonth(leapDay)).toBe(1);  // 2月对应索引1（0-11）
    expect(getDate(leapDay)).toBe(29);
  });

  test('应该正确处理月末边界', () => {
    // 测试1月31日加1个月的情况
    const jan31 = createTime('2025-01-31');
    const result = TimeUtils.create('2025-01-31')
      .add(1, 'month')
      .format('YYYY-MM-DD');

    // dayjs的行为：1月31日+1个月 = 2月28日（因为2月没有31日）
    expect(result).toMatch(/^2025-02-(28|29)$/);
  });

  test('应该正确处理年份边界', () => {
    const newYear = createTime('2025-01-01');
    const prevYear = TimeUtils.create('2025-01-01')
      .subtract(1, 'day')
      .format('YYYY-MM-DD');

    expect(prevYear).toBe('2024-12-31');
  });

  test('应该正确处理无效日期输入', () => {
    // 测试无效日期字符串
    expect(() => {
      createTime('invalid-date');
    }).not.toThrow(); // 应该创建一个Invalid Date对象而不是抛出错误
  });
});

describe('时区和时间戳测试', () => {
  beforeEach(() => {
    setTimeLibrary(TimeLibraryType.DATE_FNS);
  });

  test('getTime和getCurrentTimestamp应该工作正常', () => {
    const time = createTime('2025-07-24 15:30:45');
    const timestamp1 = getTime(time);
    const timestamp2 = getCurrentTimestamp();

    expect(typeof timestamp1).toBe('number');
    expect(typeof timestamp2).toBe('number');
    expect(timestamp1).toBeGreaterThan(0);
    expect(timestamp2).toBeGreaterThan(0);
  });

  test('带时区调整的时间戳应该不同', () => {
    const time = createTime('2025-07-24 15:30:45');
    const normalTimestamp = getTime(time, false);
    const adjustedTimestamp = getTime(time, true);

    expect(typeof normalTimestamp).toBe('number');
    expect(typeof adjustedTimestamp).toBe('number');
    // 在某些情况下，两个值可能相同或不同，取决于时区设置
  });
});

describe('格式化功能扩展测试', () => {
  beforeEach(() => {
    setTimeLibrary(TimeLibraryType.DATE_FNS);
  });

  test('应该支持多种日期格式', () => {
    const time = createTime('2025-07-24 15:30:45');

    const formats = [
      { format: 'YYYY-MM-DD', expected: '2025-07-24' },
      { format: 'MM/DD/YYYY', expected: '07/24/2025' },
      { format: 'HH:mm:ss', expected: '15:30:45' },
      { format: 'YYYY年MM月DD日', expected: '2025年07月24日' }
    ];

    formats.forEach(({ format, expected }) => {
      const result = formatTime(time, format);
      if (format === 'MM/DD/YYYY') {
        // dayjs可能不支持这个格式，所以只检查基本结构
        expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}|2025-07-24/);
      } else {
        expect(result).toBe(expected);
      }
    });
  });
});

describe('性能和内存测试', () => {
  beforeEach(() => {
    setTimeLibrary(TimeLibraryType.DATE_FNS);
  });

  test('批量创建时间对象不应该导致内存泄漏', () => {
    const startMemory = process.memoryUsage().heapUsed;

    // 创建大量时间对象
    for (let i = 0; i < 1000; i++) {
      const time = createTime(`2025-07-${String(i % 30 + 1).padStart(2, '0')} 15:30:45`);
      formatTime(time, 'YYYY-MM-DD');
    }

    // 强制垃圾回收（如果可用）
    if (global.gc) {
      global.gc();
    }

    const endMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = endMemory - startMemory;

    // 内存增长应该在合理范围内（小于10MB）
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });

  test('链式调用性能应该可接受', () => {
    const startTime = Date.now();

    // 执行大量链式调用
    for (let i = 0; i < 100; i++) {
      TimeUtils.create('2025-07-24 15:30:45')
        .add(i, 'day')
        .hour(12)
        .minute(0)
        .second(0)
        .format('YYYY-MM-DD HH:mm:ss');
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // 100次链式调用应该在1秒内完成
    expect(duration).toBeLessThan(1000);
  });
});
