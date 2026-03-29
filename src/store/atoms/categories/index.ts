
import { atom } from 'jotai';
import { getCategories, Category } from '@api';

export const categoriesListAtom = atom<Category[]>([]);
export const categoriesLoadingAtom = atom<boolean>(false);
export const categoriesErrorAtom = atom<string | null>(null);
export const shouldFetchCategoriesAtom = atom<boolean>(true);

export const getCategoriesAtom = atom(
  null,
  async (_get, set) => {
    try {
      set(categoriesLoadingAtom, true);
      set(categoriesErrorAtom, null);
      
      const categories = await getCategories.getAll();
      set(categoriesListAtom, categories);
      set(shouldFetchCategoriesAtom, false);
    } catch (error) {
      set(categoriesErrorAtom, error instanceof Error ? error.message : 'Произошла ошибка при загрузке категорий');
    } finally {
      set(categoriesLoadingAtom, false);
    }
  }
);