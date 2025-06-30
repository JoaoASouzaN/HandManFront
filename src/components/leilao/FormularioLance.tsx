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
  const [enviando, setEnviando] = useState(false);
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

    setEnviando(true);

    try {
      const response = await axios.post(
        `${URLAPI}/leiloes/${idLeilao}/lance`,
        {
          valor: Number(valor),
          usuarioId: token.id,
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast.success('Lance enviado com sucesso!');
      setValor('');
      
      // Recarregar a página para mostrar o novo lance
      window.location.reload();
    } catch (error: any) {
      console.error('Erro ao enviar lance:', error);
      
      if (error.response?.status === 403) {
        toast.error('Apenas fornecedores podem dar lances em leilões. Você precisa ser um fornecedor para participar.');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.erro || 'Erro ao enviar o lance.');
      } else if (error.response?.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        navigate('/login');
      } else {
        toast.error('Erro ao enviar o lance. Tente novamente.');
      }
    } finally {
      setEnviando(false);
    }
  };

  const irParaLogin = () => {
    navigate('/login');
  };

  const irParaCadastroFornecedor = () => {
    navigate('/cadastro-fornecedor');
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

  // Se não for fornecedor, mostrar mensagem específica
  if (token.role !== 'Fornecedor') {
    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 mb-3">Apenas fornecedores podem dar lances em leilões.</p>
        <p className="text-blue-600 text-sm mb-3">Você precisa ser um fornecedor para participar de leilões.</p>
        <button
          onClick={irParaCadastroFornecedor}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Seja um Fornecedor
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col items-start gap-3">
      <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
        <h3 className="font-semibold text-green-800 mb-2">Como funciona o leilão:</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• O usuário define um valor máximo que está disposto a pagar</li>
          <li>• Os fornecedores competem oferecendo valores MENORES</li>
          <li>• Quem oferecer o menor valor ganha o serviço</li>
          <li>• Seu lance deve ser menor que o valor máximo e menor que os lances existentes</li>
        </ul>
      </div>
      
      <div className="w-full">
        <label htmlFor="valor-lance" className="block text-sm font-medium text-gray-700 mb-1">
          Seu Lance (R$) - Deve ser MENOR que o valor máximo
        </label>
        <input
          id="valor-lance"
          type="number"
          placeholder="Digite seu lance (valor menor)"
          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          min="0"
          step="0.01"
          disabled={enviando}
        />
        <p className="text-xs text-gray-500 mt-1">
          Dica: Ofereça um valor competitivo para aumentar suas chances de ganhar!
        </p>
      </div>
      <button
        onClick={enviarLance}
        disabled={!valor || Number(valor) <= 0 || enviando}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {enviando ? 'Enviando...' : 'Enviar Lance'}
      </button>
    </div>
  );
};