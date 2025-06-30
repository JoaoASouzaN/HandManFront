import React from 'react';

interface ConflitoModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflitos: Array<{
    id: string;
    data: Date;
    horario: Date;
    tipo: 'servico' | 'leilao';
    titulo?: string;
  }>;
}

export const ConflitoModal: React.FC<ConflitoModalProps> = ({ isOpen, onClose, conflitos }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              Conflito de Horário
            </h3>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-4">
            Você já tem compromissos agendados neste horário:
          </p>
          
          <div className="space-y-3">
            {conflitos.map((conflito, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      {conflito.tipo === 'servico' ? 'Serviço' : 'Leilão'}
                    </p>
                    {conflito.titulo && (
                      <p className="text-sm text-red-600 mt-1">
                        {conflito.titulo}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-red-800">
                      {conflito.data.toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-red-600">
                      {conflito.horario.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            onClick={onClose}
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}; 