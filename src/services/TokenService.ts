import { injectable } from "inversify";
import { inversifyContainer } from "../inversify.config";
import { Utils } from "../utils/utils";
import { TokenServiceError } from "../errors/Errors";

/**
 * Interface defining methods for managing and accessing tokens in a storage mechanism.
 *
 * @example
 * ```typescript
 * const tokenService = new ReactTokenService();
  // Add a key with a custom validation function
  tokenService.addTokenKey('myCustomToken', (token) => token.startsWith('custom_'));
  // Set a token for that key
  tokenService.setToken('myCustomToken', 'custom_12345');
  // Check if the token is valid
  const isValid = tokenService.isValidToken('myCustomToken'); // true
 * ```
 */
export interface ITokenService {
  /**
   * Adds a new token key with a validation function.
   *
   * @param {string} keyName - The name of the token key to add.
   * @param {(token: string) => boolean} validateFn - A function that validates the token for the given key.
   * @throws {TokenServiceError} If the key name already exists.
   */
  addTokenKey(keyName: string, validateFn: (token: string) => boolean): void;

  /**
   * Sets a token value for a specific key.
   *
   * @param {string} keyName - The name of the token key to set.
   * @param {string} token - The token value to store.
   * @throws {TokenServiceError} If the key name is not registered or if the token is invalid according to the registered validation function.
   */
  setToken(keyName: string, token: string): void;

  /**
   * Retrieves a token value for a specific key.
   *
   * @param {string} keyName - The name of the token key to retrieve.
   * @returns {string | null} The token value or null if the key is not found.
   */
  getToken(keyName: string): string | null;

  /**
   * Removes a token for a specific key.
   *
   * @param {string} keyName - The name of the token key to remove.
   */
  removeToken(keyName: string): void;

  /**
   * Checks if a token for a specific key is valid.
   *
   * @param {string} keyName - The name of the token key to validate.
   * @returns {boolean} True if the token is valid, false otherwise.
   */
  isValidToken(keyName: string): boolean;
}

@injectable()
export class ReactTokenService implements ITokenService {
  private tokenKeys: Map<string, { validate: (token: string) => boolean }> =
    new Map();

  public addTokenKey(
    keyName: string,
    validateFn: (token: string) => boolean,
  ): void {
    this.tokenKeys.set(keyName, { validate: validateFn });
  }

  public setToken(keyName: string, token: string): void {
    if (!Utils.isBrowserEnvironment()) {
      throw new TokenServiceError(
        "This method can only be used in the browser environment",
      );
    }

    const keyInfo = this.tokenKeys.get(keyName);
    if (!keyInfo) {
      throw new TokenServiceError(`Token key '${keyName}' is not registered.`);
    }

    if (!keyInfo.validate(token)) {
      throw new TokenServiceError(`Invalid token for key '${keyName}'`);
    }

    localStorage.setItem(keyName, token);
  }

  public getToken(keyName: string): string | null {
    if (!Utils.isBrowserEnvironment()) {
      throw new TokenServiceError(
        "This method can only be used in the browser environment",
      );
    }
    return localStorage.getItem(keyName);
  }

  public removeToken(keyName: string): void {
    if (!Utils.isBrowserEnvironment()) {
      throw new TokenServiceError(
        "This method can only be used in the browser environment",
      );
    }
    localStorage.removeItem(keyName);
  }

  public isValidToken(keyName: string): boolean {
    const token = this.getToken(keyName);
    if (!token) {
      return false;
    }

    const keyInfo = this.tokenKeys.get(keyName);
    return keyInfo ? keyInfo.validate(token) : false;
  }
}

export function ReactTokenServiceInstance(): ITokenService {
  return inversifyContainer().get<ITokenService>(ReactTokenService);
}
