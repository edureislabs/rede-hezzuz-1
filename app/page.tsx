"use client";

import ServerFeatures from "../components/ServerFeatures";

import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="pt-28">
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        {/* HERO SECTION */}
        <section className="text-center text-white px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 animate-pulse">
              Rede Hezzuz
            </h1>
            <p className="mt-6 text-gray-300 text-xl md:text-2xl max-w-3xl mx-auto">
              O servidor onde a jogabilidade vira lenda 🔥
            </p>
            
            {/* IP DO SERVIDOR */}
            <div className="mt-8 inline-block bg-gradient-to-r from-red-900/30 to-orange-900/30 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6">
              <p className="text-gray-300 mb-2">Conecte-se agora:</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="bg-black/50 border border-orange-500/30 rounded-xl px-6 py-3">
                  <code className="text-2xl md:text-3xl font-mono font-bold text-white">
                    hezzuz.com
                  </code>
                </div>
                
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÕES ADICIONAIS */}
        <ServerFeatures />
   
        
        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}