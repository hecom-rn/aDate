import { MomentTimeLibrary } from '../implementations/MomentTimeLibrary';
import type { TimeObject } from '../interfaces/ITimeLibrary.js';

describe('MomentTimeLibrary 实现测试', () => {
  let library: MomentTimeLibrary;

  beforeEach(() => {
    library = new MomentTimeLibrary();
  });

  test('应该正确创建时间对象', () => {
    const time = library.create('2025-07-24 15:30:45');
    expect(time).toBeDefined();
    expect(library.year(time)).toBe(2025);
    expect(library.month(time)).toBe(6);  // 7月对应索引6（0-11）
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
