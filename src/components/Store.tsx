import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4, validate as validateUUID } from "uuid";

interface Store {
  id: string;
  clients: string;
  sale_date: string;
  quantity_product: number;
}

const StoreComponent = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [newStore, setNewStore] = useState<Store>({
    id: "",
    clients: "",
    sale_date: "",
    quantity_product: 0,
  });
  const [editStoreId, setEditStoreId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/stores");
      setStores(response.data);
    } catch (error) {
      console.log("No se encontraron tiendas:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewStore({
      ...newStore,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (editStoreId) {
        const updatedStore = { ...newStore, id: editStoreId };
        await axios.put(
          `http://localhost:3000/stores/${editStoreId}`,
          updatedStore
        );
        const updatedStores = stores.map((store) => {
          if (store.id === editStoreId) {
            return updatedStore;
          }
          return store;
        });
        setStores(updatedStores);
        setEditStoreId(null);
      } else {
        const newId = uuidv4();
        const response = await axios.post("http://localhost:3000/stores", {
          ...newStore,
          id: newId,
        });
        setStores([...stores, response.data]);
      }
      setNewStore({
        id: "",
        clients: "",
        sale_date: "",
        quantity_product: 0,
      });
    } catch (error: any) {
      console.error("Error al enviar la nueva tienda:", error);
      console.log(error.response);
    }
  };

  const handleEdit = (id: string) => {
    const storeToEdit = stores.find((store) => store.id === id);
    if (storeToEdit) {
      setEditStoreId(id);
      setNewStore(storeToEdit);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (validateUUID(id)) {
        await axios.delete(`http://localhost:3000/stores/${id}`);
        setStores(stores.filter((item) => item.id !== id));
      } else {
        console.error("El ID de la tienda no es un UUID válido.");
      }
    } catch (error) {
      console.error("Error al eliminar la tienda:", error);
    }
  };

  return (
    <div>
      <h1 className='text-lg font-bold text-violet-600'>Lista de Tiendas</h1>
      <div>
        <form className='flex flex-col space-y-4' onSubmit={handleSubmit}>
          <input
            type='text'
            name='clients'
            value={newStore.clients}
            onChange={handleInputChange}
            placeholder='Nombre de clientes'
            className='p-2 border border-gray-300 rounded'
          />
          <input
            type='text'
            name='sale_date'
            value={newStore.sale_date}
            onChange={handleInputChange}
            placeholder='Fecha de venta'
            className='p-2 border border-gray-300 rounded'
          />
          <input
            type='number'
            name='quantity_product'
            value={newStore.quantity_product}
            onChange={handleInputChange}
            placeholder='Cantidad de productos'
            className='p-2 border border-gray-300 rounded'
          />
          <button
            type='submit'
            className='p-2 bg-blue-500 border-2 border-inherit rounded-lg text-white font-bold'
          >
            {editStoreId ? "Actualizar tienda" : "Agregar tienda"}
          </button>
        </form>

        <div className='border border-gray-300 p-4 rounded-md'>
          {stores.map((store: Store) => (
            <div
              key={store.id}
              className='flex items-center justify-between mb-4'
            >
              <div>
                <h3 className='text-lg font-semibold'>
                  Clientes: {store.clients}
                </h3>
                <p>Fecha de venta: {store.sale_date}</p>
                <p>Cantidad de productos: {store.quantity_product}</p>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(store.id)}
                  className='p-2 bg-green-500 text-white rounded-lg mr-2'
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(store.id)}
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

export default StoreComponent;
