import { SignOptions, sign, verify } from "jsonwebtoken";
import { createHash } from "crypto";
import * as CryptoJS from "crypto-js";
import { environment } from "..";

export class Encryptor {
  private static key = CryptoJS.enc.Utf8.parse(environment.CRYPTO_KEY);
  private static iv = CryptoJS.enc.Utf8.parse(environment.CRYPTO_IV);
  static encrypt(input: string, key?: string) {
    const salt = key ? CryptoJS.enc.Utf8.parse(key) : this.key;
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(input), salt, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }
  static decrypt(input: string, key?: string) {
    const salt = key ? CryptoJS.enc.Utf8.parse(key) : this.key;
    const decrypted = CryptoJS.AES.decrypt(input, salt, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  /**
   * To compare normal data with encrypted data
   * @param data
   * @param encryptedData
   * @returns {boolean}
   */
  static compareEncryptedData(data: string, encryptedData: string) {
    return Encryptor.decrypt(encryptedData) === data;
  }
}

export function randomNumberInRange(min: number, max: number) {
  const floatRandom = Math.random();

  const difference = max - min;

  // random between 0 and the difference
  const random = Math.round(difference * floatRandom);

  const randomWithinRange = random + min;

  return randomWithinRange;
}

/**
 * Convert payload data into JWT token
 * @param payload
 * @param options
 * @default options = { expiresIn: "5h" }
 * @returns {string}
 */
export function generateToken<T extends object>(
  payload: T,
  options?: SignOptions,
) {
  return sign(
    JSON.parse(JSON.stringify(payload)),
    environment.JWT_TOKEN_KEY as string,
    options || {
      expiresIn: "5h",
    },
  );
}

/**
 * Convert payload data from JWT token
 * @param token
 * @returns {object}
 */
export function generateDataFromToken<T extends object>(token: string) {
  const key = environment.JWT_TOKEN_KEY as string;
  return verify(token, key) as T;
}

export function autoGeneratePassword(length = 8) {
  let randomNumber;
  let strPassword = "";
  let strTemp = "";
  const chararray = [
    "B",
    "1",
    "2",
    "F",
    "3",
    "G",
    "4",
    "H",
    "5",
    "J",
    "#",
    "K",
    "7",
    "L",
    "8",
    "M",
    "9",
    "N",
    "$",
    "W",
    "X",
    "6",
    "Z",
    "@",
  ];
  for (let i = 1; i <= length; i++) {
    if (i == 1) {
      randomNumber = randomNumberInRange(0, 22);
    } else {
      randomNumber = randomNumberInRange(0, 23);
    }

    strTemp = chararray[randomNumber];
    if (randomNumberInRange(0, 5) % 2 === 0) strTemp = strTemp.toLowerCase();
    strPassword += strTemp;
  }
  return strPassword;
}

export function generateSHA512Signature(rawData: string) {
  const hash = createHash("sha512");
  hash.update(rawData, "utf8");
  return hash.digest("hex");
}

export function generateTransactionID() {
  return `TXUTK${Date.now()}${randomNumberInRange(100, 999)}`;
}

export function generateRecieptID() {
  return `RTUTK${Date.now()}${randomNumberInRange(100, 999)}`;
}
