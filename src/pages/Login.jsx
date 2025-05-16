import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ user: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!form.user || !form.password) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const response = await api.post('http://127.0.0.1:8000/api/v1/usuarios/login', {
        email: form.user,
        senha: form.password
      });

      // Suponha que o backend retorne um token ou dados do usuário:
      const { token, usuario } = response.data;

      // Salvar token localmente (para manter o login)
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      alert('Login realizado com sucesso!');
      console.log('Usuário logado:', usuario);

      // Redirecionar para o painel principal, por exemplo:
      // window.location.href = '/painel';

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col justify-center items-center p-4">
      <div className="mb-6">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-black">
          <span className="text-6xl text-black">👤</span>
        </div>
      </div>
      <div className="w-full max-w-md bg-white/50 p-6 rounded-lg shadow-md">
        <InputField label="Usuário" name="user" value={form.user} onChange={handleChange} />
        <div className="relative">
          <InputField
            label="Senha"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 bottom-3 text-xl"
          >
            👁️
          </button>
        </div>
        <div className="flex justify-end mt-2 text-indigo-800 font-semibold">
        <button onClick={() => navigate('/register')}>Cadastrar</button>
        </div>
        <h2 className="text-center text-2xl mt-6 font-bold text-indigo-900">Login</h2>
        <div className="mt-4">
          <Button onClick={handleLogin}>Entrar</Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
