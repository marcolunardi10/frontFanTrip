import React, { useState } from 'react';
import InputField from '../components/InputField';
import RadioGroup from '../components/RadioGroup';
import Button from '../components/Button';
import PageTitle from '../components/PageTitle';
import api from 'axios'; // Importa a configuração do Axios

const Register = () => {
  const [role, setRole] = useState('motorista');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', confirmPassword: '',
    cpf: '', birth: '', password: '',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // Validação básica do formulário
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    const data = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      cpf: form.cpf,
      birth: form.birth,
      password: form.password,
      role, // Envia o papel selecionado (fã ou motorista)
    };

    try {
      const response = await api.post('/register', data); // Envia os dados para o backend
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