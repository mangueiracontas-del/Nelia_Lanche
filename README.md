# 🍽️ OlaClick Dashboard Replica

Uma réplica funcional do painel de controle do **OlaClick** — plataforma de gestão de pedidos para restaurantes e delivery.

![Dashboard Preview](preview.png)

## 🚀 Funcionalidades

### Interface Principal
- **Header fixo** com logo, botão de upgrade, notificações, mensagens e menu do usuário
- **Sidebar colapsável** à esquerda com navegação por ícones (expande ao passar o mouse)
- **Banner do caixa** com aviso de caixa fechado e botão para abrir

### Gestão de Pedidos
- **Tabs de pedidos**: Balcão, Delivery, Mesas (com contadores)
- **Filtros rápidos**: Tudo, Pendente, Em curso, PDV/WEB, Aplicativos
- **Tabela de pedidos** com:
  - Data e timer
  - Estado (Entregue, Pendente, Em curso)
  - Total e status de pagamento
  - Informações do cliente (nome, WhatsApp)
  - Ações (Imprimir, Status, Pagar, Finalizar)

### Interatividade
- ✅ Tabs clicáveis com animação
- ✅ Filtros com feedback visual
- ✅ Botões de ação com confirmação
- ✅ Ordenação de colunas
- ✅ Tooltips em todos os botões
- ✅ Toast notifications
- ✅ Atalhos de teclado (Ctrl+K, Ctrl+N, Escape)
- ✅ Sidebar expande no hover
- ✅ Totalmente responsivo

## 📁 Estrutura de Arquivos

```
olaclick-dashboard/
├── index.html      # Estrutura HTML principal
├── styles.css      # Estilos e tema visual
├── app.js          # Interações e funcionalidades
└── README.md       # Documentação
```

## 🎨 Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Primary | `#006FFF` | Botões principais, links, destaques |
| Primary Dark | `#003E8F` | Textos em botões claros |
| Success | `#3CAF47` | Ações de sucesso, finalizar |
| Warning | `#FF9800` | Alertas, não pago, timer |
| Error | `#FE5F55` | Erros, caixa fechado |
| Background | `#F0F0F0` | Fundo da página |
| Text Dark | `#0A131F` | Textos principais |
| Text Medium | `#5A6472` | Textos secundários |

## 🖥️ Como Usar

1. **Baixe todos os arquivos** para uma pasta
2. **Abra o `index.html`** em qualquer navegador moderno
3. **Não requer servidor** — funciona localmente

### Ou via servidor local:
```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8000
```

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl + K` | Abrir busca |
| `Ctrl + N` | Novo pedido |
| `Escape` | Fechar banner |

## 📱 Responsividade

- **Desktop** (>1200px): Layout completo
- **Tablet** (768-1200px): Sidebar oculta, tabela scrollable
- **Mobile** (<768px): Layout compacto, sidebar removida

## 🛠️ Tecnologias

- **HTML5** — Estrutura semântica
- **CSS3** — Flexbox, Grid, Custom Properties, Animações
- **JavaScript Vanilla** — Sem dependências externas
- **Material Design Icons** — Ícones via CDN
- **Google Fonts (Roboto)** — Tipografia via CDN

## 📝 Licença

Projeto de réplica educacional. Não afiliado ao OlaClick.

---

**Desenvolvido com ❤️ em 2026**
