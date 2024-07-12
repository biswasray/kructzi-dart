import os from "os";
import { IRequireOnlyEntity, IsE164PhoneNumber } from "../interfaces";
import { MakeOptionalKeysRequired } from "../interfaces";
import {
  Distinct,
  ExtraArrayFunctions,
  GroupBy,
  IExtraArrayFunctions,
  MultipleGroupBy,
  OrderBy,
  PropType,
  Select,
  Skip,
  SortBy,
  Take,
} from "./extra_array";
import PlatformError from "../platform-error";

export {
  Distinct,
  ExtraArrayFunctions,
  GroupBy,
  IExtraArrayFunctions,
  MultipleGroupBy,
  OrderBy,
  PropType,
  Select,
  Skip,
  SortBy,
  Take,
};

export * from "./logger";
export { default as logger } from "./logger";
export * from "./security";
export * from "./storage";

export function getDateString(date: Date) {
  const str = date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  let format: string;
  switch (date.getDate()) {
    case 1:
    case 21:
    case 31:
      format = "st";
      break;
    case 2:
    case 22:
      format = "nd";
      break;
    case 3:
    case 33:
      format = "rd";
      break;
    default:
      format = "th";
      break;
  }

  return `${str.replace(",", format + ",")} ${date.getFullYear()}`;
}

export function getListLastDateOfMonth(year: number, month: number) {
  const monthDifference = month === 0 ? new Date().getMonth() : month - 1;
  const listDates: Date[] = [];
  for (let singleMonth = 1; singleMonth <= monthDifference + 1; singleMonth++) {
    listDates.push(new Date(year, singleMonth, 0));
  }
  return listDates;
}
export function getListOfDatesOfCurrentMonth() {
  const day = new Date().getDate();
  const listDates: Date[] = [];
  for (let i = 1; i <= day; i++) {
    listDates.push(
      new Date(new Date().getFullYear(), new Date().getMonth(), i),
    );
  }
  return listDates;
}

export function getListOfDatesOfPreviousYearThisMonth() {
  const day = new Date().getDate();
  const listDates: Date[] = [];
  for (let i = 1; i <= day; i++) {
    listDates.push(
      new Date(new Date().getFullYear() - 1, new Date().getMonth(), i),
    );
  }
  return listDates;
}

export function getLastDateOfMonth(year: number, month: number) {
  return new Date(year, month, 0);
}

export function getListOfDatesOfMonthYear(year: number, month: number): Date[] {
  const lastDateOfMonth = getLastDateOfMonth(year, month);
  const day = lastDateOfMonth.getDate();
  const listDates: Date[] = [];
  for (let i = 1; i <= day; i++) {
    listDates.push(new Date(year, month - 1, i));
  }
  return listDates;
}

export function randomNumberInRange(min: number, max: number) {
  const floatRandom = Math.random();

  const difference = max - min;

  // random between 0 and the difference
  const random = Math.round(difference * floatRandom);

  const randomWithinRange = random + min;

  return randomWithinRange;
}

export function stringFormat(str: string, ...args: PropType[]) {
  return str.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != "undefined" ? args[number].toString() : match;
  });
}

export function excludeProp<T extends object, K extends keyof T>(
  obj: T,
  prop: K,
): Omit<T, K> {
  const { [prop]: _, ...result } = obj;
  _;
  return result;
}

export function excludeUndefinedProps<T extends object>(a: T) {
  const data: Partial<T> = {};
  for (const k in a) {
    const key = k as keyof T;
    if (typeof a[key] !== "undefined") {
      data[key] = a[key];
    }
  }
  return data as IRequireOnlyEntity<T>;
}

export function excludeProps<T extends object, K extends keyof T>(
  obj: T,
  ...props: K[]
): Omit<T, K> {
  if (props.length === 0) return obj;
  const [f, ...rest] = props;
  const data = excludeProp(obj, f);
  return excludeProps(data, ...(rest as Exclude<K, K>[])) as Omit<T, K>;
}

export function instanceContainsProps<T extends object>(
  obj: T | null | undefined,
  ...props: (keyof T)[]
) {
  if (!obj) return false;
  let flag = true;
  props.forEach(
    (prop) => (flag &&= Object.prototype.hasOwnProperty.call(obj, prop)),
  );
  return flag;
}

export function validateRequestData<T, P extends keyof T>(
  payload: T,
  ...props: P[]
) {
  for (const prop of props) {
    if (typeof payload[prop] === undefined || !payload[prop]) {
      throw new PlatformError("Bad Request", {
        messages: `${String(prop)} missing in request`,
      });
    }
  }
  // return payload as ConditionalRemoveOptional<typeof payload>;
  return payload as MakeOptionalKeysRequired<typeof payload, P>;
}

export function deg2rad(deg: number) {
  return (deg * Math.PI) / 180.0;
}

export function rad2deg(rad: number) {
  return (rad / Math.PI) * 180.0;
}

export function distance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: "K" | "N" = "K",
) {
  const theta = lon1 - lon2;
  let dist =
    Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.cos(deg2rad(theta));
  dist = dist > 1 ? 1 : dist;
  dist = Math.acos(dist);
  dist = rad2deg(dist);
  dist = dist * 60 * 1.1515;

  if (unit === "K") {
    dist = dist * 1.609344;
  } else if (unit === "N") {
    dist = dist * 0.8684;
  }

  return dist;
}

export function getDates(
  start_date: Date,
  end_date: Date,
  days: number,
): Date[];
export function getDates(
  start_date: Date,
  end_date: Date,
  days: number[],
): Date[];
export function getDates(
  start_date: Date,
  end_date: Date,
  days: number | number[],
) {
  const scheduleDates: Date[] = [];
  if (typeof days === "number") {
    for (
      let date = start_date;
      date <= end_date;
      date.setDate(date.getDate() + days)
    ) {
      scheduleDates.push(date);
    }
  } else {
    for (
      let date = start_date;
      date <= end_date;
      date.setDate(date.getDate() + 1)
    ) {
      //if (date.DayOfWeek == DayOfWeek.Sunday || date.DayOfWeek == DayOfWeek.Saturday)
      //    days_list.Add(date.ToShortDateString());
      if (days.includes(date.getDay())) {
        scheduleDates.push(date);
      }
    }
  }
  return scheduleDates;
}

export function convertDateTime(input: string): Date | null {
  const date = new Date(input);
  return isNaN(date.getTime()) ? null : date;
}

export function maxDate(dates: (Date | null | undefined)[]) {
  const sortedDates = dates.sort().reverse();
  for (const date of sortedDates) {
    if (date) {
      return date;
    }
  }
  return undefined;
}
export function getKeyByValue(obj: { [key: string]: unknown }, value: unknown) {
  return Object.keys(obj).find((key) => obj[key] === value);
}

export function getIp4Addresses() {
  // const os = require('os');

  // for(let addresses of Object.values(os.networkInterfaces())) {
  //     for(let add of addresses) {
  //         if(add.address.startsWith('192.168.')) {
  //             return add.address;
  //         }
  //     }
  // }
  const ips = Object.values(os.networkInterfaces())
    .flat()
    .filter(
      (data: { family: string; internal: boolean } | undefined) =>
        data?.family === "IPv4" && !data.internal,
    )
    .map(
      (data: { address: string } | undefined) => data?.address ?? "localhost",
    );
  return ips;
}

export function getLocalIpAddress() {
  // const os = require('os');

  // for(let addresses of Object.values(os.networkInterfaces())) {
  //     for(let add of addresses) {
  //         if(add.address.startsWith('192.168.')) {
  //             return add.address;
  //         }
  //     }
  // }
  const ips = getIp4Addresses();
  return ips.find((ip) => ip.startsWith("192.168.")) || ips.at(0);
}

export function generateRandomUserName() {
  return `${Date.now()}`;
}

export function parseTemplate(template: string, data: object) {
  const paramNames = Object.keys(data);
  const paramValues = Object.values(data);
  const fun = new Function(...paramNames, "return `" + template + "`");
  return fun(...paramValues, template);
}

export function isE164PhoneNumber(
  mobile: string,
): mobile is IsE164PhoneNumber<string> {
  return (
    mobile.startsWith("+91") &&
    !isNaN(Number(mobile.slice(3, 13))) &&
    mobile.length === 13
  );
}

export function parseToInMobile(mobile: string) {
  const result = `+91${mobile}`;
  if (!isE164PhoneNumber(result)) {
    throw new PlatformError("Unsupported Media Type", {
      messages: "Invalid mobile number",
    });
  }
  return result;
}

export function calculateAge(dob: Date | string, today = new Date()) {
  dob = new Date(dob);
  if (isNaN(dob.getTime())) {
    throw new Error("Invalid Date Type");
  }
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  // Adjust for negative months
  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }

  // Adjust for negative days
  if (days < 0) {
    const daysInLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
    ).getDate();
    days += daysInLastMonth;
    months--;

    if (months < 0) {
      months += 12;
      years--;
    }
  }
  return { years: years, months: months, days: days };
}

export function getTimeDue(date: Date, now = new Date()) {
  const timeDifference = now.getTime() - date.getTime();

  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30.44 * day; // Average month length in milliseconds
  const year = 12 * month;

  if (timeDifference < minute) {
    return "Just now";
  } else if (timeDifference < hour) {
    return `${Math.floor(timeDifference / minute)} minutes ago`;
  } else if (timeDifference < day) {
    return `${Math.floor(timeDifference / hour)} hours ago`;
  } else if (timeDifference < week) {
    return `${Math.floor(timeDifference / day)} days ago`;
  } else if (timeDifference < month) {
    return `${Math.floor(timeDifference / week)} weeks ago`;
  } else if (timeDifference < year) {
    return `${Math.floor(timeDifference / month)} months ago`;
  }
  return `${Math.floor(timeDifference / year)} years ago`;
}

export function createObjectPair<K extends string | number | symbol, V>(
  key: K,
  value: V,
) {
  const result = {
    [key]: value,
  };
  return result as {
    [key in K]: V;
  };
}

export function deepEqual(x: unknown, y: unknown): boolean {
  if (x === y) {
    return true;
  }

  if (
    typeof x !== "object" ||
    x === null ||
    typeof y !== "object" ||
    y === null
  ) {
    return false;
  }

  const keysX = Object.keys(x);
  const keysY = Object.keys(y);

  if (keysX.length !== keysY.length) {
    return false;
  }

  for (const prop in x) {
    if (
      Object.prototype.hasOwnProperty.call(y, prop) &&
      !deepEqual(x[prop as keyof object], y[prop as keyof object])
    ) {
      return false;
    }
  }

  return true;
}

export function getBeforeNDay(date = new Date(), n = 1) {
  const day = new Date(date).setDate(date.getDate() - n);
  return new Date(day);
}

export function getBeforeNWeek(date = new Date(), n = 1) {
  const week = new Date(date).setDate(date.getDate() - 7 * n);
  return new Date(week);
}

export function getBeforeNMonth(date = new Date(), n = 1) {
  const month = new Date(date).setMonth(date.getMonth() - n);
  return new Date(month);
}

export function getBeforeNYear(date = new Date(), n = 1) {
  const year = new Date(date).setFullYear(date.getFullYear() - n);
  return new Date(year);
}

export function getBeforeNTimeSpan(date = new Date(), n = 1) {
  const day = getBeforeNDay(date, n);
  const week = getBeforeNWeek(date, n);
  const month = getBeforeNMonth(date, n);
  const year = getBeforeNYear(date, n);
  return {
    day,
    week,
    month,
    year,
  };
}

export function createApiPath<T extends object>(
  path: string,
  config: T,
  recursive = false,
) {
  const result = {} as {
    [K in keyof T]: string & T[K];
  };
  for (const k in config) {
    const nextObj = config[k];
    if (typeof nextObj === "object" && nextObj) {
      const currentPath = `${path}/${k}`;
      const currentConfig = createApiPath(currentPath, nextObj as object, true);
      result[k] = Object.assign(currentPath, currentConfig);
    }
  }
  if (recursive) return result;
  return Object.assign(path, result);
}

export function isPathURL(input: string): boolean {
  // Regular expression to check if the input is a valid URL
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(input);
}

export function soberMessage(percent: number) {
  switch (true) {
    case percent === 0:
      return "";
    case percent < 0.03:
      return "This is the lowest level of intoxication with some measurable impact on the brain and body. You will feel relaxed, experience altered mood, feel a little warmer, and may make poor judgments.";
    case percent < 0.08:
      return "Driving under these conditions is risky and could impair your abilities. It's safest to avoid driving until you're sober.";
    default:
      return "It's illegal and unsafe to drive in this state. Please find an alternative way to get home, such as a designated driver or a ride-sharing service. Your safety and the safety of others on the road are paramount.";
  }
}
