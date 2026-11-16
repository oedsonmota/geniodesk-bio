/* Conteúdo padrão da bio. É o que aparece se o banco não responder,
   e o ponto de partida do painel. Texto entre *asteriscos* fica amarelo. */
window.BIO_DEFAULT = {
  mode: 'campanha',
  autoNormalAfterEnd: true,

  brand: {
    logo: 'bio-assets/logo-geniodesk.png',
    logoMStand: 'bio-assets/logo-m-stand.png',
    favicon: 'favicon.png'
  },

  hero: {
    videoWide: 'bio-assets/video-horizontal.mp4',
    videoTall: 'bio-assets/video-vertical.mp4',
    tallOnMobile: false,
    slides: [
      { img: 'bio-assets/foto-hero-1.webp', name: 'GenioDesk ART', href: 'https://geniodesk.com.br/products/mesa-com-regulagem-de-altura-geniodesk-art-1?utm_source=instagram&utm_medium=bio&utm_campaign=novembro_genial_hero' },
      { img: 'bio-assets/foto-hero-2.webp', name: 'GenioDesk PRO Smart', href: 'https://geniodesk.com.br/products/mesa-com-regulagem-de-altura-geniodesk-pro-smart-wi-fi?utm_source=instagram&utm_medium=bio&utm_campaign=novembro_genial_hero' },
      { img: 'bio-assets/foto-hero-3.webp', name: 'Mesas elétricas', href: 'https://geniodesk.com.br/collections/mesa-com-regulagem-de-altura?utm_source=instagram&utm_medium=bio&utm_campaign=novembro_genial_hero' }
    ]
  },

  campanha: {
    pageTitle: 'GenioDesk · Cupons Novembro Genial',
    pageDescription: 'Cupons GenioDesk liberados no site: R$ 300 OFF em mesas, R$ 200 OFF + frete grátis em cadeiras, R$ 100 OFF no M-Stand e 10% OFF em acessórios. Válidos de 12 a 30/11.',
    pill: 'Cupons ativos',
    headingType: 'arte',          /* arte = "Novembro Genial" desenhado | imagem | texto */
    headingImage: '',
    headingText: 'Novembro *Genial*',
    titleLine1: 'Cupons liberados',
    titleLine2: 'no site todo',
    subtitle: 'Válidos de 12 a 30/11 em todo o site.',
    endedSubtitle: 'Fique de olho nas próximas condições GenioDesk.',
    showTimer: true,
    start: '2026-11-12T00:00',
    end: '2026-12-01T00:00',
    buttonText: 'Ver cupons',
    cuponsTitle: 'Cupons ativos',
    cuponsHint: 'Toque para copiar o código.',
    cupons: [
      { categoria: 'Mesas', valor: 'R$ 300 OFF', descricao: 'Com regulagem de altura.', selo: '', codigo: 'MESA300', href: 'https://geniodesk.com.br/collections/mesa-com-regulagem-de-altura?utm_source=instagram&utm_medium=bio&utm_campaign=cupom_mesa300' },
      { categoria: 'Cadeiras', valor: 'R$ 200 OFF', descricao: '', selo: 'Frete grátis', codigo: 'CADEIRA200', href: 'https://geniodesk.com.br/collections/cadeiras-ergonomicas?utm_source=instagram&utm_medium=bio&utm_campaign=cupom_cadeira200' },
      { categoria: 'M-Stand', valor: 'R$ 100 OFF', descricao: 'O essencial em forma elevada.', selo: '', codigo: 'MSTAND100', href: 'https://geniodesk.com.br/collections/m-stand?utm_source=instagram&utm_medium=bio&utm_campaign=cupom_mstand100' },
      { categoria: 'Acessórios', valor: '10% OFF', descricao: 'Para completar o setup.', selo: '', codigo: 'ACESSORIOS10', href: 'https://geniodesk.com.br/collections/acessorios?utm_source=instagram&utm_medium=bio&utm_campaign=cupom_acessorios10' }
    ],
    trust: {
      show: true,
      img: 'bio-assets/selo-garantia-30-dias.webp',
      eyebrow: 'Garantia de satisfação',
      title: '30 dias para testar',
      text: 'Aproveite os 30 dias de teste e comprove a qualidade.',
      cta: 'Ver as mesas',
      href: 'https://geniodesk.com.br/collections/mesa-com-regulagem-de-altura/?utm_source=instagram&utm_medium=bio&utm_campaign=30_dias_para_testar_sua_nova_geniodesk'
    },
    seg: {
      show: true,
      icon: 'ticket',
      eyebrow: 'Novembro Genial',
      title: 'Todas as ofertas no site',
      text: 'Use os cupons acima no carrinho e garanta seu desconto.',
      cta: 'Ir para o site',
      href: 'https://geniodesk.com.br/?utm_source=instagram&utm_medium=bio&utm_campaign=novembro_genial_ofertas'
    }
  },

  normal: {
    pageTitle: 'GenioDesk · Mesas com regulagem de altura',
    pageDescription: 'Mesas com regulagem de altura, cadeiras ergonômicas, M-Stand e acessórios GenioDesk.',
    pill: 'Loja oficial',
    pillHref: 'https://geniodesk.com.br/?utm_source=instagram&utm_medium=bio&utm_campaign=bio_loja_oficial',
    headingType: 'texto',
    headingImage: '',
    headingText: 'Transforme o seu *espaço de trabalho.*',
    titleLine1: 'Mesas com regulagem',
    titleLine2: 'de altura',
    subtitle: 'Trabalhe em pé ou sentado, no seu ritmo.',
    buttonText: 'Ver as mesas',
    buttonHref: 'https://geniodesk.com.br/collections/mesa-com-regulagem-de-altura?utm_source=instagram&utm_medium=bio&utm_campaign=bio_hero_mesas',
    destaquesTitle: 'Comece por aqui',
    destaquesHint: 'Toque para ver no site.',
    destaques: [
      { categoria: 'Cadeiras', descricao: 'Ergonômicas.', href: 'https://geniodesk.com.br/collections/cadeiras-ergonomicas?utm_source=instagram&utm_medium=bio&utm_campaign=bio_destaque_cadeiras' },
      { categoria: 'M-Stand', descricao: 'O essencial em forma elevada.', href: 'https://geniodesk.com.br/collections/m-stand?utm_source=instagram&utm_medium=bio&utm_campaign=bio_destaque_mstand' },
      { categoria: 'Acessórios', descricao: 'Para completar o setup.', href: 'https://geniodesk.com.br/collections/acessorios?utm_source=instagram&utm_medium=bio&utm_campaign=bio_destaque_acessorios' }
    ],
    trust: {
      show: true,
      img: 'bio-assets/selo-garantia-30-dias.webp',
      eyebrow: 'Garantia de satisfação',
      title: '30 dias para testar',
      text: 'Aproveite os 30 dias de teste e comprove a qualidade.',
      cta: 'Ver as mesas',
      href: 'https://geniodesk.com.br/collections/mesa-com-regulagem-de-altura/?utm_source=instagram&utm_medium=bio&utm_campaign=30_dias_para_testar_sua_nova_geniodesk'
    },
    seg: {
      show: true,
      icon: 'store',
      eyebrow: 'Loja oficial',
      title: 'Todos os produtos no site',
      text: 'Mesas, cadeiras e acessórios para montar o seu setup.',
      cta: 'Ir para o site',
      href: 'https://geniodesk.com.br/?utm_source=instagram&utm_medium=bio&utm_campaign=bio_site'
    }
  },

  shop: {
    title: 'Escolha seu setup',
    feat: { img: 'bio-assets/geniodesk-pro.webp', alt: 'Homem trabalhando em pé na GenioDesk PRO', badge: 'Mais vendida', name: 'GenioDesk PRO', href: 'https://geniodesk.com.br/products/mesa-com-regulagem-de-altura-geniodesk-pro-1?utm_source=instagram&utm_medium=bio&utm_campaign=geniodeskpro_mais_venda' },
    cards: [
      { img: 'bio-assets/geniodesk-art.webp', alt: 'Tampo de teca da GenioDesk ART', name: 'GenioDesk ART', small: 'Tampo de teca', logo: '', href: 'https://geniodesk.com.br/products/mesa-com-regulagem-de-altura-geniodesk-art-1?utm_source=instagram&utm_medium=bio&utm_campaign=geniodesk_art_tampo_teca' },
      { img: 'bio-assets/pro-smart.webp', alt: 'GenioDesk PRO Smart com tampo preto', name: 'PRO Smart', small: 'Comando de voz', logo: '', href: 'https://geniodesk.com.br/products/mesa-com-regulagem-de-altura-geniodesk-pro-smart-wi-fi?utm_source=instagram&utm_medium=bio&utm_campaign=geniodesk_pro_smart_comando_de_voz' },
      { img: 'bio-assets/cadeiras.webp', alt: 'Cadeira ergonômica preta em setup de madeira escura', name: 'Cadeiras', small: 'Ergonômicas', logo: '', href: 'https://geniodesk.com.br/collections/cadeiras-ergonomicas?utm_source=instagram&utm_medium=bio&utm_campaign=cadeiras_ergonomicas_eiffel_e_ergochais_com_15oof' },
      { img: 'bio-assets/m-stand.webp', alt: 'M-Stand em setup escuro', name: 'M-Stand', small: 'O essencial em forma elevada', logo: 'mstand', href: 'https://geniodesk.com.br/collections/m-stand?utm_source=instagram&utm_medium=bio&utm_campaign=m-stand_o_essencial_em_forma_elevada' },
      { img: 'bio-assets/mesas-eletricas.webp', alt: 'Setup com mesa elétrica GenioDesk', name: 'Mesas elétricas', small: 'Com regulagem de altura', logo: '', href: 'https://geniodesk.com.br/collections/mesa-com-regulagem-de-altura?utm_source=instagram&utm_medium=bio&utm_campaign=as_mesas_eletricas_n1_do_brasil' },
      { img: 'bio-assets/acessorios.webp', alt: 'Mesa com desk pad, apoio de punho e organizador', name: 'Acessórios', small: 'Para completar o setup', logo: '', href: 'https://geniodesk.com.br/collections/acessorios?utm_source=instagram&utm_medium=bio&utm_campaign=acessorios' }
    ]
  },

  links: [
    { icon: 'people', title: 'Parcerias', small: 'Creators, marcas e empresas', href: 'https://geniodesk.com.br/pages/contato?utm_source=instagram&utm_medium=bio&utm_campaign=parcerias' }
  ],

  social: {
    instagram: 'https://www.instagram.com/geniodesk/',
    tiktok: 'https://www.tiktok.com/@geniodesk',
    youtube: 'https://www.youtube.com/channel/UC-JjkoxghgX67LCrkVaAk5Q',
    site: 'https://geniodesk.com.br/?utm_source=instagram&utm_medium=bio&utm_campaign=website'
  },

  footer: { text: 'Transforme o seu espaço de trabalho.' }
};
