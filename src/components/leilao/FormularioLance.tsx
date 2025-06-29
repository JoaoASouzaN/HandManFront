import { useState } from "react";
import axios from "axios";
import { URLAPI } from "../../constants/ApiUrl";
import { useGetToken } from "../../hooks/useGetToken";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Props {
  idLeilao: string;
}

export const FormularioLance = ({ idLeilao }: Props) => {
  const [valor, setValor] = useState('');
  const token = useGetToken();
  const navigate = useNavigate();

  const enviarLance = async () => {
    if (!token?.id) {
      toast.error('Você precisa estar logado para fazer um lance.');
      navigate('/login');
      return;
    }

    if (!valor || Number(valor) <= 0) {
      toast.error('Digite um valor válido para o lance.');
      return;
    }

    try {
      await axios.post(`${URLAPI}/leiloes/${idLeilao}/lance`, {
        valor: Number(valor),
        id_usuario: token.id,
      });

      toast.success('Lance enviado com sucesso!');
      setValor('');
    } catch (error) {
      console.error('Erro ao enviar lance:', error);
      toast.error('Erro ao enviar o lance.');
    }
  };

  const irParaLogin = () => {
    navigate('/login');
  };

  // Se não estiver logado, mostrar botão para fazer login
  if (!token?.id) {
    return (
      <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="text-orange-800 mb-3">Você precisa estar logado para fazer um lance.</p>
        <button
          onClick={irParaLogin}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
        >
          Fazer Login
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col items-start gap-3">
      <div className="w-full">
        <label htmlFor="valor-lance" className="block text-sm font-medium text-gray-700 mb-1">
          Seu Lance (R$)
        </label>
        <input
          id="valor-lance"
          type="number"
          placeholder="Digite seu lance"
          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          min="0"
          step="0.01"
        />
      </div>
      <button
        onClick={enviarLance}
        disabled={!valor || Number(valor) <= 0}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Enviar Lance
      </button>
    </div>
  );
};