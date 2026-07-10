import data from '@emoji-mart/data/sets/14/apple.json';
import dayjs from 'dayjs';
import enLocale from 'dayjs/locale/en';
import isBetween from 'dayjs/plugin/isBetween';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import relativeTime from 'dayjs/plugin/relativeTime';
import weekday from 'dayjs/plugin/weekday';
import { init } from 'emoji-mart';

init({ data });

/* 
  Do not explicitly set "en" locale, 
  some functions may not work correctly.
*/
dayjs.locale('en', { ...enLocale, weekStart: 1 });

[relativeTime, weekday, quarterOfYear, isBetween].map((p) => dayjs.extend(p));

(window as any).d = dayjs;
