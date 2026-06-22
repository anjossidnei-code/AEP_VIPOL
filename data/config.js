/**
 * config.js — Configuração de usuários e empresas
 * ⚠️  ARQUIVO PRIVADO — não compartilhe publicamente
 * 
 * Para adicionar usuários: copie um bloco e edite
 * Para adicionar empresas: copie um bloco e edite
 * Após editar, faça git commit + push → Vercel faz deploy automático
 */

const CONFIG = {

  // ══════════════════════════════════════════
  // USUÁRIOS
  // ══════════════════════════════════════════
  // Cada usuário tem: login, senha (hash SHA-256), nome e empresaId
  // Para gerar hash SHA-256 da senha: https://emn178.github.io/online-tools/sha256.html
  // Ou use a tela de admin para gerar automaticamente
  usuarios: [
    {
      id: 'admin',
      login: 'admin',
      // Senha padrão: "admin123" — TROQUE IMEDIATAMENTE
      senhaHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
      nome: 'Administrador',
      perfil: 'admin',    // 'admin' ou 'usuario'
      empresaId: null,    // admin vê todas
      ativo: true,
    },
    // Exemplo de usuário comum:
    // {
    //   id: 'user001',
    //   login: 'sidnei',
    //   senhaHash: 'HASH_SHA256_DA_SENHA',
    //   nome: 'Sidnei Martins',
    //   perfil: 'usuario',
    //   empresaId: 'city001',   // só vê esta empresa
    //   ativo: true,
    // },
  ],

  // ══════════════════════════════════════════
  // EMPRESAS
  // ══════════════════════════════════════════
  empresas: [
    // Exemplo — preenchido pelo admin via interface
    // {
    //   id: 'city001',
    //   nome: 'CITY TRANSPORTE URBANO INTERMODAL LTDA.',
    //   cnpj: '27.116.724/0001-51',
    //   logo: 'data:image/png;base64,...',  // base64 do logo
    //   responsaveis: [
    //     {
    //       nome: 'Edgard Antonio Giannini',
    //       cargo: 'Engenheiro de Segurança do Trabalho',
    //       registro: 'CREA 0600882910',
    //       funcao: 'Responsável pela Elaboração Técnica',
    //       assinatura: 'data:image/png;base64,...',
    //     },
    //     {
    //       nome: 'Sidnei Martins dos Anjos',
    //       cargo: 'Eng. Seg. Trabalho / Ergonomista',
    //       registro: 'CREA 5070695189',
    //       funcao: 'Participação Técnica na Implantação',
    //       assinatura: '',
    //     },
    //   ],
    // },
  ],
};

// Export para uso no sistema
if (typeof module !== 'undefined') module.exports = CONFIG;
