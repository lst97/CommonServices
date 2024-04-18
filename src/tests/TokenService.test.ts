import { TokenServiceError } from "../errors/Errors";
import { inversifyContainer } from "../inversify.config";
import { ITokenService, ReactTokenService } from "../services/TokenService";

describe("ReactTokenService", () => {
  let tokenService: ITokenService;
  beforeEach(() => {
    tokenService = inversifyContainer().get<ITokenService>(ReactTokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Should be failed, because the setToken method is called outside of the browser environment
  it("should add a new token key with a validation function", () => {
    const keyName = "tokenKeyTest";
    const validateFn = (_token: string) => true;

    tokenService.addTokenKey(keyName, validateFn);
    tokenService.setToken(keyName, "token_value_test");
    expect(tokenService.getToken(keyName)).toEqual("token_value_test");
    expect(tokenService.isValidToken(keyName)).toBeTruthy();
  });

  it("should throw TokenServiceError if setToken is called outside of browser environment", () => {
    const keyName = "tokenKey";
    const token = "tokenValue";

    expect(() => {
      tokenService.setToken(keyName, token);
    }).toThrow(TokenServiceError);
  });
});
