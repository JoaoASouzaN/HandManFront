import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { URLAPI } from "../constants/ApiUrl";
import { toast } from "react-toastify";
import axios from "axios";
import { useGetToken } from "../hooks/useGetToken";

export const CriarLeilaoScreen = () => {
  const token = useGetToken();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valorInicial, setValorInicial] = useState("");
  const [prazo, setPrazo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [erros, setErros] = useState({
    titulo: false,
    descricao: false,
    categoria: false,
    valorInicial: false,
    prazo: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErros({ titulo: false, descricao: false, categoria: false, valorInicial: false, prazo: false });

    let hasError = false;

    if (!titulo.trim() || titulo.length < 5 || titulo.length > 100) {
      toast.warning("O título deve ter entre 5 e 100 caracteres.");
      setErros(prev => ({ ...prev, titulo: true }));
      hasError = true;
    }

    if (!descricao.trim() || descricao.length < 20) {
      toast.warning("A descrição deve ter pelo menos 20 caracteres.");
      setErros(prev => ({ ...prev, descricao: true }));
      hasError = true;
    }

    if (!categoria.trim()) {
      toast.warning("Escolha uma categoria.");
      setErros(prev => ({ ...prev, categoria: true }));
      hasError = true;
    }

    const valor = Number(valorInicial);
    if (isNaN(valor) || valor <= 0) {
      toast.warning("Informe um valor inicial válido (maior que zero).");
      setErros(prev => ({ ...prev, valorInicial: true }));
      hasError = true;
    }

    if (!prazo) {
      toast.warning("Informe o prazo final do leilão.");
      setErros(prev => ({ ...prev, prazo: true }));
      hasError = true;
    } else {
      const prazoDate = new Date(prazo);
      const agora = new Date();
      if (prazoDate <= agora) {
        toast.warning("O prazo deve ser uma data futura.");
        setErros(prev => ({ ...prev, prazo: true }));
        hasError = true;
      }
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      await axios.post(`${URLAPI}/leiloes`, {
        id_usuario: token?.id,
        titulo,
        descricao,
        categoria,
        valor_inicial: valor,
        prazo
      });

      toast.success("Leilão criado com sucesso!");
      navigate("/meus-leiloes");
    } catch (error) {
      toast.error("Erro ao criar o leilão.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-700">Criar Novo Leilão</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Título do Leilão"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className={`border p-3 rounded ${erros.titulo ? 'border-red-500' : 'border-gray-300'}`}
        />

        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className={`border p-3 rounded min-h-[100px] ${erros.descricao ? 'border-red-500' : 'border-gray-300'}`}
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={`border p-3 rounded ${erros.categoria ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Selecione a categoria</option>
          <option value="Mudança">Mudança</option>
          <option value="Carpintaria">Carpintaria</option>
          <option value="Elétricista">Elétricista</option>
          <option value="Limpeza">Limpeza</option>
          <option value="Encanamento">Encanamento</option>
          <option value="Jardinagem">Jardinagem</option>
        </select>

        <input
          type="number"
          placeholder="Valor Inicial (R$)"
          value={valorInicial}
          onChange={(e) => setValorInicial(e.target.value)}
          className={`border p-3 rounded ${erros.valorInicial ? 'border-red-500' : 'border-gray-300'}`}
        />

        <input
          type="datetime-local"
          value={prazo}
          onChange={(e) => setPrazo(e.target.value)}
          className={`border p-3 rounded ${erros.prazo ? 'border-red-500' : 'border-gray-300'}`}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`text-white py-3 rounded transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-700 hover:bg-orange-800'}`}
        >
          {isLoading ? "Criando..." : "Criar Leilão"}
        </button>
      </form>
    </div>
  );
};
