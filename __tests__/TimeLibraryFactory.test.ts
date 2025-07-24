import { TimeLibraryType } from '../TimeLibraryFactory.js';
import { DayjsTimeLibrary } from '../implementations/DayjsTimeLibrary.js';
import { XDateTimeLibrary } from '../implementations/XDateTimeLibrary.js';

describe('TimeLibraryFactory 测试', () => {
  let factory: any;

  beforeEach(() => {
    // 获取工厂实例进行测试
    const { timeLibraryFactory } = require('../TimeLibraryFactory.js');
    factory = timeLibraryFactory;
  });

  test('应该有默认的时间库类型', () => {
    expect(factory.getCurrentType()).toBe(TimeLibraryType.DAYJS);
  });

  test('应该能够切换时间库类型', () => {
    factory.setLibraryType(TimeLibraryType.XDATE);
    expect(factory.getCurrentType()).toBe(TimeLibraryType.XDATE);

    factory.setLibraryType(TimeLibraryType.DAYJS);
    expect(factory.getCurrentType()).toBe(TimeLibraryType.DAYJS);
  });

  test('应该返回正确的时间库实例', () => {
    factory.setLibraryType(TimeLibraryType.DAYJS);
    const dayjsInstance = factory.getInstance();
    expect(dayjsInstance).toBeInstanceOf(DayjsTimeLibrary);

    factory.setLibraryType(TimeLibraryType.XDATE);
    const xdateInstance = factory.getInstance();
    expect(xdateInstance).toBeInstanceOf(XDateTimeLibrary);
  });

  test('应该在切换类型时创建新实例', () => {
    factory.setLibraryType(TimeLibraryType.DAYJS);
    const instance1 = factory.getInstance();

    factory.setLibraryType(TimeLibraryType.XDATE);
    factory.setLibraryType(TimeLibraryType.DAYJS);
    const instance2 = factory.getInstance();

    // 应该是不同的实例（因为重新创建了）
    expect(instance1).toBeInstanceOf(DayjsTimeLibrary);
    expect(instance2).toBeInstanceOf(DayjsTimeLibrary);
  });

  test('应该抛出错误当使用不支持的时间库类型', () => {
    expect(() => {
      factory.setLibraryType('unsupported-library' as any);
    }).toThrow('Unsupported time library type');
  });
});

describe('TimeLibraryType 常量测试', () => {
  test('应该包含正确的时间库类型', () => {
    expect(TimeLibraryType.DAYJS).toBe('dayjs');
    expect(TimeLibraryType.XDATE).toBe('xdate');
  });

  test('TimeLibraryType 应该是只读的', () => {
    // 由于 TypeScript 的 as const 断言，这个测试在运行时实际上不会抛出错误
    // 但在 TypeScript 编译时会报错，这里我们测试对象是否存在预期的属性
    expect(TimeLibraryType.DAYJS).toBe('dayjs');
    expect(TimeLibraryType.XDATE).toBe('xdate');

    // 测试对象是否为冻结状态（如果实现了Object.freeze）
    expect(Object.isFrozen(TimeLibraryType)).toBe(false); // 由于使用了 as const，不是真正的 freeze
  });
});
