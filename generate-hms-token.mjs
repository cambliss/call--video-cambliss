import jwt from "jsonwebtoken";

const ACCESS_KEY = "6920427d145cb4e8449b1bc9";
const APP_SECRET = "UqqB080DRsXrrUEywmSnwlb9F9ZMk2JPU_cotEzZUTwD6DFBGOQAheLicdQrxwWHMtMTKnka5xpZU-SH-PtOED1fvnOVNHUc3zet70H4eB978EugZ8G_JCvrL57jFsAINfAJChdDB90tQGel3NqTA00405SSR_tIYhsKIHevD98=";

const now = Math.floor(Date.now() / 1000);
const payload = {
  access_key: ACCESS_KEY,
  type: "management",
  version: 2,
  iat: now,
  exp: now + 24 * 60 * 60, // valid for 24 hours
  jti: `${ACCESS_KEY}-${now}-${Math.random().toString(36).slice(2)}`,
};

const token = jwt.sign(payload, APP_SECRET, { algorithm: "HS256" });

console.log("Your HMS_MANAGEMENT_TOKEN =\n");
console.log(token);
