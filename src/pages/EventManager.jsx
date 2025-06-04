import React, { useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import EventCreateModal from '../components/EventCreateModal';
import api from 'axios';

const EventManager = () => {
  const [search, setSearch] = useState({ uf: '', cidade: '', evento: '' });
  const [showModal, setShowModal] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [tabela, setTabela] = useState([]);

  const fetchEventos = async (params = {}) => {
    try {
      const response = await api.get('http://127.0.0.1:8000/eventos/', { params });
      setEventos(response.data);
      setTabela(response.data); // Pode ter tratamento diferente se quiser.
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      alert('Erro ao buscar eventos.');
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleSearch = () => {
    fetchEventos(search);
  };

  const handleInputChange = e => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-blue-100 p-8 text-indigo-900">
      <PageTitle>Buscar ou Criar Eventos</PageTitle>

      {/* Formulário de busca */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <input 
          placeholder="UF" 
          name="uf" 
          value={search.uf} 
          onChange={handleInputChange} 
          className="p-2 rounded border" 
        />
        <input 
          placeholder="Cidade" 
          name="cidade" 
          value={search.cidade} 
          onChange={handleInputChange} 
          className="p-2 rounded border" 
        />
        <input 
          placeholder="Nome do Evento" 
          name="evento" 
          value={search.evento} 
          onChange={handleInputChange} 
          className="p-2 rounded border" 
        />
      </div>

      {/* Botões */}
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={handleSearch}
          className="bg-indigo-800 text-white px-6 py-2 rounded shadow hover:bg-indigo-900"
        >
          Buscar
        </button>
        <button 
          onClick={handleCreate} 
          className="bg-indigo-800 text-white px-6 py-2 rounded shadow hover:bg-indigo-900"
        >
          Criar
        </button>
      </div>

      <div className="flex">
        {/* Tabela */}
        <table className="border-collapse table-fixed border border-indigo-900 w-full">
  <thead>
    <tr className="bg-indigo-200">
      <th className="border p-2 text-left w-1/4">Nome</th>
      <th className="border p-2 text-left w-1/4">Cidade</th>
      <th className="border p-2 text-center w-1/8">UF</th>
      <th className="border p-2 text-center w-1/4">Data</th>
    </tr>
  </thead>
  <tbody>
    {tabela.map((item, idx) => (
      <tr key={idx} className="hover:bg-indigo-50">
        <td className="border p-2 text-left">{item.nome}</td>
        <td className="border p-2 text-left">{item.cidade}</td>
        <td className="border p-2 text-center">{item.uf}</td>
        <td className="border p-2 text-center">{item.data}</td>
      </tr>
    ))}
  </tbody>
</table>


        {/* Lista de eventos */}
        <div className="flex flex-col space-y-4 w-1/3">
          {eventos.map(evento => (
            <div key={evento.id} className="flex items-center space-x-2 bg-white p-4 rounded shadow hover:bg-gray-100 transition cursor-pointer">
              <span className="text-2xl">★</span>
              <span className="font-semibold">{evento.nome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de criação */}
      <EventCreateModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={() => {
          fetchEventos();
          setShowModal(false);
        }} 
      />
    </div>
  );
};

export default EventManager;
