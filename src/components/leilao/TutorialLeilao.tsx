import { useState, useEffect } from 'react';

export const TutorialLeilao = () => {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const ocultar = localStorage.getItem('ocultarTutorialLeilao');
    if (!ocultar) setMostrar(true);
  }, []);

  const handleFechar = () => {
    const checkbox = document.getElementById('naoMostrarMais') as HTMLInputElement;
    if (checkbox?.checked) {
      localStorage.setItem('ocultarTutorialLeilao', 'true');
    }
    setMostrar(false);
  };

  if (!mostrar) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded mb-4">
      <h2 className="font-bold">Como criar um leilão</h2>
      <p className="mb-2">1. Defina claramente o serviço desejado.<br />2. Estabeleça um tempo de duração.<br />3. Adicione imagens se necessário.</p>
      <label className="flex items-center gap-2">
        <input id="naoMostrarMais" type="checkbox" />
        Não mostrar novamente
      </label>
      <button className="ml-4 text-blue-500 underline" onClick={handleFechar}>Entendi</button>
    </div>
  );
};