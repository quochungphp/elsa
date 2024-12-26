import { HttpException } from "@nestjs/common";
import { CoreError } from "./const";

export class CoreException extends HttpException {
  constructor(error: CoreError, ...args: string[] | number[]) {
    let message = error.message;
    if (args && args.length > 0) {
      for (let i = 1; i <= args.length; i++) {
        const token = String(args[i - 1]);
        const regex = new RegExp("(\\{" + i + "\\})", "g");
        message = message.replace(regex, token);
      }
    }
    const errorResponse = { ...error, message: message };
    super(errorResponse, error.status, { cause: errorResponse });
  }
}
