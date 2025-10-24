import { createTime, TimeInstance, TimeUtils, cloneTime } from '../index';
import { timeLibraryFactory } from '../TimeLibraryFactory';

// 测试 clone 方法的基本功能
describe('Clone Method Tests', () => {

  test('cloneTime function should work', () => {
    const timeObj = createTime('2023-01-01');
    const clonedTimeObj = cloneTime(timeObj);

    // 验证克隆对象不是同一个引用
    expect(clonedTimeObj).not.toBe(timeObj);

    // 验证克隆对象的值相同
    expect(clonedTimeObj.valueOf()).toBe(timeObj.valueOf());
    expect(clonedTimeObj.format('YYYY-MM-DD')).toBe(timeObj.format('YYYY-MM-DD'));
  });

  test('TimeInstance clone method should work', () => {
    const timeInstance = TimeUtils.create('2023-01-01');
    const clonedInstance = timeInstance.clone();

    // 验证克隆实例不是同一个引用
    expect(clonedInstance).not.toBe(timeInstance);

    // 验证克隆实例的值相同
    expect(clonedInstance.valueOf()).toBe(timeInstance.valueOf());
    expect(clonedInstance.format('YYYY-MM-DD')).toBe(timeInstance.format('YYYY-MM-DD'));
  });

  test('MomentTimeLibrary clone method should work', () => {
    const timeObj = createTime('2023-01-01');
    const clonedTimeObj = timeLibraryFactory.getInstance().clone(timeObj);

    // 验证克隆对象不是同一个引用
    expect(clonedTimeObj).not.toBe(timeObj);

    // 验证克隆对象的值相同
    expect(clonedTimeObj.valueOf()).toBe(timeObj.valueOf());
    expect(clonedTimeObj.format('YYYY-MM-DD')).toBe(timeObj.format('YYYY-MM-DD'));
  });

  test('Clone should create independent objects', () => {
    const original = createTime('2023-06-15 10:30:00');
    const cloned = timeLibraryFactory.getInstance().clone(original);

    // 修改原始对象
    const modified = original.add(1, 'day');

    // 验证克隆对象不受影响
    expect(cloned.format('YYYY-MM-DD')).toBe('2023-06-15');
    expect(modified.format('YYYY-MM-DD')).toBe('2023-06-16');
  });

  test('Clone should preserve timezone information', () => {
    const timeObj = createTime('2023-01-01 12:00:00', undefined, 'Asia/Shanghai');
    const clonedTimeObj = timeLibraryFactory.getInstance().clone(timeObj);

    expect(clonedTimeObj.format('YYYY-MM-DD HH:mm:ss')).toBe(timeObj.format('YYYY-MM-DD HH:mm:ss'));
    expect(clonedTimeObj.utcOffset()).toBe(timeObj.utcOffset());
  });

  test('Clone performance test', () => {
    const timeObj = createTime('2023-01-01');
    const startTime = Date.now();

    for (let i = 0; i < 1000; i++) {
      timeLibraryFactory.getInstance().clone(timeObj);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Clone method performance: 1000 operations took ${duration}ms`);
    expect(duration).toBeLessThan(100); // 性能测试，1000次操作应该在100ms内完成
  });
});
