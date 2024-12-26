import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
@Injectable()
export class ScheduleService {
  logger = new Logger(ScheduleService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addTimeout(name: string, duration: number, callback: any) {
    const timeout = setTimeout(callback, duration);
    this.schedulerRegistry.addTimeout(name, timeout);
  }
  deleteTimeout(name: string) {
    try {
      this.schedulerRegistry.deleteTimeout(name);
    } catch (error) {
      this.logger.error(`Unable to delete timeout ${name}`);
    }
  }

  clearAndDeleteTimeout(name: string) {
    try {
      const timeout = this.schedulerRegistry.getTimeout(name);
      if (timeout) {
        clearTimeout(timeout);
        this.schedulerRegistry.deleteTimeout(name);
      }
    } catch (error) {
      this.logger.error(`Unable to delete timeout ${name}`);
    }
  }
}
