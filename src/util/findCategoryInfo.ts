export const hasSubCategories = (categories: any[], targetKey: string): boolean => {
  for (const category of categories) {
    if (category.key === targetKey) {
      return Array.isArray(category.children) && category.children.length > 0;
    }
    if (category.children) {
      const found = hasSubCategories(category.children, targetKey);
      if (found) return true;
    }
  }
  return false;
};
