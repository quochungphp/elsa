// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface String {
  stringWithFormat(...args: string[] | number[]): string;
}

String.prototype.stringWithFormat = function (...args: string[] | number[]) {
  let message = `${this}`;
  if (args && args.length > 0) {
    for (let i = 1; i <= args.length; i++) {
      const token = String(args[i - 1]);
      const regex = new RegExp("(\\{" + i + "\\})", "g");
      message = message.replace(regex, token);
    }
  }
  return message;
};
