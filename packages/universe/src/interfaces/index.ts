import { UUID } from "crypto";

export interface IQueryParams {
  id?: UUID;
  currentPage?: number | string;
  recordsPerPage?: number | string;
  searchText?: string;
  fromDate?: Date;
  toDate?: Date;
}

export type QueryParams<T extends keyof IQueryParams> = Required<
  Pick<IQueryParams, T>
>;

export type IPrettify<T> = {
  [P in keyof T]: T[P];
};

export type IRequireOnlyEntity<T> = Pick<
  T,
  {
    [K in keyof T]-?: undefined extends T[K] ? never : K;
  }[keyof T]
>;

export type Optional<T extends object, P extends keyof T> = {
  [K in keyof T]: T[K];
} & {
  [K in P]?: T[K];
};

export type MakeOptionalKeysRequired<T, P extends keyof Partial<T> = never> = {
  [K in Extract<keyof T, P>]-?: Exclude<T[K], undefined>;
} & {
  [K in Exclude<keyof T, P>]: T[K];
};

// export type MakeOptionalKeysRequired<T, K extends keyof T> = {
//   [P in keyof T]: P extends K ? NonNullable<T[P]> : T[P];
// };
// export interface IRequestSession extends Session {
//   captcha?: string | null;
//   otp?: number | null;
// }

// https://stackoverflow.com/questions/66212384/typescript-4-1-fixed-length-string-literal-type#:~:text=There%20is%20no%20way%20to,feature%20has%20not%20been%20released.&text=But%20you%20can't%20handle,too%20complex%20to%20represent%22%20error.
// type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type IsN<T extends number, N extends number> = N extends T ? true : never;

type LengthOfString<
  S extends string,
  T extends string[] = [],
> = S extends `${string}${infer R}`
  ? LengthOfString<R, [...T, string]>
  : T["length"];

type IsLengthN<T extends string, N extends number> = true extends IsN<
  LengthOfString<T>,
  N
>
  ? T
  : never;

export type IsE164PhoneNumber<S extends string> = S extends `+91${number}`
  ? IsLengthN<S, 13>
  : never;
