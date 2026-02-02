# JN Climatização - Website

Website profissional para serviços de higienização de ar condicionado.

## 🚀 Funcionalidades

- **Design Responsivo**: Totalmente adaptado para desktop, tablet e mobile
- **Calculadora de BTUs**: Sistema inteligente que calcula a capacidade ideal do ar condicionado baseado em:
  - Área do ambiente (m²)
  - Número de pessoas
  - Incidência solar
  - Tipo de ambiente (residencial, cozinha, escritório, sala de servidores)
  - Quantidade de equipamentos eletrônicos
  - Altura do pé direito
- **Calculadora de Orçamento Interativa**: Sistema inteligente que calcula o valor do serviço baseado em:
  - Quantidade de aparelhos (1, 2, 3 ou mais)
  - Tipo de limpeza (interna ou completa)
  - Localização da condensadora (térreo ou andares superiores)
- **Formulário de Orçamento com Envio por Email**:
  - Captura de dados do cliente (nome, telefone, email opcional, mensagem)
  - Envio automático para o email do proprietário via FormSubmit
  - Toast de sucesso após envio
  - Validação de campos obrigatórios
- **Integração com WhatsApp**: Botão flutuante e envio direto de orçamentos calculados
- **Portfólio Visual**: Galeria de trabalhos realizados com imagens antes/depois
- **Seções Informativas**: Benefícios, serviços e informações de contato
- **Ícone Personalizado**: Favicon SVG com design profissional representando climatização

## 📐 Calculadora de BTUs

A calculadora de BTUs ajuda os clientes a descobrir qual a capacidade ideal do aparelho de ar condicionado para o seu ambiente. O cálculo considera:

- **Cálculo base**: 600 BTUs por m²
- **Pessoas**: 600 BTUs por pessoa adicional
- **Insolação**:
  - Pouca (sombra): -10%
  - Média: sem alteração
  - Muita (sol direto): +15%
- **Tipo de ambiente**:
  - Residencial: sem alteração
  - Cozinha: +20%
  - Escritório: +10%
  - Sala de servidores: +50%
- **Equipamentos eletrônicos**:
  - Médio: +800 BTUs
  - Muitos: +1500 BTUs
- **Pé direito**:
  - Baixo (até 2,7m): -5%
  - Médio (2,7m a 3,2m): sem alteração
  - Alto (acima de 3,2m): +10%

O resultado é arredondado para os BTUs comerciais padrão (7.000, 9.000, 12.000, 18.000, 24.000, 30.000, etc.) e sugere modelos compatíveis.

## 📋 Estrutura de Preços

### Limpeza Interna (Evaporadora)

- 1 aparelho: R$ 200,00
- 2 aparelhos: R$ 350,00
- 3 aparelhos: R$ 400,00

### Limpeza Completa (Interna + Externa)

- Condensadora no térreo: + R$ 80,00 por aparelho
- Condensadora em andares superiores: Consultar via WhatsApp

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3 (Design moderno com gradientes e animações)
- JavaScript (Vanilla JS)
- Font Awesome (Ícones)
- FormSubmit (Serviço de envio de emails sem backend)
- SVG (Ícone vetorial personalizado)

## 📱 Como Usar

1. Abra o arquivo `index.html` em qualquer navegador m e enviar pelo WhatsApp
2. Preencha o formulário de contato para receber orçamento por email
3. Use o botão flutuanteeções usando o menu ou scroll
4. Use a calculadora de orçamento para simular valores
5. Clique no botão do WhatsApp para contato direto

## 📞 Contato

- **Whail**: jhonbreno@gmail.com
- **Empresa**: JN Climatização
- **Serviços**: Fortaleza e Região Metropolitana

## 📧 Sistema de Orçamento por Email

O formulário de contato utiliza o **FormSubmit**, um serviço gratuito que permite envio de emails sem necessidade de backend. Os orçamentos são enviados automaticamente para `jhonbreno@gmail.com` contendo:
index.html`: Conteúdo e estrutura

- `style.css`: Cores, fontes e estilos (incluindo toast de notificação)
- `script.js`: Lógica de orçamento, envio de email e interações
- `favicon.svg`: Ícone do site (vetorial, editável)
- Email (opcional)
- Descrição do serviço solicitado
- Timestamp do envio

Após o envio bem-sucedido, um **toast de confirmação** é exibido ao cliente com a mensagem: _"Orçamento solicitado. Em breve entraremos em contato."_

- **Serviços**: Fortaleza e Região Metropolitana

## 🎨 Personalização

--success-color: #00d2d3;

````

### Alterar Email de Recebimento

Para alterar o email que recebe os orçamentos, edite a linha 233 do arquivo `script.js`:

```javascript
fetch('https://formsubmit.co/' + 'SEU_EMAIL@gmail.com', {
````

## 📁 Estrutura de Arquivos

````
jn-higienizacao/
├── index.html          # Página principal
├── style.css          # Estilos e animações
├── script.js          # Funcionalidades JavaScript
├── favicon.svg        # Ícone do site (SVG vetorial)
└── README.md          # Documentação

Para personalizar o site, edite os seguintes arquivos:

- `style.css`: Cores, fontes e estilos
- `script.js`: Lógica de orçamento e interações
- `index.html`: Conteúdo e estrutura

### Variáveis CSS Principais

```css
--primary-color: #00a8ff;
--secondary-color: #0097e6;
--dark-color: #1e272e;
--light-color: #f5f6fa;
````

## 📄 Licença

© 2026 JN Climatização. Todos os direitos reservados.
