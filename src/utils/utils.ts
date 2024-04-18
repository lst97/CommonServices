export class Utils {
  static isBrowserEnvironment() {
    return (
      typeof window !== "undefined" && typeof window.document !== "undefined"
    );
  }
}
