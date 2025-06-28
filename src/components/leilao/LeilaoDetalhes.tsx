import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URLAPI } from "../../constants/ApiUrl";
import { FormularioLance } from "./FormularioLance";
import { useGetToken } from "../../hooks/useGetToken";

interface Leilao {
  id_leilao: string;
  titulo: string;
  descricao: string;
  data_limite: string;
  categoria: string;
  imagem?: string;
}

export const LeilaoDetalhes = () => {
  const { idLeilao } = useParams();
  const [leilao, setLeilao] = useState<Leilao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const token = useGetToken();

  const buscarLeilao = async () => {
    try {
      const response = await axios.get(`${URLAPI}/leilao/${idLeilao}`);
      setLeilao(response.data);
    } catch (error) {
      console.error('Erro ao buscar leilão:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (idLeilao) buscarLeilao();
  }, [idLeilao]);

  if (carregando) return <p>Carregando detalhes do leilão...</p>;

  if (!leilao) return <p>Leilão não encontrado.</p>;

  const dataLimite = new Date(leilao.data_limite).toLocaleString();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-orange-800">{leilao.titulo}</h1>

      {leilao.imagem && (
        <img
          src={leilao.imagem}
          alt={leilao.titulo}
          className="w-full max-h-[400px] object-cover rounded mb-6"
        />
      )}

      <p className="text-gray-600 mb-4"><strong>Categoria:</strong> {leilao.categoria}</p>
      <p className="text-gray-600 mb-4"><strong>Descrição:</strong> {leilao.descricao}</p>
      <p className="text-gray-600 mb-4"><strong>Data limite:</strong> {dataLimite}</p>

      {token?.role === 'prestador' && (
        <FormularioLance idLeilao={leilao.id_leilao} />
      )}
    </div>
  );
};