export const ResponseMessage = (
  message: string,
  data: unknown = null,
): Record<string, unknown> => ({
  message,
  data,
});
