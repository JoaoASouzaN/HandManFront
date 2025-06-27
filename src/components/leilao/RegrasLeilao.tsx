export const RegrasLeilao = () => {
  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-800 p-4 rounded mb-4">
      <h2 className="font-bold mb-2">Regras para criação de leilão</h2>
      <ul className="list-disc list-inside">
        <li>Descreva claramente o serviço.</li>
        <li>Evite informações falsas ou incompletas.</li>
        <li>Respeite o tempo máximo de duração permitido.</li>
        <li>Leilões com linguagem ofensiva serão removidos.</li>
      </ul>
    </div>
  );
};