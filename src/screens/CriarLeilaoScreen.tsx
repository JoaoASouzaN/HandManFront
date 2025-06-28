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
  const [prazo, setPrazo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !descricao || !categoria || !prazo) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (token?.role !== "Consumidor") {
      toast.error("Apenas consumidores podem criar leilões.");
      return;
    }

    try {
      await axios.post(`${URLAPI}/leilao`, {
        titulo,
        descricao,
        categoria,
        prazo,
        id_usuario: token.id
      });

      toast.success("Leilão criado com sucesso!");
      navigate("/");
    } catch (error) {
      toast.error("Erro ao criar leilão.");
      console.error(error);
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
          className="border border-gray-300 p-3 rounded"
        />

        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="border border-gray-300 p-3 rounded min-h-[100px]"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border border-gray-300 p-3 rounded"
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
          type="datetime-local"
          value={prazo}
          onChange={(e) => setPrazo(e.target.value)}
          className="border border-gray-300 p-3 rounded"
        />

        <button
          type="submit"
          className="bg-orange-700 text-white py-3 rounded hover:bg-orange-800 transition"
        >
          Criar Leilão
        </button>
      </form>
    </div>
  );
};