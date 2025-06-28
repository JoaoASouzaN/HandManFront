import { useEffect, useState } from "react";
import axios from "axios";
import { URLAPI } from "../constants/ApiUrl";
import { useGetToken } from "../hooks/useGetToken";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

interface Leilao {
  id: string;
  titulo: string;
  descricao: string;
  prazo: string;
  status: string;
}

export const MeusLeiloesScreen = () => {
  const token = useGetToken();
  const navigate = useNavigate();

  const [leiloes, setLeiloes] = useState<Leilao[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token?.id) return;

    const fetchLeiloes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URLAPI}/leilao/ativos/${token.id}`);
        setLeiloes(response.data);
      } catch (error) {
        toast.error("Erro ao carregar seus leilões.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeiloes();
  }, [token?.id]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-700">Meus Leilões Ativos</h2>

      {loading && <p>Carregando...</p>}

      {!loading && leiloes.length === 0 && (
        <p className="text-center text-gray-500">Você não possui leilões ativos.</p>
      )}

      <ul className="space-y-4">
        {leiloes.map((leilao) => (
          <li
            key={leilao.id}
            className="border p-4 rounded hover:shadow-md transition cursor-pointer"
            onClick={() => navigate(`/leilao/${leilao.id}`)}
          >
            <h3 className="font-semibold text-lg">{leilao.titulo}</h3>
            <p className="text-gray-600">{leilao.descricao}</p>
            <p className="text-sm text-gray-500 mt-2">
              Prazo termina{" "}
              {formatDistanceToNow(new Date(leilao.prazo), { addSuffix: true })}
            </p>
            <p className="text-sm font-medium mt-1">
              Status: <span className="capitalize">{leilao.status}</span>
            </p>
            <button
              className="mt-3 px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-800 transition"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/leilao/${leilao.id}`);
              }}
            >
              Ver detalhes
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
