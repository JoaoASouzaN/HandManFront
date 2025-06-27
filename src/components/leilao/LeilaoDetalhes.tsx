import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { URLAPI } from '../../constants/ApiUrl';
import { FormularioLance } from './FormularioLance';

export const LeilaoDetalhes = () => {
  const { id } = useParams();
  const [leilao, setLeilao] = useState<any>(null);

  useEffect(() => {
    axios.get(`${URLAPI}/leiloes/${id}`).then((res) => setLeilao(res.data));
  }, [id]);

  if (!leilao) return <p>Carregando detalhes...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <img src={leilao.imagem} alt={leilao.titulo} className="w-full h-64 object-cover rounded mb-4" />
      <h1 className="text-2xl font-bold mb-2">{leilao.titulo}</h1>
      <p className="mb-4 text-gray-700">{leilao.descricao}</p>
      <FormularioLance leilaoId={leilao.id} />
    </div>
  );
};