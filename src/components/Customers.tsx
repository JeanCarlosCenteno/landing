import axios from "axios";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface Store {
  id: string;
  IDproduct: string;
  client: Client;
  sale_date: string;
  quantityProduct: number;
}

function CustomersComponent() {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState<Client>({
    id: "",
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<Client[]>(
        "http://localhost:3000/client"
      );
      setClients(response.data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewClient({ ...newClient, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post<Client>(
        "http://localhost:3000/client",
        newClient
      );
      console.log(response.data);
      setClients([...clients, response.data]);
      setNewClient({
        id: "",
        name: "",
        address: "",
        phone: "",
      });
    } catch (error) {
      console.error("Error al crear el cliente:", error);
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Listado de Clientes</h1>
      <div className='mb-4'>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            name='name'
            value={newClient.name}
            onChange={handleInputChange}
            placeholder='Nombre'
            className='p-2 border border-gray-300 rounded mb-2'
          />
          <input
            type='text'
            name='address'
            value={newClient.address}
            onChange={handleInputChange}
            placeholder='Dirección'
            className='p-2 border border-gray-300 rounded mb-2'
          />
          <input
            type='text'
            name='phone'
            value={newClient.phone}
            onChange={handleInputChange}
            placeholder='Teléfono'
            className='p-2 border border-gray-300 rounded mb-2'
          />
          <button type='submit' className='p-2 bg-blue-500 text-white rounded'>
            Crear Cliente
          </button>
        </form>
      </div>
      <h2 className='text-xl font-bold mb-2'>Listado de Clientes:</h2>
      <ul>
        {clients.map((client) => (
          <li key={client.id} className='mb-4'>
            <h3 className='text-lg font-semibold'>Nombre: {client.name}</h3>
            <p>Dirección: {client.address}</p>
            <p>Teléfono: {client.phone}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomersComponent;
