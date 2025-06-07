function observeUrlChanges() {
  let lastUrl = location.href;

  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      checkAndInit();
    }
  });

  observer.observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
  });

  checkAndInit();
}

function checkAndInit() {
  if (isVariableGroupUrl()) {
    requestAnimationFrame(() => {
      setTimeout(initCopyButton, 500); 
    });
  } else {
    removeCopyButtonIfExists();
  }
}

function isVariableGroupUrl() {
  return /https:\/\/dev\.azure\.com\/.+\/_library\?itemType=VariableGroups&view=VariableGroupView&variableGroupId=\d+/.test(
    location.href
  );
}

function removeCopyButtonIfExists() {
  const button = document.querySelector('.copy-env-button');
  if (button) {
    button.style.transition = 'opacity 0.3s ease';
    button.style.opacity = '0';
    setTimeout(() => button.remove(), 300);
  }
}

function initCopyButton() {
  const variablesSection = document.querySelector("#lib-vg-header-variables");
  const variables = document.querySelectorAll("pre");
  
  if (!variablesSection || variables.length === 0) {
    return;
  }
  
  if (variablesSection.querySelector('.copy-env-button')) {
    return;
  }
  
  const fileEnv = buildEnvString(variables);
  injectCopyButton(variablesSection, () => copyToClipboard(fileEnv));
}

function buildEnvString(elements) {
  let env = "";
  elements.forEach((el, i) => {
    const text = el.textContent.trim();
    env += i % 2 === 0 ? text : ` = ${text}\n`;
  });
  return env;
}

function injectCopyButton(container, onClick) {
  if (container.querySelector('.copy-env-button')) {
    return;
  }

  container.style.display = "flex";
  container.style.width = "100%";
  container.style.justifyContent = "space-between";

  const button = document.createElement("div");
  button.className = 'copy-env-button';
  button.style.cssText = `
    display: flex;
    margin: 0 10px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    transform: scale(0.8);
    opacity: 0;
    transition: all 0.3s ease;
  `;

  // Crear el ícono con estilo inicial para animación
  const icon = document.createElement('i');
  icon.setAttribute('role', 'presentation');
  icon.setAttribute('aria-hidden', 'true');
  icon.className = `ms-CommandBarItem-icon itemIcon_278ff396 ms-CommandBarItem-iconColor 
                   itemIconColor_278ff396 vss-PivotBar--commandBar-icon 
                   vss-Icon vss-Icon--bowtie bowtie-edit-copy root-45`;
  
  // Estilos iniciales para la animación del ícono
  icon.style.cssText = `
    transform: rotate(-30deg) scale(0.5);
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  `;
  
  button.appendChild(icon);
  
  button.addEventListener("click", async (e) => {
    e.stopPropagation();
    
    // Animación de clic
    button.style.transform = 'scale(0.9)';
    icon.style.transform = 'rotate(0deg) scale(0.8)';
    await new Promise(resolve => setTimeout(resolve, 100));
    button.style.transform = 'scale(1.1)';
    icon.style.transform = 'rotate(10deg) scale(1.1)';
    await new Promise(resolve => setTimeout(resolve, 100));
    button.style.transform = 'scale(1)';
    icon.style.transform = 'rotate(0deg) scale(1)';
    
    onClick();
  });
  
  container.appendChild(button);
  
  // Animación de aparición del botón
  requestAnimationFrame(() => {
    button.style.transform = 'scale(1)';
    button.style.opacity = '1';
    
    // Animación especial del ícono con retraso
    setTimeout(() => {
      icon.style.transform = 'rotate(0deg) scale(1)';
      icon.style.opacity = '1';
    }, 150);
  });
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showFeedback("Copiado al portapapeles");
  } catch (err) {
    console.error("Error al copiar:", err);
    showFeedback("Error al copiar", true);
  }
}

function showFeedback(message, isError = false) {
  const existingFeedback = document.querySelector('.copy-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }

  const feedback = document.createElement('div');
  feedback.className = 'copy-feedback';
  feedback.textContent = message;
  feedback.style.position = 'fixed';
  feedback.style.bottom = '20px';
  feedback.style.right = '20px';
  feedback.style.padding = '12px 24px';
  feedback.style.background = isError ? '#ffebee' : '#e8f5e9';
  feedback.style.color = isError ? '#c62828' : '#2e7d32';
  feedback.style.borderRadius = '4px';
  feedback.style.zIndex = '9999';
  feedback.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  feedback.style.transform = 'translateY(100px)';
  feedback.style.opacity = '0';
  feedback.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  
  document.body.appendChild(feedback);
  
  requestAnimationFrame(() => {
    feedback.style.transform = 'translateY(0)';
    feedback.style.opacity = '1';
  });
  
  setTimeout(() => {
    feedback.style.transform = 'translateY(-20px)';
    feedback.style.opacity = '0';
    setTimeout(() => feedback.remove(), 400);
  }, 2500);
}

// Iniciar
observeUrlChanges();