export function readFromStorage(key, fallbackValue) {
  try {
    const rawValue = localStorage.getItem(key);

    if (rawValue === null) {
      return fallbackValue;
    }

    return JSON.parse(rawValue);
  } catch {
    return fallbackValue;
  }
}

export function writeToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures to keep the UI responsive.
  }
}
