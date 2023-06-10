import axios from "axios";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Producto {
  id: string;
  clients: string;
  sale_date: string;
  quantity_product: number;
}

function Store() {
  const [store, setStore] = useState<Producto[]>([]);
  const [nuevoStore, setNewStore] = useState<Producto>({
    id: "",
    clients: "",
    sale_date: "",
    quantity_product: 0,
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<Producto[]>(
        "http://localhost:3000/stores"
      );
      setStore(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewStore({ ...nuevoStore, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); // Limpiar el mensaje de error

    try {
      const response = await axios.post<Producto[]>(
        "http://localhost:3000/stores",
        nuevoStore
      );
      console.log(response.data);
      setStore(response.data);
      setNewStore({
        id: "",
        clients: "",
        sale_date: "",
        quantity_product: 0,
      });
    } catch (error) {
      console.error("Error al enviar el nuevo producto:", error);
      setError(
        "Error al enviar el nuevo producto. Por favor, intenta nuevamente."
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/stores/${id}`);
      setStore(store.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      setError("Error al eliminar el producto. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div>
      <h1 className='text-lg font-bold text-violet-600'>Listas de Productos</h1>
      <div>
        <form className='flex flex-col space-y-4 w-80' onSubmit={handleSubmit}>
          <input
            type='text'
            name='clients'
            value={nuevoStore.clients}
            onChange={handleInputChange}
            placeholder='Nombre del producto'
            className='p-2 border border-gray-300 rounded'
          />
          <input
            type='text'
            name='sale_date'
            value={nuevoStore.sale_date}
            onChange={handleInputChange}
            placeholder='Fecha de venta'
            className='p-2 border border-gray-300 rounded'
          />
          <input
            type='number'
            name='quantity_product'
            value={nuevoStore.quantity_product}
            onChange={handleInputChange}
            placeholder='Cantidad del producto'
            className='p-2 border border-gray-300 rounded'
          />
          <button
            type='submit'
            className='p-2 bg-blue-500 border-2 border-inherit rounded-lg text-white font-bold'
          >
            Agregar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Store;
