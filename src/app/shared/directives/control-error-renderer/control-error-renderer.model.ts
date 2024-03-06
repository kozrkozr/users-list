export type ErrorKey = string;
export type ErrorMessage = string;

export type ExtractErrorMessageFn<Error> = (error: Error) => string;

export const isExtractErrorMessageFn = (message: ErrorMessage | ExtractErrorMessageFn<any>): message is ExtractErrorMessageFn<any> =>
  typeof message === 'function';

export type ErrorsMessagesDict = Record<ErrorKey, ErrorMessage | ExtractErrorMessageFn<any>>;
