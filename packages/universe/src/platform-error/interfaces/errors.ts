export interface IErrorSerialized {
  message: string;
  param?: string;
}
export interface IServerError {
  status: false;
  errors: {
    message: string;
  }[];
}

export type IErrorLoggerFunction = (error: Error) => void;
