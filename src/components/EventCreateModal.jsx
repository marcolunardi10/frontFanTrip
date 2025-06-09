import React, { useEffect, useState } from 'react';
import api from 'axios';

const EventCreateModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    nome: '',
    cidade: '',
    uf: '',
    data: ''
  });

  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCancel = () => {
    setForm({ nome: '', cidade: '', uf: '', data: '' });
    onClose();
  };

  // Buscar UFs na montagem
  useEffect(() => {
    const fetchUFs = async () => {
      const res = await api.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      const ufsOrdenadas = res.data.sort((a, b) => a.nome.localeCompare(b.nome));
      setUfs(ufsOrdenadas);
    };

    fetchUFs();
  }, []);

  // Buscar cidades ao selecionar UF
  useEffect(() => {
    const fetchCidades = async () => {
      if (form.uf) {
        const res = await api.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.uf}/municipios`);
        const cidadesOrdenadas = res.data.sort((a, b) => a.nome.localeCompare(b.nome));
        setCidades(cidadesOrdenadas);
      } else {
        setCidades([]);
      }
    };

    fetchCidades();
  }, [form.uf]);

  const handleSubmit = async () => {
    if (!form.nome || !form.cidade || !form.uf || !form.data) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const selectedDate = new Date(form.data);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // zera hora

      if (selectedDate < today) {
        alert('A data do evento não pode ser no passado.');
        return;
      }

      const response = await api.post('http://127.0.0.1:8000/eventos', form);
      alert('Evento criado com sucesso!');
      console.log('Resposta do backend:', response.data);
      onSave();
      onClose();

    } catch (error) {
      console.error('Erro ao criar evento:', error);

      if (error.response?.status === 409) {
        alert('Já existe um evento com esse nome.');
      } else if (error.response?.data?.detail) {
        alert(`Erro ao criar evento: ${error.response.data.detail}`);
      } else {
        alert('Erro inesperado ao criar evento. Tente novamente.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-indigo-900">Cadastrar Novo Evento</h2>

        <input
          placeholder="Nome do Evento"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />

        {/* UF primeiro */}
        <select
          name="uf"
          value={form.uf}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        >
          <option value="">Selecione a UF</option>
          {ufs.map(uf => (
            <option key={uf.sigla} value={uf.sigla}>
              {uf.nome} - {uf.sigla}
            </option>
          ))}
        </select>

        {/* Cidade depois */}
        <select
          name="cidade"
          value={form.cidade}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
          disabled={!form.uf}
        >
          <option value="">Selecione a Cidade</option>
          {cidades.map(cidade => (
            <option key={cidade.id} value={cidade.nome}>
              {cidade.nome}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="data"
          value={form.data}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCreateModal;
