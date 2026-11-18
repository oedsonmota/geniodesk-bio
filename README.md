# Link na bio · GenioDesk

Página do link na bio da GenioDesk, com dois modos (Campanha e Normal) e painel administrativo.

- Página: `index.html` + `bio.js` (monta tudo a partir do conteúdo salvo no Supabase; se o banco não responder, usa `default-content.js`).
- Painel: `/admin` (login com e-mail e senha do Supabase do Radar de Avaliações; só e-mails da tabela `bio_admins` editam).
- Conteúdo: tabela `bio_site` (id `geniodesk`), histórico em `bio_history`, uploads no bucket `bio`.
- Prévia de um modo específico: `?modo=campanha` ou `?modo=normal`.
- Métricas: `track.js` registra visitas e cliques em `bio_events` (com aparelho, modo e região aproximada; o IP não é guardado) e o mapa de calor em `bio_visits` (posição dos cliques em cada bloco, tempo em que cada bloco ficou na tela e rolagem). O painel lê pelas funções `bio_stats` e `bio_heatmap` nas abas Cliques e Mapa de calor. Quem já entrou no painel naquele navegador não é contado.
