export const readEnumParam = (searchParams, key, allowedValues, fallback) => {
  const value = searchParams.get(key);
  return allowedValues.includes(value) ? value : fallback;
};

export const readTextParam = (searchParams, key, fallback = "") =>
  searchParams.get(key) ?? fallback;

export const updateSearchParams = (searchParams, updates, defaults = {}) => {
  const next = new URLSearchParams(searchParams);

  Object.entries(updates).forEach(([key, value]) => {
    const defaultValue = defaults[key];
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === defaultValue
    ) {
      next.delete(key);
      return;
    }
    next.set(key, String(value));
  });

  return next;
};
