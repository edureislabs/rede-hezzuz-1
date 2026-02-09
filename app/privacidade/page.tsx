import Footer from "../../components/Footer";

export default function PrivacidadePage() {
  return (
    <>
      <div className="pt-28 pb-20 bg-black min-h-screen">
        <div className="max-w-3xl mx-auto px-4">
          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Política de Privacidade
            </h1>
            <p className="text-gray-400">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* CONTEÚDO */}
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Informações que Coletamos</h2>
              <ul className="text-gray-300 space-y-2 ml-4">
                <li>• Nickname (nome no jogo)</li>
                <li>• E-mail (para conta e comunicação)</li>
                <li>• UUID do Minecraft (identificador da conta)</li>
                <li>• Endereço IP (para segurança)</li>
                <li>• Histórico de jogos e ações no servidor</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Como Usamos suas Informações</h2>
              <ul className="text-gray-300 space-y-2 ml-4">
                <li>• Para criar e gerenciar sua conta</li>
                <li>• Para moderar e manter o servidor seguro</li>
                <li>• Para aplicar punições quando necessário</li>
                <li>• Para melhorar nossos serviços</li>
                <li>• Para comunicação importante</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Proteção de Dados</h2>
              <p className="text-gray-300">
                Sua senha é criptografada. Dados são armazenados com segurança. Não vendemos suas informações.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Cookies</h2>
              <p className="text-gray-300">
                Usamos cookies para melhorar sua experiência no site, como manter login.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Seus Direitos</h2>
              <ul className="text-gray-300 space-y-2 ml-4">
                <li>• Acessar seus dados</li>
                <li>• Corrigir informações incorretas</li>
                <li>• Solicitar exclusão de sua conta</li>
                <li>• Optar por não receber comunicações</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Alterações</h2>
              <p className="text-gray-300">
                Esta política pode ser atualizada. Alterações serão publicadas aqui.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Contato</h2>
              <p className="text-gray-300">
                Para questões sobre privacidade: discord.hezzuz.com
              </p>
            </section>
          </div>

          {/* BOTÕES */}
          <div className="mt-10 border-t border-gray-800 pt-8 text-center">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/"
                className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded"
              >
                Voltar ao Início
              </a>
              <a
                href="/termos-de-uso"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
              >
                Ver Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}