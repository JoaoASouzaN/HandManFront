import { useEffect, useState } from "react";
import axios from "axios";
import { URLAPI } from "../../constants/ApiUrl";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LeilaoImage } from "./LeilaoImage";

interface Leilao {
    id: string;
    titulo: string;
    descricao: string;
    imagemCapa: string;
    tempoFinalizacao: string; // ISO String
}

export const LeilaoCarousel = () => {
    const [leiloes, setLeiloes] = useState<Leilao[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const buscarLeiloes = async () => {
            try {
                console.log('Buscando leilões ativos...');
                const response = await axios.get(`${URLAPI}/leiloes/ativos`);
                console.log('Leilões ativos recebidos:', response.data);
                setLeiloes(response.data);
                setError(null);
            } catch (err) {
                console.error('Erro ao carregar leilões:', err);
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
        return <div className="text-center py-8">Carregando leilões...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-8">{error}</div>;
    }

    if (leiloes.length === 0) {
        return <div className="text-center py-8">Nenhum leilão ativo no momento.</div>;
    }

    return (
        <div className="bg-orange-50 py-10">
            <h2 className="text-2xl font-bold text-center text-orange-700 mb-6">Leilões em destaque</h2>
            <div className="flex overflow-x-auto space-x-6 px-6 scrollbar-thin scrollbar-thumb-orange-300">
                {leiloes.map((leilao) => (
                    <div
                        key={leilao.id}
                        className="min-w-[280px] max-w-[300px] bg-white rounded-xl shadow-md p-4 flex-shrink-0 cursor-pointer hover:shadow-lg transition"
                        onClick={() => {
                            console.log('Card clicado, navegando para:', `/leilao/${leilao.id}`);
                            navigate(`/leilao/${leilao.id}`);
                        }}
                    >
                        <LeilaoImage
                            src={leilao.imagemCapa}
                            alt={leilao.titulo}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                        <h3 className="text-lg font-semibold text-gray-800 truncate">{leilao.titulo}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{leilao.descricao}</p>
                        <p className="text-xs text-gray-500 mt-2">Encerra {tempoRestante(leilao.tempoFinalizacao)}</p>
                        <button 
                            className="mt-3 w-full bg-orange-600 text-white py-1 px-3 rounded hover:bg-orange-700 text-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('Botão Saiba mais clicado, navegando para:', `/leilao/${leilao.id}`);
                                navigate(`/leilao/${leilao.id}`);
                            }}
                        >
                            Saiba mais
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
