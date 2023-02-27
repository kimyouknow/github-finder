// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const cloneDeep = <T>(x: T): T => JSON.parse(JSON.stringify(x));
