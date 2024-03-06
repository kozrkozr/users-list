export const generateDynamicId = (): number => {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);

  const uniqueId = parseInt(`${timestamp}${randomSuffix}`, 10);

  return uniqueId;
};
