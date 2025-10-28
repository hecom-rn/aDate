import {
  setTimeLibrary,
  getCurrentTimeLibrary,
  setDefaultTimezone,
  getTime,
  getCurrentTimestamp,
  now,
  formatTime,
  addTime,
  subtractTime,
  createTime,
  parseTime,
  TimeLibraryType,
  TimeUtils,
  getYear,
  getMonth,
  getDate,
  getDay,
  getHour,
  getMinute,
  getSecond,
  isLeapYear,
  daysInMonth,
  isToday,
  isBefore,
  isAfter,
  isSame,
} from '../index';

describe('时间库抽象层基础功能测试', () => {
  beforeEach(() => {
    // 每个测试前重置为 moment
    setTimeLibrary(TimeLibraryType.MOMENT);
    setDefaultTimezone('Asia/Shanghai');
  });

  describe('基础 API 测试', () => {
    test('应该正确获取当前时间库类型', () => {
      expect(getCurrentTimeLibrary()).toBe(TimeLibraryType.MOMENT);
    });

    test('应该能够切换时间库', () => {
      setTimeLibrary(TimeLibraryType.MOMENT);
      expect(getCurrentTimeLibrary()).toBe(TimeLibraryType.MOMENT);
    });

    test('应该能够创建时间对象', () => {
      const time = createTime('2025-07-24 15:30:00');
      expect(time).toBeDefined();
    });

    test('应该能够获取当前时间', () => {
      const time = now();
      expect(time).toBeDefined();
    });
  });

  describe('时间戳获取测试', () => {
    test('getTime 应该返回正确的时间戳', () => {
      const time = createTime('2025-07-24 15:30:00');
      const timestamp = getTime(time);
      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(0);
    });

    test('getCurrentTimestamp 应该返回当前时间戳', () => {
      const timestamp = getCurrentTimestamp();
      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(0);
    });

    test('带时区调整的时间戳应该不同', () => {
      const time = createTime('2025-07-24 15:30:00');
      const normalTimestamp = getTime(time);
      const adjustedTimestamp = getTime(time, true);

      expect(typeof normalTimestamp).toBe('number');
      expect(typeof adjustedTimestamp).toBe('number');
    });
  });

  describe('时间格式化测试', () => {
    test('应该正确格式化时间', () => {
      const time = createTime('2025-07-24 15:30:45');
      const formatted = formatTime(time, 'YYYY-MM-DD HH:mm:ss');
      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    test('应该支持不同的格式字符串', () => {
      const time = createTime('2025-07-24 15:30:45');
      const dateOnly = formatTime(time, 'YYYY-MM-DD');
      const timeOnly = formatTime(time, 'HH:mm:ss');

      expect(dateOnly).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(timeOnly).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('时间解析测试', () => {
    test('应该正确解析时间字符串', () => {
      const timeStr = '2025-07-24 15:30:45';
      const parsedTime = parseTime(timeStr);
      expect(parsedTime).toBeDefined();

      const formatted = formatTime(parsedTime, 'YYYY-MM-DD HH:mm:ss');
      expect(formatted).toBe(timeStr);
    });

    test('应该正确解析不同格式的时间字符串', () => {
      const timeStr = '2025/07/24';
      const parsedTime = parseTime(timeStr);
      expect(parsedTime).toBeDefined();
    });
  });

  describe('时间计算测试', () => {
    test('应该正确进行时间加法', () => {
      const time = createTime('2025-07-24 15:30:00');
      const tomorrow = addTime(time, 1, 'day');

      const originalFormatted = formatTime(time, 'YYYY-MM-DD');
      const tomorrowFormatted = formatTime(tomorrow, 'YYYY-MM-DD');

      expect(tomorrowFormatted).toBe('2025-07-25');
    });

    test('应该正确进行时间减法', () => {
      const time = createTime('2025-07-24 15:30:00');
      const yesterday = subtractTime(time, 1, 'day');

      const yesterdayFormatted = formatTime(yesterday, 'YYYY-MM-DD');
      expect(yesterdayFormatted).toBe('2025-07-23');
    });

    test('应该支持不同的时间单位', () => {
      const time = createTime('2025-07-24 15:30:00');

      const nextYear = addTime(time, 1, 'year');
      const nextMonth = addTime(time, 1, 'month');
      const nextHour = addTime(time, 1, 'hour');

      expect(getYear(nextYear)).toBe(2026);
      expect(getMonth(nextMonth)).toBe(7); // 7月(索引6) + 1 = 8月(索引7)
      expect(getHour(nextHour)).toBe(16);   // 15时 + 1 = 16时
    });
  });
});

describe('时间获取方法测试', () => {
  beforeEach(() => {
    setTimeLibrary(TimeLibraryType.MOMENT);
  });

  test('应该正确获取时间各部分', () => {
    const time = createTime('2025-07-24 15:30:45');

    expect(getYear(time)).toBe(2025);
    expect(getMonth(time)).toBe(6);   // 7月对应月份索引6（0-11）
    expect(getDate(time)).toBe(24);   // 24日
    expect(getHour(time)).toBe(15);   // 15时
    expect(getMinute(time)).toBe(30); // 30分
    expect(getSecond(time)).toBe(45); // 45秒
  });

  test('应该正确获取星期几', () => {
    const time = createTime('2025-07-24'); // 2025年7月24日是星期四
    const dayOfWeek = getDay(time);
    expect(dayOfWeek).toBeGreaterThanOrEqual(0);
    expect(dayOfWeek).toBeLessThanOrEqual(6);
  });
});

describe('日期判断测试', () => {
  beforeEach(() => {
    setTimeLibrary(TimeLibraryType.MOMENT);
  });

  test('应该正确判断闰年', () => {
    const leapYear = createTime('2024-02-15');
    const normalYear = createTime('2025-02-15');

    expect(isLeapYear(leapYear)).toBe(true);
    expect(isLeapYear(normalYear)).toBe(false);
  });

  test('应该正确获取月份天数', () => {
    const feb2024 = createTime('2024-02-15'); // 闰年2月
    const feb2025 = createTime('2025-02-15'); // 平年2月
    const jan2025 = createTime('2025-01-15'); // 1月

    expect(daysInMonth(feb2024)).toBe(29);
    expect(daysInMonth(feb2025)).toBe(28);
    expect(daysInMonth(jan2025)).toBe(31);
  });

  test('应该正确比较时间', () => {
    const time1 = createTime('2025-07-24 10:00:00');
    const time2 = createTime('2025-07-24 15:00:00');
    const time3 = createTime('2025-07-24 10:00:00');

    expect(isBefore(time1, time2)).toBe(true);
    expect(isAfter(time2, time1)).toBe(true);
    expect(isSame(time1, time3)).toBe(true);
  });
});

describe('TimeUtils 链式调用测试', () => {
  beforeEach(() => {
    setTimeLibrary(TimeLibraryType.MOMENT);
  });

  test('应该支持链式调用', () => {
    const result = TimeUtils.create('2025-07-24 10:00:00')
      .add(1, 'day')
      .hour(15)
      .format('YYYY-MM-DD HH:mm:ss');

    expect(result).toBe('2025-07-25 15:00:00');
  });

  test('应该支持复杂的链式操作', () => {
    const result = TimeUtils.now()
      .year(2025)
      .month(11)  // 12月对应索引11（0-11）
      .date(25)
      .hour(0)
      .minute(0)
      .second(0)
      .format('YYYY-MM-DD HH:mm:ss');

    expect(result).toBe('2025-12-25 00:00:00');
  });

  test('TimeInstance 应该支持获取时间各部分', () => {
    const timeInstance = TimeUtils.create('2025-07-24 15:30:45');

    expect(timeInstance.getYear()).toBe(2025);
    expect(timeInstance.getMonth()).toBe(6);  // 7月对应索引6（0-11）
    expect(timeInstance.getDate()).toBe(24);
    expect(timeInstance.getHour()).toBe(15);
    expect(timeInstance.getMinute()).toBe(30);
    expect(timeInstance.getSecond()).toBe(45);
  });

  test('TimeInstance 应该支持日期判断', () => {
    const leapYear = TimeUtils.create('2024-02-15');
    const normalYear = TimeUtils.create('2025-02-15');

    expect(leapYear.isLeapYear()).toBe(true);
    expect(normalYear.isLeapYear()).toBe(false);
    expect(leapYear.getDaysInMonth()).toBe(29);
    expect(normalYear.getDaysInMonth()).toBe(28);
  });
});

describe('时间库切换测试', () => {
  test('切换时间库后功能应该正常', () => {
    // 测试 moment
    setTimeLibrary(TimeLibraryType.MOMENT);
    const momentTime = createTime('2025-07-24 15:30:00');
    const momentFormatted = formatTime(momentTime, 'YYYY-MM-DD HH:mm:ss');

    // 切换回 moment
    setTimeLibrary(TimeLibraryType.MOMENT);
    expect(getCurrentTimeLibrary()).toBe(TimeLibraryType.MOMENT);
  });

  test('不同时间库的基础功能应该一致', () => {
    const testCases = [
      { input: '2025-07-24 15:30:45', expected: { year: 2025, month: 6, date: 24 } },  // 7月对应索引6
      { input: '2024-02-29 12:00:00', expected: { year: 2024, month: 1, date: 29 } }   // 2月对应索引1
    ];

    [TimeLibraryType.MOMENT].forEach(libraryType => {
      setTimeLibrary(libraryType);

      testCases.forEach(({ input, expected }) => {
        const time = createTime(input);
        expect(getYear(time)).toBe(expected.year);
        expect(getMonth(time)).toBe(expected.month);
        expect(getDate(time)).toBe(expected.date);
      });
    });
  });
});
