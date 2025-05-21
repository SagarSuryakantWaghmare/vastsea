// Type definitions for bcryptjs 2.4
// Provides type definitions for bcryptjs

declare module "bcryptjs" {
  /**
   * Synchronously generates a hash for the given string.
   * @param s String to hash
   * @param salt Salt length to generate or salt to use
   */
  export function hashSync(s: string, salt: string | number): string;

  /**
   * Asynchronously generates a hash for the given string.
   * @param s String to hash
   * @param salt Salt length to generate or salt to use
   * @param callback Callback receiving the error, if any, and the resulting hash
   */
  export function hash(s: string, salt: string | number): Promise<string>;

  /**
   * Synchronously generates a salt.
   * @param rounds Number of rounds to use, defaults to 10 if omitted
   * @returns Salt
   */
  export function genSaltSync(rounds?: number): string;

  /**
   * Asynchronously generates a salt.
   * @param rounds Number of rounds to use, defaults to 10 if omitted
   */
  export function genSalt(rounds?: number): Promise<string>;

  /**
   * Synchronously tests a string against a hash.
   * @param s String to compare
   * @param hash Hash to test against
   * @returns true if matching, false otherwise
   */
  export function compareSync(s: string, hash: string): boolean;

  /**
   * Asynchronously compares the given data against the given hash.
   * @param s Data to compare
   * @param hash Data to be compared to
   */
  export function compare(s: string, hash: string): Promise<boolean>;

  /**
   * Gets the number of rounds used to encrypt the specified hash.
   * @param hash Hash to extract the used rounds from
   * @returns Number of rounds used
   */
  export function getRounds(hash: string): number;
}
