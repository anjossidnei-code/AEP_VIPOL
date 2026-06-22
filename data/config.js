/**
 * config.js — Gerado automaticamente pelo Painel Admin
 * Data: 22/06/2026, 09:17:50
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
    }
  ],
  "empresas": [
    {
      "id": "city",
      "nome": "CITY TRANSPORTE URBANO INTERMODAL LTDA.",
      "cnpj": "27.116.724/0001-51",
      "logo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABAAJIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9+i2BXmXx/wD2zfhP+ytFC3xI+JHgrwQ1yhkgh1nWILSe5UcZjjdg7/8AAQa8X/4LS/8ABRT/AIdmfsKa/wCO7Bbafxdqc0eheF7ecZifUJw5WRx3WKKOWUj+LyguRvyP5Oda1f4iftj/ABxuby4/4Sr4kfELxZctM/lQzalqepS4J+REDO2FHCouAq8AAcfqXAPhrLP6M8biqvsqEXa/VvrvpZdzixWMVJ8sVdn9lnwA/bR+En7VAmHw4+JXgnxvJbIJJ4NG1iC7uLZT3kiRi6f8CAr0u4uY7S3klmkSKKJS7u7YVAOpJ7Cv4jdPvPiT+xZ8dLG+SLxZ8M/iJ4UuEurcXNtNpupafJ1UtHIquAynlWGHUkEFTz/WH/wTf/bth/4KNf8ABMbS/iXKttb6/daPd6d4htofuW2pW6NHPhcnajkLMiknCTICTzVcdeGjyJUsThavtaFR8t9Lp9NtGnrZhhsX7W8ZKzPR9I/4KU/s6a9qttY2Px8+C97fXsq29vbweNtNkluJGIVURRMSzEkAADJJrovi7+2b8IP2fPE8Wi+Pfir8OPBOsz2y3kVhr/iWy025kgZmVZRHNIrFCyOobGCUYZ4Nfxp/snc/tSfDP/sa9L/9LIq/Rb/g8AYD/gqB4W/7Jvpx/wDKhqdfQ4vwhwmHzjDZZLEvlqwlLmstOW2m/W5nHHSlTc1HY/e3/h6D+zT/ANHCfBD/AMLrS/8A4/R/w9B/Zp/6OE+CH/hdaX/8fr+L7OTSZFfVPwBwCjzPGyt/hX+Zz/2pPblP7VNR/wCChXwD0fwtpmu3fxv+ENromtSTw6fqE3jHT0tb94CgmWKQzbZGjMke8KTt8xM43Cuk+DX7VPwx/aOm1CL4e/EbwL47k0kRtfJ4e1+11NrMSbghlEEjbA2xsbsZ2nHQ1/P1+zj+wav7av8AwbEa/q2kWQufGnwn8Z6v4o0kxxhppoI4rc31sCAT89vlwg5eSCEV80/8G+37cg/YZ/4KXeD7/Ubr7N4T8eH/AIRLXi7YjjhunTyZ2JOF8q4WFmbtH5o/ir4SHhfhcTgcbWwOIlOthpSjy2WttVaz6rbz0On65KMoqasmf1dfEr4o+Gfg54LvPEni/wARaH4W8Pads+16pq9/FY2dtvdY03zSsqLudlUZPJYAcmuB+H/7f/wI+KvjCx8PeF/jV8JvEmv6pIYrLTNL8XafeXl24UsVjijlLudqk4APAJ7V+Q3/AAeG/t0eTYeAv2fNEvDuuSPFviZY2/gXfFYwMR6sJ5WU9NkDdxXIf8GgP7BI8YfE7xf+0Nrtnus/Cit4a8LtIvBvZkDXk656GOB0iBHBF3KOq15NDgChDheXEWPrODfwQSXva2jr5v8ADU0eKbreyij+gNjhfSvgT9rT/g5D/Zq/ZG+LmqeCL/VvEPizXtEmNvqX/CO6et3bWcwyHhaZnRDImMMqk4PBIIIr1n/gs1+1NqP7G/8AwTT+KnjfRLlrTxBBpY07SZ1OGt7u7lS2jlU/3o/NMg90r+Ry009pVaSWVpZXYs8jtlnY9yT1JPJPfNdnht4f0c8p1MXjW/ZxfKktLu138tUedm2ZvDtQhuf0d/8AEW7+zVt/5AfxP/8ABRB/8fr6w/Ys/wCCn3hD9uP4PxeOvC3h7xZpnhu6uZrW1uNWt44Humiba7IiuxKbtw3Z6qR2NfyKy2cYjOMdOa/o5/4IWRCP/glL8JgvT7PfE49Tf3Ffin00MW/DLg7D5tw2rV6tdU25+8lHllJ2XfRHq8FXzPGypYlvlSv27H6ZeEPG9n41tpJLUtmI7XVhgr+FbPbmvMP2d+JdV/7Z/wDs1eoKea/PvBri/HcTcI4TOcxt7Wopc1lZe7Jxvb5Hs5rhYYbFSo09lb8h1FFFfqR5x+C3/B6J8S7mXXfgN4PjlK2kcOr6xcRhuJJCbWGFiPVQJgD/ALbV0f8AwZqfs4aN/wAK9+LfxauLOC41+TVIfCtjcuuZLK3jhS5nVD2ErzQbvXyF6V51/wAHn3hSSz+PPwO1shvJ1HQdTslPG0tBPA5Hr0uR+Yr6D/4M1fENrc/sPfFLSVkU3ll46N3KndUlsLVEP4mB/wAq/ofFznR8L6fsNFJ6286mv46fgeTGzxrv/Wh9U/8ABWD/AIIfeAv+CsXjXwFrXiTxBqnhK88Hi4tbu60i0ia81ayk2stuZZMqgjkVnUlHx5smAN+a9M/ZO/4J2/Db/gmp+yn4q8EfDK11e30q/S61W9k1LUZLye8umtliaVs4RCUijXEaovyjipP+ChX/AAU++GH/AATK0PwbqfxPm1m303xnqzaVBPp1oLo2eyJpXuJIwwcxLhVby1dsyL8pGa7DwF+1P8Ov2uP2eNc8TfDTxl4f8Z6G2nTq1zpl2s32ZzCxCSp9+J8clHUN7V+RLF53LL8PSrOf1Xm93+W/Nrr3v3+R6HLT5218R/HL+yd/ydJ8NP8Asa9K/wDSyKv7XNe+Hmg+KrhLjU9E0nUrhEEayXVpHM4UEnaCwJxknj3PrX8Uf7J3/J0nw0/7GvSv/SyKv7dkGUHPav1rx4qThXwMoOz5Jf8AtpwZZtI/mV/4O5PDWneFv+Cmvhi20zT7HTLc/DvT5DHawJCjMdQ1LLEKBzgAZ9AB2r9FP+DUX4d+H/FP/BK/7TqehaPqFx/wl+pp5tzZRSvgLBjkgnv+Ffnx/wAHgo/42h+F/wDsnGn/APpw1Ov0i/4NIxn/AIJP/wDc46p/6DBWnE2Iqrw7wVRSd2463d3uKik8XLTQ/SrSfCum6DpTWFhYWdlZtnMFvAscZJ6/KAB9eOa/kL/4LUfsIv8A8E8f+ChXjbwTaWrW3hXU5f7f8LkKRGdNuWdo4174hkEsHqTBnvX9gzV+On/B4v8As+aH4h/ZA+HvxNaLyvEvhbxOuhxTKP8Aj4s7yCWSSN+5xJaxMvpmT++a+M8IuIp4DPo4ebbhX91+v2X9+nzOnH0lKlfsfhJ8Wfi38Rf2/P2k4tZ1+4u/F3xE8a3Fho8Hloolv5ljis7aJVGBuOyNfdiSetf1+f8ABPH9j7S/2Dv2MvAPwr0vypD4W0xI7+5jUgX985Mt1OM84kneRgDyqlR2r+eH/g1N/Z70L45f8FUItT12P7Qfhx4ZvPE+nQsoZHvBNb2cbMD/AHBdu6/7aIe1f1EgV9D4351H63RyLDLlp0Um0trvZfJfmY5dT911Zbs/PH/g6GJH/BIjxeBxnWdIB9x9tjP+FfzHwW813GkNujSz3EixRRr1d2OFH5nFf04f8HRBz/wSJ8Xf9hrSP/S2Ov5pfh0f+K88NdP+QxZ8np/r0r6TwsxM8NwpiMRTWsXUa+UUz57OYqWNjF9bH6mfDv8A4NWbrUvBmnXfiz4uHTtYurSOW7sbHR/MSylYBmiEjSfPtzgnABIziv0u/Yj/AGXoP2Lv2XPCvwzttWm16HwxFNGt/LCIXn8yeSU5UE4wZMcHtXs2ows8jYVsVQY7SBX/AD6eK30iOOeP6Ty7ibF+1oRqOcYWSUWrpWt2TaP3zJchwWBftMNG0mtfwOk+G/j+PwLLeGSF5ftATG3AxjP+Neh+C/i3beL9V+yiGSGQjcu7GDXikmA1dX8GOPHNv/ut/Kvf8FfGbibLcyy3hnD1V9UlVjDlcVe1Sfva79WPOcow86dTFNe9a/3I9xooHFFf6pH5sfmB/wAHVH7EmoftQf8ABPeDxroFpJfa78Hb99bkjRd8kmlyJ5d7tH+xthmJ7Jbv1Jr8O/8Agkx/wVz8cf8ABJr4ra5rPhvStP8AFHh7xZbRW+taDezNbx3bQlmgmjlUMY5ULyAHaylZHBXO1l/r5vraK+tJILiOKWCZTHIkigq6kYIIPY5r8jP2y/8Ag0R+E/xv+IGoeIfhb431P4UHUpHuJdFbTl1XSonYkkW6eZFJAhP8G91UcIFAC1+1+HvHOVUMrqZDxDFug3dOzaV9WnbVa6prqedisNNz9pS3Px0/4Kx/8Fa/G/8AwVk+MGjeIPE+m2XhnQPC1rJaaHoNlO08Vj5rK00zyMAZJZCkYJCqAsUYC5BJ/cH/AINt/wBj3UP2YP8AgkVqviPW7KSy1z4sm88TeXJHsmisDbiGzB9Q8cbTqfS6H0rz39jP/g0J+GnwZ+IuneIvip4+v/inDpsq3EWhQ6SulabcSA5AuP3srzR9CUDIDjDblJU/rlrPhu31HwldaPCFtLa4s3soxGgAgRkKDavTAGOPatOPOOcorYGhkeQxtQhJOTs1s9lfV66t9xYXD1FN1au5/E9+ycP+MpPhp/2Nelf+lkVf26xjKr9K/Fb4V/8ABnbovwx+KHhvxGvx71W7Ph7VLbUhAfCkaef5MqybC32o43bcZwcZ6Gv2oRgoxnpx1rzPFjizLs8q4WWXSclTTTumt+Xv6GmBozppqZ/NH/weCnP/AAVE8L/9k50//wBOGp1+kP8AwaSHH/BJ/wD7nLVP/QYK1/8Agrn/AMG9Wl/8FV/2mNM+JF18U77wXLpvh6Dw/wDYIdCS+WTyri5mEpczxnJ+0bduP4Bzzx9Gf8Eo/wDgnPaf8EvP2WP+FZWviu48ZRf2vc6sdQmsFsjmYRjZ5Ykf7vl9d3OfannnFeXYngzDZNSk/bQaurPpfrt1FSozWIlUex9NHkZr8sP+Dvb/AJRbaN6/8J7pv/pLfV+p3mKeNwzXy5/wVn/4JsWv/BVH9mCz+G934uufBcVprtvrgv4LBb5nMMc8flmMunDednO7Py+9fA8KY6jgc3w+MxDtCE036JnVXi5U2kfit/wZz/8AKSbx5/2Ta8/9Oem1/SavWvzi/wCCQv8Awb6ad/wSh/aM1z4hWnxRv/Gs2teHZfD32GfQksFiElzbTmXeJ5CSPs23bgffPPAr9HGcex7da9zxJzzCZvnlTHYF3pyUVe1tlruZYSnKnT5Zbn55f8HRQ/41B+Mm6hNZ0ck+n+nRD+tfzHWsokgyGKtkMrDggjnj8cc1/X5/wVO/ZJm/bn/YC+JnwysvLXV/EOkltKaQ7UF9A63FsGPZTLEik9gxr+P3WPCWt+AvEOpaHrem3mlazo9y9nf2V3EYprWeNirxuh6MrA/lX634L4+jPK6uCerUndeUkvw0aPm8+oP2vtPQ/Rn4af8ABy98cvAXgzT9I1LRvBHiVtNtEtRe3VtPHc3OwAb5CkgUsQBkhQD6V+tX/BOr9p3V/wBsr9jLwT8SdesrHTdW8TxTyXFtZbvIjMdzLCNoYk/dQd6/l2eOfng9K/pB/wCCEcRvf+CUnwqMRSTy4b+NsHO1hqFxkH3Ff57/ALQHwS4I4T4Qw2dcOZbDDV6uJSlKCaupQm2t7WbSZ9v4f5vi8RjJUcTVcoqOl/kfa/w58AJ48e7DzvF9m242gHrn1+leheCvhJb+ENVN2LiWeRRtXIHy/lWJ+z7aSW76mXUqCIwD2J+avSiPmr80+jl4VcMYrhfL+JMThVLFXlJTd94zkou22lke9n+Z11iZ4eEvc0X4K5JRSDgUV/Xp8wfKn/BaP4B6j+0F/wAE5PiNpmgaPr2t+L9LsDqfhq20We4hvRqMYKxNEIHV5GAkf5DlTnlTivjTxX+zJ8U/2Yf+CrOpePPBngn4iXvwp8A2NppuhWmnS6nfSXwj8KXzR2iAzNHLZPeIkczOjyi6+y/vFBNfrt1pMEn/AAr6DK+IquCoSwygpRaktf73Le3muXT1fcynS5nc/Fr9kP4KftfeEvg18L9Fu/C3xD8P+Pfhp471bxBAmuX41Gy1i1m8OC6FrdXaMYjBd37XdvnlrZrmIE74yS+H9n34+aNbeGHg8G/GrV9Q1H9miTR9Ra7uruCLw3qSeH7xFhtGjuVWa8lvDBHLa3NsZRM8c8TgRnH7RFaGGRXpVeMqk5OXsIK6d9Hu23f73oifY+Z+NHxI/YA+PPwJ/YJ+Ffhy2n+LHj06hZ6/q8+k+GL+9srvwl4lvdMtRoIO+7NwLSzvEuZJXklZEnnMjIqAKva+Ef2NPjH4r/4K+6trvxH0rxdqXw78TWsXhTXdQ0u41C3tNSL+CbaO4V9kyQrpj3a3Q3xRiRL2OAeYNxA/WMCkxms1xhiOWalTi3KM43tb45c112a6PtbsHsF3fT8D8NNU/Yp+Ifw+/Y9/ZatL74d/FC6RvE/izU/iFp76ZrviKZGZmgsJLq0tL2C6OYYbcRbJ0RSA7K+X3fpF/wAFTfDPjK6+H3wm8UeD9I8U67B8OPiXo3ijX9M8PCSXUr3SoUuIp0igRla5IM8bGHksEJCsQBX1TjPWlArjxvEU8VVp1Z017jk+uvNJyt8r2XlbsVGlbby/A/Ez4K/sU/tFeDf2lf2bPEmv6L8RYtJ8KafoMniCe2u72fUdP+3eIvENy8DET/Z5ESG4sI79JFlaO3kyhTZk+YfAr9mv9q60/wCCbvjz4bWHwz+Nl54i+I3iXw9bzrdapNos0At4bu5v3jmvpn8j5rOzEl3uSG4N2kSRqUIP9ATDIpApr2Fx5XtLmoQbk4vbZxk5r8X9yRn9VXdn5H6b4P8A2oPGvxj0Px1ceGvHcWk+OvEHwoXxfotzDPbtpBtRZXd9qEClgVSG4juba7iC4ZJkdv8AVGvWP+COXwf+OHw/+P8A40vPiJY+PNMs38Px2vi6XxFfSz2niTxaNUvZH1HTFeR1FobF7ZN0QjQr5Kbd0LAfoyRSFc15eL4mnXoTw6oxipKKulr7qsvv6/LsaRpWd7iEZHt6V4B+0B/wS5/Z+/am8cv4n8e/Cnwp4g8QzIscuoy27RXE6r93e8bKXIHALZOAB0Ar6A20Fa8DC4zEYaXPh5uL7ptO3yHUo06itUVz5GP/AAQl/ZJx/wAkQ8J5/wB64/8AjteyfAX9i74afsx+Bv8AhGvAPhWz8L6Ebl7z7FayStH5r43MA7HGdo4HHFeqhMCjZk1y5/FZ5hvqWc3xFK9+Wp7yv3s76+YsPRhQlz0VyvuilpGhW+hwGO2iEYY5OB1q6p5NAXFAGDXNgcBh8HQjhcJBQpxVkkrJfI3lJyfNJ3Y6iiiuwk//2Q==",
      "responsaveis": []
    }
  ]
};

if (typeof module !== 'undefined') module.exports = CONFIG;
