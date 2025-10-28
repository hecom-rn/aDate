import { TimeUtils } from '../index';
import moment from 'moment-timezone';

describe('TimeUtils.locale 方法单元测试', () => {
  // 保存原始 locale，用于测试后恢复
  let originalLocale: string;

  beforeEach(() => {
    // 保存当前 locale
    originalLocale = TimeUtils.locale();
  });

  afterEach(() => {
    // 恢复原始 locale
    TimeUtils.locale(originalLocale);
  });

  describe('基础功能测试', () => {
    test('TimeUtils.locale() 应该返回当前 locale 字符串', () => {
      const currentLocale = TimeUtils.locale();
      expect(typeof currentLocale).toBe('string');
      expect(currentLocale).toBeTruthy();
    });

    test('TimeUtils.locale() 应该能够设置 locale 并返回设置后的值', () => {
      const result = TimeUtils.locale('zh-cn');
      expect(result).toBe('zh-cn');
      expect(TimeUtils.locale()).toBe('zh-cn');
    });

    test('TimeUtils.locale() 应该与 moment.locale() 行为一致', () => {
      // 设置我们的库
      const ourResult = TimeUtils.locale('zh-cn');

      // 设置 moment
      const momentResult = moment.locale('zh-cn');

      expect(ourResult).toBe(momentResult);
      expect(TimeUtils.locale()).toBe(moment.locale());
    });
  });

  describe('TimeUtils.locale() 方法测试', () => {
    test('TimeUtils.locale() 不传参数应该返回当前 locale', () => {
      const timeInstance = TimeUtils.create('2025-01-01');

      // 设置特定 locale
      TimeUtils.locale('zh-cn');

      const result = TimeUtils.locale();
      expect(result).toBe('zh-cn');
      expect(typeof result).toBe('string');
    });

    test('locale() 方法应该支持链式调用', () => {
      const timeInstance = TimeUtils.create('2025-01-01');
      TimeUtils.locale('zh-cn');
      const result = timeInstance
        .add(1, 'day')
        .format('YYYY-MM-DD');

      expect(typeof result).toBe('string');
      expect(result).toBe('2025-01-02');
      expect(TimeUtils.locale()).toBe('zh-cn');
    });
  });

  describe('多语言支持测试', () => {
    test('应该支持中文 locale (zh-cn)', () => {
      TimeUtils.locale('zh-cn');

      const weekdays = TimeUtils.weekdays();

      expect(weekdays).toContain('星期日');
      expect(weekdays).toContain('星期一');
      expect(TimeUtils.locale()).toBe('zh-cn');
    });

    test('应该支持英文 locale (en)', () => {
      TimeUtils.locale('en');

      const weekdays = TimeUtils.weekdays();

      expect(weekdays).toContain('Sunday');
      expect(weekdays).toContain('Monday');
      expect(TimeUtils.locale()).toBe('en');
    });

    test('应该支持临时设置locale', () => {
      TimeUtils.locale('en');
      const zh = TimeUtils.create('2025-10-12').locale('zh-cn').format('ddd');
      const en = TimeUtils.create('2025-10-12').format('ddd');
      expect(zh).toContain('周日');
      expect(en).toContain('Sun');
    });

    test('应该支持日文 locale (ja)', () => {
      TimeUtils.locale('ja');

      const timeInstance = TimeUtils.create('2025-01-01');
      // 验证 locale 设置成功
      expect(TimeUtils.locale()).toBe('ja');
    });

    test('应该支持西班牙文 locale (es)', () => {
      TimeUtils.locale('es');

      const timeInstance = TimeUtils.create('2025-01-01');
      // 验证 locale 设置成功
      expect(TimeUtils.locale()).toBe('es');
    });
  });

  describe('locale 设置对时间格式化的影响', () => {
    test('中文 locale 应该影响 weekdays 输出', () => {
      TimeUtils.locale('zh-cn');

      const weekdays = TimeUtils.weekdays();
      const weekdaysShort = TimeUtils.weekdaysShort();
      const months = TimeUtils.months();

      // 验证中文输出
      expect(weekdays[0]).toBe('星期日');
      expect(months[0]).toBe('一月');

      // 与 moment 对比
      expect(weekdays).toEqual(moment.weekdays());
      expect(weekdaysShort).toEqual(moment.weekdaysShort());
      expect(months).toEqual(moment.months());
    });

    test('英文 locale 应该影响 weekdays 输出', () => {
      TimeUtils.locale('en');

      const weekdays = TimeUtils.weekdays();
      const months = TimeUtils.months();

      // 验证英文输出
      expect(weekdays[0]).toBe('Sunday');
      expect(months[0]).toBe('January');

      // 与 moment 对比
      expect(weekdays).toEqual(moment.weekdays());
      expect(months).toEqual(moment.months());
    });

    test('locale 切换应该立即生效', () => {
      // 设置中文
      TimeUtils.locale('zh-cn');
      expect(TimeUtils.weekdays()[0]).toBe('星期日');

      // 切换到英文
      TimeUtils.locale('en');
      expect(TimeUtils.weekdays()[0]).toBe('Sunday');

      // 再切换回中文
      TimeUtils.locale('zh-cn');
      expect(TimeUtils.weekdays()[0]).toBe('星期日');
    });
  });

  describe('错误处理测试', () => {
    test('设置不存在的 locale 应该优雅处理', () => {
      const originalLocale = TimeUtils.locale();

      // 设置一个不存在的 locale
      const result = TimeUtils.locale('invalid-locale');

      // 根据 moment 的行为，不存在的 locale 通常会回退到默认值或保持当前值
      expect(typeof result).toBe('string');
    });

    test('locale() 方法参数验证', () => {
      const timeInstance = TimeUtils.create('2025-01-01');

      // 测试 undefined 参数（应该返回当前 locale）
      const currentLocale = TimeUtils.locale();
      expect(typeof currentLocale).toBe('string');

      // 测试空字符串
      expect(() => {
        TimeUtils.locale('');
      }).not.toThrow();
    });
  });

  describe('与 moment.locale() 一致性测试', () => {
    test('TimeUtils.locale 结果应该与 moment.locale() 一致', () => {
      const testLocales = ['zh-cn', 'en', 'ja', 'es'];

      testLocales.forEach(locale => {
        // 设置我们的库
        const ourResult = TimeUtils.locale(locale);

        // 设置 moment（重新设置以确保同步）
        const momentResult = moment.locale(locale);

        expect(ourResult).toBe(momentResult);
        expect(TimeUtils.locale()).toBe(moment.locale());
      });
    });

    test('weekdays 等方法在不同 locale 下应该与 moment 一致', () => {
      const testLocales = ['zh-cn', 'en'];

      testLocales.forEach(locale => {
        TimeUtils.locale(locale);
        moment.locale(locale);

        expect(TimeUtils.weekdays()).toEqual(moment.weekdays());
        expect(TimeUtils.weekdaysShort()).toEqual(moment.weekdaysShort());
        expect(TimeUtils.weekdaysMin()).toEqual(moment.weekdaysMin());
        expect(TimeUtils.months()).toEqual(moment.months());
        expect(TimeUtils.monthsShort()).toEqual(moment.monthsShort());
      });
    });
  });

  describe('性能测试', () => {
    test('locale 设置和获取应该有合理的性能', () => {
      const iterations = 1000;

      const startTime = Date.now();
      for (let i = 0; i < iterations; i++) {
        TimeUtils.locale('zh-cn');
        TimeUtils.locale();
        TimeUtils.locale('en');
        TimeUtils.locale();
      }
      const endTime = Date.now();

      const duration = endTime - startTime;

      // 性能应该在合理范围内（1000次操作不超过1秒）
      expect(duration).toBeLessThan(1000);
    });

    test('TimeUtils.locale() 性能测试', () => {
      const iterations = 100;
      const timeInstance = TimeUtils.create('2025-01-01');

      const startTime = Date.now();
      for (let i = 0; i < iterations; i++) {
        TimeUtils.locale('zh-cn');
        TimeUtils.locale();
        TimeUtils.locale('en');
        TimeUtils.locale();
      }
      const endTime = Date.now();

      const duration = endTime - startTime;

      // 性能应该在合理范围内
      expect(duration).toBeLessThan(500);
    });
  });

  describe('边界情况测试', () => {
    test('连续设置相同 locale 应该正常工作', () => {
      TimeUtils.locale('zh-cn');
      const result1 = TimeUtils.locale('zh-cn');
      const result2 = TimeUtils.locale('zh-cn');

      expect(result1).toBe('zh-cn');
      expect(result2).toBe('zh-cn');
      expect(TimeUtils.locale()).toBe('zh-cn');
    });

    test('多个 TimeInstance 使用不同 locale', () => {
      TimeUtils.locale('zh-cn');
      const instance1 = TimeUtils.create('2025-01-01');
      TimeUtils.locale('en');
      const instance2 = TimeUtils.create('2025-01-01');

      // 由于 locale 是全局的，最后设置的会生效
      expect(TimeUtils.locale()).toBe('en');

      // 但两个实例都应该正常工作
      expect(instance1.format('YYYY-MM-DD')).toBe('2025-01-01');
      expect(instance2.format('YYYY-MM-DD')).toBe('2025-01-01');
    });
  });
});
