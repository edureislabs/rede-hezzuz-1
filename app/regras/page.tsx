import Footer from "../../components/Footer";
export default function RegrasPage() {
  return (
    <div className="pt-28  bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            📜 Regras Oficiais
          </h1>
          <p className="text-gray-400">
            Leia todas as regras para evitar punições
          </p>
        </div>

        {/* AVISO IMPORTANTE */}
        <div className="mb-8 bg-red-900/20 border border-red-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-3">⚠️ Aviso Importante</h2>
          <p className="text-gray-300">
            Estas regras podem ser atualizadas a qualquer momento. O não cumprimento resulta em punições.
          </p>
        </div>

        {/* REGRAS EM LISTA */}
        <div className="space-y-8">
          {/* COMPORTAMENTO IN-GAME */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-red-500">⚡</span>
              Comportamento In-Game
            </h2>
            <ul className="space-y-4">
              <li className="text-gray-300">
                <strong className="text-white">Comentários Ofensivos:</strong> Proibidos comentários sobre raça, gênero, religião, etc.
              </li>
              <li className="text-gray-300">
                <strong className="text-white">Linguagem Imprópria:</strong> Linguagem excessivamente ofensiva não é permitida.
              </li>
              <li className="text-gray-300">
                <strong className="text-white">Provocações e Insultos:</strong> Não provoque ou insulte outros jogadores.
              </li>
              <li className="text-gray-300">
                <strong className="text-white">Incentivo ao Ódio:</strong> Qualquer incentivo à violência ou ódio será punido.
              </li>
              <li className="text-gray-300">
                <strong className="text-white">Privacidade:</strong> Não divulgue informações pessoais de outros jogadores.
              </li>
              <li className="text-gray-300">
                <strong className="text-white">Spam e Flood:</strong> Evite enviar mensagens repetidas no chat.
              </li>
            </ul>
          </section>

          {/* PROIBIÇÕES GERAIS */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-red-600">🚫</span>
              Proibições Gerais
            </h2>
            <ul className="space-y-4">
              <li className="text-gray-300">
                <strong className="text-white">Exploração de Bugs:</strong> Não use bugs para obter vantagens. Reporte-os à staff.
              </li>
              <li className="text-gray-300">
                <strong className="text-white">Conteúdo Inadequado:</strong> Proibido conteúdo ofensivo em construções, skins, nicks, etc.
              </li>
              <li className="text-gray-300">
                <strong className="text-white">Compartilhamento de Conta:</strong> Você é responsável por sua conta do Minecraft.
              </li>
            </ul>
          </section>

          {/* REGRAS ESPECÍFICAS */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">🎯 Regras Específicas</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-orange-400 mb-3 flex items-center gap-2">
                  <span>⚔️</span> Anti-Jogo
                </h3>
                <p className="text-gray-300">
                  Ações que atrapalham outros jogadores são proibidas (ex: preços altos no /shop para sabotar).
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <span>👑</span> Desrespeito à Staff
                </h3>
                <p className="text-gray-300">
                  Não desrespeite a staff. Em caso de discordância, use o suporte oficial.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <span>💬</span> Chat Fake
                </h3>
                <p className="text-gray-300">
                  Passar informações falsas no chat é proibido e resulta em punição.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-indigo-400 mb-3 flex items-center gap-2">
                  <span>💻</span> Regras do Discord
                </h3>
                <ul className="text-gray-300 space-y-1 ml-4">
                  <li>• Não divulgue outros servidores</li>
                  <li>• Respeite todos os membros</li>
                  <li>• Sem conteúdo ofensivo</li>
                  <li>• Preserve a privacidade</li>
                  <li>• Evite marcar sem necessidade</li>
                </ul>
              </div>
            </div>
          </section>

          {/* INFORMAÇÕES IMPORTANTES */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">ℹ️ Informações Importantes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <span>🐛</span> Denúncia de Bugs
                </h3>
                <ul className="text-gray-300 space-y-1 ml-4">
                  <li>• Seu nick no jogo</li>
                  <li>• Versão do Minecraft</li>
                  <li>• Horário do ocorrido</li>
                  <li>• Passos para reproduzir</li>
                  <li>• Evidências (imagens/vídeos)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                  <span>⚠️</span> Mods Proibidos
                </h3>
                <ul className="text-gray-300 space-y-1 ml-4">
                  <li>• Mods com vantagens</li>
                  <li>• Minimapas com entidades</li>
                  <li>• Auto-clickers e macros</li>
                  <li>• Mods de voo/velocidade</li>
                  <li>• Radares e X-ray</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* DISCLAIMER FINAL */}
        <div className="mt-12 border border-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400 mb-6">
            Todas as regras são válidas para todos os jogadores. A staff pode modificar regras conforme necessário.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://discord.hezzuz.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Discord Oficial
            </a>
            <a
              href="/"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Voltar para Início
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
  