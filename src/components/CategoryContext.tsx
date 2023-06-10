import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface Category {
  id: string;
  descriptionProduct: string;
}

interface CategoryContextProps {
  categories: Category[];
  fetchCategories: () => void;
}

export const CategoryContext = createContext<CategoryContextProps>({
  categories: [],
  fetchCategories: () => {},
});

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/category');
      setCategories(response.data);
    } catch (error) {
      console.log('No se encontraron categorías:', error);
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};
