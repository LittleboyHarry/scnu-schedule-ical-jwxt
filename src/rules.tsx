export const title = '课程表导出小帮手 - ISCNU';
/**
 * 运行域名
 * @example 本地 localhost 调试时用 '*'
 */
export const domain = '*';
export const jwxtOrigin = 'https://jwxt.scnu.edu.cn';
export const jwxtUrl = `${jwxtOrigin}/`;
export const documentPath = `${process.env.PUBLIC_URL}/doc.md`;
export const calendarData = {
  domain: 'jwc.scnu.edu.cn',
  prodId: {
    company: 'South China Normal University',
    product: 'class-schedule'
  },
  name: 'ISCNU Class Schedule',
  timezone: 'Asia/Shanghai'
};
/** 学期的第一个周一的日期 */
export const firstMonday = '2020-03-02';
/** 抓取 Javascript 代码
 * 每条语句必须要有分号结尾，否则无法单行执行。
 */
export const scratchScript =
  `
(async domain => {
    try{
  const form_data = new FormData();
  form_data.append("xnm", "2019");
  form_data.append("xqm", "12");
  const data = (
    await (
      await fetch("/kbcx/xskbcx_cxXsKb.html", {
        method: "POST",
        credentials: "include",
        body: form_data
      })
    ).json()
    ).kbList;
    opener.postMessage(data,domain);
    setTimeout(()=>{alert("先回到日历导出窗口，点击重试按钮。然后再来一次")},0)
    }catch{setTimeout(()=>{alert("不是在这个窗口输入，重新试试。")},0)}
})('${domain}')`;
export enum Campus {
  /** 石牌 */
  Shipai = 'sp',
  /** 大学城 */
  Daxuecheng = 'dxc',
  /** 南海 */
  Nanhai = 'nh'
}
/** 上课时间表 */
export const schedule: Record<Campus, Record<number, { start: string; end: string }>> = {
  [Campus.Shipai]: {
    1: { start: '8:30', end: '9:10' },
    2: { start: '9:20', end: '10:00' },
    3: { start: '10:20', end: '11:00' },
    4: { start: '11:10', end: '11:50' },
    5: { start: '14:30', end: '15:10' },
    6: { start: '15:20', end: '16:00' },
    7: { start: '16:10', end: '16:50' },
    8: { start: '17:00', end: '17:40' },
    9: { start: '19:00', end: '19:40' },
    10: { start: '19:50', end: '20:30' },
    11: { start: '20:40', end: '21:20' }
  },
  [Campus.Daxuecheng]: {
    1: { start: '8:30', end: '9:10' },
    2: { start: '9:20', end: '10:00' },
    3: { start: '10:20', end: '11:00' },
    4: { start: '11:10', end: '11:50' },
    5: { start: '14:00', end: '14:40' },
    6: { start: '14:50', end: '15:30' },
    7: { start: '15:40', end: '16:20' },
    8: { start: '16:30', end: '17:10' },
    9: { start: '19:00', end: '19:40' },
    10: { start: '19:50', end: '20:30' },
    11: { start: '20:40', end: '21:20' }
  },
  [Campus.Nanhai]: {
    1: { start: '8:15', end: '8:55' },
    2: { start: '9:05', end: '9:45' },
    3: { start: '9:55', end: '10:35' },
    4: { start: '10:45', end: '11:25' },
    5: { start: '14:00', end: '14:40' },
    6: { start: '14:50', end: '15:30' },
    7: { start: '15:40', end: '16:20' },
    8: { start: '16:30', end: '17:10' },
    9: { start: '19:40', end: '20:20' },
    10: { start: '20:30', end: '21:10' },
    11: { start: '21:20', end: '22:00' }
  }
};
