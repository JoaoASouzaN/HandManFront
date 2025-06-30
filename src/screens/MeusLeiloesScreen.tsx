import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { URLAPI } from "../constants/ApiUrl";
import { useGetToken } from "../hooks/useGetToken";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Leilao {
  id: string;
  titulo: string;
  valor_atual: number;
  prazo: string;
  status: string;
  total_lances: number;
}

export const MeusLeiloesScreen = () => {
  const token = useGetToken();
  const [leiloes, setLeiloes] = useState<Leilao[]>([]);
  const [loading, setLoading] = useState(true);

  const buscarLeiloes = useCallback(async () => {
    if (!token?.id) return;
    setLoading(true);
    try {
      const response = await axios.get(`${URLAPI}/leiloes/usuario/${token.id}`);
      setLeiloes(response.data);
    } catch (error) {
      console.error("Erro ao buscar leilões:", error);
    } finally {
      setLoading(false);
    }
  }, [token?.id]);

  useEffect(() => {
    buscarLeiloes();
  }, [buscarLeiloes]);

  const cancelarLeilao = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja cancelar este leilão?")) return;
    try {
      await axios.patch(`${URLAPI}/leiloes/${id}/cancelar`);
      buscarLeiloes();
    } catch (error) {
      alert("Erro ao cancelar leilão.");
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-6 mt-10 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-orange-700">Meus Leilões</h2>
          <Link
            to="/criar-leilao"
            className="px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-800 transition"
          >
            Criar Leilão
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : leiloes.length === 0 ? (
          <p className="text-center text-gray-500">Você ainda não criou nenhum leilão.</p>
        ) : (
          <div className="grid gap-4">
            {leiloes.map((leilao) => (
              <div key={leilao.id} className={`border p-4 rounded-md shadow hover:shadow-md transition flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${leilao.status === 'Cancelado' ? 'opacity-60 bg-gray-100' : ''}`}>
                <div>
                  <h3 className="text-xl font-semibold">{leilao.titulo}</h3>
                  <p className="text-sm text-gray-600">Status: <strong>{leilao.status}</strong></p>
                  <p className="text-sm text-gray-600">Valor atual: <strong>R$ {leilao.valor_atual?.toFixed(2)}</strong></p>
                  <p className="text-sm text-gray-600">Lances: {leilao.total_lances || 0}</p>
                  <p className="text-sm text-gray-600">
                    Prazo restante:{" "}
                    <strong>
                      {formatDistanceToNow(new Date(leilao.prazo), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </strong>
                  </p>
                  {leilao.status === 'Cancelado' && (
                    <span className="text-red-600 font-bold">CANCELADO</span>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/leilao/${leilao.id}`}
                    className="px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-800 transition"
                  >
                    Ver Detalhes
                  </Link>
                  {leilao.status !== 'Cancelado' && (
                    <button
                      onClick={() => cancelarLeilao(leilao.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};
