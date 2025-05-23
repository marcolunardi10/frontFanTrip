import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';


const VehicleRegister = () => {
  const [vehicle, setVehicle] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [plateType, setPlateType] = useState('antiga');
  const [plateNumber, setPlateNumber] = useState('');

  const handleSave = () => {
    const data = {
      vehicle,
      capacity,
      plateType,
      plateNumber
    };
    alert(`Veículo salvo:\n${JSON.stringify(data, null, 2)}`);
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
        <h2 className="text-2xl font-semibold mb-2">CAPACIDADE</h2>
        <div className="flex items-center justify-center space-x-6 mt-2">
          <button
            onClick={() => setCapacity(prev => Math.max(1, prev - 1))}
            className="w-10 h-10 rounded-full bg-red-500 text-white text-xl hover:bg-red-600 transition"
          >−</button>
          <span className="text-2xl font-medium">{capacity}</span>
          <button
            onClick={() => setCapacity(prev => prev + 1)}
            className="w-10 h-10 rounded-full bg-green-500 text-white text-xl hover:bg-green-600 transition"
          >+</button>
        </div>
      </div>

      {/* Tipo de Placa */}
      <div className="text-center mt-4">
        <h2 className="text-2xl font-semibold mb-2">PLACA:</h2>
        <div className="flex justify-center space-x-10 text-lg font-medium">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="plateType"
              value="antiga"
              checked={plateType === 'antiga'}
              onChange={() => setPlateType('antiga')}
              className="accent-indigo-600"
            />
            <span>Antiga</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="plateType"
              value="mercosul"
              checked={plateType === 'mercosul'}
              onChange={() => setPlateType('mercosul')}
              className="accent-indigo-600"
            />
            <span>Mercosul</span>
          </label>
        </div>
      </div>

      {/* Número da Placa */}
      <input
        type="text"
        placeholder="Número da placa"
        value={plateNumber}
        onChange={e => setPlateNumber(e.target.value)}
        className="mt-4 w-full max-w-sm p-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Botões */}
      <div className="flex justify-center space-x-8 mt-6">
        <button
          onClick={() => alert('Cadastro cancelado')}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default VehicleRegister;
