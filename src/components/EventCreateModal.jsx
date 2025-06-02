import React from 'react';

const EventCreateModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-indigo-900">Cadastrar Novo Evento</h2>
        
        {/* Formulário */}
        <input placeholder="Nome do Evento" className="w-full mb-2 p-2 border rounded" />
        <input type="date" className="w-full mb-2 p-2 border rounded" />
        <input type="time" className="w-full mb-2 p-2 border rounded" />
        <input placeholder="UF" className="w-full mb-2 p-2 border rounded" />
        <input placeholder="Cidade" className="w-full mb-2 p-2 border rounded" />
        <input placeholder="Quantidade" className="w-full mb-4 p-2 border rounded" />

        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Cancelar</button>
          <button onClick={onSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default EventCreateModal;
