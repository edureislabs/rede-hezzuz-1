"use client";

import { 
  FaDiscord, 
  FaYoutube, 
  FaTiktok, 
  FaInstagram, 
  FaHeart,
  FaCrown,
  FaShieldAlt
} from "react-icons/fa";

const socialLinks = [
  {
    name: "Discord",
    icon: <FaDiscord className="text-2xl" />,
    href: "https://discord.hezzuz.com/",
    color: "hover:bg-[#5865F2]",
    bgColor: "bg-[#5865F2]/20",
    borderColor: "border-[#5865F2]/30",
  },
  {
    name: "YouTube",
    icon: <FaYoutube className="text-2xl" />,
    href: "#",
    color: "hover:bg-[#FF0000]",
    bgColor: "bg-[#FF0000]/20",
    borderColor: "border-[#FF0000]/30",
  },
  {
    name: "TikTok",
    icon: <FaTiktok className="text-2xl" />,
    href: "#",
    color: "hover:bg-[#000000]",
    bgColor: "bg-[#000000]/20",
    borderColor: "border-[#000000]/30",
  },
  {
    name: "Instagram",
    icon: <FaInstagram className="text-2xl" />,
    href: "#",
    color: "hover:bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040]",
    bgColor: "bg-gradient-to-r from-[#833AB4]/20 via-[#FD1D1D]/20 to-[#F56040]/20",
    borderColor: "border-[#833AB4]/30",
  },
];

const quickLinks = [
  { name: "Início", href: "#" },
  { name: "Regras", href: "#" },
  { name: "Loja", href: "#" },
  { name: "Suporte", href: "https://discord.hezzuz.com/" },
  { name: "Status", href: "#" },
  { name: "Equipe", href: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-gray-900 to-black border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* LOGO E DESCRIÇÃO */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Rede Hezzuz</h2>
            </div>
            <p className="text-gray-400 mb-6">
              O servidor de Minecraft onde a diversão nunca acaba. 
              Gameplays únicas, comunidade ativa e uma experiência 
              incrível te esperam!
            </p>
            
            {/* IP DO SERVIDOR */}
            <div className="inline-flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm border border-orange-500/30 rounded-xl px-4 py-3">
              <FaShieldAlt className="text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">IP do Servidor</p>
                <code className="text-white font-mono font-bold">hezzuz.com</code>
              </div>
            </div>
          </div>

          {/* LINKS RÁPIDOS */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaCrown className="text-yellow-400" />
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* REDES SOCIAIS */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Redes Sociais</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.bgColor} ${social.borderColor} border rounded-xl p-3 transition-all duration-300 hover:scale-105 ${social.color} hover:text-white`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* DIVISOR */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* COPYRIGHT */}
          <div className="text-gray-500 text-sm text-center md:text-left">
            <p>
              © {currentYear} Rede Hezzuz. Todos os direitos reservados.
              <br />
              <span className="text-xs">
                Minecraft é uma marca registrada da Mojang Studios.
              </span>
            </p>
          </div>

          {/* MADE WITH LOVE */}
          <div className="flex items-center gap-2 text-gray-500">
            <span>Desenvolvido por</span>
            <span>DC: @eduzzplayer</span>
          </div>

          {/* LEGAL */}
          <div className="flex gap-6 text-sm">
            <a
              href="../../termos-de-uso"
              className="text-gray-400 hover:text-orange-400 transition-colors"
            >
              Termos de Uso
            </a>
            <a
              href="../../privacidade"
              className="text-gray-400 hover:text-orange-400 transition-colors"
            >
              Política de Privacidade
            </a>
          </div>
        </div>

    
      </div>
    </footer>
  );
}