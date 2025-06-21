import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../services/api';

const EventCreateModal = ({ isOpen, onClose, onSave, usuario, veiculos = [] }) => {
  const [form, setForm] = useState({
    // Nomes atualizados para corresponder ao backend
    nome_evento: '',
    cidade_evento: '',
    uf_evento: '',
    data_evento: '',
    cidade_saida: '',
    uf_saida: '',
    data_saida: '',
  });
  
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  
  // Estados para os dropdowns de localização
  const [ufs, setUfs] = useState([]);
  const [cidadesEvento, setCidadesEvento] = useState([]);
  const [cidadesSaida, setCidadesSaida] = useState([]);

  // Lógica para buscar UFs (sem alterações)
  useEffect(() => {
    if (isOpen) {
      axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(res => setUfs(res.data.sort((a, b) => a.nome.localeCompare(b.nome))))
        .catch(e => console.error("Erro ao buscar UFs", e));
    }
  }, [isOpen]);

  // Lógica para buscar cidades do EVENTO
  useEffect(() => {
    if (form.uf_evento) {
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.uf_evento}/municipios`)
        .then(res => setCidadesEvento(res.data.sort((a, b) => a.nome.localeCompare(b.nome))))
        .catch(e => console.error("Erro ao buscar Cidades", e));
    } else {
      setCidadesEvento([]);
    }
  }, [form.uf_evento]);

  // Lógica para buscar cidades de SAÍDA
  useEffect(() => {
    if (form.uf_saida) {
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.uf_saida}/municipios`)
        .then(res => setCidadesSaida(res.data.sort((a, b) => a.nome.localeCompare(b.nome))))
        .catch(e => console.error("Erro ao buscar Cidades", e));
    } else {
      setCidadesSaida([]);
    }
  }, [form.uf_saida]);


  const handleSubmit = async () => {
    // Validação completa
    if (!form.nome_evento || !form.cidade_evento || !form.uf_evento || !form.data_evento ||
        !form.cidade_saida || !form.uf_saida || !form.data_saida || !selectedVehicleId) {
      alert('Por favor, preencha todos os campos, incluindo o veículo.');
      return;
    }

    try {
      const payload = {
        ...form,
        id_veiculo: parseInt(selectedVehicleId),
        id_transportador: usuario.id
      };
      
      await api.post('/eventos/', payload);
      alert('Evento criado com sucesso!');
      onSave();
      onClose(); // Fechar o modal
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      const errorDetail = error.response?.data?.detail;
      // ... seu tratamento de erro
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-indigo-900">Cadastrar Novo Evento</h2>
        
        <input placeholder="Nome do Evento" name="nome_evento" value={form.nome_evento} onChange={(e) => setForm({...form, nome_evento: e.target.value})} className="w-full mb-4 p-2 border rounded" />
        
        <fieldset className="border p-4 rounded mb-4">
          <legend className="px-2 font-semibold">Local de Saída</legend>
          <input type="date" name="data_saida" value={form.data_saida} onChange={(e) => setForm({...form, data_saida: e.target.value})} className="w-full mb-2 p-2 border rounded" />
          <select name="uf_saida" value={form.uf_saida} onChange={(e) => setForm({...form, uf_saida: e.target.value, cidade_saida: ''})} className="w-full mb-2 p-2 border rounded">
            <option value="">Selecione a UF de Saída</option>
            {ufs.map(uf => <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>)}
          </select>
          <select name="cidade_saida" value={form.cidade_saida} onChange={(e) => setForm({...form, cidade_saida: e.target.value})} className="w-full p-2 border rounded" disabled={!form.uf_saida}>
            <option value="">Selecione a Cidade de Saída</option>
            {cidadesSaida.map(cidade => <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>)}
          </select>
        </fieldset>
        
        <fieldset className="border p-4 rounded mb-4">
          <legend className="px-2 font-semibold">Local do Evento</legend>
          <input type="date" name="data_evento" value={form.data_evento} onChange={(e) => setForm({...form, data_evento: e.target.value})} className="w-full mb-2 p-2 border rounded" />
          <select name="uf_evento" value={form.uf_evento} onChange={(e) => setForm({...form, uf_evento: e.target.value, cidade_evento: ''})} className="w-full mb-2 p-2 border rounded">
            <option value="">Selecione a UF do Evento</option>
            {ufs.map(uf => <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>)}
          </select>
          <select name="cidade_evento" value={form.cidade_evento} onChange={(e) => setForm({...form, cidade_evento: e.target.value})} className="w-full p-2 border rounded" disabled={!form.uf_evento}>
            <option value="">Selecione a Cidade do Evento</option>
            {cidadesEvento.map(cidade => <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>)}
          </select>
        </fieldset>

        <select name="veiculo" value={selectedVehicleId} onChange={e => setSelectedVehicleId(e.target.value)} className="w-full mb-4 p-2 border rounded">
          <option value="">Selecione o Veículo</option>
          {veiculos.map(v => (
            <option key={v.id_veiculo} value={v.id_veiculo}> 
              {`${v.tipo_veiculo.charAt(0).toUpperCase()}${v.tipo_veiculo.slice(1)} - ${v.placa} (Cap: ${v.capacidade})`}
            </option>
          ))}
        </select>

        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Cancelar</button>
          <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default EventCreateModal;