const totemScreen = document.querySelector('#totemScreen');
const totemForm = document.querySelector('#totemForm');
const rutInput = document.querySelector('#rutInput');
const procedureInput = document.querySelector('#procedureInput');
const formError = document.querySelector('#formError');
const appShell = document.querySelector('.app-shell');
const scanButton = document.querySelector('#scanButton');
const resetButton = document.querySelector('#resetButton');
const resultPlaceholder = document.querySelector('#resultPlaceholder');
const ticketResult = document.querySelector('#ticketResult');
const scanMessage = document.querySelector('#scanMessage');
const scannerStage = document.querySelector('#scannerStage');
const ticketNumber = document.querySelector('#ticketNumber');
const ticketTime = document.querySelector('#ticketTime');
const printButton = document.querySelector('#printButton');
const procedureLabel = document.querySelector('.ticket-details strong');

function isValidRut(rut) {
  const cleanRut = rut.replace(/[.\-\s]/g, '').toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(cleanRut)) return false;

  const body = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1);
  let multiplier = 2;
  let sum = 0;

  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  const expectedVerifier = remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder);
  return verifier === expectedVerifier;
}

totemForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formError.hidden = true;

  if (!isValidRut(rutInput.value)) {
    formError.hidden = false;
    rutInput.focus();
    return;
  }

  procedureLabel.textContent = procedureInput.value;
  totemScreen.hidden = true;
  appShell.hidden = false;
});

function createTicketNumber() {
  const number = String(Math.floor(Math.random() * 70) + 30).padStart(3, '0');
  return `A-${number}`;
}

function updateTicketTime() {
  ticketTime.textContent = new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
}

function showTicket() {
  scannerStage.classList.remove('scanning');
  scanMessage.innerHTML = '<span class="message-icon">✓</span><span>Rostro identificado correctamente</span>';
  resultPlaceholder.hidden = true;
  ticketResult.hidden = false;
  ticketNumber.textContent = createTicketNumber();
  updateTicketTime();
  scanButton.hidden = true;
  resetButton.hidden = false;
}

scanButton.addEventListener('click', () => {
  if (scanButton.disabled) return;
  scanButton.disabled = true;
  scannerStage.classList.add('scanning');
  scanMessage.innerHTML = '<span class="message-icon">◎</span><span>Analizando rasgos y recuperando información...</span>';
  scanButton.innerHTML = '<span class="button-icon">◌</span> Verificando rostro...';

  window.setTimeout(showTicket, 1800);
});

resetButton.addEventListener('click', () => {
  resultPlaceholder.hidden = false;
  ticketResult.hidden = true;
  resetButton.hidden = true;
  scanButton.hidden = false;
  scanButton.disabled = false;
  scanButton.innerHTML = '<span class="button-icon">◉</span> Escanear rostro <span class="arrow">→</span>';
  scanMessage.innerHTML = '<span class="message-icon">◎</span><span>Rostro listo para escanear</span>';
});

printButton.addEventListener('click', () => {
  window.print();
});
