import { LoginChallenge } from "./rusty-common/generated";

export enum LOGIN_METHOD {
  MANUAL = "MANUAL",
  NOSTR = "NOSTR",
  PRIVATE_KEY = "PRIVATE_KEY",
  EMAIL_MAGIC_LINK = "EMAIL_MAGIC_LINK",
  GOOGLE = "GOOGLE",
  GITHUB = "GITHUB",
  MICROSOFT = "MICROSOFT",
}

export const LOGIN_METHOD_NOSTR = [
  LOGIN_METHOD.NOSTR,
  LOGIN_METHOD.PRIVATE_KEY,
  LOGIN_METHOD.MANUAL,
];
export const LOGIN_METHOD_EMAIL_MAGIC_LINK = [LOGIN_METHOD.EMAIL_MAGIC_LINK];
export const LOGIN_METHOD_GOOGLE = [LOGIN_METHOD.GOOGLE];
export const LOGIN_METHOD_GITHUB = [LOGIN_METHOD.GITHUB];
export const LOGIN_METHOD_MICROSOFT = [LOGIN_METHOD.MICROSOFT];

export const OFFICIAL_LOGIN_METHODS = [
  LOGIN_METHOD.NOSTR,
  LOGIN_METHOD.EMAIL_MAGIC_LINK,
  LOGIN_METHOD.GOOGLE,
  LOGIN_METHOD.GITHUB,
  LOGIN_METHOD.MICROSOFT,
];

export const loginMethodFromType = (type: LoginChallenge['type']): LOGIN_METHOD | undefined => {
  switch (type) {
    case "NOSTR":
      return LOGIN_METHOD.NOSTR;
    case "EMAIL_MAGIC_LINK":
      return LOGIN_METHOD.EMAIL_MAGIC_LINK;
    case "GOOGLE":
      return LOGIN_METHOD.GOOGLE;
    case "GITHUB":
      return LOGIN_METHOD.GITHUB;
    case "MICROSOFT":
      return LOGIN_METHOD.MICROSOFT;
    default:
      return undefined
  }
}

export const loginMethodFromTypeOrThrow = (type: LoginChallenge['type']): LOGIN_METHOD => {
  const method = loginMethodFromType(type);
  if (!method) {
    throw new Error(`Unsupported login method type: ${type}`);
  }
  return method;
}

export const isOfficialLoginMethod = (type: LoginChallenge['type']): boolean => {
  const loginMethod = loginMethodFromType(type);
  return loginMethod ? OFFICIAL_LOGIN_METHODS.includes(loginMethod) : false;
}