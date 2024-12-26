import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const error =
      exception instanceof WsException
        ? exception.getError()
        : exception.getResponse();

    const callback = host.getArgByIndex(2);
    if (callback && typeof callback === "function") {
      callback({
        status: "error",
        errors: [error],
      });
    }
  }
}
