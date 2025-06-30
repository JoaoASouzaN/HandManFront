import axios from "axios";
import { useEffect, useState } from "react";
import { PerfilFornecedor } from "./PerfilFornecedor";
import { Loading } from "../Loading";
import { URLAPI } from "../../constants/ApiUrl";

interface PropsFornecedor {
    id: string | undefined;
}

interface Fornecedor {
    id_fornecedor: string;
    nome: string;
    media_avaliacoes: string;
    descricao: string;
    sub_descricao: string;
    valor: string;
    imagemPerfil: string;
    imagemIlustrativa: string;
    endereco?: enderecoFornecedor;
    imagemServicos?: string[];
    sobre?: string;
    categoria_servico?: string[];
}

interface enderecoFornecedor {
    cep: string;
    pais: string;
    cidade: string;
    estado: string;
    rua: string;
}


export const Pagina_principal = ({ id }:PropsFornecedor) => {

    const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);
    
    const pesquisarFornecedor = async () => {
        setLoading(true);
        setError(null);
        
        try{
            console.log('🔍 Buscando fornecedor:', id);
            const response = await axios.get(`${URLAPI}/fornecedor/${id}`);
            console.log('✅ Dados do fornecedor recebidos:', response.data);
            
            // Verificar se os dados estão completos
            const dados = response.data;
            if (!dados.nome || !dados.id_fornecedor) {
                console.log('❌ Dados incompletos:', dados);
                setError('Dados do fornecedor incompletos');
                return;
            }
            
            setFornecedor(dados);
            console.log('✅ Fornecedor carregado com sucesso');
            
        }catch (error: any) {
            console.error('❌ Erro detalhado ao buscar fornecedor:', error);
            
            if (error.response) {
                // Erro da API
                console.error('Status:', error.response.status);
                console.error('Dados:', error.response.data);
                
                if (error.response.status === 404) {
                    setError('Fornecedor não encontrado');
                } else if (error.response.status === 500) {
                    setError('Erro interno do servidor');
                } else {
                    setError(`Erro ${error.response.status}: ${error.response.data?.error || 'Erro desconhecido'}`);
                }
            } else if (error.request) {
                // Erro de rede
                console.error('Erro de rede:', error.request);
                setError('Erro de conexão. Verifique sua internet.');
            } else {
                // Outro erro
                console.error('Erro:', error.message);
                setError('Erro ao buscar fornecedor');
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        pesquisarFornecedor();
    },[]);



    return (
        <>
            {loading && <Loading/>}
            {error && <div className="flex justify-center items-center h-screen"><p className="text-red-500">{error}</p></div>}
            {fornecedor && (
                <PerfilFornecedor
                    id={fornecedor.id_fornecedor}
                    local={fornecedor.endereco?.cidade || 'Local não informado'}
                    nome={fornecedor.nome}
                    media_avaliacoes={fornecedor.media_avaliacoes}
                    descricao={fornecedor.descricao}
                    imagemPerfil={fornecedor.imagemPerfil ?? ""}
                    valor={fornecedor.valor}
                    imagensServicos={fornecedor.imagemServicos || []}
                    categoria_servico={fornecedor.categoria_servico || []}
                    sobre={fornecedor.sobre || ''}
                />
            )}
        </>
    )
}