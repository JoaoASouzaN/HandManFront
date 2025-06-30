import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { URLAPI } from "../constants/ApiUrl";
import { useGetToken } from "../hooks/useGetToken";
import { FormularioLance } from "../components/leilao/FormularioLance";
import { formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Lance {
    id: string;
    valor: number;
    data: string;
    nomeUsuario: string;
}

interface Leilao {
    id: string;
    titulo: string;
    descricao: string;
    categoria: string;
    prazoLimite: string;
    valorDesejado: number;
    detalhes: string;
    id_usuario: string;
    lances: Lance[];
}

export const LeilaoDetalhesScreen = () => {
    const { id } = useParams();
    const token = useGetToken();
    const [leilao, setLeilao] = useState<Leilao | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(true);

    console.log('LeilaoDetalhesScreen renderizada com ID:', id);

    const buscarLeilao = async () => {
        try {
            console.log('Iniciando busca do leilão com ID:', id);
            const response = await axios.get(`${URLAPI}/leiloes/${id}`);
            console.log('Leilão encontrado:', response.data);
            setLeilao(response.data);
        } catch (error) {
            console.error('Erro ao buscar leilão:', error);
            setErro("Erro ao buscar leilão.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarLeilao();
    }, [id]);

    if (carregando) return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <p className="text-center mt-10">Carregando...</p>
            </div>
            <Footer />
        </>
    );
    
    if (erro || !leilao) return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <p className="text-center mt-10 text-red-500">{erro}</p>
            </div>
            <Footer />
        </>
    );

    const ehDono = token?.id === leilao.id_usuario;
    const tempoRestante = formatDistanceToNow(new Date(leilao.prazoLimite), {
        locale: ptBR,
        addSuffix: true,
    });

    // Calcular o valor atual (menor lance) ou valor desejado se não houver lances
    const valorAtual = leilao.lances.length > 0 
        ? Math.min(...leilao.lances.map(l => l.valor))
        : leilao.valorDesejado;

    // Ordenar lances do menor para o maior valor
    const lancesOrdenados = [...leilao.lances].sort((a, b) => a.valor - b.valor);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
                    <div className="mb-4">
                        <a href="/leiloes" className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 font-semibold transition mb-2">← Ver todos os leilões</a>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-orange-700 mb-2">{leilao.titulo}</h1>
                    <p className="text-gray-700 mb-4">{leilao.descricao}</p>
                    <p className="text-sm text-gray-500 mb-4">Categoria: {leilao.categoria}</p>
                    <p className="text-sm text-gray-600 mb-6">Termina {tempoRestante}</p>

                    {/* Informações do leilão */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Informações do Leilão</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Valor máximo:</span>
                                <span className="ml-2 font-medium text-red-600">
                                    R$ {leilao.valorDesejado.toFixed(2)}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Menor lance:</span>
                                <span className="ml-2 font-medium text-green-600">
                                    R$ {valorAtual.toFixed(2)}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Total de lances:</span>
                                <span className="ml-2 font-medium">{leilao.lances.length}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Status:</span>
                                <span className="ml-2 font-medium text-orange-600">
                                    {leilao.lances.length > 0 ? 'Em andamento' : 'Aguardando lances'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-3">Histórico de Lances</h2>
                    {leilao.lances.length === 0 ? (
                        <p className="text-gray-500 mb-6">Nenhum lance ainda. Seja o primeiro a dar um lance!</p>
                    ) : (
                        <div className="mb-6">
                            <div className="space-y-2">
                                {lancesOrdenados.map((lance, index) => (
                                    <div key={lance.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <span className="font-medium">Lance #{index + 1}</span>
                                            <span className="text-gray-500 ml-2">por usuário {lance.nomeUsuario}</span>
                                        </div>
                                        <span className="font-bold text-green-600">
                                            R$ {lance.valor.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Seção de lances */}
                    {ehDono ? (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 font-medium">Você é o criador deste leilão.</p>
                            <p className="text-green-600 text-sm mt-1">Aguarde os lances dos fornecedores.</p>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3">Participar do Leilão</h3>
                            <FormularioLance idLeilao={leilao.id} />
                        </div>
                    )}

                    {/* Informações adicionais */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Como funciona o leilão?</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• O usuário define um valor máximo (R$ {leilao.valorDesejado.toFixed(2)})</li>
                            <li>• Os fornecedores competem oferecendo valores MENORES</li>
                            <li>• Quem oferecer o menor valor ganha o serviço</li>
                            <li>• Apenas fornecedores podem dar lances</li>
                            <li>• O criador do leilão não pode participar</li>
                            <li>• O leilão termina na data especificada</li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};
