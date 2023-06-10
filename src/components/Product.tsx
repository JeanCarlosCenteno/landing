import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4, validate as validateUUID } from 'uuid';

interface Product {
  id: string;
  name_product: string;
  price: number;
  quantity: number;
}

const ProductComponent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name_product: '',
    price: 0,
    quantity: 0,
  });
  const [editProductId, setEditProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/product');
      setProducts(response.data);
    } catch (error) {
      console.log('No se encontraron productos:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({
      ...newProduct,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (editProductId) {
        const updatedProduct = { ...newProduct, id: editProductId };
        await axios.put(`http://localhost:3000/product/${editProductId}`, updatedProduct);
        const updatedProducts = products.map((product) => {
          if (product.id === editProductId) {
            return updatedProduct;
          }
          return product;
        });
        setProducts(updatedProducts);
        setEditProductId(null);
      } else {
        const newId = uuidv4();
        const response = await axios.post('http://localhost:3000/product', {
          ...newProduct,
          id: newId,
        });
        setProducts([...products, response.data]);
      }
      setNewProduct({ id: '', name_product: '', price: 0, quantity: 0 });
    } catch (error) {
      console.error('Error al enviar el nuevo producto:', error);

    }
  };

  const handleEdit = (id: string) => {
    const productToEdit = products.find((product) => product.id === id);
    if (productToEdit) {
      setEditProductId(id);
      setNewProduct(productToEdit);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (validateUUID(id)) {
        await axios.delete(`http://localhost:3000/product/${id}`);
        setProducts(products.filter((item) => item.id !== id));
      } else {
        console.error('El ID del producto no es un UUID válido.');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-lg font-bold text-violet-600 mb-4">Lista de Productos</h1>
      <div className="mb-4">
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name_product"
            value={newProduct.name_product}
            onChange={handleInputChange}
            placeholder="Nombre del producto"
            className="p-2 border border-gray-300 rounded"
          />

          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="Precio del producto"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="quantity"
            value={newProduct.quantity}
            onChange={handleInputChange}
            placeholder="Cantidad del producto"
            className="p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 border-2 border-inherit rounded-lg text-white font-bold"
          >
            {editProductId ? 'Actualizar producto' : 'Agregar producto'}
          </button>
        </form>
      </div>
      <div className="border border-gray-300 p-4 rounded-md">
        {products.map((item: Product) => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Nombre: {item.name_product}</h3>
              <p>Precio: {item.price}</p>
              <p>Cantidad: {item.quantity}</p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(item.id)}
                className="p-2 bg-green-500 text-white rounded-lg mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 bg-red-500 text-white rounded-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductComponent;

