// MENU MOBILE
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  navToggle.classList.toggle("active")
})

// FECHAR MENU AO CLICAR EM UM LINK
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
  })
})

// SCROLL SUAVE
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// FAQ ACCORDION
function toggleFaq(element) {
  const faqItem = element.parentElement
  const faqAnswer = faqItem.querySelector(".faq-answer")
  const isActive = element.classList.contains("active")

  // Fechar todas as outras FAQs
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.classList.remove("active")
    question.parentElement.querySelector(".faq-answer").classList.remove("active")
  })

  // Abrir/fechar a FAQ clicada
  if (!isActive) {
    element.classList.add("active")
    faqAnswer.classList.add("active")
  }
}

// VALIDAÇÃO E ENVIO DO FORMULÁRIO COM BREVO
const contactForm = document.getElementById("contact-form")
const submitBtn = document.getElementById("submit-btn")
const btnText = submitBtn.querySelector(".btn-text")
const btnLoading = submitBtn.querySelector(".btn-loading")
const successMessage = document.getElementById("form-success")
const errorMessage = document.getElementById("form-error")
const errorText = document.getElementById("error-text")

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  // Limpar mensagens anteriores
  hideMessages()

  // Validação básica
  const nome = document.getElementById("nome").value.trim()
  const email = document.getElementById("email").value.trim()
  const negocio = document.getElementById("negocio").value
  const whatsapp = document.getElementById("whatsapp").value.trim()

  if (!nome || !email || !negocio || !whatsapp) {
    showError("Por favor, preencha todos os campos obrigatórios.")
    return
  }

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    showError("Por favor, insira um e-mail válido.")
    return
  }

  // Validação de telefone (básica)
  const phoneRegex = /^[\d\s()+-]+$/
  if (!phoneRegex.test(whatsapp)) {
    showError("Por favor, insira um número de WhatsApp válido.")
    return
  }

  // Mostrar loading
  setLoading(true)

  try {
    // Enviar dados para a API
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        email,
        negocio,
        whatsapp,
      }),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      // Sucesso
      showSuccess()
      contactForm.reset()
    } else {
      // Erro da API
      showError(result.error || "Erro ao enviar formulário. Tente novamente.")
    }
  } catch (error) {
    console.error("Erro ao enviar formulário:", error)
    showError("Erro de conexão. Verifique sua internet e tente novamente.")
  } finally {
    setLoading(false)
  }
})

// Funções auxiliares para o formulário
function setLoading(loading) {
  if (loading) {
    submitBtn.disabled = true
    btnText.style.display = "none"
    btnLoading.style.display = "inline-flex"
  } else {
    submitBtn.disabled = false
    btnText.style.display = "inline"
    btnLoading.style.display = "none"
  }
}

function showSuccess() {
  hideMessages()
  successMessage.style.display = "flex"
  successMessage.scrollIntoView({ behavior: "smooth", block: "center" })
}

function showError(message) {
  hideMessages()
  errorText.textContent = message
  errorMessage.style.display = "flex"
  errorMessage.scrollIntoView({ behavior: "smooth", block: "center" })
}

function hideMessages() {
  successMessage.style.display = "none"
  errorMessage.style.display = "none"
}

// ANIMAÇÕES AO SCROLL
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Aplicar animação aos elementos
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".problem-card, .solution-item, .audience-card, .step")

  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
})

// MÁSCARA PARA TELEFONE
document.getElementById("whatsapp").addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "")

  if (value.length <= 11) {
    if (value.length <= 2) {
      value = value.replace(/(\d{0,2})/, "($1")
    } else if (value.length <= 7) {
      value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2")
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
    }
  }

  e.target.value = value
})

// EFEITO PARALLAX SUAVE NO HERO
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const hero = document.querySelector(".hero")
  const rate = scrolled * -0.5

  if (hero) {
    hero.style.transform = `translateY(${rate}px)`
  }
})

// BOTÃO VOLTAR AO TOPO
const backToTopBtn = document.getElementById("back-to-top")

// Mostrar/esconder botão baseado no scroll
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add("visible")
  } else {
    backToTopBtn.classList.remove("visible")
  }
})

// Função para voltar ao topo
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// FUNÇÕES DOS MODAIS
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("active")
    modal.style.display = "flex"
    document.body.style.overflow = "hidden" // Prevenir scroll da página
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("active")
    setTimeout(() => {
      modal.style.display = "none"
    }, 300)
    document.body.style.overflow = "auto" // Restaurar scroll da página
  }
}

// Fechar modal ao clicar fora do conteúdo
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    const modalId = e.target.id
    closeModal(modalId)
  }
})

// Fechar modal com tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const activeModal = document.querySelector(".modal.active")
    if (activeModal) {
      closeModal(activeModal.id)
    }
  }
})

// ATUALIZAR LINKS DO WHATSAPP COM NÚMERO REAL
document.addEventListener("DOMContentLoaded", () => {
  // Atualizar todos os links do WhatsApp para o número real
  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]')
  whatsappLinks.forEach((link) => {
    link.href = "https://wa.me/5511936196444"
  })
})
