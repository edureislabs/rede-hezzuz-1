"use client";

import { FaShieldAlt, FaUsers, FaGamepad, FaStar } from "react-icons/fa";

const features = [
  {
    icon: <FaShieldAlt className="text-3xl" />,
    title: "Anti-Cheat Avançado",
    description: "Proteção máxima contra trapaças",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <FaUsers className="text-3xl" />,
    title: "Comunidade Ativa",
    description: "Centenas de jogadores online",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <FaGamepad className="text-3xl" />,
    title: "Gameplays Únicas",
    description: "Modos exclusivos e divertidos",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <FaStar className="text-3xl" />,
    title: "Eventos Semanais",
    description: "Prêmios e competições",
    color: "from-yellow-500 to-orange-500",
  },
];

export default function ServerFeatures() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        Por que jogar na <span className="text-orange-400">Rede Hezzuz</span>?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, index) => (
          <div
            key={index}
            className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feat.color} mb-4`}>
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
            <p className="text-gray-400">{feat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}