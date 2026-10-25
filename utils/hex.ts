/**
 * Deterministic, realistic-looking hex for the diagrams.
 *
 * Every hash, root, nullifier and ciphertext on screen is produced here from a
 * fixed seed string, so the same thing always shows the same bytes on every
 * render and every export — and two things that are meant to be equal (the
 * root two indexers compute, a nullifier published twice) are visibly equal.
 * None of it is real cryptography; it only has to look like bytes.
 */
export function fakeHex(seed: string, len = 16): string {
  let h = 2166136261 >>> 0
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  let x = h || 1
  let out = ''
  while (out.length < len) {
    x ^= x << 13
    x >>>= 0
    x ^= x >>> 17
    x ^= x << 5
    x >>>= 0
    out += (x & 0xF).toString(16)
  }
  return out
}

/** `3f9a…c27e` — the form hashes take on screen. */
export function shortHex(seed: string, n = 4): string {
  const hex = fakeHex(seed, n * 2)
  return `${hex.slice(0, n)}…${hex.slice(n)}`
}
