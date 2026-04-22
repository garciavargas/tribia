import SimpleHeader from '@/components/SimpleHeader';
import SimpleFooter from '@/components/SimpleFooter';
import SimpleButton from '@/components/SimpleButton';

export default function CleanHome() {
  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      
      <main className="flex-1 bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">🏆 Tribia Futbolera</h1>
          <p className="text-gray-600 mb-8">Demuestra tu conocimiento del fútbol</p>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-2xl mx-auto">
            {/* Conectar Wallet - Solo UI */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-4">🔗 Conectar Wallet</h3>
              <SimpleButton color="blue">Conectar</SimpleButton>
            </div>
            
            {/* Verificar - Solo UI */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-4">🔐 Verificar</h3>
              <SimpleButton color="purple">Verificar</SimpleButton>
            </div>
            
            {/* Recompensa - Solo UI */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-4">🎁 Recompensa</h3>
              <SimpleButton color="green">Reclamar</SimpleButton>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            Versión esqueleto - Solo UI estática
          </div>
        </div>
      </main>
      
      <SimpleFooter />
    </div>
  );
}
