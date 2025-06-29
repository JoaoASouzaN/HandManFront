import { useEffect, useState } from "react";
import axios from "axios";
import { URLAPI } from "../constants/ApiUrl";
import { useGetToken } from "../hooks/useGetToken";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Leilao {
  id_leilao: string;
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

  useEffect(() => {
    if (!token?.id) return;

    const buscarLeiloes = async () => {
      try {
        const response = await axios.get(`${URLAPI}/leiloes/usuario/${token.id}`);
        setLeiloes(response.data);
      } catch (error) {
        console.error("Erro ao buscar leilões:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarLeiloes();
  }, [token?.id]);

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-6 mt-10 min-h-screen">
        <h2 className="text-3xl font-bold text-orange-700 mb-6">Meus Leilões</h2>

        {loading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : leiloes.length === 0 ? (
          <p className="text-center text-gray-500">Você ainda não criou nenhum leilão.</p>
        ) : (
          <div className="grid gap-4">
            {leiloes.map((leilao) => (
              <div key={leilao.id_leilao} className="border p-4 rounded-md shadow hover:shadow-md transition">
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

                <Link
                  to={`/leilao/${leilao.id_leilao}`}
                  className="inline-block mt-4 px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-800 transition"
                >
                  Ver Detalhes
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};
