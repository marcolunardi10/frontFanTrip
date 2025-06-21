import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import EventCreateModal from '../components/EventCreateModal';
import api from '../services/api';

const EventManager = () => {
  const navigate = useNavigate();

  // Estados do Componente
  const [usuario, setUsuario] = useState(null);
  const [meusVeiculos, setMeusVeiculos] = useState([]);
  const [tabela, setTabela] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState({
    nome_evento: '',
    cidade_saida: '',
    cidade_evento: '',
  });

  // Carrega o usuário do localStorage ao montar o componente
  useEffect(() => {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString && usuarioString !== 'undefined') {
      try {
        setUsuario(JSON.parse(usuarioString));
      } catch (error) {
        console.error("Erro ao ler dados do usuário:", error);
      }
    }
  }, []);

  // Busca os dados do backend (eventos e veículos do motorista)
  useEffect(() => {
    // Só busca os dados depois que soubermos quem é o usuário
    if (!usuario) return;

    const fetchAllData = async () => {
      // O backend precisa do ID do usuário logado para saber se ele já está inscrito
      const activeFilters = Object.fromEntries(
        Object.entries(search).filter(([_, value]) => value !== '')
      );
      const params = { ...activeFilters, id_usuario_logado: usuario.id };
      
      try {
        const [eventosResponse, veiculosResponse] = await Promise.all([
          api.get('/eventos/', { params }),
          usuario.tipo_usuario === 'motorista'
            ? api.get(`/veiculos/usuario/${usuario.id}`)
            : Promise.resolve({ data: [] })
        ]);
        
        setTabela(eventosResponse.data);
        setMeusVeiculos(veiculosResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados da página:", error);
      }
    };
    
    fetchAllData();
  }, [usuario, search]);

  // Função para recarregar a lista de eventos (usada após reservar ou cancelar)
  const refreshEventList = async () => {
    const params = { id_usuario_logado: usuario?.id };
    try {
      const response = await api.get('/eventos/', { params });
      setTabela(response.data);
    } catch (error) {
      console.error("Erro ao recarregar eventos:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearch(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleCreate = () => {
    if (usuario?.tipo_usuario === 'motorista' && meusVeiculos.length === 0) {
      alert('Você precisa cadastrar um veículo antes de criar um evento.');
      navigate('/vehicle');
      return;
    }
    setShowModal(true);
  };

  const handleReservarLugar = async (evento) => {
    if (!usuario) return alert('Faça login para reservar uma vaga.');
    if (window.confirm(`Deseja realmente reservar sua vaga para o evento "${evento.nome_evento}"?`)) {
      try {
        await api.post('/viagens/', { id_usuario: usuario.id, id_evento: evento.id });
        alert('Vaga reservada com sucesso!');
        refreshEventList();
      } catch (error) {
        alert(error.response?.data?.detail || 'Não foi possível reservar a vaga.');
      }
    }
  };

  const handleCancelarReserva = async (evento) => {
    if (!usuario) return;
    if (window.confirm(`Deseja realmente CANCELAR sua reserva para o evento "${evento.nome_evento}"?`)) {
      try {
        await api.delete(`/viagens/usuario/${usuario.id}/evento/${evento.id}`);
        alert('Reserva cancelada com sucesso!');
        refreshEventList();
      } catch (error) {
        alert(error.response?.data?.detail || 'Não foi possível cancelar a reserva.');
      }
    }
  };
  
  const onEventSave = () => {
    setShowModal(false);
    refreshEventList();
  };

  return (
    <div className="min-h-screen bg-blue-100 p-8 text-indigo-900">
      <PageTitle>Eventos Disponíveis</PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          placeholder="Nome do Evento"
          name="nome_evento"
          value={search.nome_evento}
          onChange={handleInputChange}
          className="p-2 rounded border"
        />
        <input
          placeholder="Cidade de Saída"
          name="cidade_saida"
          value={search.cidade_saida}
          onChange={handleInputChange}
          className="p-2 rounded border"
        />
        <input
          placeholder="Cidade do Evento"
          name="cidade_evento"
          value={search.cidade_evento}
          onChange={handleInputChange}
          className="p-2 rounded border"
        />
      </div>

      <div className="flex space-x-4 mb-6">
        {/* O botão de buscar/limpar agora é controlado pela mesma lógica do useEffect */}
        <button onClick={() => setSearch({ nome_evento: '', cidade_saida: '', cidade_evento: '' })} className="bg-indigo-800 text-white px-6 py-2 rounded shadow hover:bg-indigo-900">
          Buscar / Limpar Filtros
        </button>
        {usuario?.tipo_usuario === 'motorista' && (
          <>
            <button onClick={handleCreate} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700">
              Criar Evento
            </button>
            <button onClick={() => navigate('/vehicle')} className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700">
              Cadastrar Veículo
            </button>
          </>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-indigo-200">
            <tr>
              <th className="p-3 text-left">Evento</th>
              <th className="p-3 text-left">Local do Evento</th>
              <th className="p-3 text-left">Saída de</th>
              <th className="p-3 text-center">Data Evento</th>
              <th className="p-3 text-center">Data Saída</th>
              {usuario?.tipo_usuario === 'fa' && (
                <>
                  <th className="p-3 text-left">Veículo</th>
                  <th className="p-3 text-center">Vagas</th>
                  <th className="p-3 text-center">Ação</th>
                </>
              )}
              {usuario?.tipo_usuario === 'motorista' && (
                <th className="p-3 text-left">Vagas (Ocupadas / Total)</th>
              )}
            </tr>
          </thead>
          <tbody>
            {tabela.map((item) => {
              const isSubscribed = !!item.minha_viagem_id;

              return (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-indigo-50">
                  <td className="p-3 font-medium">{item.nome_evento}</td>
                  <td className="p-3">{item.cidade_evento}/{item.uf_evento}</td>
                  <td className="p-3">{item.cidade_saida}/{item.uf_saida}</td>
                  <td className="p-3 text-center">{new Date(item.data_evento + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                  <td className="p-3 text-center">{new Date(item.data_saida + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                  
                  {usuario?.tipo_usuario === 'fa' && (
                    <>
                      <td className="p-3">{item.veiculo ? item.veiculo.tipo_veiculo : 'N/A'}</td>
                      <td className="p-3 text-center">{item.veiculo ? `${item.vagas_ocupadas} / ${item.veiculo.capacidade}` : 'N/A'}</td>
                      <td className="p-3 text-center">
                        {isSubscribed ? (
                          <button 
                            onClick={() => handleCancelarReserva(item)}
                            className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                          >
                            Cancelar
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleReservarLugar(item)} 
                            className="bg-purple-600 text-white px-3 py-1 text-sm rounded hover:bg-purple-700 disabled:bg-gray-400"
                            disabled={!item.veiculo || item.vagas_ocupadas >= item.veiculo.capacidade}
                          >
                            Reservar
                          </button>
                        )}
                      </td>
                    </>
                  )}
                  {usuario?.tipo_usuario === 'motorista' && (
                      <td className="p-3 text-center font-bold">{item.veiculo ? `${item.vagas_ocupadas} / ${item.veiculo.capacidade}` : 'N/A'}</td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {usuario?.tipo_usuario === 'motorista' && (
        <EventCreateModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={onEventSave}
          usuario={usuario}
          veiculos={meusVeiculos}
        />
      )}
    </div>
  );
};

export default EventManager;
