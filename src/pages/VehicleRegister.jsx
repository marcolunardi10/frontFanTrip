import React, { useState } from 'react';
import { IMaskInput } from 'react-imask'; // 1. Importe o componente de máscara
import PageTitle from '../components/PageTitle';
import api from '../services/api'; // Usando sua instância do Axios para consistência
import { useNavigate } from 'react-router-dom';

const VehicleRegister = () => {
  const [vehicle, setVehicle] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [plateType, setPlateType] = useState('antiga');
  const [plateNumber, setPlateNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSave = async () => {
    setError(''); // Limpa erro anterior

    // Validação robusta que funciona para ambos os formatos de placa
    const rawPlateNumber = plateNumber.replace(/[^a-zA-Z0-9]/g, '');
    if (rawPlateNumber.length !== 7) {
      setError('A placa deve conter 7 caracteres.');
      return;
    }

    if (!vehicle) {
      setError('Selecione um tipo de veículo.');
      return;
    }

    // Lembre-se de pegar o ID do usuário logado do localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        setError('Usuário não encontrado. Faça login novamente.');
        return;
    }

    const data = {
      tipo_veiculo: vehicle,
      capacidade: capacity,
      fl_mercosul: plateType === 'mercosul',
      placa: rawPlateNumber.toUpperCase(), // O estado já tem o valor formatado
      id_usuario: usuario.id
    };

    try {
      await api.post('/veiculos/', data);
      alert('Veículo salvo com sucesso!');
      navigate('/event');
    } catch (err) {
      if (err.response) {
        const errorData = err.response.data;
        const status = err.response.status;
    
        if (status === 409) {
          setError('Já existe um veículo cadastrado com essa placa.');
        } else if (status === 422 && Array.isArray(errorData.detail)) {
          // Pega a primeira mensagem de erro de validação do FastAPI
          const firstError = errorData.detail[0];
          const fieldName = firstError.loc[firstError.loc.length - 1];
          setError(`Erro no campo '${fieldName}': ${firstError.msg}`);
        } else {
          setError(errorData.detail || 'Ocorreu um erro ao salvar o veículo.');
        }
      } else {
        setError('Não foi possível conectar ao servidor.');
      }
      console.error('Erro ao salvar veículo:', err);
    }
    
  };

  const handleCancel = () => {
    setVehicle('');
    setCapacity(1);
    setPlateNumber('');
    setPlateType('antiga');
    setError('');
    alert('Cadastro cancelado.');
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-start px-4 py-10 space-y-8 text-indigo-900">
      <PageTitle>Cadastro de Veículo</PageTitle>

      {/* Seletor de Veículo */}
      <div className="w-full max-w-sm">
        <select
          className="w-full p-3 rounded-lg border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={vehicle}
          onChange={e => setVehicle(e.target.value)}
        >
          <option value="">Escolha o veículo</option>
          <option value="carro">Carro</option>
          <option value="van">Van</option>
          <option value="onibus">Ônibus</option>
          <option value="microonibus">Microônibus</option>
        </select>
      </div>

      {/* Capacidade */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Capacidade de Passageiros</h2>
        <div className="flex items-center justify-center space-x-6 mt-2">
          <button onClick={() => setCapacity(prev => Math.max(1, prev - 1))} className="w-10 h-10 rounded-full bg-red-500 text-white text-xl hover:bg-red-600 transition">−</button>
          <span className="text-2xl font-medium">{capacity}</span>
          <button onClick={() => setCapacity(prev => prev + 1)} className="w-10 h-10 rounded-full bg-green-500 text-white text-xl hover:bg-green-600 transition">+</button>
        </div>
      </div>

      {/* Tipo de Placa */}
      <div className="text-center mt-4">
        <h2 className="text-2xl font-semibold mb-2">PLACA:</h2>
        <div className="flex justify-center space-x-10 text-lg font-medium">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="plateType" value="antiga" checked={plateType === 'antiga'} onChange={() => { setPlateNumber(''); setPlateType('antiga'); }} className="accent-indigo-600"/>
            <span>Antiga</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="plateType" value="mercosul" checked={plateType === 'mercosul'} onChange={() => { setPlateNumber(''); setPlateType('mercosul'); }} className="accent-indigo-600"/>
            <span>Mercosul</span>
          </label>
        </div>
        {error && (<div className="text-red-600 mt-2 font-medium text-center max-w-sm">{error}</div>)}
      </div>

      {/* 2. Número da Placa com o componente de Máscara */}
      <IMaskInput
  mask={plateType === 'antiga' ? 'aaa-0000' : 'aaa0a00'}
  definitions={{
    'a': /[A-Za-z]/,
    '0': /[0-9]/,
  }}
  value={plateNumber}
  onAccept={(value) => setPlateNumber(value.toUpperCase())}
  overwrite
  placeholder={plateType === 'antiga' ? 'ABC-1234' : 'ABC1D23'}
  className="mt-4 w-full max-w-sm p-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-xl font-mono tracking-widest"
/>

      {/* Botões */}
      <div className="flex justify-center space-x-8 mt-6">
        <button onClick={handleCancel} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition">Cancelar</button>
        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition">Salvar</button>
      </div>
    </div>
  );
};

export default VehicleRegister;
