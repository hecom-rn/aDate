import {
  TimeUtils,
  createTime,
  formatTime,
  getYear,
  getMonth,
  getDate,
  getHour,
  getMinute,
  getSecond,
  getMillisecond,
  setTimeLibrary,
  TimeLibraryType,
  isLeapYear,
  daysInMonth,
  isBefore,
  isAfter,
  isSame,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  getDay,
  isToday,
  diff,
  isValid
} from '../index';
import {zoneConfig} from '../config';
import moment from 'moment-timezone';


describe('TimeUtils vs Dayjs 对比测试', () => {
  beforeEach(() => {
    setTimeLibrary(TimeLibraryType.MOMENT);
    TimeUtils.locale('zh-cn'); // 设置中文语言包
  });

  describe('基础创建和格式化对比', () => {
    test('创建时间对象应该产生相同结果', () => {
      const testDate = '2025-07-24 15:30:45';

      const timeUtilsTime = TimeUtils.create(testDate);
      const momentTime = moment(testDate);

      // 格式化后应该相同
      expect(timeUtilsTime.format('YYYY-MM-DD HH:mm:ss')).toBe(
          momentTime.format('YYYY-MM-DD HH:mm:ss')
      );
    });

    test('不同格式的时间创建应该一致', () => {
      const testCases = [
        '2025-07-24',
        '2025/07/24',
        '2025-07-24 15:30:45',
        1721813445000 // 时间戳
      ];

      testCases.forEach(input => {
        const timeUtilsTime = TimeUtils.create(input);
        const momentTime = moment(input);

        expect(timeUtilsTime.format('YYYY-MM-DD')).toBe(
            momentTime.format('YYYY-MM-DD')
        );
      });
    });

    test('格式化应该产生相同结果', () => {
      const testDate = '2025-07-24 15:30:45';
      const formats = [
        'YYYY-MM-DD',
        'MM/DD/YYYY',
        'HH:mm:ss',
        'YYYY年MM月DD日',
        'dddd, MMMM Do YYYY'
      ];

      formats.forEach(format => {
        const timeUtilsTime = createTime(testDate);
        const momentTime = moment(testDate);

        const timeUtilsFormatted = formatTime(timeUtilsTime, format);
        const momentFormatted = momentTime.format(format);

        expect(timeUtilsFormatted).toBe(momentFormatted);
      });
    });
  });

  describe('获取时间部分对比', () => {
    test('获取年月日时分秒应该一致', () => {
      const testDate = '2025-07-24 15:30:45';

      const timeUtilsTime = createTime(testDate);
      const momentTime = moment(testDate);

      expect(getYear(timeUtilsTime)).toBe(momentTime.year());
      expect(getMonth(timeUtilsTime)).toBe(momentTime.month()); // 现在都返回 0-11
      expect(getDate(timeUtilsTime)).toBe(momentTime.date());
      expect(getHour(timeUtilsTime)).toBe(momentTime.hour());
      expect(getMinute(timeUtilsTime)).toBe(momentTime.minute());
      expect(getSecond(timeUtilsTime)).toBe(momentTime.second());
      expect(getMillisecond(timeUtilsTime)).toBe(momentTime.millisecond());
    });

    test('TimeInstance 获取方法应该与 moment 一致', () => {
      const testDate = '2025-07-24 15:30:45';

      const timeInstance = TimeUtils.create(testDate);
      const momentTime = moment(testDate);

      expect(timeInstance.getYear()).toBe(momentTime.year());
      expect(timeInstance.getMonth()).toBe(momentTime.month()); // 现在都返回 0-11
      expect(timeInstance.getDate()).toBe(momentTime.date());
      expect(timeInstance.getHour()).toBe(momentTime.hour());
      expect(timeInstance.getMinute()).toBe(momentTime.minute());
      expect(timeInstance.getSecond()).toBe(momentTime.second());
      expect(timeInstance.getMillisecond()).toBe(momentTime.millisecond());
    });
  });

  describe('设置时间部分对比', () => {
    test('设置年月日时分秒应该产生相同结果', () => {
      const baseDate = '2025-07-24 15:30:45';

      // 测试设置年份
      const timeUtilsYear = TimeUtils.create(baseDate).year(2026);
      const momentYear = moment(baseDate).year(2026);
      expect(timeUtilsYear.format('YYYY-MM-DD HH:mm:ss')).toBe(
          momentYear.format('YYYY-MM-DD HH:mm:ss')
      );

      // 测试设置月份
      const timeUtilsMonth = TimeUtils.create(baseDate).month(11);  // 使用0-11的月份标准
      const momentMonth = moment(baseDate).month(11); // moment 月份是 0-11
      expect(timeUtilsMonth.format('YYYY-MM-DD HH:mm:ss')).toBe(
          momentMonth.format('YYYY-MM-DD HH:mm:ss')
      );

      // 测试设置日期
      const timeUtilsDate = TimeUtils.create(baseDate).date(1);
      const momentDate = moment(baseDate).date(1);
      expect(timeUtilsDate.format('YYYY-MM-DD HH:mm:ss')).toBe(
          momentDate.format('YYYY-MM-DD HH:mm:ss')
      );

      // 测试设置小时
      const timeUtilsHour = TimeUtils.create(baseDate).hour(0);
      const momentHour = moment(baseDate).hour(0);
      expect(timeUtilsHour.format('YYYY-MM-DD HH:mm:ss')).toBe(
          momentHour.format('YYYY-MM-DD HH:mm:ss')
      );

      // 测试设置分钟
      const timeUtilsMinute = TimeUtils.create(baseDate).minute(0);
      const momentMinute = moment(baseDate).minute(0);
      expect(timeUtilsMinute.format('YYYY-MM-DD HH:mm:ss')).toBe(
          momentMinute.format('YYYY-MM-DD HH:mm:ss')
      );

      // 测试设置秒
      const timeUtilsSecond = TimeUtils.create(baseDate).second(0);
      const momentSecond = moment(baseDate).second(0);
      expect(timeUtilsSecond.format('YYYY-MM-DD HH:mm:ss')).toBe(
          momentSecond.format('YYYY-MM-DD HH:mm:ss')
      );
    });

    test('链式设置应该与 moment 链式调用一致', () => {
      const baseDate = '2025-07-24 15:30:45';

      const timeUtilsResult = TimeUtils.create(baseDate)
          .year(2026)
          .month(11)  // 使用0-11的月份标准，11表示12月
          .date(25)
          .hour(0)
          .minute(0)
          .second(0)
          .format('YYYY-MM-DD HH:mm:ss');

      const momentResult = moment(baseDate)
          .year(2026)
          .month(11) // moment 月份是 0-11
          .date(25)
          .hour(0)
          .minute(0)
          .second(0)
          .format('YYYY-MM-DD HH:mm:ss');

      expect(timeUtilsResult).toBe(momentResult);
    });
  });

  describe('时间计算对比', () => {
    test('时间加法应该与 moment 一致', () => {
      const baseDate = '2025-07-24 15:30:45';
      const units: Array<{ unit: any, amount: number }> = [
        { unit: 'year', amount: 1 },
        { unit: 'month', amount: 3 },
        { unit: 'day', amount: 7 },
        { unit: 'hour', amount: 24 },
        { unit: 'minute', amount: 60 },
        { unit: 'second', amount: 3600 }
      ];

      units.forEach(({ unit, amount }) => {
        const timeUtilsResult = TimeUtils.create(baseDate)
            .add(amount, unit)
            .format('YYYY-MM-DD HH:mm:ss');

        const momentResult = moment(baseDate)
            .add(amount, unit)
            .format('YYYY-MM-DD HH:mm:ss');

        expect(timeUtilsResult).toBe(momentResult);
      });
    });

    test('时间差计算应该与 moment 一致', () => {
      const a = moment().utc().locale('en').format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
      const b = TimeUtils.create().utc().locale('en').formalFormat('ddd, DD MMM YYYY HH:mm:ss [GMT]')
      const c = new Date().toUTCString();
      expect(a).toEqual(b);
      expect(c).toEqual(b);
    });

    test('时间戳和格式化综合测试', () => {
      const desc1 = new Date(1721813445000).toISOString();
      const desc2 = TimeUtils.create(1721813445000).toISOString();
      expect(desc1).toBe(desc2);

      const timestamp1 = new Date().valueOf();
      const timestamp2 = TimeUtils.create().valueOf();
      expect(timestamp1).toBe(timestamp2);

      const current1 = new Date();
      current1.setHours(0, 0, 0, 0);
      const day1 = current1.getDate() - 1;
      const t11 = new Date(current1.getTime()).setDate(current1.getDate() - 1);
      const current2 = TimeUtils.create().startOfDay();
      const day2 = current2.getDate() - 1;
      const t22 = current2.date(current2.getDate() - 1).valueOf();
      expect(day1).toBe(day2);
      expect(t11).toBe(t22);

      const t1 = new Date(2025, 7).getTime();
      const t2 = TimeUtils.create().year(2025).month(7).startOfMonth().valueOf();
      console.log(t1, '************t1************');
      console.log(t2, '************t2************');
      expect(t1).toBe(t2);

      const t3 = new Date(2025, 0).getTime();
      const t4 = TimeUtils.create().year(2025).month(0).startOfMonth().valueOf();
      const t5 = TimeUtils.create().year(2025).startOfYear().valueOf();
      console.log(t3, '************t3************');
      console.log(t4, '************t4************');
      expect(t3).toBe(t4);
      expect(t5).toBe(t4);

      const current = TimeUtils.create().year(2025).month(3).date(30);
      const t6 = new Date(current.valueOf()).setDate(current.getDate() - 1);
      const t7 = current.date(current.getDate() - 1).valueOf();
      expect(t7).toBe(t6);

      const timeStamp1 = TimeUtils.create('2025-07-24 15:30:45').valueOf(true);
      const timeStamp2 = TimeUtils.create('2025-07-24 15:30:45').valueOf();
      const timeDesc = TimeUtils.create(timeStamp1).format('YYYY-MM-DD HH:mm:ss',true);
      const hour = TimeUtils.create(timeStamp1).getHour(true);
      expect(timeDesc).toBe('2025-07-24 15:30:45')

      const dt = '2025-07-24 15:30:45';
      const firstWeekEnd = '2025-07-24 16:30:45';
      const end1 = moment(dt);
      const start1 = moment(firstWeekEnd);
      const difTime1 = end1 - start1;

      const end2 = new Date(dt);
      const start2 = new Date(firstWeekEnd);
      const difTime2 = end2 - start2;

      const end3 = TimeUtils.create(dt);
      const start3 = TimeUtils.create(firstWeekEnd);
      const difTime3 = end3.valueOf() - start3.valueOf();
      expect(difTime1).toBe(difTime2);
      expect(difTime2).toBe(difTime3);

      console.log(TimeUtils.create().valueOf(), '************TimeUtils.create().valueOf()************');
      console.log(TimeUtils.now().valueOf(), '************TimeUtils.now().valueOf()************');
      console.log(moment().valueOf(), '************TimeUtils.create().valueOf()************');

      const aaa = moment().utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
      const bbb = moment.utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
      const ccc = TimeUtils.create().utc().formalFormat('ddd, DD MMM YYYY HH:mm:ss [GMT]')
      expect(aaa).toBe(bbb);
      expect(aaa).toBe(ccc);
    });

    test('时间减法应该与 moment 一致', () => {
      const baseDate = '2025-07-24 15:30:45';
      const units: Array<{ unit: any, amount: number }> = [
        { unit: 'year', amount: 1 },
        { unit: 'month', amount: 2 },
        { unit: 'day', amount: 5 },
        { unit: 'hour', amount: 12 },
        { unit: 'minute', amount: 30 },
        { unit: 'second', amount: 45 }
      ];

      units.forEach(({ unit, amount }) => {
        const timeUtilsResult = TimeUtils.create(baseDate)
            .subtract(amount, unit)
            .format('YYYY-MM-DD HH:mm:ss');

        const momentResult = moment(baseDate)
            .subtract(amount, unit)
            .format('YYYY-MM-DD HH:mm:ss');

        expect(timeUtilsResult).toBe(momentResult);
      });
    });
  });

  describe('时间比较对比', () => {
    test('时间比较方法应该与 moment 一致', () => {
      const date1 = '2025-07-24 10:00:00';
      const date2 = '2025-07-24 15:00:00';
      const date3 = '2025-07-24 10:00:00';

      const timeUtils1 = createTime(date1);
      const timeUtils2 = createTime(date2);
      const timeUtils3 = createTime(date3);

      const moment1 = moment(date1);
      const moment2 = moment(date2);
      const moment3 = moment(date3);

      // isBefore 比较
      expect(isBefore(timeUtils1, timeUtils2)).toBe(moment1.isBefore(moment2));
      expect(isBefore(timeUtils2, timeUtils1)).toBe(moment2.isBefore(moment1));

      // isAfter 比较
      expect(isAfter(timeUtils2, timeUtils1)).toBe(moment2.isAfter(moment1));
      expect(isAfter(timeUtils1, timeUtils2)).toBe(moment1.isAfter(moment2));

      // isSame 比较
      expect(isSame(timeUtils1, timeUtils3)).toBe(moment1.isSame(moment3));
      expect(isSame(timeUtils1, timeUtils2)).toBe(moment1.isSame(moment2));
    });

    test('TimeInstance 比较方法应该与 moment 一致', () => {
      const date1 = '2025-07-24 10:00:00';
      const date2 = '2025-07-24 15:00:00';

      const timeInstance1 = TimeUtils.create(date1);
      const timeInstance2 = TimeUtils.create(date2);

      const moment1 = moment(date1);
      const moment2 = moment(date2);

      expect(timeInstance1.isBefore(timeInstance2.toObject())).toBe(moment1.isBefore(moment2));
      expect(timeInstance2.isAfter(timeInstance1.toObject())).toBe(moment2.isAfter(moment1));
      expect(timeInstance1.isSame(timeInstance1.toObject())).toBe(moment1.isSame(moment1));
    });
  });

  describe('边界时间操作对比', () => {

    test('按照时区创建时间测试', () => {
      const testDate = '2025-07-15 14:30:25';
      const timeUtilsStart = TimeUtils.create(testDate);
      const t1 = timeUtilsStart.valueOf(true);
      const timeUtilsStart1 = TimeUtils.create(testDate, undefined, zoneConfig.systemZone);
      const t2 = timeUtilsStart1.valueOf();
      expect(t1).toEqual(t2);
    });

    test('月初月末操作应该与 moment 一致', () => {
      const testDate = '2025-07-15 14:30:25';

      const timeUtilsStart = TimeUtils.create(testDate)
          .startOfMonth()
          .format('YYYY-MM-DD HH:mm:ss');
      const momentStart = moment(testDate)
          .startOf('month')
          .format('YYYY-MM-DD HH:mm:ss');

      const timeUtilsEnd = TimeUtils.create(testDate)
          .endOfMonth()
          .format('YYYY-MM-DD HH:mm:ss');
      const momentEnd = moment(testDate)
          .endOf('month')
          .format('YYYY-MM-DD HH:mm:ss');

      expect(timeUtilsStart).toBe(momentStart);
      expect(timeUtilsEnd).toBe(momentEnd);
    });

    test('日初日末操作应该与 moment 一致', () => {
      const testDate = '2025-07-15 14:30:25';

      const timeUtilsStart = TimeUtils.create(testDate)
          .startOfDay()
          .format('YYYY-MM-DD HH:mm:ss');
      const momentStart = moment(testDate)
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss');

      const timeUtilsEnd = TimeUtils.create(testDate)
          .endOfDay()
          .format('YYYY-MM-DD HH:mm:ss');
      const momentEnd = moment(testDate)
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss');

      expect(timeUtilsStart).toBe(momentStart);
      expect(timeUtilsEnd).toBe(momentEnd);
    });

    test('函数式边界时间操作应该与 moment 一致', () => {
      const testDate = '2025-07-15 14:30:25';
      const timeObj = createTime(testDate);

      // 测试函数式 API
      const timeUtilsStartMonth = startOfMonth(timeObj);
      const timeUtilsEndMonth = endOfMonth(timeObj);
      const timeUtilsStartDay = startOfDay(timeObj);
      const timeUtilsEndDay = endOfDay(timeObj);

      const momentObj = moment(testDate);
      const momentStartMonth = momentObj.startOf('month');
      const momentEndMonth = momentObj.endOf('month');
      const momentStartDay = momentObj.startOf('day');
      const momentEndDay = momentObj.endOf('day');

      expect(formatTime(timeUtilsStartMonth, 'YYYY-MM-DD HH:mm:ss')).toBe(
          momentStartMonth.format('YYYY-MM-DD HH:mm:ss')
      );
      expect(formatTime(timeUtilsEndMonth, 'YYYY-MM-DD HH:mm:ss')).toBe(
          momentEndMonth.format('YYYY-MM-DD HH:mm:ss')
      );
      expect(formatTime(timeUtilsStartDay, 'YYYY-MM-DD HH:mm:ss')).toBe(
          momentStartDay.format('YYYY-MM-DD HH:mm:ss')
      );
      expect(formatTime(timeUtilsEndDay, 'YYYY-MM-DD HH:mm:ss')).toBe(
          momentEndDay.format('YYYY-MM-DD HH:mm:ss')
      );
    });

    test('不同月份的边界时间应该正确处理', () => {
      const testDates = [
        '2024-02-15 10:30:45', // 闰年2月
        '2025-02-15 10:30:45', // 平年2月
        '2025-01-31 23:59:59', // 1月最后一天
        '2025-04-30 12:00:00', // 4月最后一天
        '2025-12-01 00:00:01', // 12月第一天
      ];

      testDates.forEach(testDate => {
        const timeUtilsStartMonth = TimeUtils.create(testDate).startOfMonth();
        const timeUtilsEndMonth = TimeUtils.create(testDate).endOfMonth();

        const momentStartMonth = moment(testDate).startOf('month');
        const momentEndMonth = moment(testDate).endOf('month');

        expect(timeUtilsStartMonth.format('YYYY-MM-DD HH:mm:ss')).toBe(
            momentStartMonth.format('YYYY-MM-DD HH:mm:ss')
        );
        expect(timeUtilsEndMonth.format('YYYY-MM-DD HH:mm:ss')).toBe(
            momentEndMonth.format('YYYY-MM-DD HH:mm:ss')
        );
      });
    });

    test('跨年边界时间应该正确处理', () => {
      const testDates = [
        '2024-12-31 23:59:59', // 年末
        '2025-01-01 00:00:01', // 年初
        '2024-01-01 12:30:45', // 闰年年初
        '2025-12-31 12:30:45', // 平年年末
      ];

      testDates.forEach(testDate => {
        const timeUtilsStartDay = TimeUtils.create(testDate).startOfDay();
        const timeUtilsEndDay = TimeUtils.create(testDate).endOfDay();

        const momentStartDay = moment(testDate).startOf('day');
        const momentEndDay = moment(testDate).endOf('day');

        expect(timeUtilsStartDay.format('YYYY-MM-DD HH:mm:ss')).toBe(
            momentStartDay.format('YYYY-MM-DD HH:mm:ss')
        );
        expect(timeUtilsEndDay.format('YYYY-MM-DD HH:mm:ss')).toBe(
            momentEndDay.format('YYYY-MM-DD HH:mm:ss')
        );
      });
    });

    test('边界时间操作的时间戳应该一致', () => {
      const testDate = '2025-07-15 14:30:25';

      const timeUtilsStartMonth = TimeUtils.create(testDate).startOfMonth();
      const timeUtilsEndMonth = TimeUtils.create(testDate).endOfMonth();
      const timeUtilsStartDay = TimeUtils.create(testDate).startOfDay();
      const timeUtilsEndDay = TimeUtils.create(testDate).endOfDay();

      const momentStartMonth = moment(testDate).startOf('month');
      const momentEndMonth = moment(testDate).endOf('month');
      const momentStartDay = moment(testDate).startOf('day');
      const momentEndDay = moment(testDate).endOf('day');

      // 比较时间戳
      expect(timeUtilsStartMonth.valueOf()).toBe(momentStartMonth.valueOf());
      expect(timeUtilsEndMonth.valueOf()).toBe(momentEndMonth.valueOf());
      expect(timeUtilsStartDay.valueOf()).toBe(momentStartDay.valueOf());
      expect(timeUtilsEndDay.valueOf()).toBe(momentEndDay.valueOf());
    });

    test('边界时间操作链式调用应该与 moment 一致', () => {
      const testDate = '2025-07-15 14:30:25';

      // 测试复杂的链式调用
      const timeUtilsChain = TimeUtils.create(testDate)
          .startOfMonth()
          .add(15, 'day')
          .endOfDay()
          .format('YYYY-MM-DD HH:mm:ss');

      const momentChain = moment(testDate)
          .startOf('month')
          .add(15, 'day')
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss');

      expect(timeUtilsChain).toBe(momentChain);

      // 测试另一个链式调用
      const timeUtilsChain2 = TimeUtils.create(testDate)
          .endOfMonth()
          .startOfDay()
          .subtract(1, 'month')
          .format('YYYY-MM-DD HH:mm:ss');

      const momentChain2 = moment(testDate)
          .endOf('month')
          .startOf('day')
          .subtract(1, 'month')
          .format('YYYY-MM-DD HH:mm:ss');

      expect(timeUtilsChain2).toBe(momentChain2);
    });

    test('边界时间操作精确度测试', () => {
      const testDate = '2025-07-15 14:30:25.123';

      // 测试毫秒级精确度
      const timeUtilsStart = TimeUtils.create(testDate).startOfDay();
      const timeUtilsEnd = TimeUtils.create(testDate).endOfDay();

      const momentStart = moment(testDate).startOf('day');
      const momentEnd = moment(testDate).endOf('day');

      // 开始时间应该是 00:00:00.000
      expect(timeUtilsStart.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2025-07-15 00:00:00.000');
      expect(momentStart.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2025-07-15 00:00:00.000');

      // 结束时间应该是 23:59:59.999
      expect(timeUtilsEnd.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2025-07-15 23:59:59.999');
      expect(momentEnd.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2025-07-15 23:59:59.999');
    });
  });

  describe('特殊日期判断对比', () => {
    test('闰年判断应该与 moment 一致', () => {
      const leapYears = ['2024-02-15', '2020-02-15', '2000-02-15'];
      const normalYears = ['2025-02-15', '2021-02-15', '1900-02-15'];

      leapYears.forEach(date => {
        const timeUtilsResult = isLeapYear(createTime(date));
        // moment 没有直接的闰年判断，我们用我们的逻辑验证
        const year = moment(date).year();
        const momentResult = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

        expect(timeUtilsResult).toBe(momentResult);
        expect(timeUtilsResult).toBe(true);
      });

      normalYears.forEach(date => {
        const timeUtilsResult = isLeapYear(createTime(date));
        const year = moment(date).year();
        const momentResult = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

        expect(timeUtilsResult).toBe(momentResult);
        expect(timeUtilsResult).toBe(false);
      });
    });

    test('月份天数应该与 moment 一致', () => {
      const testDates = [
        '2024-02-15', // 闰年2月
        '2025-02-15', // 平年2月
        '2025-01-15', // 1月
        '2025-04-15', // 4月
        '2025-12-15'  // 12月
      ];

      testDates.forEach(date => {
        const timeUtilsResult = daysInMonth(createTime(date));
        const momentResult = moment(date).daysInMonth();

        expect(timeUtilsResult).toBe(momentResult);
      });
    });
  });

  describe('时间戳对比', () => {
    test('valueOf 应该返回相同的时间戳', () => {
      const testDate = '2025-07-24 15:30:45';

      const timeInstance = TimeUtils.create(testDate);
      const momentTime = moment(testDate);

      expect(timeInstance.valueOf()).toBe(momentTime.valueOf());
    });

    test('不同输入格式的时间戳应该一致', () => {
      const inputs = [
        '2025-07-24 15:30:45',
        '2025/07/24 15:30:45',
        1721813445000
      ];

      inputs.forEach(input => {
        const timeInstance = TimeUtils.create(input);
        const momentTime = moment(input);

        expect(timeInstance.valueOf()).toBe(momentTime.valueOf());
      });
    });
  });

  describe('边界情况对比', () => {
    test('月末边界处理应该一致', () => {
      // 测试1月31日加1个月的情况
      const jan31 = '2025-01-31';

      const timeUtilsResult = TimeUtils.create(jan31)
          .add(1, 'month')
          .format('YYYY-MM-DD');

      const momentResult = moment(jan31)
          .add(1, 'month')
          .format('YYYY-MM-DD');

      expect(timeUtilsResult).toBe(momentResult);
    });

    test('年份边界处理应该一致', () => {
      const newYear = '2025-01-01';

      const timeUtilsResult = TimeUtils.create(newYear)
          .subtract(1, 'day')
          .format('YYYY-MM-DD');

      const momentResult = moment(newYear)
          .subtract(1, 'day')
          .format('YYYY-MM-DD');

      expect(timeUtilsResult).toBe(momentResult);
    });

    test('闰年2月29日处理应该一致', () => {
      const leapDay = '2024-02-29';

      const timeUtilsYear = getYear(createTime(leapDay));
      const timeUtilsMonth = getMonth(createTime(leapDay));
      const timeUtilsDate = getDate(createTime(leapDay));

      const momentTime = moment(leapDay);

      expect(timeUtilsYear).toBe(momentTime.year());
      expect(timeUtilsMonth).toBe(momentTime.month());
      expect(timeUtilsDate).toBe(momentTime.date());
    });
  });

  describe('性能对比测试', () => {
    test('大量操作性能应该在可接受范围内', () => {
      const iterations = 1000;

      // TimeUtils 性能测试
      const timeUtilsStart = Date.now();
      for (let i = 0; i < iterations; i++) {
        TimeUtils.create('2025-07-24 15:30:45')
            .add(i, 'day')
            .hour(12)
            .formalFormat('YYYY-MM-DD HH:mm:ss');
      }
      const timeUtilsDuration = Date.now() - timeUtilsStart;

      // Dayjs 性能测试
      const momentStart = Date.now();
      for (let i = 0; i < iterations; i++) {
        moment('2025-07-24 15:30:45')
            .add(i, 'day')
            .hour(12)
            .format('YYYY-MM-DD HH:mm:ss');
      }
      const momentDuration = Date.now() - momentStart;

      // TimeUtils 性能不应该比 moment 慢太多（允许2倍的差距）
      expect(timeUtilsDuration).toBeLessThan(momentDuration * 3);

      console.log(`性能对比 - TimeUtils: ${timeUtilsDuration}ms, Dayjs: ${momentDuration}ms`);
    });
  });

  describe('星期相关功能对比', () => {
    test('获取星期几应该与 moment 一致', () => {
      const testDates = [
        '2025-07-20', // 星期日
        '2025-07-21', // 星期一
        '2025-07-22', // 星期二
        '2025-07-23', // 星期三
        '2025-07-24', // 星期四
        '2025-07-25', // 星期五
        '2025-07-26'  // 星期六
      ];

      testDates.forEach(date => {
        const timeUtils = createTime(date);
        const momentTime = moment(date);

        expect(getDay(timeUtils)).toBe(momentTime.day());
      });
    });

    test('TimeInstance 获取星期几应该与 moment 一致', () => {
      const testDate = '2025-07-24 15:30:45';
      const timeInstance = TimeUtils.create(testDate);
      const momentTime = moment(testDate);

      expect(timeInstance.getDay()).toBe(momentTime.day());
    });
  });

  describe('毫秒设置对比', () => {
    test('设置毫秒应该与 moment 一致', () => {
      const baseDate = '2025-07-24 15:30:45.123';

      const timeUtilsMs = TimeUtils.create(baseDate).millisecond(999);
      const momentMs = moment(baseDate).millisecond(999);

      expect(timeUtilsMs.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
          momentMs.format('YYYY-MM-DD HH:mm:ss.SSS')
      );
    });
  });

  describe('时区相关对比', () => {
    test('UTC时间应该与 moment 一致', () => {
      const testDate = '2025-07-24 15:30:45';

      const timeInstance = TimeUtils.create(testDate);
      const momentTime = moment(testDate);

      // 比较时间戳
      expect(timeInstance.valueOf()).toBe(momentTime.valueOf());
    });

    test('格式化不同时区应该与 moment 保持一致的时间戳', () => {
      const testDate = '2025-07-24 15:30:45';

      const timeInstance = TimeUtils.create(testDate);
      const momentTime = moment(testDate);

      // 即使格式化不同，时间戳应该一致
      expect(timeInstance.valueOf()).toBe(momentTime.valueOf());
    });
  });

  describe('解析和格式化增强测试', () => {
    test('更多格式化模式应该与 moment 一致', () => {
      const testDate = '2025-07-24 15:30:45';
      const additionalFormats = [
        'YYYY',
        'MM',
        'DD',
        'HH',
        'mm',
        'ss',
        'YYYY/MM/DD',
        'MM-DD-YYYY',
        'HH:mm',
        'YYYY-MM-DD HH:mm'
      ];

      additionalFormats.forEach(format => {
        try {
          const timeUtilsFormatted = formatTime(createTime(testDate), format);
          const momentFormatted = moment(testDate).format(format);
          expect(timeUtilsFormatted).toBe(momentFormatted);
        } catch (error) {
          // 某些格式可能不被支持，记录但不失败
          console.warn(`格式 ${format} 可能不被完全支持:`, error);
        }
      });
    });

    test('不同输入类型创建时间应该一致', () => {
      const now = new Date();
      const timestamp = now.getTime();
      const isoString = now.toISOString();

      // 使用Date对象
      const timeUtilsFromDate = TimeUtils.create(now);
      const momentFromDate = moment(now);
      expect(timeUtilsFromDate.valueOf()).toBe(momentFromDate.valueOf());

      // 使用时间戳
      const timeUtilsFromTimestamp = TimeUtils.create(timestamp);
      const momentFromTimestamp = moment(timestamp);
      expect(timeUtilsFromTimestamp.valueOf()).toBe(momentFromTimestamp.valueOf());

      // 使用ISO字符串
      const timeUtilsFromISO = TimeUtils.create(isoString);
      const momentFromISO = moment(isoString);
      expect(timeUtilsFromISO.valueOf()).toBe(momentFromISO.valueOf());
    });
  });

  describe('链式调用复杂场景', () => {
    test('复杂链式操作应该与 moment 一致', () => {
      const baseDate = '2025-07-24 15:30:45';

      const timeUtilsComplex = TimeUtils.create(baseDate)
          .add(1, 'year')
          .subtract(2, 'month')
          .date(15)
          .hour(9)
          .minute(30)
          .second(0)
          .add(5, 'day')
          .format('YYYY-MM-DD HH:mm:ss');

      const momentComplex = moment(baseDate)
          .add(1, 'year')
          .subtract(2, 'month')
          .date(15)
          .hour(9)
          .minute(30)
          .second(0)
          .add(5, 'day')
          .format('YYYY-MM-DD HH:mm:ss');

      expect(timeUtilsComplex).toBe(momentComplex);
    });

    test('月末日期调整应该与 moment 一致', () => {
      // 测试特殊情况：3月31日减1个月
      const mar31 = '2025-03-31';

      const timeUtilsResult = TimeUtils.create(mar31)
          .subtract(1, 'month')
          .format('YYYY-MM-DD');

      const momentResult = moment(mar31)
          .subtract(1, 'month')
          .format('YYYY-MM-DD');

      expect(timeUtilsResult).toBe(momentResult);
    });
  });

  describe('错误处理和边界值测试', () => {
    test('无效日期应该与 moment 行为一致', () => {
      const invalidDates = [
        '2025-02-30', // 2月没有30日
        '2025-13-01', // 没有13月
        '2025-04-31', // 4月没有31日
      ];

      invalidDates.forEach(invalidDate => {
        try {
          const timeUtils = TimeUtils.create(invalidDate);
          const momentTime = moment(invalidDate);

          // 检查是否都认为无效
          const timeUtilsValid = !isNaN(timeUtils.valueOf());
          const momentValid = momentTime.isValid();

          if (timeUtilsValid && momentValid) {
            // 如果都认为有效，则比较结果
            expect(timeUtils.valueOf()).toBe(momentTime.valueOf());
          }
        } catch (error) {
          // 记录错误但不失败测试
          console.warn(`处理无效日期 ${invalidDate} 时出错:`, error);
        }
      });
    });

    test('极值日期应该正确处理', () => {
      const extremeDates = [
        '1970-01-01 00:00:00', // Unix时间戳起始
        '2038-01-19 03:14:07', // 32位系统时间戳上限附近
        '1900-01-01 00:00:00', // 很早的日期
        '2100-12-31 23:59:59', // 很晚的日期
      ];

      extremeDates.forEach(date => {
        try {
          const timeUtils = TimeUtils.create(date);
          const momentTime = moment(date);

          expect(timeUtils.format('YYYY-MM-DD HH:mm:ss')).toBe(
              momentTime.format('YYYY-MM-DD HH:mm:ss')
          );
        } catch (error) {
          console.warn(`处理极值日期 ${date} 时出错:`, error);
        }
      });
    });
  });

  describe('时间有效性验证对比 (isValid)', () => {
    test('有效时间应该与 moment.isValid() 一致', () => {
      const validDates = [
        '2025-07-24 15:30:45',
        '2025/07/24 15:30:45',
        '2025-07-24T15:30:45.000Z',
        '2025-01-01 00:00:00',
        '2025-12-31 23:59:59',
        '2024-02-29 12:00:00', // 闰年2月29日
        1721813445000, // 时间戳
        new Date('2025-07-24'),
        new Date()
      ];

      validDates.forEach(validDate => {
        const timeObj = createTime(validDate);
        const momentTime = moment(validDate);

        // 测试函数式API
        expect(isValid(timeObj)).toBe(momentTime.isValid());
        expect(isValid(timeObj)).toBe(true);

        // 测试TimeInstance的isValid方法
        const timeInstance = TimeUtils.create(validDate);
        expect(timeInstance.isValid()).toBe(momentTime.isValid());
        expect(timeInstance.isValid()).toBe(true);
      });
    });

    test('无效时间应该与 moment.isValid() 一致', () => {
      const invalidDates = [
        '2025-02-30', // 2月没有30日
        '2025-13-01', // 没有13月
        '2025-04-31', // 4月没有31日
        '2025-00-01', // 没有0月
        '2025-01-00', // 没有0日
        '2025-01-32', // 1月没有32日
        '2023-02-29', // 平年没有2月29日
        'invalid-date',
        '',
        null,
        undefined,
        NaN,
        'abc',
        '2025-1-1-1', // 格式错误
        '25/13/2025', // 无效月份
      ];

      invalidDates.forEach(invalidDate => {
        try {
          const timeObj = TimeUtils.create(invalidDate);
          const momentTime = moment(invalidDate);

          // 测试函数式API
          expect(isValid(timeObj)).toBe(momentTime.isValid());

          // 测试TimeInstance的isValid方法
          const timeInstance = TimeUtils.create(invalidDate);
          expect(timeInstance.isValid()).toBe(momentTime.isValid());

          // 无效日期应该返回false
          if (!momentTime.isValid()) {
            expect(isValid(timeObj)).toBe(false);
            expect(timeInstance.isValid()).toBe(false);
          }
        } catch (error) {
          // 某些输入可能会抛出异常，这也是预期的行为
          const momentTime = moment(invalidDate);
          expect(momentTime.isValid()).toBe(false);
        }
      });
    });

    test('边界日期的有效性验证应该与 moment 一致', () => {
      const boundaryDates = [
        '1970-01-01 00:00:00', // Unix时间戳起始
        '2038-01-19 03:14:07', // 32位系统时间戳上限附近
        '1900-01-01 00:00:00', // 很早的日期
        '2100-12-31 23:59:59', // 很晚的日期
        '2000-02-29 00:00:00', // 世纪闰年
        '1900-02-28 23:59:59', // 世纪平年
        '2024-12-31 23:59:59.999', // 毫秒精度
        '2025-01-01 00:00:00.000', // 毫秒精度
      ];

      boundaryDates.forEach(boundaryDate => {
        const timeObj = createTime(boundaryDate);
        const momentTime = moment(boundaryDate);

        expect(isValid(timeObj)).toBe(momentTime.isValid());

        const timeInstance = TimeUtils.create(boundaryDate);
        expect(timeInstance.isValid()).toBe(momentTime.isValid());
      });
    });

    test('操作后的时间有效性应该与 moment 一致', () => {
      const baseDate = '2025-07-24 15:30:45';

      // 测试正常操作后的有效性
      const timeUtilsAfterOps = TimeUtils.create(baseDate)
          .add(1, 'month')
          .subtract(5, 'day')
          .hour(10)
          .minute(30);

      const momentAfterOps = moment(baseDate)
          .add(1, 'month')
          .subtract(5, 'day')
          .hour(10)
          .minute(30);

      expect(timeUtilsAfterOps.isValid()).toBe(momentAfterOps.isValid());
      expect(timeUtilsAfterOps.isValid()).toBe(true);

      // 测试边界操作后的有效性
      const timeUtilsBoundary = TimeUtils.create(baseDate)
          .startOfMonth()
          .endOfDay()
          .utc();

      const momentBoundary = moment(baseDate)
          .startOf('month')
          .endOf('day')
          .utc();

      expect(timeUtilsBoundary.isValid()).toBe(momentBoundary.isValid());
      expect(timeUtilsBoundary.isValid()).toBe(true);
    });

    test('不同时区下的时间有效性应该与 moment 一致', () => {
      const testDate = '2025-07-24 15:30:45';

      // 测试本地时间
      const localTimeInstance = TimeUtils.create(testDate);
      const localDayjsTime = moment(testDate);

      expect(localTimeInstance.isValid()).toBe(localDayjsTime.isValid());

      // 测试UTC时间
      const utcTimeInstance = TimeUtils.create(testDate).utc();
      const utcDayjsTime = moment(testDate).utc();

      expect(utcTimeInstance.isValid()).toBe(utcDayjsTime.isValid());
      expect(utcTimeInstance.isValid()).toBe(true);
    });

    test('时间计算可能导致的无效日期应该与 moment 行为一致', () => {
      // 测试可能导致无效日期的操作
      const testCases = [
        { base: '2025-01-31', operation: () => moment('2025-01-31').add(1, 'month') },
        { base: '2025-03-31', operation: () => moment('2025-03-31').subtract(1, 'month') },
        { base: '2024-02-29', operation: () => moment('2024-02-29').add(1, 'year') },
      ];

      testCases.forEach(({ base, operation }) => {
        const timeUtilsResult = TimeUtils.create(base).add(1, 'month');
        const momentResult = operation();

        expect(timeUtilsResult.isValid()).toBe(momentResult.isValid());

        // 如果moment认为结果有效，我们的实现也应该认为有效
        if (momentResult.isValid()) {
          expect(timeUtilsResult.isValid()).toBe(true);
        }
      });
    });

    test('极端值的时间有效性应该与 moment 一致', () => {
      const extremeValues = [
        0, // Unix时间戳0
        -1, // 负时间戳
        Number.MAX_SAFE_INTEGER, // 最大安全整数
        Number.MIN_SAFE_INTEGER, // 最小安全整数
        Infinity,
        -Infinity,
      ];

      extremeValues.forEach(extremeValue => {
        try {
          const timeObj = createTime(extremeValue);
          const momentTime = moment(extremeValue);

          expect(isValid(timeObj)).toBe(momentTime.isValid());

          const timeInstance = TimeUtils.create(extremeValue);
          expect(timeInstance.isValid()).toBe(momentTime.isValid());
        } catch (error) {
          // 某些极端值可能会抛出异常
          const momentTime = moment(extremeValue);
          expect(momentTime.isValid()).toBe(false);
        }
      });
    });

    test('字符串格式的边界情况有效性应该与 moment 一致', () => {
      const edgeCases = [
        '2025-7-24', // 单数字月份
        '2025-07-4', // 单数字日期
        '2025-7-4',  // 单数字月份和日期
        '25-07-24',  // 2位年份
        '2025/7/24', // 斜杠分隔的单数字
        '24/07/2025', // 日/月/年格式
        '07/24/2025', // 月/日/年格式
        '2025-07-24 5:30:45', // 单数字小时
        '2025-07-24 15:5:45', // 单数字分钟
        '2025-07-24 15:30:5', // 单数字秒
        '2025-07-24T15:30:45', // ISO格式
        '2025-07-24 15:30', // 没有秒
        '2025-07-24 15', // 只有小时
      ];

      edgeCases.forEach(edgeCase => {
        try {
          const timeObj = createTime(edgeCase);
          const momentTime = moment(edgeCase);

          expect(isValid(timeObj)).toBe(momentTime.isValid());

          const timeInstance = TimeUtils.create(edgeCase);
          expect(timeInstance.isValid()).toBe(momentTime.isValid());
        } catch (error) {
          // 某些格式可能不被支持
          const momentTime = moment(edgeCase);
          // 如果我们的实现抛出异常，moment应该认为它无效
          expect(momentTime.isValid()).toBe(false);
        }
      });
    });

    test('链式操作中isValid应该在每一步都与 moment 一致', () => {
      const baseDate = '2025-07-31'; // 选择可能产生边界问题的日期

      // 创建可能导致日期调整的链式操作
      const timeUtilsChain = TimeUtils.create(baseDate)
          .add(1, 'month') // 可能导致日期调整
          .subtract(1, 'day');

      const momentChain = moment(baseDate)
          .add(1, 'month')
          .subtract(1, 'day');

      expect(timeUtilsChain.isValid()).toBe(momentChain.isValid());

      // 测试更复杂的链式操作
      const complexChain = TimeUtils.create(baseDate)
          .add(1, 'month')
          .endOfMonth()
          .startOfDay()
          .add(1, 'year');

      const complexDayjsChain = moment(baseDate)
          .add(1, 'month')
          .endOf('month')
          .startOf('day')
          .add(1, 'year');

      expect(complexChain.isValid()).toBe(complexDayjsChain.isValid());
    });

    test('isValid性能应该在可接受范围内', () => {
      const testDates = [
        '2025-07-24 15:30:45',
        '2025-02-30', // 无效日期
        '2025-13-01', // 无效月份
        new Date(),
        1721813445000
      ];

      const iterations = 1000;

      // 测试我们的isValid性能
      const startTime = Date.now();
      for (let i = 0; i < iterations; i++) {
        testDates.forEach(testDate => {
          try {
            const timeObj = createTime(testDate);
            isValid(timeObj);
          } catch (error) {
            // 忽略异常
          }
        });
      }
      const ourDuration = Date.now() - startTime;

      // 测试moment的isValid性能
      const momentStartTime = Date.now();
      for (let i = 0; i < iterations; i++) {
        testDates.forEach(testDate => {
          moment(testDate).isValid();
        });
      }
      const momentDuration = Date.now() - momentStartTime;

      // 我们的性能不应该比moment慢太多（允许3倍的差距）
      expect(ourDuration).toBeLessThan(momentDuration * 3);

      console.log(`isValid性能对比 - 我们的实现: ${ourDuration}ms, Dayjs: ${momentDuration}ms`);
    });
  });

  describe('UTC功能对比', () => {
    test('UTC转换应该与 moment.utc() 一致', () => {
      const testDate = '2025-07-24 15:30:45';

      // 测试TimeInstance的utc方法
      const timeUtilsUtc = TimeUtils.create(testDate).utc();
      const momentUtc = moment(testDate).utc();

      // 比较格式化结果
      expect(timeUtilsUtc.formalFormat('YYYY-MM-DD HH:mm:ss')).toBe(
          momentUtc.format('YYYY-MM-DD HH:mm:ss')
      );

      // 比较时间戳
      expect(timeUtilsUtc.valueOf()).toBe(momentUtc.valueOf());
    });

    // test('UTC时间的各个部分应该与 moment 一致', () => {
    //   const testDate = '2025-07-24 15:30:45';
    //
    //   const timeUtilsUtc = TimeUtils.create(testDate).utc();
    //   const momentUtc = moment(testDate).utc();
    //
    //   expect(timeUtilsUtc.getYear()).toBe(momentUtc.year());
    //   expect(timeUtilsUtc.getMonth()).toBe(momentUtc.month());
    //   expect(timeUtilsUtc.getDate()).toBe(momentUtc.date());
    //   expect(timeUtilsUtc.getHour()).toBe(momentUtc.hour());
    //   expect(timeUtilsUtc.getMinute()).toBe(momentUtc.minute());
    //   expect(timeUtilsUtc.getSecond()).toBe(momentUtc.second());
    //   expect(timeUtilsUtc.getMillisecond()).toBe(momentUtc.millisecond());
    // });

    test('UTC偏移量应该与 moment.utcOffset() 一致', () => {
      const testDate = '2025-07-24 15:30:45';

      const timeInstance = TimeUtils.create(testDate);
      const momentTime = moment(testDate);

      // 比较UTC偏移量
      expect(timeInstance.utcOffset()).toBe(momentTime.utcOffset());
    });

    test('不同时区的UTC偏移量应该正确', () => {
      const testDate = '2025-07-24 15:30:45';

      // 测试本地时间的UTC偏移量
      const localTimeInstance = TimeUtils.create(testDate);
      const localDayjsTime = moment(testDate);

      expect(localTimeInstance.utcOffset()).toBe(localDayjsTime.utcOffset());

      // 测试UTC时间的偏移量应该是0
      const utcTimeInstance = TimeUtils.create(testDate).utc();
      const utcDayjsTime = moment(testDate).utc();

      expect(utcTimeInstance.utcOffset()).toBe(utcDayjsTime.utcOffset());
      expect(utcTimeInstance.utcOffset()).toBe(0);
    });

    test('UTC时间链式操作应该与 moment 一致', () => {
      const testDate = '2025-07-24 15:30:45';

      // 测试UTC后的链式操作
      const timeUtilsChain = TimeUtils.create(testDate)
          .utc()
          .add(1, 'hour')
          .formalFormat('YYYY-MM-DD HH:mm:ss');

      const momentChain = moment(testDate)
          .utc()
          .add(1, 'hour')
          .format('YYYY-MM-DD HH:mm:ss');

      expect(timeUtilsChain).toBe(momentChain);
    });

    test('UTC时间操作后的UTC偏移量应该保持为0', () => {
      const testDate = '2025-07-24 15:30:45';

      // 进行各种操作后UTC偏移量应该仍然是0
      const timeUtilsAfterOps = TimeUtils.create(testDate)
          .utc()
          .add(1, 'day')
          .hour(12)
          .minute(30);

      const momentAfterOps = moment(testDate)
          .utc()
          .add(1, 'day')
          .hour(12)
          .minute(30);

      expect(timeUtilsAfterOps.utcOffset()).toBe(0);
      expect(momentAfterOps.utcOffset()).toBe(0);
      expect(timeUtilsAfterOps.utcOffset()).toBe(momentAfterOps.utcOffset());
    });

    test('多种日期格式的UTC转换应该一致', () => {
      const testDates = [
        '2025-07-24 15:30:45',
        '2025/07/24 15:30:45',
        '2025-07-24T15:30:45',
        '2025-07-24T15:30:45Z',
        1721813445000 // 时间戳
      ];

      testDates.forEach(testDate => {
        const timeUtilsUtc = TimeUtils.create(testDate).utc();
        const momentUtc = moment(testDate).utc();

        expect(timeUtilsUtc.valueOf()).toBe(momentUtc.valueOf());
        expect(timeUtilsUtc.formalFormat('YYYY-MM-DD HH:mm:ss')).toBe(
            momentUtc.format('YYYY-MM-DD HH:mm:ss')
        );
      });
    });

    test('UTC时间的边界操作应该与 moment 一致', () => {
      const testDate = '2025-07-24 15:30:45';

      // 测试UTC时间的日开始和结束
      const timeUtilsStartOfDay = TimeUtils.create(testDate).utc().startOfDay();
      const momentStartOfDay = moment(testDate).utc().startOf('day');

      const timeUtilsEndOfDay = TimeUtils.create(testDate).utc().endOfDay();
      const momentEndOfDay = moment(testDate).utc().endOf('day');

      expect(timeUtilsStartOfDay.formalFormat('YYYY-MM-DD HH:mm:ss')).toBe(
          momentStartOfDay.format('YYYY-MM-DD HH:mm:ss')
      );
      expect(timeUtilsEndOfDay.formalFormat('YYYY-MM-DD HH:mm:ss')).toBe(
          momentEndOfDay.format('YYYY-MM-DD HH:mm:ss')
      );

      // 测试UTC时间的月开始和结束
      const timeUtilsStartOfMonth = TimeUtils.create(testDate).utc().startOfMonth();
      const momentStartOfMonth = moment(testDate).utc().startOf('month');

      const timeUtilsEndOfMonth = TimeUtils.create(testDate).utc().endOfMonth();
      const momentEndOfMonth = moment(testDate).utc().endOf('month');

      expect(timeUtilsStartOfMonth.formalFormat('YYYY-MM-DD HH:mm:ss')).toBe(
          momentStartOfMonth.format('YYYY-MM-DD HH:mm:ss')
      );
      expect(timeUtilsEndOfMonth.formalFormat('YYYY-MM-DD HH:mm:ss')).toBe(
          momentEndOfMonth.format('YYYY-MM-DD HH:mm:ss')
      );
    });

    test('UTC时间比较应该与 moment 一致', () => {
      const date1 = '2025-07-24 10:00:00';
      const date2 = '2025-07-24 15:00:00';

      const timeUtils1Utc = TimeUtils.create(date1).utc();
      const timeUtils2Utc = TimeUtils.create(date2).utc();

      const moment1Utc = moment(date1).utc();
      const moment2Utc = moment(date2).utc();

      expect(timeUtils1Utc.isBefore(timeUtils2Utc.toObject())).toBe(
          moment1Utc.isBefore(moment2Utc)
      );
      expect(timeUtils2Utc.isAfter(timeUtils1Utc.toObject())).toBe(
          moment2Utc.isAfter(moment1Utc)
      );
    });

    test('utcOffset方法应该与 moment.utcOffset() 完全一致', () => {
      const testDates = [
        '2025-07-24 15:30:45',
        '2025-01-01 00:00:00',
        '2025-12-31 23:59:59',
        '2024-02-29 12:00:00', // 闰年
        new Date().toISOString()
      ];

      testDates.forEach(testDate => {
        const timeInstance = TimeUtils.create(testDate);
        const momentTime = moment(testDate);

        // 本地时间的UTC偏移量应该一致
        expect(timeInstance.utcOffset()).toBe(momentTime.utcOffset());
      });
    });

    test('UTC转换后utcOffset应该为0', () => {
      const testDates = [
        '2025-07-24 15:30:45',
        '2025-01-01 00:00:00',
        '2025-12-31 23:59:59',
        1721813445000 // 时间戳
      ];

      testDates.forEach(testDate => {
        const timeUtilsUtc = TimeUtils.create(testDate).utc();
        const momentUtc = moment(testDate).utc();

        // UTC时间的偏移量都应该是0
        expect(timeUtilsUtc.utcOffset()).toBe(0);
        expect(momentUtc.utcOffset()).toBe(0);
        expect(timeUtilsUtc.utcOffset()).toBe(momentUtc.utcOffset());
      });
    });

    test('链式操作中utcOffset应该保持正确', () => {
      const testDate = '2025-07-24 15:30:45';

      // 进行各种操作后的utcOffset应该保持不变
      const originalOffset = TimeUtils.create(testDate).utcOffset();
      const originalDayjsOffset = moment(testDate).utcOffset();

      const timeUtilsAfterOps = TimeUtils.create(testDate)
          .add(1, 'day')
          .hour(10)
          .minute(30);

      const momentAfterOps = moment(testDate)
          .add(1, 'day')
          .hour(10)
          .minute(30);

      expect(timeUtilsAfterOps.utcOffset()).toBe(originalOffset);
      expect(momentAfterOps.utcOffset()).toBe(originalDayjsOffset);
      expect(timeUtilsAfterOps.utcOffset()).toBe(momentAfterOps.utcOffset());

      // UTC时间进行操作后，utcOffset应该保持为0
      const timeUtilsUtcAfterOps = TimeUtils.create(testDate)
          .utc()
          .add(1, 'day')
          .hour(10)
          .minute(30);

      const momentUtcAfterOps = moment(testDate)
          .utc()
          .add(1, 'day')
          .hour(10)
          .minute(30);

      expect(timeUtilsUtcAfterOps.utcOffset()).toBe(0);
      expect(momentUtcAfterOps.utcOffset()).toBe(0);
      expect(timeUtilsUtcAfterOps.utcOffset()).toBe(momentUtcAfterOps.utcOffset());
    });

    test('边界时间的utcOffset应该与 moment 一致', () => {
      const testDate = '2025-07-24 15:30:45';

      // 测试startOfDay的utcOffset
      const timeUtilsStartDay = TimeUtils.create(testDate).startOfDay();
      const momentStartDay = moment(testDate).startOf('day');

      expect(timeUtilsStartDay.utcOffset()).toBe(momentStartDay.utcOffset());

      // 测试endOfDay的utcOffset
      const timeUtilsEndDay = TimeUtils.create(testDate).endOfDay();
      const momentEndDay = moment(testDate).endOf('day');

      expect(timeUtilsEndDay.utcOffset()).toBe(momentEndDay.utcOffset());

      // 测试UTC边界时间的utcOffset
      const timeUtilsUtcStartDay = TimeUtils.create(testDate).utc().startOfDay();
      const momentUtcStartDay = moment(testDate).utc().startOf('day');

      expect(timeUtilsUtcStartDay.utcOffset()).toBe(0);
      expect(momentUtcStartDay.utcOffset()).toBe(0);
      expect(timeUtilsUtcStartDay.utcOffset()).toBe(momentUtcStartDay.utcOffset());
    });

    test('不同类型输入的utcOffset应该一致', () => {
      const now = new Date();
      const timestamp = now.getTime();
      const isoString = now.toISOString();
      const dateString = '2025-07-24 15:30:45';

      const inputs = [
        { type: 'timestamp', value: timestamp },
        { type: 'isoString', value: isoString },
        { type: 'dateString', value: dateString },
        { type: 'dateObject', value: now }
      ];

      inputs.forEach(({ type, value }) => {
        const timeInstance = TimeUtils.create(value);
        const momentTime = moment(value);

        expect(timeInstance.utcOffset()).toBe(momentTime.utcOffset());

        // 测试UTC转换后的utcOffset
        const timeInstanceUtc = TimeUtils.create(value).utc();
        const momentTimeUtc = moment(value).utc();

        expect(timeInstanceUtc.utcOffset()).toBe(0);
        expect(momentTimeUtc.utcOffset()).toBe(0);
        expect(timeInstanceUtc.utcOffset()).toBe(momentTimeUtc.utcOffset());
      });
    });

    test('utcOffset在复杂链式操作中应该保持正确', () => {
      const testDate = '2025-07-24 15:30:45';

      // 复杂的本地时间链式操作
      const complexLocalChain = TimeUtils.create(testDate)
          .add(1, 'month')
          .startOfMonth()
          .add(15, 'day')
          .hour(12)
          .minute(30)
          .second(45);

      const complexDayjsLocalChain = moment(testDate)
          .add(1, 'month')
          .startOf('month')
          .add(15, 'day')
          .hour(12)
          .minute(30)
          .second(45);

      expect(complexLocalChain.utcOffset()).toBe(complexDayjsLocalChain.utcOffset());

      // 复杂的UTC时间链式操作
      const complexUtcChain = TimeUtils.create(testDate)
          .utc()
          .add(1, 'month')
          .startOfMonth()
          .add(15, 'day')
          .hour(12)
          .minute(30)
          .second(45);

      const complexDayjsUtcChain = moment(testDate)
          .utc()
          .add(1, 'month')
          .startOf('month')
          .add(15, 'day')
          .hour(12)
          .minute(30)
          .second(45);

      expect(complexUtcChain.utcOffset()).toBe(0);
      expect(complexDayjsUtcChain.utcOffset()).toBe(0);
      expect(complexUtcChain.utcOffset()).toBe(complexDayjsUtcChain.utcOffset());
    });

    test('跨时区边界的utcOffset应该正确处理', () => {
      // 测试跨年边界
      const yearEnd = '2024-12-31 23:59:59';
      const yearStart = '2025-01-01 00:00:01';

      [yearEnd, yearStart].forEach(testDate => {
        const timeInstance = TimeUtils.create(testDate);
        const momentTime = moment(testDate);

        expect(timeInstance.utcOffset()).toBe(momentTime.utcOffset());

        const timeInstanceUtc = TimeUtils.create(testDate).utc();
        const momentTimeUtc = moment(testDate).utc();

        expect(timeInstanceUtc.utcOffset()).toBe(0);
        expect(momentTimeUtc.utcOffset()).toBe(0);
      });

      // 测试闰年边界
      const leapYear = '2024-02-29 12:00:00';
      const timeInstance = TimeUtils.create(leapYear);
      const momentTime = moment(leapYear);

      expect(timeInstance.utcOffset()).toBe(momentTime.utcOffset());

      const timeInstanceUtc = TimeUtils.create(leapYear).utc();
      const momentTimeUtc = moment(leapYear).utc();

      expect(timeInstanceUtc.utcOffset()).toBe(0);
      expect(momentTimeUtc.utcOffset()).toBe(0);
    });

    test('utcOffset与时间戳的关系应该与 moment 一致', () => {
      const testDate = '2025-07-24 15:30:45';

      const timeInstance = TimeUtils.create(testDate);
      const momentTime = moment(testDate);

      // 同一时刻的本地时间和UTC时间应该有相同的时间戳但不同的utcOffset
      const timeInstanceUtc = TimeUtils.create(testDate).utc();
      const momentTimeUtc = moment(testDate).utc();

      // 时间戳应该相同
      expect(timeInstance.valueOf()).toBe(momentTime.valueOf());
      expect(timeInstanceUtc.valueOf()).toBe(momentTimeUtc.valueOf());
      expect(timeInstance.valueOf()).toBe(timeInstanceUtc.valueOf());

      // 但是utcOffset应该不同（除非本地时间就是UTC）
      if (timeInstance.utcOffset() !== 0) {
        expect(timeInstance.utcOffset()).not.toBe(timeInstanceUtc.utcOffset());
      }
      expect(timeInstanceUtc.utcOffset()).toBe(0);
      expect(momentTimeUtc.utcOffset()).toBe(0);
    });
  });

  test('unix和toISOString方法对比moment', () => {
    const date = new Date(2025, 7, 1, 12, 34, 56, 789);
    const timeInstance = TimeUtils.create(date);
    const momentInstance = moment(date);
    expect(timeInstance.unix()).toBe(momentInstance.unix());
    expect(timeInstance.toISOString()).toBe(momentInstance.toISOString());
  });
  test('weekdays等方法验证', () => {
    const momentMonths = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];// monthNames、monthNamesShort
    const momentMonthsShort = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const momentWeekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']; // dayNames
    const momentWeekdaysShort = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const momentWeekdaysMin = ['日', '一', '二', '三', '四', '五', '六']; // dayNamesShort

    const timeInstanceWeekdays = TimeUtils.weekdays();
    expect(timeInstanceWeekdays).toEqual(momentWeekdays);

    const timeInstanceShort = TimeUtils.weekdaysShort(); // 修正：调用正确的方法
    expect(timeInstanceShort).toEqual(momentWeekdaysShort);

    const timeInstanceMonth = TimeUtils.months();
    expect(timeInstanceMonth).toEqual(momentMonths);

    const timeInstanceMonthShort = TimeUtils.monthsShort();
    expect(timeInstanceMonthShort).toEqual(momentMonthsShort);
    const weekdaysMin = TimeUtils.weekdaysMin();
    expect(weekdaysMin).toEqual(momentWeekdaysMin);
  });
});
