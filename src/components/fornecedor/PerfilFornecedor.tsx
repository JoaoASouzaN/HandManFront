import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import imagemPefilDefault from '../../assets/perfil.png';
import { useNavigate } from "react-router-dom";
import { useGetToken } from "../../hooks/useGetToken";
import { toast } from "react-toastify";
import { ProfileImage } from "../ProfileImage";

interface FornecedorProps {
  id: string
  nome: string;
  media_avaliacoes: string;
  descricao: string;
  valor: string;
  imagemPerfil: string;
  local: string;
  imagensServicos?: string[];
  categoria_servico?: string[];
  sobre: string;
}

export const PerfilFornecedor = ({
  id,
  nome,
  media_avaliacoes,
  descricao,
  valor,
  imagemPerfil,
  local,
  imagensServicos,
  categoria_servico,
  sobre
}: FornecedorProps) => {
  const navigate = useNavigate();
  const token = useGetToken();

  const formatarAvaliacao = (avaliacao: string) => {
    if (!avaliacao) return "0.0";
    const num = parseFloat(avaliacao);
    return isNaN(num) ? "0.0" : num.toFixed(1);
  };

  const handleAgendar = () => {
    if (!token?.id) {
      toast.error("Você precisa estar logado para agendar um serviço");
      navigate("/login");
      return;
    }
    navigate(`/pagamento/${id}`);
  };

  const images = (imagensServicos || []).map((img) => ({
    original: img,
    thumbnail: img,
  }));

  const categorias = (categoria_servico || []).map((categoria, index) => (
    <span
      key={index}
      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
    >
      {categoria}
    </span>
  ));

  return (
    <div className="flex flex-col items-center p-6">
      <div className="flex flex-col md:flex-row justify-around w-full  bg-white rounded-lg  p-6 gap-6">
        {/* Perfil do profissional */}
        <div className="flex items-center gap-4">
          <img
            src={imagemPerfil || imagemPefilDefault}
            alt="Imagem do Fornecedor"
            className="w-48 h-48 object-cover rounded-full border-2 border-[#A75C00]"
          />
          <div>
            <h2 className="text-3xl font-semibold text-[#AD5700]">{nome || 'Nome não disponível'}</h2>
            <p className="text-lg text-gray-700 flex items-center">
              <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {formatarAvaliacao(media_avaliacoes)}
            </p>
            <p className="text-gray-600">{local || 'Local não informado'}</p>
            <div className="mt-2">
              <h3 className="font-semibold text-orange-700">Especialidades:</h3>
              <p className="text-gray-700">
                {descricao || 'Descrição não disponível'}
              </p>
            </div>
          </div>
        </div>

        {/* Card lateral com valor */}
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-700">R$ {valor || '0'}</p>
            <p className="text-gray-600 mb-4">por hora</p>
            <button
              onClick={handleAgendar}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Agendar Serviço
            </button>
          </div>
        </div>
      </div>

      {/* Categorias */}
      {(categoria_servico && categoria_servico.length > 0) && (
        <div className="mt-8 w-full max-w-5xl bg-orange-50 rounded-lg p-6 shadow-lg">
          <h3 className="text-orange-700 font-semibold mb-3">
            Este serviço é oferecido por um profissional.
          </h3>
          <div className="flex gap-4">
            {categorias}
          </div>
        </div>
      )}
      
      {/*imagem ilustrativa */}
      {images.length !== 0 && (
        <div className="mt-6 w-full max-w-4xl rounded-lg p-4">
          <h2 className="text-orange-700 font-semibold mb-5">Imagens do serviço:</h2>
          <ImageGallery
            items={images}
            showPlayButton={false}
            showFullscreenButton={false}
            showNav={false}
            showThumbnails={true}
            thumbnailPosition="bottom" // top, bottom, left, right
          />
        </div>
      )}

      {/* Sobre o profissional */}
      {sobre && (
        <div className="mt-6 w-full max-w-5xl rounded-lg p-4">
          <p className="text-orange-700 font-semibold mb-2">sobre-min:</p>
          <p>{sobre}</p>
        </div>
      )}

    </div>

  )
}