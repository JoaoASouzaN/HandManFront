import { useState } from 'react';
import axios from 'axios';
import { URLAPI } from '../../constants/ApiUrl';

interface Props {
  leilaoId: string;
}

export const FormularioLance = ({ leilaoId }: Props) => {
  const [valor, setValor] = useState('');
  const [mensagem, setMensagem] = useState('');

  const enviarLance = async () => {
    try {
      await axios.post(`${URLAPI}/leiloes/${leilaoId}/lance`, { valor });
      setMensagem('Lance enviado com sucesso!');
      setValor('');
    } catch (error) {
      setMensagem('Erro ao enviar lance.');
    }
  };

  return (
    <div className="mt-6">
      <label className="block mb-2 font-semibold">Valor do lance:</label>
      <input
        type="number"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button onClick={enviarLance} className="mt-3 bg-green-600 text-white px-4 py-2 rounded">
        Enviar Lance
      </button>
      {mensagem && <p className="mt-2 text-sm text-gray-700">{mensagem}</p>}
    </div>
  );
};
