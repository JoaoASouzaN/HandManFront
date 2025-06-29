import { useEffect, useState } from "react";
import axios from "axios";
import { URLAPI } from "../constants/ApiUrl";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LeilaoImage } from "../components/leilao/LeilaoImage";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Leilao {
    id: string;
    titulo: string;
    descricao: string;
    imagemCapa: string;
    tempoFinalizacao: string;
}

export const LeiloesScreen = () => {
    const [leiloes, setLeiloes] = useState<Leilao[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const buscarLeiloes = async () => {
            try {
                const response = await axios.get(`${URLAPI}/leiloes/ativos`);
                setLeiloes(response.data);
                setError(null);
            } catch (err) {
                setError("Erro ao carregar leilões.");
                setLeiloes([]);
            } finally {
                setLoading(false);
            }
        };

        buscarLeiloes();
    }, []);

    const tempoRestante = (dataFinal: string) => {
        return formatDistanceToNowStrict(new Date(dataFinal), {
            addSuffix: true,
            locale: ptBR
        });
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Carregando leilões...</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center text-red-500 py-8">{error}</div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Todos os Leilões</h1>
                        <p className="text-gray-600">Encontre os melhores serviços em leilão</p>
                    </div>

                    {leiloes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum leilão ativo</h3>
                            <p className="text-gray-500">Não há leilões ativos no momento. Volte mais tarde!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {leiloes.map((leilao) => (
                                <div
                                    key={leilao.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={() => navigate(`/leilao/${leilao.id}`)}
                                >
                                    <LeilaoImage
                                        src={leilao.imagemCapa}
                                        alt={leilao.titulo}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                                            {leilao.titulo}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {leilao.descricao}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-orange-600 font-medium">
                                                Encerra {tempoRestante(leilao.tempoFinalizacao)}
                                            </span>
                                            <button className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                                                Ver detalhes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}; 