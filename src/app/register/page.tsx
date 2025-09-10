'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || 'Erro ao registrar');
        return;
      }

      localStorage.setItem('token', data.token);
      router.push('/login'); 
    } catch (err) {
      console.error(err);
      setErro('Erro ao registrar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Criar Conta</h1>

        {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

        <div>
          <label className="block text-gray-700 text-sm mb-1">Nome</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={e => setSenha(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          Registrar
        </button>

        <p className="text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Fazer login
          </a>
        </p>
      </form>
    </div>
  );
}
