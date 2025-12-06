// src/server/management-token.ts

import jwt, { type Secret } from "jsonwebtoken";
import { env } from "~/env.mjs";
import uuid4 from "uuid4";

interface Payload {
  iat: number;
  nbf: number;
  access_key: string;
  type: string;
  version: number;
}

/**
 * Generate a 100ms management token.
 * We add a small negative offset to iat/nbf to avoid
 * "token is not valid yet" errors due to clock skew.
 */
export const generateManagementToken = (): Promise<string> => {
  // subtract 60 seconds to be safe
  const nowInSeconds = Math.floor(Date.now() / 1000) - 60;

  const payload: Payload = {
    access_key: env.ACCESS_KEY,
    type: "management",
    version: 2,
    iat: nowInSeconds,
    nbf: nowInSeconds,
  };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      env.APP_SECRET as Secret,
      {
        algorithm: "HS256",
        expiresIn: "24h",
        jwtid: uuid4(),
      },
      function (err, token) {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      }
    );
  });
};
