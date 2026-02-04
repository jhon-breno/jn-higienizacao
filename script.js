// Variáveis globais para o orçamento
let quantidadeAparelhos = 0;
let tipoLimpeza = "";
let localizacaoCondensadora = "";
let valorFinal = 0;
let servicoAtual = "";

// ========== CARROSSEL DE SERVIÇOS ==========
let slideAtual = 0;
// NOTA: Atualizar para 4 quando o serviço de instalação estiver disponível
const totalSlides = 3;

function mudarServico(direcao) {
  slideAtual += direcao;

  // Loop circular
  if (slideAtual < 0) slideAtual = totalSlides - 1;
  if (slideAtual >= totalSlides) slideAtual = 0;

  atualizarCarrossel();
}

function irParaSlide(index) {
  slideAtual = index;
  atualizarCarrossel();
}

function atualizarCarrossel() {
  const track = document.getElementById("carouselTrack");
  const indicators = document.querySelectorAll(".indicator");
  const cards = document.querySelectorAll(".carousel-card");

  // Mover o track
  track.style.transform = `translateX(-${slideAtual * 100}%)`;

  // Atualizar indicadores
  indicators.forEach((ind, index) => {
    ind.classList.toggle("active", index === slideAtual);
  });

  // Atualizar cards
  cards.forEach((card, index) => {
    card.classList.toggle("active", index === slideAtual);
  });
}

function iniciarOrcamento(servico) {
  servicoAtual = servico;
  const calculadoraWrapper = document.getElementById("calculadoraWrapper");
  const servicoSelecionado = document.getElementById("servicoSelecionado");

  // Atualizar título do serviço
  const servicosInfo = {
    "limpeza-interna": {
      icone: "fas fa-snowflake",
      nome: "Limpeza de Evaporadora",
    },
    "limpeza-completa": {
      icone: "fas fa-fan",
      nome: "Limpeza Completa",
    },
    instalacao: {
      icone: "fas fa-tools",
      nome: "Instalação de Ar Condicionado",
    },
    manutencao: {
      icone: "fas fa-shield-alt",
      nome: "Manutenção Preventiva",
    },
  };

  const info = servicosInfo[servico];
  servicoSelecionado.innerHTML = `
    <i class="${info.icone}"></i>
    <span>${info.nome}</span>
  `;

  // Mostrar calculadora
  calculadoraWrapper.classList.remove("hidden");

  // Scroll suave para a calculadora
  setTimeout(() => {
    calculadoraWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);

  // Verificar tipo de serviço e iniciar fluxo apropriado
  if (servico === "limpeza-interna" || servico === "limpeza-completa") {
    mostrarStep(1);
  } else {
    // Para instalação e manutenção, ir direto para WhatsApp
    const mensagens = {
      instalacao:
        "Olá! Gostaria de solicitar um orçamento para instalação de ar condicionado.",
      manutencao:
        "Olá! Gostaria de solicitar um orçamento para manutenção preventiva do meu ar condicionado.",
    };
    abrirWhatsApp(mensagens[servico]);
    voltarParaCarrossel();
  }
}

function voltarParaCarrossel() {
  const calculadoraWrapper = document.getElementById("calculadoraWrapper");
  calculadoraWrapper.classList.add("hidden");

  // Reset
  quantidadeAparelhos = 0;
  tipoLimpeza = "";
  localizacaoCondensadora = "";
  valorFinal = 0;

  // Esconder todos os steps
  document
    .querySelectorAll(".calc-step")
    .forEach((s) => s.classList.add("hidden"));

  // Limpar seleção de radio buttons
  document
    .querySelectorAll('input[name="tipo"]')
    .forEach((radio) => (radio.checked = false));

  // Scroll para o carrossel
  document
    .querySelector(".servicos-carrossel")
    .scrollIntoView({ behavior: "smooth", block: "center" });
}

// Menu Mobile
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });
}

// Fechar menu ao clicar em um link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Animação de scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document
  .querySelectorAll(".servico-card, .beneficio-item, .portfolio-item")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s, transform 0.6s";
    observer.observe(el);
  });

// ========== CALCULADORA DE ORÇAMENTO ==========

// Step 1: Quantidade de aparelhos
const qtdButtons = document.querySelectorAll(".qtd-btn");
qtdButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    const qtd = this.getAttribute("data-qtd");

    if (qtd !== "mais") {
      quantidadeAparelhos = parseInt(qtd);
      mostrarStep(2);
    }
  });
});

// Step 2: Tipo de limpeza
const radioTipo = document.querySelectorAll('input[name="tipo"]');
radioTipo.forEach((radio) => {
  radio.addEventListener("change", function () {
    tipoLimpeza = this.value;

    if (tipoLimpeza === "interna") {
      // Se é apenas limpeza interna, calcular e mostrar resultado
      calcularOrcamento();
    } else if (tipoLimpeza === "completa") {
      // Se é completa, perguntar sobre localização
      mostrarStep(3);
    }
  });
});

// Step 3: Localização da condensadora
const locButtons = document.querySelectorAll(".loc-btn");
locButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    localizacaoCondensadora = this.getAttribute("data-loc");

    if (localizacaoCondensadora === "terreo") {
      calcularOrcamento();
    } else {
      // Se for a partir do primeiro andar, direcionar para WhatsApp
      const mensagem = `Olá! Gostaria de um orçamento para limpeza completa de ${quantidadeAparelhos} aparelho(s). A condensadora está a partir do 1º andar. Gostaria de mais informações sobre o valor.`;
      abrirWhatsApp(mensagem);
      resetCalculadora();
    }
  });
});

// Função para calcular orçamento
function calcularOrcamento() {
  let valorBase = 0;
  let detalhes = "";

  // Calcular valor base da limpeza interna
  if (quantidadeAparelhos === 1) {
    valorBase = 200;
    detalhes +=
      "<p><strong>Limpeza Interna:</strong> <span>1 aparelho - R$ 200,00</span></p>";
  } else if (quantidadeAparelhos === 2) {
    valorBase = 350;
    detalhes +=
      "<p><strong>Limpeza Interna:</strong> <span>2 aparelhos - R$ 350,00</span></p>";
  } else if (quantidadeAparelhos === 3) {
    valorBase = 400;
    detalhes +=
      "<p><strong>Limpeza Interna:</strong> <span>3 aparelhos - R$ 400,00</span></p>";
  }

  // Se for limpeza completa e no térreo, adicionar valor da condensadora
  if (tipoLimpeza === "completa" && localizacaoCondensadora === "terreo") {
    const valorCondensadora = quantidadeAparelhos * 80;
    detalhes += `<p><strong>Limpeza Externa (Térreo):</strong> <span>${quantidadeAparelhos} aparelho(s) - R$ ${valorCondensadora
      .toFixed(2)
      .replace(".", ",")}</span></p>`;
    valorBase += valorCondensadora;
  }

  valorFinal = valorBase;

  // Mostrar resultado
  document.getElementById("valorTotal").textContent = `R$ ${valorFinal
    .toFixed(2)
    .replace(".", ",")}`;
  document.getElementById("detalhesOrcamento").innerHTML = detalhes;

  mostrarStep("resultado");
}

// Função para mostrar step específico
function mostrarStep(step) {
  // Esconder todos os steps
  document
    .querySelectorAll(".calc-step")
    .forEach((s) => s.classList.add("hidden"));

  // Mostrar step desejado
  if (typeof step === "number") {
    document.getElementById(`step${step}`).classList.remove("hidden");
  } else {
    document.getElementById(step).classList.remove("hidden");
  }
}

// Função para voltar step
function voltarStep(step) {
  mostrarStep(step);
}

// Função para resetar calculadora
function resetCalculadora() {
  voltarParaCarrossel();
}

// Função para enviar orçamento pelo WhatsApp
function enviarOrcamento() {
  let mensagem = `Olá! Gostaria de contratar o serviço de higienização de ar condicionado:\n\n`;
  mensagem += `📋 *Detalhes do Orçamento:*\n`;
  mensagem += `• Quantidade: ${quantidadeAparelhos} aparelho(s)\n`;

  if (tipoLimpeza === "interna") {
    mensagem += `• Serviço: Limpeza Interna (Evaporadora)\n`;
  } else {
    mensagem += `• Serviço: Limpeza Completa (Interna + Externa)\n`;
    mensagem += `• Localização: Térreo\n`;
  }

  mensagem += `\n💰 *Valor Total: R$ ${valorFinal
    .toFixed(2)
    .replace(".", ",")}*\n\n`;
  mensagem += `Gostaria de agendar o serviço!`;

  abrirWhatsApp(mensagem);
}

// Função para abrir WhatsApp
function abrirWhatsApp(mensagem = "") {
  const telefone = "5585999469423";
  let url = `https://wa.me/${telefone}`;

  if (mensagem) {
    url += `?text=${encodeURIComponent(mensagem)}`;
  } else {
    const mensagemPadrao =
      "Olá! Gostaria de saber mais sobre os serviços de higienização de ar condicionado.";
    url += `?text=${encodeURIComponent(mensagemPadrao)}`;
  }

  window.open(url, "_blank");
}

// Formulário de contato
function enviarFormulario(event) {
  event.preventDefault();

  const form = event.target;
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;
  const mensagemTexto = document.getElementById("mensagem").value;

  // Criar FormData para envio
  const formData = new FormData();
  formData.append("nome", nome);
  formData.append("telefone", telefone);
  formData.append("email", email || "Não informado");
  formData.append("mensagem", mensagemTexto);
  formData.append("_subject", `Novo Orçamento - ${nome}`);
  formData.append("_captcha", "false");
  formData.append("_template", "table");

  // Desabilitar botão durante envio
  const btnSubmit = form.querySelector('button[type="submit"]');
  const textoOriginal = btnSubmit.innerHTML;
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

  // Enviar via FormSubmit
  fetch("https://formsubmit.co/" + "jhonbreno@gmail.com", {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Mostrar toast de sucesso
        mostrarToast("Orçamento solicitado. Em breve entraremos em contato.");

        // Limpar formulário
        form.reset();
      } else {
        mostrarToast(
          "Erro ao enviar. Tente novamente ou entre em contato via WhatsApp.",
          "error",
        );
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      mostrarToast(
        "Erro ao enviar. Tente novamente ou entre em contato via WhatsApp.",
        "error",
      );
    })
    .finally(() => {
      // Reabilitar botão
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = textoOriginal;
    });
}

// Função para mostrar toast
function mostrarToast(mensagem, tipo = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const toastIcon = toast.querySelector("i");

  // Configurar mensagem e cor
  toastMessage.textContent = mensagem;

  if (tipo === "success") {
    toast.style.background = "#27ae60";
    toastIcon.className = "fas fa-check-circle";
  } else {
    toast.style.background = "#e74c3c";
    toastIcon.className = "fas fa-exclamation-circle";
  }

  // Mostrar toast
  toast.classList.add("show");

  // Esconder após 5 segundos
  setTimeout(() => {
    toast.classList.remove("show");
  }, 5000);
}

// Header fixo com efeito
let lastScroll = 0;
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  } else {
    header.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
  }

  lastScroll = currentScroll;
});

// Efeito parallax suave no hero
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Log de inicialização
console.log("JN Climatização - Website carregado com sucesso! 🌬️");

// ========== CALCULADORA DE BTUs ==========

let btuCalculado = 0;
let areaCalculada = 0;

// Formulário de cálculo de BTU
const formCalculoBTU = document.getElementById("formCalculoBTU");
if (formCalculoBTU) {
  formCalculoBTU.addEventListener("submit", function (e) {
    e.preventDefault();
    calcularBTU();
  });
}

function calcularBTU() {
  // Obter valores do formulário
  const area = parseFloat(document.getElementById("areaAmbiente").value);
  const numeroPessoas = parseInt(
    document.getElementById("numeroPessoas").value,
  );
  const insolacao = document.getElementById("insolacao").value;
  const tipoAmbiente = document.getElementById("tipoAmbiente").value;
  const equipamentos = document.getElementById("equipamentos").value;
  const peDireito = document.getElementById("peDireito").value;

  // Validação
  if (!area || !numeroPessoas || !insolacao || !tipoAmbiente) {
    mostrarToast("Por favor, preencha todos os campos obrigatórios!", "error");
    // Scroll para o formulário
    document.getElementById("formCalculoBTU").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Validação de área
  if (area <= 0 || area > 500) {
    mostrarToast("Por favor, insira uma área válida (entre 1 e 500 m²)!", "error");
    return;
  }

  // Cálculo base: 600 BTUs por m²
  let btuBase = area * 600;

  // Adicionar BTUs por pessoa (cada pessoa adiciona calor)
  // Primeira pessoa já está no cálculo base, adicionar para as demais
  if (numeroPessoas > 1) {
    btuBase += (numeroPessoas - 1) * 600;
  }

  // Fator de insolação
  let fatorInsolacao = 1;
  if (insolacao === "pouca") {
    fatorInsolacao = 0.9; // Reduz 10%
  } else if (insolacao === "media") {
    fatorInsolacao = 1.0; // Mantém
  } else if (insolacao === "muita") {
    fatorInsolacao = 1.15; // Aumenta 15%
  }

  btuBase *= fatorInsolacao;

  // Tipo de ambiente
  let fatorAmbiente = 1;
  if (tipoAmbiente === "cozinha") {
    fatorAmbiente = 1.2; // Cozinha gera mais calor
  } else if (tipoAmbiente === "servidor") {
    fatorAmbiente = 1.5; // Sala de servidores precisa muito mais
  } else if (tipoAmbiente === "escritorio") {
    fatorAmbiente = 1.1; // Escritório tem mais equipamentos
  }

  btuBase *= fatorAmbiente;

  // Equipamentos eletrônicos
  if (equipamentos === "medio") {
    btuBase += 800;
  } else if (equipamentos === "muitos") {
    btuBase += 1500;
  }

  // Pé direito (altura)
  if (peDireito === "alto") {
    btuBase *= 1.1; // Aumenta 10% para pé direito alto
  } else if (peDireito === "baixo") {
    btuBase *= 0.95; // Reduz 5% para pé direito baixo
  }

  // Arredondar para BTUs comerciais padrão
  const btusPadroes = [
    7000, 7500, 9000, 10000, 12000, 14000, 16000, 18000, 20000, 22000, 24000,
    27000, 30000, 36000, 42000, 48000, 60000,
  ];

  // Encontrar o BTU comercial mais próximo (sempre arredondando para cima)
  let btuRecomendado = btusPadroes.find((btu) => btu >= btuBase) || 60000;

  // Se o valor calculado for muito próximo do limite inferior, manter
  // Se for muito acima, informar que pode precisar de dois aparelhos
  if (btuBase > 60000) {
    btuRecomendado = Math.ceil(btuBase / 1000) * 1000;
  }

  // Salvar valores
  btuCalculado = btuRecomendado;
  areaCalculada = area;

  // Exibir resultado
  exibirResultadoBTU(btuRecomendado, area, btuBase);
}

function exibirResultadoBTU(btuRecomendado, area, btuCalculadoExato) {
  const resultadoDiv = document.getElementById("resultadoBTU");
  const btuValorDiv = document.getElementById("btuCalculado");
  const btuDetalhesDiv = document.getElementById("btuDetalhes");
  const btuModelosDiv = document.getElementById("btuModelos");

  // Valor principal
  btuValorDiv.innerHTML = `${btuRecomendado.toLocaleString("pt-BR")} BTUs`;

  // Detalhes
  let detalhesHTML = `
    <p><strong>Área do ambiente:</strong> ${area} m²</p>
    <p><strong>Capacidade calculada:</strong> ${Math.round(btuCalculadoExato).toLocaleString("pt-BR")} BTUs</p>
    <p><strong>Aparelho recomendado:</strong> ${btuRecomendado.toLocaleString("pt-BR")} BTUs</p>
  `;

  // Verificar se precisa de mais de um aparelho
  if (btuRecomendado > 60000) {
    const qtdAparelhos = Math.ceil(btuRecomendado / 30000);
    const btuPorAparelho =
      Math.ceil(btuRecomendado / qtdAparelhos / 1000) * 1000;
    detalhesHTML += `
      <p style="color: var(--primary-color); font-weight: bold; margin-top: 1rem;">
        <i class="fas fa-info-circle"></i> 
        Recomendamos ${qtdAparelhos} aparelhos de ${btuPorAparelho.toLocaleString("pt-BR")} BTUs cada
      </p>
    `;
  }

  btuDetalhesDiv.innerHTML = detalhesHTML;

  // Modelos sugeridos
  let modelosHTML =
    "<h4><i class='fas fa-snowflake'></i> Modelos Compatíveis:</h4><ul>";

  // Definir faixa de BTUs compatíveis
  const btuMinimo = btuRecomendado;
  const btuMaximo = btuRecomendado + 3000;

  const modelosPossiveis = [
    { btu: 7000, nome: "7.000 BTUs - Ideal para até 9m²" },
    { btu: 9000, nome: "9.000 BTUs - Ideal para até 12m²" },
    { btu: 12000, nome: "12.000 BTUs - Ideal para até 16m²" },
    { btu: 18000, nome: "18.000 BTUs - Ideal para até 25m²" },
    { btu: 24000, nome: "24.000 BTUs - Ideal para até 35m²" },
    { btu: 30000, nome: "30.000 BTUs - Ideal para até 45m²" },
    { btu: 36000, nome: "36.000 BTUs - Ideal para até 55m²" },
    { btu: 48000, nome: "48.000 BTUs - Ideal para até 70m²" },
    { btu: 60000, nome: "60.000 BTUs - Ideal para até 90m²" },
  ];

  // Filtrar modelos na faixa recomendada
  const modelosFiltrados = modelosPossiveis.filter(
    (m) => m.btu >= btuMinimo - 2000 && m.btu <= btuMaximo,
  );

  if (modelosFiltrados.length > 0) {
    modelosFiltrados.forEach((modelo) => {
      modelosHTML += `<li><i class="fas fa-check"></i> ${modelo.nome}</li>`;
    });
  } else {
    modelosHTML += `<li><i class="fas fa-check"></i> Aparelho de ${btuRecomendado.toLocaleString("pt-BR")} BTUs</li>`;
  }

  modelosHTML += "</ul>";
  btuModelosDiv.innerHTML = modelosHTML;

  // Mostrar resultado com animação
  resultadoDiv.classList.remove("hidden");
  // Pequeno delay para ativar a transição
  setTimeout(() => {
    resultadoDiv.classList.add("show");
  }, 10);

  // Scroll para o resultado
  setTimeout(() => {
    resultadoDiv.scrollIntoView({ 
      behavior: "smooth", 
      block: "nearest" 
    });
  }, 300);

  // Mostrar sucesso
  mostrarToast("Cálculo realizado com sucesso! 🎉", "success");
}

function resetCalculadoraBTU() {
  const resultadoDiv = document.getElementById("resultadoBTU");
  const formBTU = document.getElementById("formCalculoBTU");

  // Remover animação de entrada
  resultadoDiv.classList.remove("show");

  // Aguardar transição e esconder
  setTimeout(() => {
    resultadoDiv.classList.add("hidden");
    formBTU.reset();
  }, 300);

  // Scroll para o formulário
  setTimeout(() => {
    formBTU.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 350);
}

function abrirWhatsAppComBTU() {
  const area = areaCalculada;
  const btu = btuCalculado;

  const mensagem = `Olá! Utilizei a calculadora do site e preciso de um aparelho de *${btu.toLocaleString("pt-BR")} BTUs* para um ambiente de *${area}m²*. Gostaria de solicitar um orçamento para instalação.`;

  const url = `https://wa.me/5585999469423?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

// ========== SUPORTE TOUCH E TECLADO PARA CARROSSEL ==========

// Suporte para teclas de seta
document.addEventListener("keydown", (e) => {
  const calculadoraVisivel = !document
    .getElementById("calculadoraWrapper")
    .classList.contains("hidden");

  // Só funciona se a calculadora não estiver visível
  if (!calculadoraVisivel) {
    if (e.key === "ArrowLeft") {
      mudarServico(-1);
    } else if (e.key === "ArrowRight") {
      mudarServico(1);
    }
  }
});

// Suporte para gestos de touch (swipe)
let touchStartX = 0;
let touchEndX = 0;

const carouselContainer = document.querySelector(".carousel-container");

if (carouselContainer) {
  carouselContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );

  carouselContainer.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true },
  );
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - próximo
      mudarServico(1);
    } else {
      // Swipe right - anterior
      mudarServico(-1);
    }
  }
}

// Log de inicialização
console.log("JN Climatização - Website carregado com sucesso! 🌬️");
