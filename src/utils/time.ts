import dayjs from "dayjs";

import "dayjs/locale/zh-cn"; // 导入本地化语言
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.locale("zh-cn");
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Shanghai");

export const formatTime = (time: string, format: string = "YYYY-MM-DD HH:mm:ss") => {
	return dayjs(time).tz().format(format);
};