# 🪓 Barbearia Vikings - Site Profissional (v2.0 Otimizada)

Site estático de alto desempenho, otimizado para SEO Local, conversão e conformidade total com a LGPD (Consent Mode V2). Desenvolvido com HTML5, CSS3 e JavaScript puro (ES6+).

## 🚀 Instalação e Publicação

1. **Hospedagem Estática Recomendada:** Vercel, Netlify ou GitHub Pages (gratuitos, rápidos e com SSL/HTTPS automático).
2. **Upload:** Faça o upload dos arquivos na raiz do seu provedor de hospedagem.
3. **Domínio:** Configure seu domínio personalizado (ex: `barbeariavikings.com.br`) nas configurações da plataforma.

## ⚙️ Configuração de Marketing (Obrigatório antes de publicar)

Abra o arquivo `index.html` e substitua os placeholders `[SUBSTITUIR_PELO_...]` pelos seus IDs reais:
1. `[SUBSTITUIR_PELO_GA4_ID]` → ID do Google Analytics 4 (ex: `G-XXXXXXXXXX`).
2. `[SUBSTITUIR_PELO_ADS_ID]` → ID de Conversão do Google Ads (ex: `AW-XXXXXXXXX`).
3. `[SUBSTITUIR_PELO_GTM_ID]` → ID do Google Tag Manager (ex: `GTM-XXXXXXX`). *Aparece em 2 lugares no HTML*.
4. `[SUBSTITUIR_PELO_PIXEL_ID]` → ID do Meta Pixel (ex: `1234567890`).

## ✅ Checklist de Pré-Lançamento

- [ ] Substituir todos os IDs de marketing no `index.html`.
- [ ] Testar o botão flutuante do WhatsApp em um celular (deve abrir o app com a mensagem pré-preenchida).
- [ ] Verificar se o banner de cookies aparece na primeira visita e some ao clicar em "Aceitar" ou "Rejeitar".
- [ ] Testar o Modo Escuro (Dark Mode) e recarregar a página para garantir que a preferência foi salva no LocalStorage.
- [ ] Validar o formulário de contato (deve gerar os links de WhatsApp e E-mail corretamente e limpar o rascunho).
- [ ] Atualizar os links do Instagram/Facebook no rodapé com os URLs reais do negócio.
- [ ] Validar o Schema.org no [Rich Results Test do Google](https://search.google.com/test/rich-results).

## 📞 Suporte
Em caso de dúvidas técnicas sobre o GTM ou LGPD, consulte a documentação oficial do Google Consent Mode V2.