// Variáveis globais para o orçamento
let quantidadeAparelhos = 0;
let tipoLimpeza = "";
let localizacaoCondensadora = "";
let valorFinal = 0;

// Menu Mobile
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

// Fechar menu ao clicar em um link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
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
  quantidadeAparelhos = 0;
  tipoLimpeza = "";
  localizacaoCondensadora = "";
  valorFinal = 0;

  // Limpar seleção de radio buttons
  document
    .querySelectorAll('input[name="tipo"]')
    .forEach((radio) => (radio.checked = false));

  mostrarStep(1);
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
          "error"
        );
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      mostrarToast(
        "Erro ao enviar. Tente novamente ou entre em contato via WhatsApp.",
        "error"
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
