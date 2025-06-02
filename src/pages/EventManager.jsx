import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import EventCreateModal from '../components/EventCreateModal';

const EventManager = () => {
  const [search, setSearch] = useState({ uf: '', cidade: '', quantidade: '', evento: '', veiculo: '' });
  const [showModal, setShowModal] = useState(false);

  // Mock: dados vindos do banco
  const eventos = [
    { id: 1, nome: 'Show Jorge & Mateus' },
    { id: 2, nome: 'Grêmio X Internacional' },
    { id: 3, nome: 'Rock in Rio' },
  ];

  const tabela = [
    { nome: 'Evento 1', quantidade: 50, veiculo: 'Ônibus', data: '2025-06-10', cidade: 'SP', uf: 'SP', valor: '150' },
    { nome: 'Evento 2', quantidade: 20, veiculo: 'Van', data: '2025-07-15', cidade: 'RJ', uf: 'RJ', valor: '200' },
  ];

  const handleCreate = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-blue-100 p-8 text-indigo-900">
      <PageTitle>Buscar ou Criar Eventos</PageTitle>

      {/* Formulário de busca */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <input placeholder="UF" className="p-2 rounded border" />
        <input placeholder="Cidade" className="p-2 rounded border" />
        <input placeholder="Quantidade" className="p-2 rounded border" />
        <input type="date" className="p-2 rounded border" />
        <input type="time" className="p-2 rounded border" />
        <input type="date" className="p-2 rounded border" />
        <input type="time" className="p-2 rounded border" />
        <input placeholder="Nome do Evento" className="p-2 rounded border" />
        <select className="p-2 rounded border">
          <option>Escolha o veículo</option>
          <option>Carro</option>
          <option>Van</option>
          <option>Ônibus</option>
        </select>
      </div>

      {/* Botões */}
      <div className="flex space-x-4 mb-6">
        <button className="bg-indigo-800 text-white px-6 py-2 rounded shadow hover:bg-indigo-900">Limpar</button>
        <button onClick={handleCreate} className="bg-indigo-800 text-white px-6 py-2 rounded shadow hover:bg-indigo-900">Criar</button>
      </div>

      <div className="flex">
        {/* Tabela */}
        <table className="border-collapse border border-indigo-900 w-2/3 mr-8">
          <thead>
            <tr>
              <th className="border p-2">Nome</th>
              <th className="border p-2">Quantidade</th>
              <th className="border p-2">Veículo</th>
              <th className="border p-2">Data</th>
              <th className="border p-2">Cidade</th>
              <th className="border p-2">UF</th>
              <th className="border p-2">Valor</th>
            </tr>
          </thead>
          <tbody>
            {tabela.map((item, idx) => (
              <tr key={idx}>
                <td className="border p-2">{item.nome}</td>
                <td className="border p-2">{item.quantidade}</td>
                <td className="border p-2">{item.veiculo}</td>
                <td className="border p-2">{item.data}</td>
                <td className="border p-2">{item.cidade}</td>
                <td className="border p-2">{item.uf}</td>
                <td className="border p-2">{item.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Lista de eventos */}
        <div className="flex flex-col space-y-4 w-1/3">
          {eventos.map(evento => (
            <div key={evento.id} className="flex items-center space-x-2 bg-white p-4 rounded shadow hover:bg-gray-100 transition cursor-pointer">
              <span className="text-2xl">🎤</span>
              <span className="font-semibold">{evento.nome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de criação */}
      <EventCreateModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={() => { alert('Evento criado!'); setShowModal(false); }} />
    </div>
  );
};

export default EventManager;
