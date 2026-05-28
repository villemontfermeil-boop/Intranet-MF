export const isBrowser = typeof window !== 'undefined';

export function getSessionItem(key: string): string | null {
  return isBrowser ? sessionStorage.getItem(key) : null;
}

export function getSessionItemOrEmpty(key: string): string {
  return isBrowser ? sessionStorage.getItem(key) || '' : '';
}

export function getSessionBoolean(key: string): boolean {
  return isBrowser ? sessionStorage.getItem(key) === 'true' : false;
}

export function clearSessionStorage() {
  if (isBrowser) {
    sessionStorage.clear();
  }
}
