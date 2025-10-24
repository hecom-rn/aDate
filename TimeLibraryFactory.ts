import { DayjsTimeLibrary } from './implementations/DayjsTimeLibrary';
import { ITimeLibrary } from './interfaces/ITimeLibrary';
import { MomentTimeLibrary } from './implementations/MomentTimeLibrary';

/**
 * 时间库类型枚举
 */
export const TimeLibraryType = {
  MOMENT: 'moment',
  DAYJS: 'dayjs',
  // XDATE: 'xdate',
  // 可以继续添加其他时间库
  // MOMENT: 'moment',
  // DATE_FNS: 'date-fns'
} as const;

/**
 * 时间库类型值
 */
export type TimeLibraryTypeValue = typeof TimeLibraryType[keyof typeof TimeLibraryType];

/**
 * 时间库工厂
 * 负责创建和管理不同的时间库实现
 */
class TimeLibraryFactory {
  private currentType: TimeLibraryTypeValue;
  private instance: ITimeLibrary | null;

  constructor() {
    this.currentType = TimeLibraryType.DAYJS;
    this.instance = null;
    this._createInstance();
  }

  /**
   * 设置时间库类型
   * @param type - 时间库类型
   */
  setLibraryType(type: TimeLibraryTypeValue): void {
    if (this.currentType !== type) {
      this.currentType = type;
      this._createInstance();
    }
  }

  /**
   * 获取当前时间库实例
   * @returns 时间库实例
   */
  getInstance(): ITimeLibrary {
    if (!this.instance) {
      throw new Error('Time library instance not initialized');
    }
    return this.instance;
  }

  /**
   * 获取当前时间库类型
   * @returns 时间库类型
   */
  getCurrentType(): TimeLibraryTypeValue {
    return this.currentType;
  }

  /**
   * 创建时间库实例
   * @private
   */
  private _createInstance(): void {
    switch (this.currentType) {
      case TimeLibraryType.DAYJS:
        // this.instance = new DayjsTimeLibrary();
        // break;
      case TimeLibraryType.MOMENT:
        this.instance = new MomentTimeLibrary();
        break;
      default:
        throw new Error(`Unsupported time library type: ${this.currentType}`);
    }
  }
}

// 创建全局工厂实例
const timeLibraryFactory: TimeLibraryFactory = new TimeLibraryFactory();

export { timeLibraryFactory };
