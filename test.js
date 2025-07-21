import dayjs, { setDefaultTimezone, getTime, toString, setSystemTimezone, getTodayStartTimestamp } from './index.js';

describe('setDefaultTimezone', () => {
  beforeAll(() => {
    setDefaultTimezone('Asia/Dubai'); // 强制覆盖默认值
  });

  test('新创建的 dayjs 对象应使用默认时区', () => {
    const now = dayjs().tz(); // 显式转换为当前时区
    expect(now.format('Z')).toBe('+04:00');
  });

  test('修改默认时区后应生效', () => {
    setDefaultTimezone('Asia/Tokyo');
    const now = dayjs().tz();
    expect(now.format('Z')).toBe('+09:00');
  });
});

describe('时间相关接口', () => {
  beforeAll(() => {
    setDefaultTimezone('Asia/Dubai');
  });

  describe('getTime', () => {
    test('应返回有效的时间戳', () => {
      const timestamp = getTime();
      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(0);
    });

    test('时间戳应接近当前系统时间', () => {
      const libTimestamp = getTime();
      const systemTimestamp = Date.now();
      // 允许100ms误差（考虑执行时间）
      expect(Math.abs(libTimestamp - systemTimestamp)).toBeLessThan(100);
    });
  });
});

describe('toString', () => {
  beforeAll(() => {
    setDefaultTimezone('Asia/Shanghai'); // UTC+8
  });

  test('应返回当前时区的格式化时间', () => {
    const nowStr = toString(undefined, 'YYYY-MM-DD HH:mm:ss Z');
    expect(nowStr).toContain('+08:00'); // 检查时区偏移
  });

  test('应正确处理传入的时间戳', () => {
    const timestamp = Date.now();
    const formatted = toString(timestamp, 'YYYY-MM-DD');
    expect(formatted).toBe(dayjs(timestamp).tz('Asia/Shanghai').format('YYYY-MM-DD'));
  });

  test('时区变更应生效', () => {
    setDefaultTimezone('America/New_York'); // UTC-5
    const nyTime = toString(undefined, 'HH:mm');
    expect(nyTime).toMatch(/^\d{2}:\d{2}$/);
    const actualOffset = dayjs().tz('America/New_York').format('Z');
    expect(actualOffset).toMatch(/^-0[45]:00$/); // 接受-04:00或-05:00
  });

  test('时区变更应生效2', () => {
    setDefaultTimezone('Asia/Dubai'); // UTC+4
    const nyTime = toString(undefined, 'YYYY-MM-DD');
    const actualOffset = dayjs(nyTime).tz('Asia/Dubai').format('Z');
    expect(actualOffset).toBe("+04:00")
  });

  test('时区变更应生效3', () => {
    setDefaultTimezone('Asia/Dubai'); // UTC+4
    const time = 1753083576510;
    const nowStr = toString(1753083576510, 'YYYY-MM-DD HH:mm:ss Z');
    expect(nowStr).toBe("2025-07-21 11:39:36 +04:00")
    setDefaultTimezone('Asia/Shanghai'); // UTC+4
    const nowStr1 = toString(1753083576510, 'YYYY-MM-DD HH:mm:ss Z');
    expect(nowStr1).toBe("2025-07-21 15:39:36 +08:00")
  });
});

describe('getTime isDate', () => {
  beforeAll(() => {
    setDefaultTimezone('Asia/Jakarta'); // UTC+7
    setSystemTimezone('Asia/Shanghai'); // UTC+8
  });

  test('不调整时应返回当前时区时间戳', () => {
    const timestamp = getTime();
    expect(timestamp).toBeGreaterThan(0);
  });

  test('调整时应补上时区差', () => {
    const adjustedTimestamp = getTime(true);
    const expectedDiff = 60 * 60 * 1000; // 1小时差
    const unadjustedTimestamp = getTime();
    
    expect(adjustedTimestamp - unadjustedTimestamp).toBe(expectedDiff);
  });

  test('时间戳应正确反映系统时区时间', () => {
    const adjustedTimestamp = getTime(true);
    const shanghaiTime = dayjs(adjustedTimestamp).tz('Asia/Shanghai');
    const jakartaTime = dayjs(adjustedTimestamp).tz('Asia/Jakarta');
    
    // 上海时间应该比雅加达时间快1小时
    expect(shanghaiTime.hour()).toBe(jakartaTime.hour() + 1);
  });
});

describe('getTodayStartTimestamp', () => {
  beforeAll(() => {
    setDefaultTimezone('Asia/Jakarta'); // UTC+7
    setSystemTimezone('Asia/Shanghai'); // UTC+8
  });

  test('跨时区测试 末尾1小时', () => {
    // 模拟当前时间是2025-01-01 23:58:00
    const time = 1735747080000;
    const timestamp = getTodayStartTimestamp(time);
    expect(timestamp).toBe(1735664400000); // 2025-01-01 01:00:00
  });

  test('跨时区测试 开始1小时', () => {
       // 模拟当前时间是2025-01-02 00:58:00
    const time = 1735750680000;
    const timestamp = getTodayStartTimestamp(time);
    expect(timestamp).toBe(1735664400000); // 2025-01-01 01:00:00
  });

    test('跨时区测试 开始1小时 2', () => {
       // 模拟当前时间是2025-01-03 00:58:00
    const time = 1735837080000;
    const timestamp = getTodayStartTimestamp(time);
    expect(timestamp).toBe(1735750800000); // 2025-01-02 01:00:00
  });

});