import { decodeNostrPrivateKeyString } from '@nostr-ts/common';

export function decodeNostrPrivateKey(privateKey: string) {
  if (privateKey.startsWith('nsec')) {
    return decodeNostrPrivateKeyString(`nostr:${privateKey}`) as string;
  } else if (privateKey.startsWith('nostr:')) {
    return decodeNostrPrivateKeyString(privateKey) as string;
  } else {
    return privateKey;
  }
}

export function decodeNostrPublicKey(publicKey: string) {
  if (publicKey.startsWith('npub')) {
    return publicKey;
  } else if (publicKey.startsWith('nostr:')) {
    return publicKey.slice(6);
  } else {
    return publicKey;
  }
}
