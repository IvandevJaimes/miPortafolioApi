export const idValidator = (id: string | string[]): number | null => {
  const idStr = Array.isArray(id) ? id[0] : id;
  const parsed = parseInt(idStr, 10);
  if (isNaN(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};
