import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4, validate as validateUUID } from "uuid";

interface Category {
  id: string;
  descriptionProduct: string;
}

const CategoryComponent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Category>({
    id: "",
    descriptionProduct: "",
  });
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/category");
      setCategories(response.data);
    } catch (error) {
      console.log("No se encontraron categorías:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory({
      ...newCategory,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (editCategoryId) {
        const updatedCategory = { ...newCategory, id: editCategoryId };
        await axios.patch(
          `http://localhost:3000/category/${editCategoryId}`,
          updatedCategory
        );
        const updatedCategories = categories.map((category) => {
          if (category.id === editCategoryId) {
            return updatedCategory;
          }
          return category;
        });
        setCategories(updatedCategories);
        setEditCategoryId(null);
      } else {
        const newId = uuidv4();
        const response = await axios.post("http://localhost:3000/category", {
          ...newCategory,
          id: newId,
        });
        setCategories([...categories, response.data]);
      }
      setNewCategory({ id: "", descriptionProduct: "" });
    } catch (error) {
      console.error("Error al enviar la nueva categoría de productos:", error);
    }
  };

  const handleEdit = (id: string) => {
    const categoryToEdit = categories.find((category) => category.id === id);
    if (categoryToEdit) {
      setEditCategoryId(id);
      setNewCategory(categoryToEdit);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (validateUUID(id)) {
        await axios.delete(`http://localhost:3000/category/${id}`);
        setCategories(categories.filter((item) => item.id !== id));
      } else {
        console.error("El ID de la categoría no es un UUID válido.");
      }
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  return (
    <div>
      <h1 className='text-lg font-bold text-violet-600'>
        Listas de Categorías
      </h1>
      <div>
        <form className='flex flex-col space-y-4' onSubmit={handleSubmit}>
          <input
            type='text'
            name='descriptionProduct'
            value={newCategory.descriptionProduct}
            onChange={handleInputChange}
            placeholder='Descripción de la categoría'
            className='p-2 border border-gray-300 rounded'
          />
          <button
            type='submit'
            className='p-2 bg-blue-500 border-2 border-inherit rounded-lg text-white font-bold'
          >
            {editCategoryId ? "Actualizar categoría" : "Agregar categoría"}
          </button>
        </form>

        <div className='border border-gray-300 p-4 rounded-md'>
          {categories.map((item: Category) => (
            <div
              key={item.id}
              className='flex items-center justify-between mb-4'
            >
              <div>
                <h3 className='text-lg font-semibold'>
                  Descripción: {item.descriptionProduct}
                </h3>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(item.id)}
                  className='p-2 bg-green-500 text-white rounded-lg mr-2'
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className='p-2 bg-red-500 text-white rounded-lg'
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;
