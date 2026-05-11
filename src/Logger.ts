export const Logger = {
  error(message: string, ...optionalParams: any[]) {
    console.error(`[Strava Sync] ${message}`, ...optionalParams);
  },
};
