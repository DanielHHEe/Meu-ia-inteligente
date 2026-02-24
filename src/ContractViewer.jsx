// src/ContractViewer.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle, Copy, ArrowLeft, Loader2 } from 'lucide-react';

const ContractViewer = ({ contract, contractType, onBack, onDownload }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contract);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (format) => {
    setDownloading(true);
    await onDownload?.(format);
    setDownloading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header Card */}
        <div className="bg-white rounded-t-2xl shadow-lg border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                  {contractType?.name || 'Contrato'} • Documento Gerado
                </h2>
                <p className="text-xs sm:text-sm text-emerald-600 font-medium">
                  ✓ Gerado por IA • Pronto para assinatura
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={copyToClipboard}
                className="px-3 sm:px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-2 shadow-sm text-sm sm:text-base flex-1 sm:flex-initial justify-center"
              >
                <Copy className="w-4 h-4" />
                <span className="sm:inline">{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                disabled={downloading}
                className="px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex-1 sm:flex-initial justify-center"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Success message */}
          <div className="mt-4 p-3 sm:p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-emerald-800">
                  Contrato gerado com sucesso!
                </p>
                <p className="text-xs sm:text-sm text-emerald-600">
                  Revise o documento abaixo. Você pode copiar o texto ou fazer download em PDF.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Content Card */}
        <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden">
          <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto p-4 sm:p-8 bg-gray-50">
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-inner border border-gray-200">
              <div className="prose prose-sm sm:prose-base max-w-none">
                <div className="font-serif text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                  {contract}
                </div>
              </div>
            </div>
          </div>

          {/* Signature area */}
          <div className="p-4 sm:p-6 bg-white border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <p className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">CONTRATANTE:</p>
                <div className="border-b-2 border-gray-300 pb-8 sm:pb-12 mb-2"></div>
                <p className="text-xs sm:text-sm text-gray-500">Assinatura</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">CONTRATADO:</p>
                <div className="border-b-2 border-gray-300 pb-8 sm:pb-12 mb-2"></div>
                <p className="text-xs sm:text-sm text-gray-500">Assinatura</p>
              </div>
            </div>
            
            {/* Testemunhas */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <p className="font-semibold text-gray-700 mb-4 text-sm sm:text-base">TESTEMUNHAS:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="border-b border-gray-300 pb-6 mb-2"></div>
                  <p className="text-xs sm:text-sm text-gray-500">Nome: _________________________</p>
                  <p className="text-xs sm:text-sm text-gray-500">CPF: _________________________</p>
                </div>
                <div>
                  <div className="border-b border-gray-300 pb-6 mb-2"></div>
                  <p className="text-xs sm:text-sm text-gray-500">Nome: _________________________</p>
                  <p className="text-xs sm:text-sm text-gray-500">CPF: _________________________</p>
                </div>
              </div>
            </div>
            
            <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8">
              {new Date().toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Back button */}
        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-sm border border-gray-200 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Criar novo contrato</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ContractViewer;