import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URLAPI } from '../../constants/ApiUrl';
import { useGetToken } from '../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

interface Servico {
    id_servico: string;
    id_usuario: string;
    id_fornecedor: string;
    categoria: string;
    data: string;
    horario: string;
    status: string;
    valor?: number;
    descricao?: string;
    id_pagamento?: string;
    id_avaliacao?: string;
}

const MeusServicos: React.FC = () => {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState<string>('todos');
    const token = useGetToken();
    const navigate = useNavigate();

    console.log('[DEBUG MeusServicos] Token:', token);

    useEffect(() => {
        console.log('[DEBUG MeusServicos useEffect] Token:', token);
        
        // Se token é undefined, ainda está carregando
        if (token === undefined) {
            return;
        }
        
        // Se token é null, não está logado
        if (token === null) {
            setLoading(false);
            navigate('/login');
            return;
        }
        
        // Se token tem id, está logado
        if (token?.id) {
            buscarServicos();
        }
    }, [token, navigate]);

    const buscarServicos = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URLAPI}/usuarios/historico/${token?.id}`);
            setServicos(response.data);
        } catch (error: any) {
            console.error('Erro ao buscar serviços:', error);
            // Em caso de erro, para o loading e mostra mensagem
            setServicos([]);
        } finally {
            setLoading(false);
        }
    };

    const servicosFiltrados = servicos.filter(servico => {
        if (filtroStatus === 'todos') return true;
        return servico.status === filtroStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'agendado': return 'bg-blue-100 text-blue-800';
            case 'confirmar valor': return 'bg-yellow-100 text-yellow-800';
            case 'confirmado': return 'bg-green-100 text-green-800';
            case 'concluído': return 'bg-purple-100 text-purple-800';
            case 'cancelado': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'agendado': return 'Agendado';
            case 'confirmar valor': return 'Aguardando Confirmação';
            case 'confirmado': return 'Confirmado';
            case 'concluído': return 'Concluído';
            case 'cancelado': return 'Cancelado';
            default: return status;
        }
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const formatarHorario = (horario: string) => {
        return horario;
    };

    const formatarValor = (valor?: number) => {
        if (!valor) return 'A definir';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const handleVerDetalhes = (servico: Servico) => {
        // Navegar para tela de detalhes do serviço
        navigate(`/servico/${servico.id_servico}`);
    };

    const handleCancelarServico = async (idServico: string) => {
        if (window.confirm('Tem certeza que deseja cancelar este serviço?')) {
            try {
                await axios.put(`${URLAPI}/servicos`, {
                    id_servico: idServico,
                    status: 'cancelado'
                });
                buscarServicos(); // Recarregar lista
            } catch (error) {
                console.error('Erro ao cancelar serviço:', error);
                alert('Erro ao cancelar serviço');
            }
        }
    };

    if (loading || token === undefined) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AC5906] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando seus serviços...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Meus Serviços Contratados
                        </h1>
                        <p className="text-gray-600">
                            Gerencie todos os serviços que você contratou
                        </p>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFiltroStatus('todos')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filtroStatus === 'todos'
                                        ? 'bg-[#AC5906] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Todos ({servicos.length})
                            </button>
                            <button
                                onClick={() => setFiltroStatus('agendado')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filtroStatus === 'agendado'
                                        ? 'bg-[#AC5906] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Agendados ({servicos.filter(s => s.status === 'agendado').length})
                            </button>
                            <button
                                onClick={() => setFiltroStatus('confirmar valor')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filtroStatus === 'confirmar valor'
                                        ? 'bg-[#AC5906] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Aguardando Confirmação ({servicos.filter(s => s.status === 'confirmar valor').length})
                            </button>
                            <button
                                onClick={() => setFiltroStatus('concluído')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filtroStatus === 'concluído'
                                        ? 'bg-[#AC5906] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Concluídos ({servicos.filter(s => s.status === 'concluído').length})
                            </button>
                        </div>
                    </div>

                    {/* Lista de Serviços */}
                    {servicosFiltrados.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Nenhum serviço encontrado
                            </h3>
                            <p className="text-gray-600">
                                {filtroStatus === 'todos' 
                                    ? 'Você ainda não contratou nenhum serviço.'
                                    : `Nenhum serviço com status "${getStatusText(filtroStatus)}" encontrado.`
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {servicosFiltrados.map((servico) => (
                                <div key={servico.id_servico} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6">
                                        {/* Header do Card */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {servico.categoria}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {servico.descricao || 'Sem descrição'}
                                                </p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(servico.status)}`}>
                                                    {getStatusText(servico.status)}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-[#AC5906]">
                                                    {formatarValor(servico.valor)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detalhes do Serviço */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Data</p>
                                                <p className="text-sm text-gray-900">{formatarData(servico.data)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Horário</p>
                                                <p className="text-sm text-gray-900">{formatarHorario(servico.horario)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Fornecedor</p>
                                                <p className="text-sm text-gray-900">ID: {servico.id_fornecedor}</p>
                                            </div>
                                        </div>

                                        {/* Botões de Ação */}
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleVerDetalhes(servico)}
                                                className="px-4 py-2 bg-[#AC5906] text-white rounded-lg text-sm font-medium hover:bg-[#8B4A05] transition-colors"
                                            >
                                                Ver Detalhes
                                            </button>
                                            
                                            {servico.status === 'agendado' && (
                                                <button
                                                    onClick={() => handleCancelarServico(servico.id_servico)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            )}
                                            
                                            {servico.status === 'concluído' && !servico.id_avaliacao && (
                                                <button
                                                    onClick={() => navigate(`/avaliar/${servico.id_servico}`)}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                                                >
                                                    Avaliar
                                                </button>
                                            )}
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

export default MeusServicos; 