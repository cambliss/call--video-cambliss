Error: Cannot find module 'generate-hms-token.mjs'

How to fix:
1. The file `generate-hms-token.mjs` does not exist in your project directory.
2. If you want to generate a 100ms management token, you can use the code from your API route directly in a script.

Example script (save as `generate-hms-token.mjs`):

```js
import jwt from "jsonwebtoken";

const ACCESS_KEY = process.env.ACCESS_KEY;
const APP_SECRET = process.env.APP_SECRET;

if (!ACCESS_KEY || !APP_SECRET) {
  throw new Error("ACCESS_KEY or APP_SECRET is not set in env");
}

const now = Math.floor(Date.now() / 1000);
const payload = {
  access_key: ACCESS_KEY,
  type: "management",
  version: 2,
  iat: now,
  nbf: now,
  exp: now + 60 * 60,
};

const managementToken = jwt.sign(payload, APP_SECRET, { algorithm: "HS256" });
console.log(managementToken);
```

3. Save this file as `generate-hms-token.mjs` in your project directory.
4. Run with:
   node generate-hms-token.mjs

Make sure you have `jsonwebtoken` installed:
   npm install jsonwebtoken

And your `.env` contains ACCESS_KEY and APP_SECRET.
