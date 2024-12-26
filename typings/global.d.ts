import { Logger } from '../src/utils/rootLogger';

declare global {
  namespace Express {
    interface Request {
      logger: Logger;
      correlationId: string;
      isPerformanceTesting: boolean;
    }
  }
}
