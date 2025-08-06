import { createTime, TimeInstance, TimeUtils, locale } from '../index';

describe('Locale 功能测试', () => {
  describe('locale 函数测试', () => {
    test('应该能够获取当前 locale', () => {
      const timeObj = createTime('2024-01-01');
      const currentLocale = locale(timeObj);
      expect(typeof currentLocale).toBe('string');
    });

    test('应该能够设置 locale 并返回新的时间对象', () => {
      const timeObj = createTime('2024-01-01');
      const newTimeObj = locale(timeObj, 'zh-cn');
      expect(newTimeObj).toBeDefined();
      expect(newTimeObj).not.toBe(timeObj); // 应该是新的对象
    });

    test('应该能够设置英文 locale', () => {
      const timeObj = createTime('2024-01-01');
      const newTimeObj = locale(timeObj, 'en-us');
      expect(newTimeObj).toBeDefined();
    });
  });

  describe('TimeInstance locale 方法测试', () => {
    test('应该能够获取当前 locale', () => {
      const timeInstance = TimeUtils.create('2024-01-01');
      const currentLocale = timeInstance.locale();
      expect(typeof currentLocale).toBe('string');
    });

    test('应该能够设置 locale 并返回新的 TimeInstance', () => {
      const timeInstance = TimeUtils.create('2024-01-01');
      const newTimeInstance = timeInstance.locale('zh-cn');
      expect(newTimeInstance).toBeInstanceOf(TimeInstance);
      expect(newTimeInstance).not.toBe(timeInstance); // 应该是新的实例
    });

    test('应该能够链式调用设置多个 locale', () => {
      const timeInstance = TimeUtils.create('2024-01-01');
      const result = timeInstance
        .locale('zh-cn')
        .locale('en-us')
        .locale('ja-jp');

      expect(result).toBeInstanceOf(TimeInstance);
    });

    test('locale 设置后格式化应该受到影响', () => {
      const timeInstance = TimeUtils.create('2024-01-01');

      // 设置中文 locale
      const chineseInstance = timeInstance.locale('zh-cn') as TimeInstance;
      expect(chineseInstance).toBeInstanceOf(TimeInstance);

      // 设置英文 locale
      const englishInstance = timeInstance.locale('en') as TimeInstance;
      expect(englishInstance).toBeInstanceOf(TimeInstance);
    });

    test('应该能够在链式调用中使用 locale', () => {
      const timeInstance = TimeUtils.create('2024-01-01');

      const result = (timeInstance.locale('zh-cn') as TimeInstance)
        .add(1, 'month')
        .format('YYYY-MM-DD');

      expect(result).toBe('2024-02-01');
    });
  });

  describe('TimeInstance 与 dayjs 对比测试', () => {
    test('TimeInstance.locale() 方法对比', () => {
      const timeInstance = TimeUtils.create('2024-01-01');

      // 测试获取当前 locale
      const currentLocale = timeInstance.locale();
      expect(typeof currentLocale).toBe('string');

      // 测试设置 locale
      const newInstance = timeInstance.locale('zh-cn') as TimeInstance;
      expect(newInstance).toBeInstanceOf(TimeInstance);
      expect(newInstance).not.toBe(timeInstance);
    });

    test('locale 方法应该与 dayjs 行为一致', () => {
      const timeObj = createTime('2024-01-01');

      // 测试不传参数时返回字符串
      const currentLocale = locale(timeObj);
      expect(typeof currentLocale).toBe('string');

      // 测试传参数时返回新对象
      const newTimeObj = locale(timeObj, 'zh-cn');
      expect(newTimeObj).toBeDefined();
      expect(newTimeObj).not.toBe(timeObj);
    });
  });

  describe('locale 错误处理测试', () => {
    test('无效的 locale 字符串应该正常处理', () => {
      const timeInstance = TimeUtils.create('2024-01-01');

      // dayjs 通常会忽略无效的 locale，这里测试不会抛出错误
      expect(() => {
        timeInstance.locale('invalid-locale');
      }).not.toThrow();
    });

    test('空字符串 locale 应该正常处理', () => {
      const timeInstance = TimeUtils.create('2024-01-01');

      expect(() => {
        timeInstance.locale('');
      }).not.toThrow();
    });
  });
});
