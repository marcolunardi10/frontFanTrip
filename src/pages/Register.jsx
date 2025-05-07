import React, { useState } from 'react';
import InputField from '../components/InputField';
import RadioGroup from '../components/RadioGroup';
import Button from '../components/Button';
import PageTitle from '../components/PageTitle';
import api from 'axios';

const Register = () => {
  const [role, setRole] = useState('motorista');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', confirmPassword: '',
    cpf: '', birth: '', password: '',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // Validação básica do formulário
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    const data = {
      nome: form.firstName,
      sobrenome: form.lastName,
      email: form.email,
      telefone: form.phone,
      cpf_cnpj: form.cpf,
      data_nascimento: form.birth,
      senha: form.password,
      tipo_usuario: role
    };

    try {
      const response = await api.post('http://127.0.0.1:8000/api/v1/usuarios', data);
      alert('Cadastro realizado com sucesso!');
      console.log('Resposta do backend:', response.data);
    } catch (error) {
      console.error('Erro ao registrar:', error);
      alert('Erro ao realizar o cadastro. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white/50 rounded-xl shadow-md p-8">
        <PageTitle>Cadastro</PageTitle>

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
          <InputField label="Nome" name="firstName" value={form.firstName} onChange={handleChange} />
          <InputField label="Sobrenome" name="lastName" value={form.lastName} onChange={handleChange} />
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
