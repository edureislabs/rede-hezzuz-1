import Footer from "../../components/Footer";

export default function TermosDeUsoPage() {
  return (
    <>
      <div className="pt-28 pb-20 bg-black min-h-screen">
        <div className="max-w-3xl mx-auto px-4">
          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Termos de Uso
            </h1>
            <p className="text-gray-400">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* CONTEÚDO */}
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Aceitação dos Termos</h2>
              <p className="text-gray-300">
                Ao acessar a rede Hezzuz, você concorda com estes termos. Se não concordar, não use nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Conta do Jogador</h2>
              <p className="text-gray-300">
                Você é responsável por sua conta. Não compartilhe sua senha. Nicks ofensivos não são permitidos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Regras de Conduta</h2>
              <ul className="text-gray-300 space-y-2 ml-4">
                <li>• Respeite todos os jogadores</li>
                <li>• Não use cheats, hacks ou mods que dêem vantagem</li>
                <li>• Não faça spam no chat</li>
                <li>• Não divulgue informações pessoais de outros</li>
                <li>• Não explore bugs do servidor</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Punições</h2>
              <p className="text-gray-300">
                Violar os termos pode resultar em:
              </p>
              <ul className="text-gray-300 space-y-1 ml-4 mt-2">
                <li>• Aviso</li>
                <li>• Mute temporário</li>
                <li>• Banimento temporário</li>
                <li>• Banimento permanente</li>
                <li>• Banimento por IP</li>                
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Alterações</h2>
              <p className="text-gray-300">
                Podemos alterar estes termos a qualquer momento. Consulte esta página regularmente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Contato</h2>
              <p className="text-gray-300">
                Dúvidas? Entre em contato pelo nosso Discord.
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
                href="/regras"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
              >
                Ver Regras
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}