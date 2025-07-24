import { DayjsTimeLibrary } from '../implementations/DayjsTimeLibrary.js';
import { XDateTimeLibrary } from '../implementations/XDateTimeLibrary.js';
import type { TimeObject } from '../interfaces/ITimeLibrary.js';

describe('DayjsTimeLibrary 实现测试', () => {
  let library: DayjsTimeLibrary;

  beforeEach(() => {
    library = new DayjsTimeLibrary();
  });

  test('应该正确创建时间对象', () => {
    const time = library.create('2025-07-24 15:30:45');
    expect(time).toBeDefined();
    expect(library.year(time)).toBe(2025);
    expect(library.month(time)).toBe(7);
    expect(library.date(time)).toBe(24);
  });

  test('应该正确格式化时间', () => {
    const time = library.create('2025-07-24 15:30:45');
    const formatted = library.format(time, 'YYYY-MM-DD HH:mm:ss');
    expect(formatted).toBe('2025-07-24 15:30:45');
  });

  test('应该正确进行时间计算', () => {
    const time = library.create('2025-07-24 15:30:45');
    const nextDay = library.add(time, 1, 'day');
    const prevDay = library.subtract(time, 1, 'day');

    expect(library.date(nextDay)).toBe(25);
    expect(library.date(prevDay)).toBe(23);
  });

  test('应该正确比较时间', () => {
    const time1 = library.create('2025-07-24 10:00:00');
    const time2 = library.create('2025-07-24 15:00:00');
    const time3 = library.create('2025-07-24 10:00:00');

    expect(library.compare(time1, time2)).toBe(-1);
    expect(library.compare(time2, time1)).toBe(1);
    expect(library.compare(time1, time3)).toBe(0);
  });

  test('应该正确判断日期关系', () => {
    const time1 = library.create('2025-07-24 10:00:00');
    const time2 = library.create('2025-07-24 15:00:00');

    expect(library.isBefore(time1, time2)).toBe(true);
    expect(library.isAfter(time2, time1)).toBe(true);
    expect(library.isSame(time1, time1)).toBe(true);
  });

  test('应该正确处理闰年', () => {
    const leapYear = library.create('2024-02-15');
    const normalYear = library.create('2025-02-15');

    expect(library.isLeapYear(leapYear)).toBe(true);
    expect(library.isLeapYear(normalYear)).toBe(false);
    expect(library.daysInMonth(leapYear)).toBe(29);
    expect(library.daysInMonth(normalYear)).toBe(28);
  });

  test('应该正确获取开始和结束时间', () => {
    const time = library.create('2025-07-24 15:30:45');

    const startOfDay = library.startOfDay(time);
    const endOfDay = library.endOfDay(time);
    const startOfMonth = library.startOfMonth(time);
    const endOfMonth = library.endOfMonth(time);

    expect(library.hour(startOfDay)).toBe(0);
    expect(library.minute(startOfDay)).toBe(0);
    expect(library.second(startOfDay)).toBe(0);

    expect(library.hour(endOfDay)).toBe(23);
    expect(library.minute(endOfDay)).toBe(59);
    expect(library.second(endOfDay)).toBe(59);

    expect(library.date(startOfMonth)).toBe(1);
    expect(library.hour(startOfMonth)).toBe(0);
  });
});

describe('XDateTimeLibrary 实现测试', () => {
  let library: XDateTimeLibrary;

  beforeEach(() => {
    library = new XDateTimeLibrary();
  });

  test('应该正确创建时间对象', () => {
    const time = library.create('2025-07-24 15:30:45');
    expect(time).toBeDefined();
    expect(library.year(time)).toBe(2025);
    expect(library.month(time)).toBe(7);
    expect(library.date(time)).toBe(24);
  });

  test('应该正确格式化时间', () => {
    const time = library.create('2025-07-24 15:30:45');
    const formatted = library.format(time, 'YYYY-MM-DD HH:mm:ss');
    expect(formatted).toBe('2025-07-24 15:30:45');
  });

  test('应该正确进行时间计算', () => {
    const time = library.create('2025-07-24 15:30:45');
    const nextDay = library.add(time, 1, 'day');
    const prevDay = library.subtract(time, 1, 'day');

    expect(library.date(nextDay)).toBe(25);
    expect(library.date(prevDay)).toBe(23);
  });

  test('应该正确比较时间', () => {
    const time1 = library.create('2025-07-24 10:00:00');
    const time2 = library.create('2025-07-24 15:00:00');
    const time3 = library.create('2025-07-24 10:00:00');

    expect(library.compare(time1, time2)).toBe(-1);
    expect(library.compare(time2, time1)).toBe(1);
    expect(library.compare(time1, time3)).toBe(0);
  });

  test('应该正确处理闰年', () => {
    const leapYear = library.create('2024-02-15');
    const normalYear = library.create('2025-02-15');

    expect(library.isLeapYear(leapYear)).toBe(true);
    expect(library.isLeapYear(normalYear)).toBe(false);
    expect(library.daysInMonth(leapYear)).toBe(29);
    expect(library.daysInMonth(normalYear)).toBe(28);
  });

  test('应该正确获取开始和结束时间', () => {
    const time = library.create('2025-07-24 15:30:45');

    const startOfDay = library.startOfDay(time);
    const endOfDay = library.endOfDay(time);

    expect(library.hour(startOfDay)).toBe(0);
    expect(library.minute(startOfDay)).toBe(0);
    expect(library.second(startOfDay)).toBe(0);

    expect(library.hour(endOfDay)).toBe(23);
    expect(library.minute(endOfDay)).toBe(59);
    expect(library.second(endOfDay)).toBe(59);
  });
});

describe('实现类兼容性测试', () => {
  test('两个实现类应该产生一致的结果', () => {
    const dayjsLib = new DayjsTimeLibrary();
    const xdateLib = new XDateTimeLibrary();

    const testDate = '2025-07-24 15:30:45';
    const dayjsTime = dayjsLib.create(testDate);
    const xdateTime = xdateLib.create(testDate);

    // 基本属性应该一致
    expect(dayjsLib.year(dayjsTime)).toBe(xdateLib.year(xdateTime));
    expect(dayjsLib.month(dayjsTime)).toBe(xdateLib.month(xdateTime));
    expect(dayjsLib.date(dayjsTime)).toBe(xdateLib.date(xdateTime));
    expect(dayjsLib.hour(dayjsTime)).toBe(xdateLib.hour(xdateTime));
    expect(dayjsLib.minute(dayjsTime)).toBe(xdateLib.minute(xdateTime));
    expect(dayjsLib.second(dayjsTime)).toBe(xdateLib.second(xdateTime));

    // 闰年判断应该一致
    expect(dayjsLib.isLeapYear(dayjsTime)).toBe(xdateLib.isLeapYear(xdateTime));

    // 月份天数应该一致
    expect(dayjsLib.daysInMonth(dayjsTime)).toBe(xdateLib.daysInMonth(xdateTime));
  });

  test('时间计算结果应该一致', () => {
    const dayjsLib = new DayjsTimeLibrary();
    const xdateLib = new XDateTimeLibrary();

    const testDate = '2025-07-24 15:30:45';
    const dayjsTime = dayjsLib.create(testDate);
    const xdateTime = xdateLib.create(testDate);

    const dayjsNext = dayjsLib.add(dayjsTime, 1, 'day');
    const xdateNext = xdateLib.add(xdateTime, 1, 'day');

    expect(dayjsLib.date(dayjsNext)).toBe(xdateLib.date(xdateNext));
    expect(dayjsLib.format(dayjsNext, 'YYYY-MM-DD')).toBe(xdateLib.format(xdateNext, 'YYYY-MM-DD'));
  });
});
