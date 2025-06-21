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

  // Busca os dados iniciais (todos os eventos e veículos do motorista)
  // Roda apenas quando o usuário é definido.
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await api.get('/eventos/');
        setTabela(response.data);
      } catch (error) {
        console.error('Erro ao buscar eventos iniciais:', error);
      }
    };
    
    fetchInitialData();

    if (usuario?.tipo_usuario === 'motorista') {
      const fetchMeusVeiculos = async () => {
        try {
          const response = await api.get(`/veiculos/usuario/${usuario.id}`);
          setMeusVeiculos(response.data);
        } catch (error) {
          console.error('Erro ao buscar veículos do motorista:', error);
        }
      };
      fetchMeusVeiculos();
    }
  }, [usuario]);
  
  // Função para lidar com a mudança nos inputs de busca
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearch(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  // Função para aplicar os filtros ao clicar no botão "Buscar"
  const handleSearch = async () => {
    const activeFilters = Object.fromEntries(
      Object.entries(search).filter(([_, value]) => value !== '')
    );
    try {
      const response = await api.get('/eventos/', { params: activeFilters });
      setTabela(response.data);
    } catch (error) {
      console.error('Erro ao buscar com filtros:', error);
    }
  };

  // Função para limpar os filtros e recarregar a lista completa
  const handleClearFilters = async () => {
    setSearch({ nome_evento: '', cidade_saida: '', cidade_evento: '' });
    try {
        const response = await api.get('/eventos/');
        setTabela(response.data);
    } catch (error) {
        console.error('Erro ao limpar filtros e buscar eventos:', error);
    }
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
        // 1. Monta o payload com os IDs do usuário (fã) e do evento
        const payload = { 
          id_usuario: usuario.id, 
          id_evento: evento.id 
        };

        // 2. Chama o novo endpoint no backend para criar a "viagem"
        await api.post('/viagens/', payload);

        alert('Vaga reservada com sucesso!');
        
        // 3. Recarrega a lista de eventos para atualizar a contagem de vagas na tela
        const response = await api.get('/eventos/');
        setTabela(response.data);

      } catch (error) {
        // 4. Exibe a mensagem de erro específica vinda do backend
        alert(error.response?.data?.detail || 'Não foi possível reservar a vaga.');
        console.error("Erro ao reservar vaga:", error);
      }
    }
  };

  const onEventSave = () => {
    setShowModal(false);
    handleClearFilters(); // Limpa filtros e recarrega a lista
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
        {/* Botão de Buscar Adicionado */}
        <button onClick={handleSearch} className="bg-blue-800 text-white px-6 py-2 rounded shadow hover:bg-blue-900">
          Buscar
        </button>
        <button onClick={handleClearFilters} className="bg-gray-600 text-white px-6 py-2 rounded shadow hover:bg-gray-700">
          Limpar Filtros
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
              {usuario?.tipo_usuario === 'fa' ? (
                <>
                  <th className="p-3 text-left">Veículo</th>
                  <th className="p-3 text-center">Vagas</th>
                  <th className="p-3 text-center">Ação</th>
                </>
              ) : (
                <th className="p-3 text-left">Veículo / Placa</th>
              )}
            </tr>
          </thead>
          <tbody>
            {tabela.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-indigo-50">
                <td className="p-3 font-medium">{item.nome_evento}</td>
                <td className="p-3">{item.cidade_evento}/{item.uf_evento}</td>
                <td className="p-3">{item.cidade_saida}/{item.uf_saida}</td>
                <td className="p-3 text-center">{new Date(item.data_evento + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                <td className="p-3 text-center">{new Date(item.data_saida + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                {/* Lógica para Fãs */}
                {usuario?.tipo_usuario === 'fa' && (
                  <>
                    <td className="p-3">{item.veiculo ? item.veiculo.tipo_veiculo : 'N/A'}</td>
                    <td className="p-3 text-center">{item.veiculo ? `${item.vagas_ocupadas} / ${item.veiculo.capacidade}` : 'N/A'}</td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => handleReservarLugar(item)} 
                        className="bg-purple-600 text-white px-3 py-1 text-sm rounded hover:bg-purple-700 disabled:bg-gray-400"
                        disabled={!item.veiculo || item.vagas_ocupadas >= item.veiculo.capacidade}
                      >
                        Reservar
                      </button>
                    </td>
                  </>
                )}
                {/* Lógica para Motoristas */}
                {usuario?.tipo_usuario === 'motorista' && (
                    <td className="p-3">{item.veiculo ? `${item.veiculo.tipo_veiculo} - ${item.veiculo.placa}` : 'Não definido'}</td>
                )}
              </tr>
            ))}
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
