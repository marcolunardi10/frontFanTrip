import React, { useState } from 'react';
import InputField from '../components/InputField';
import RadioGroup from '../components/RadioGroup';
import Button from '../components/Button';

const Register = () => {
  const [role, setRole] = useState('motorista');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', confirmPassword: '',
    cpf: '', birth: '', password: '',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    // TODO: Form validation and submit
    alert('Cadastro enviado!');
  };

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white/50 rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Cadastro</h1>

        <p className="text-center text-lg font-semibold mb-4 text-indigo-800">EU SOU:</p>
        <RadioGroup
          selected={role}
          onChange={setRole}
          options={[
            { label: 'FÃ', value: 'fa' },
            { label: 'MOTORISTA', value: 'motorista' }
          ]}
        />

        <div className="grid grid-cols-2 gap-6 mt-6">
          <InputField label="Nome Completo" name="name" value={form.name} onChange={handleChange} />
          <InputField label="CPF/CNPJ" name="cpf" value={form.cpf} onChange={handleChange} />
          <InputField label="Email" name="email" value={form.email} onChange={handleChange} />
          <InputField label="Data de nascimento" name="birth" type="date" value={form.birth} onChange={handleChange} />
          <InputField label="Telefone" name="phone" value={form.phone} onChange={handleChange} />
          <InputField label="Senha" name="password" type="password" value={form.password} onChange={handleChange} />
          <InputField label="Confirmar senha" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
        </div>

        <div className="flex space-x-4 justify-center mt-6">
          <Button onClick={handleSubmit}>Cadastrar</Button>
          <Button onClick={() => alert('Cancelado')} variant="secondary">Cancelar</Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
