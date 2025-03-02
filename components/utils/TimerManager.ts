/**
 * Centralized timer manager to reduce multiple interval creations
 * This singleton class manages all timers in the application to improve performance
 */
export class TimerManager {
  private static instance: TimerManager;
  private timers: Map<
    string,
    {
      callback: () => void;
      interval: number;
      lastRun: number;
    }
  > = new Map();
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {
    // Start a single interval that checks all timers
    this.intervalId = setInterval(() => {
      const now = Date.now();
      this.timers.forEach((timer, id) => {
        if (now - timer.lastRun >= timer.interval) {
          timer.callback();
          timer.lastRun = now;
        }
      });
    }, 1000); // Check every second
  }

  public static getInstance(): TimerManager {
    if (!TimerManager.instance) {
      TimerManager.instance = new TimerManager();
    }
    return TimerManager.instance;
  }

  public registerTimer(
    id: string,
    callback: () => void,
    interval: number
  ): void {
    this.timers.set(id, {
      callback,
      interval,
      lastRun: Date.now(),
    });
  }

  public unregisterTimer(id: string): void {
    this.timers.delete(id);
  }

  public cleanup(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.timers.clear();
  }
}
