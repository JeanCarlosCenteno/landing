import axios from "axios";
import React, { useState, useEffect } from "react";

interface Producto {
  id: number;
  name_product: string;
  price: number;
  quantity: number;
}

function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState<Partial<Producto>>({
    name_product: "",
    price: 0,
    quantity: 0,
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/product");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNuevoProducto({ ...nuevoProducto, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/product", nuevoProducto);
      console.log(response.data);
      setProductos([...productos, response.data]);
      setNuevoProducto({ name_product: "", price: undefined, quantity: 0 });
    } catch (error) {
      console.error("Error al enviar el nuevo producto:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/product/${id}`);
      setProductos(productos.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const handleEdit = (id: number) => {
    const productToEdit = productos.find((item) => item.id === id);
    if (productToEdit) {
      setEditingProductId(id);
      setNuevoProducto({ ...productToEdit });
    }
  };

  const handleUpdate = async () => {
    if (editingProductId) {
      try {
        const response = await axios.put(
          `http://localhost:3000/product/${editingProductId}`,
          nuevoProducto
        );
        console.log(response.data);
        const updatedProducts = productos.map((item) => {
          if (item.id === editingProductId) {
            return { ...response.data };
          }
          return item;
        });
        setProductos(updatedProducts);
        setNuevoProducto({ name_product: "", price: undefined, quantity: 0 });
        setEditingProductId(null);
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-lg font-bold text-violet-600">Lista de Productos</h1>
      <div>
        <form className="flex flex-col space-y-4 w-80" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name_product"
            value={nuevoProducto.name_product}
            onChange={handleInputChange}
            placeholder="Nombre del producto"
            className="p-2 border border-gray-300 rounded"
            required
          />
                   <input
            type="number"
            name="quantity"
            value={nuevoProducto.quantity}
            onChange={handleInputChange}
            placeholder="Cantidad"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 border-2 border-inherit rounded-lg text-white font-bold"
          >
            Agregar producto
          </button>
        </form>
      </div>
      <div className="border border-gray-300 p-4 rounded-md w-80">
        {productos.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Nombre: {item.name_product}</h3>
              <h3>Precio: {item.price}</h3>
              <h3>Cantidad: {item.quantity}</h3>
            </div>
            <div>
              <button
                onClick={() => handleEdit(item.id)}
                className="p-2 bg-yellow-500 text-white rounded-lg mr-2"
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
      {editingProductId && (
        <div className="mt-4">
          <h2 className="text-lg font-bold text-violet-600">Editar Producto</h2>
          <form className="flex flex-col space-y-4 w-80">
            <input
              type="text"
              name="name_product"
              value={nuevoProducto.name_product}
              onChange={handleInputChange}
              placeholder="Nombre del producto"
              className="p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="number"
              name="price"
              value={nuevoProducto.price || ""}
              onChange={handleInputChange}
              placeholder="Precio"
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="quantity"
              value={nuevoProducto.quantity}
              onChange={handleInputChange}
              placeholder="Cantidad"
              className="p-2 border border-gray-300 rounded"
              required
            />
            <div>
              <button
                onClick={handleUpdate}
                className="p-2 bg-green-500 text-white rounded-lg"
              >
                Actualizar
              </button>
              <button
                onClick={() => setEditingProductId(null)}
                className="p-2 bg-gray-500 text-white rounded-lg ml-2"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Productos