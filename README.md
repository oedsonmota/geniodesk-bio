# Link na bio · GenioDesk

Página do link na bio da GenioDesk, com dois modos (Campanha e Normal) e painel administrativo.

- Página: `index.html` + `bio.js` (monta tudo a partir do conteúdo salvo no Supabase; se o banco não responder, usa `default-content.js`).
- Painel: `/admin` (login com e-mail e senha do Supabase do Radar de Avaliações; só e-mails da tabela `bio_admins` editam).
- Conteúdo: tabela `bio_site` (id `geniodesk`), histórico em `bio_history`, uploads no bucket `bio`.
- Prévia de um modo específico: `?modo=campanha` ou `?modo=normal`.
