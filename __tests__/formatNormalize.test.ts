import { setTimeLibrary, TimeLibraryType, TimeUtils, formatTime, createTime } from '../index';

describe.skip('format token normalization (Y->y, D->d)', () => {
  beforeAll(() => {
    // 切换到 date-fns 实现，测试格式归一化
    setTimeLibrary(TimeLibraryType.DATE_FNS);
  });

  test('replace YYYY and DD to yyyy and dd', () => {
    const t = createTime('2025-10-23 15:04:05', undefined, 'Asia/Shanghai');
    const out = formatTime(t, 'YYYY-MM-DD');
    expect(out.startsWith('2025-10-23')).toBe(true);
  });

  test('bracket literals remain unchanged', () => {
    const t = createTime('2025-10-05 08:09:10', undefined, 'Asia/Shanghai');
    const out = formatTime(t, '[Year:] YYYY [Day:] DD');
    // 期待形如: Year: 2025 Day: 05
    expect(out).toMatch(/Year:\s+2025\s+Day:\s+05/);
  });

  test('mixed tokens unaffected for others', () => {
    const t = createTime('2025-01-02 03:04:05', undefined, 'Asia/Shanghai');
    const out = formatTime(t, 'YYYY/MM/DD HH:mm:ss');
    expect(out).toBe('2025/01/02 03:04:05');
  });

  afterAll(() => {
    // 切回默认 dayjs 以不影响其他测试
    setTimeLibrary(TimeLibraryType.DATE_FNS);
  });
});
