import { useState } from "react";
import axios from "axios";
import { URLAPI } from "../../constants/ApiUrl";
import { useGetToken } from "../../hooks/useGetToken";
import { toast } from "react-toastify";

interface Props {
  idLeilao: string;
}

export const FormularioLance = ({ idLeilao }: Props) => {
  const [valor, setValor] = useState('');
  const token = useGetToken();

  const enviarLance = async () => {
    try {
      await axios.post(`${URLAPI}/leilao/${idLeilao}/lance`, {
        valor: Number(valor),
        id_usuario: token?.id,
      });

      toast.success('Lance enviado com sucesso!');
      setValor('');
    } catch (error) {
      console.error('Erro ao enviar lance:', error);
      toast.error('Erro ao enviar o lance.');
    }
  };

  return (
    <div className="mt-4 flex flex-col items-start gap-3">
      <input
        type="number"
        placeholder="Digite seu lance (R$)"
        className="border border-gray-300 p-2 rounded w-64"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      <button
        onClick={enviarLance}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Enviar Lance
      </button>
    </div>
  );
};