import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { URLAPI } from "../constants/ApiUrl";
import { useGetToken } from "../hooks/useGetToken";
import { FormularioLance } from "../components/leilao/FormularioLance";
import { formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

interface Lance {
    id_lance: string;
    id_usuario: string;
    valor: number;
    criado_em: string;
}

interface Leilao {
    id_leilao: string;
    titulo: string;
    descricao: string;
    categoria: string;
    data_final: string;
    id_usuario: string;
    lances: Lance[];
}

export const LeilaoDetalhesScreen = () => {
    const { id } = useParams();
    const token = useGetToken();
    const [leilao, setLeilao] = useState<Leilao | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(true);

    const buscarLeilao = async () => {
        try {
            const response = await axios.get(`${URLAPI}/leiloes/${id}`);
            setLeilao(response.data);
        } catch (error) {
            console.error(error);
            setErro("Erro ao buscar leilão.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarLeilao();
    }, [id]);

    if (carregando) return <p className="text-center mt-10">Carregando...</p>;
    if (erro || !leilao) return <p className="text-center mt-10 text-red-500">{erro}</p>;

    const ehDono = token?.id === leilao.id_usuario;
    const tempoRestante = formatDistanceToNow(new Date(leilao.data_final), {
        locale: ptBR,
        addSuffix: true,
    });

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
            <div className="mb-4">
                <a href="/leiloes" className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 font-semibold transition mb-2">Ver todos os leilões</a>
            </div>
            <h1 className="text-2xl font-bold text-orange-700 mb-2">{leilao.titulo}</h1>
            <p className="text-gray-700 mb-4">{leilao.descricao}</p>
            <p className="text-sm text-gray-500 mb-4">Categoria: {leilao.categoria}</p>
            <p className="text-sm text-gray-600 mb-6">Termina {tempoRestante}</p>

            <h2 className="text-xl font-semibold mb-3">Lances</h2>
            {leilao.lances.length === 0 ? (
                <p className="text-gray-500">Nenhum lance ainda.</p>
            ) : (
                <ul className="list-disc pl-5 mb-6">
                    {leilao.lances.map((lance) => (
                        <li key={lance.id_lance}>
                            R$ {lance.valor.toFixed(2)} por usuário {lance.id_usuario}
                        </li>
                    ))}
                </ul>
            )}

            {!ehDono && (
                <div className="mt-6">
                    <FormularioLance idLeilao={leilao.id_leilao} />
                </div>
            )}

            {ehDono && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">Você é o criador deste leilão.</p>
                    <p className="text-green-600 text-sm mt-1">Aguarde os lances dos outros usuários.</p>
                </div>
            )}
        </div>
    );
};
