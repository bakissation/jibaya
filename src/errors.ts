export type JibayaErrorCode =
  | 'UNKNOWN_YEAR'
  | 'INVALID_INPUT'
  | 'UNKNOWN_CATEGORY';

/** Error thrown by jibaya for unsupported years, categories or invalid inputs. */
export class JibayaError extends Error {
  readonly code: JibayaErrorCode;
  constructor(message: string, code: JibayaErrorCode) {
    super(message);
    this.name = 'JibayaError';
    this.code = code;
  }
}
