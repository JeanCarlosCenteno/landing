import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4, validate as validateUUID } from "uuid";

interface Landing {
  id: string;
  name: string;
  url: string;
  descriptionProduct: string;
  landing: string;
  price: number;
}

export const LandingComponent = () => {
  const [landing, setLanding] = useState<Landing[]>([]);
  const [newLanding, setNewLanding] = useState<Landing>({
    id: "",
    name: "",
    url: "",
    descriptionProduct: "",
    landing: "",
    price: 0,
  });
  const [editLandingId, setEditLandingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/landing");
      setLanding(response.data);
    } catch (error) {
      console.log("landing not found:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewLanding({
      ...newLanding,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (editLandingId) {
        const updatedLanding = { ...newLanding, id: editLandingId };
        await axios.patch(
          `http://localhost:3000/landing/${editLandingId}`,
          updatedLanding
        );
        const updatedLandings = landing.map((landing) => {
          if (landing.id === editLandingId) {
            return updatedLanding;
          }
          return landing;
        });
        setLanding(updatedLandings);
        setEditLandingId(null);
      } else {
        const newId = uuidv4();
        const response = await axios.post("http://localhost:3000/landing", {
          ...newLanding,
          id: newId,
        });
        setLanding([...landing, response.data]);
      }
      setNewLanding({
        id: "",
        name: "",
        url: "",
        descriptionProduct: "",
        landing: "",
        price: 0,
      });
    } catch (error) {
      console.error("Error to send landing:", error);
    }
  };

  const handleEdit = (id: string) => {
    const storeToEdit = landing.find((landing) => landing.id === id);
    if (storeToEdit) {
      setEditLandingId(id);
      setNewLanding(storeToEdit);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (validateUUID(id)) {
        await axios.delete(`http://localhost:3000/landing/${id}`);
        setLanding(landing.filter((item) => item.id !== id));
      } else {
        console.error("El ID de la tienda no es un UUID válido.");
      }
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  return (
    <div>
      <h1 className='text-lg font-bold text-violet-600'>Listas de Tiendas</h1>
      <div>
        <form className='flex flex-col space-y-4' onSubmit={handleSubmit}>
          <input
            type='text'
            name='name'
            value={newLanding.name}
            onChange={handleInputChange}
            placeholder='Nombre de la tienda'
            className='p-2 border border-gray-300 rounded'
          />
          <input
            type='text'
            name='url'
            value={newLanding.url}
            onChange={handleInputChange}
            placeholder='URL de la tienda'
            className='p-2 border border-gray-300 rounded'
          />
          <input
            type='text'
            name='descriptionProduct'
            value={newLanding.descriptionProduct}
            onChange={handleInputChange}
            placeholder='Descripción del producto'
            className='p-2 border border-gray-300 rounded'
          />
          <input
            type='text'
            name='landing'
            value={newLanding.landing}
            onChange={handleInputChange}
            placeholder='Cantidad de tiendas'
            className='p-2 border border-gray-300 rounded'
          />
          <input
            type='number'
            name='price'
            value={newLanding.price}
            onChange={handleInputChange}
            placeholder='Precio'
            className='p-2 border border-gray-300 rounded'
          />
          <button
            type='submit'
            className='p-2 bg-blue-500 border-2 border-inherit rounded-lg text-white font-bold'
          >
            {editLandingId ? "Actualizar categoría" : "Agregar categoría"}
          </button>
        </form>
        <div className='border border-gray-300 p-4 rounded-md'>
          {landing.map((item: Landing) => (
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
