// ethers v6
import { hexlify, toUtf8Bytes, toUtf8String, getBytes } from "ethers";

// --- Helpers: ASCII <-> fixed bytes (right-pad with zeros) ---

// Right-pad a 0x-hex string with zeros to `size` bytes.
const rpadHex = (hex: `0x${string}`, size: number): `0x${string}` => {
  const without0x = hex.slice(2);
  const targetLen = size * 2; // hex chars
  if (without0x.length > targetLen) {
    throw new Error(`rpadHex: input longer than ${size} bytes`);
  }
  const padded = without0x.padEnd(targetLen, "0");
  return (`0x${padded}`) as `0x${string}`;
};

// String -> 0x-hex (UTF-8)
const stringToHex = (ascii: string): `0x${string}` =>
  hexlify(toUtf8Bytes(ascii)) as `0x${string}`;

// 0x-hex -> string (UTF-8)
export const hexToString = (hex: `0x${string}`): string =>
  toUtf8String(getBytes(hex));

// Fixed-size helpers
export const toBytes20 = (ascii: string) =>
  rpadHex(stringToHex(ascii), 20) as `0x${string}`;

export const toBytes12 = (ascii: string) =>
  rpadHex(stringToHex(ascii), 12) as `0x${string}`;