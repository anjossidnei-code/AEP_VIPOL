/**
 * config.js — Gerado automaticamente pelo Painel Admin
 * Data: 22/06/2026, 10:41:16
 * NÃO EDITE MANUALMENTE — use o painel admin
 */
const CONFIG = {
  "usuarios": [
    {
      "id": "admin",
      "login": "admin",
      "senhaHash": "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
      "nome": "Administrador",
      "perfil": "admin",
      "empresaId": null,
      "ativo": true
    },
    {
      "id": "tst",
      "login": "tst",
      "nome": "tst",
      "senhaHash": "cf21333039cc741694eb55abef6b20e6ed85e63bdc7679ef62277bf9b20c2f87",
      "perfil": "usuario",
      "empresaId": "city",
      "ativo": true,
      "permissoes": [
        "importar_planilha",
        "gerar_laudo",
        "gerar_pdf",
        "ver_sumario",
        "ver_identificacao",
        "ver_introducao",
        "ver_base_legal",
        "ver_metodologia",
        "ver_matrizes",
        "ver_inventario",
        "ver_matriz_risco",
        "ver_plano",
        "ver_afastamentos",
        "ver_conclusao",
        "filtros_avancados",
        "editar_assinaturas"
      ]
    },
    {
      "id": "sesmt",
      "login": "sesmt",
      "nome": "sesmt",
      "senhaHash": "acd36aa231c2e513dc0e2d95d112583b41ee34ebbf0ed1ab7d8cefb030175e9d",
      "perfil": "usuario",
      "empresaId": "city",
      "ativo": true,
      "permissoes": [
        "importar_planilha",
        "gerar_laudo",
        "gerar_pdf",
        "ver_sumario",
        "ver_identificacao",
        "ver_introducao",
        "ver_base_legal",
        "ver_metodologia",
        "ver_matrizes",
        "ver_inventario",
        "ver_matriz_risco",
        "ver_plano",
        "ver_afastamentos",
        "ver_vibracoes",
        "ver_conclusao",
        "filtros_avancados",
        "editar_assinaturas"
      ]
    },
    {
      "id": "tstvmp",
      "login": "tstvmp",
      "nome": "tstvmp",
      "senhaHash": "cf21333039cc741694eb55abef6b20e6ed85e63bdc7679ef62277bf9b20c2f87",
      "perfil": "usuario",
      "empresaId": "vmp",
      "ativo": true,
      "permissoes": [
        "gerar_laudo",
        "gerar_pdf",
        "ver_sumario",
        "ver_identificacao",
        "ver_introducao",
        "ver_base_legal",
        "ver_metodologia",
        "ver_matrizes",
        "ver_inventario",
        "ver_matriz_risco",
        "ver_plano",
        "ver_afastamentos",
        "ver_vibracoes",
        "ver_conclusao",
        "filtros_avancados"
      ]
    },
    {
      "id": "sesmtvmp",
      "login": "sesmtvmp",
      "nome": "sesmtvmp",
      "senhaHash": "acd36aa231c2e513dc0e2d95d112583b41ee34ebbf0ed1ab7d8cefb030175e9d",
      "perfil": "usuario",
      "empresaId": "vmp",
      "ativo": true,
      "permissoes": [
        "importar_planilha",
        "gerar_laudo",
        "gerar_pdf",
        "ver_sumario",
        "ver_identificacao",
        "ver_introducao",
        "ver_base_legal",
        "ver_metodologia",
        "ver_matrizes",
        "ver_inventario",
        "ver_matriz_risco",
        "ver_plano",
        "ver_afastamentos",
        "ver_vibracoes",
        "ver_conclusao",
        "filtros_avancados",
        "editar_assinaturas"
      ]
    }
  ],
  "empresas": [
    {
      "id": "city",
      "nome": "CITY TRANSPORTE URBANO INTERMODAL LTDA.",
      "cnpj": "27.116.724/0001-51",
      "logo": "data:image/jpeg;base64,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",
      "responsaveis": []
    },
    {
      "id": "vmp",
      "nome": "VIAÇÃO METRÓPOLE PAULISTA S/A",
      "cnpj": "31.974.104/0001-20",
      "logo": "data:image/jpeg;base64,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",
      "responsaveis": []
    }
  ]
};

if (typeof module !== 'undefined') module.exports = CONFIG;
