/* eslint-disable @typescript-eslint/no-explicit-any */
export enum CustomDefinedErrors {
  DataDuplicationError = 'DataDuplicationError',
}
const errorHandler = (error: any) => {
  let errorMessage = 'An unexpected error occurred';
  let statusCode = 500;

  if (error.name === 'ValidationError') {
    errorMessage = Object.values(error.errors)
      .map((val: any) => val.message)
      .join(', ');
    statusCode = 400;
  } else if (error.name === 'DataDuplicationError') {
    errorMessage = error.message;
    statusCode = 409;
  }

  return { statusCode, errorMessage };
};

export default errorHandler;
