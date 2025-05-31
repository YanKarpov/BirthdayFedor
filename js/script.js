const msgEl = document.getElementById('message');
const choicesEl = document.getElementById('choices');

let ready = false;

let scenario = [];
let stack = [];
let currentIndex = 0;

function typeText(text, callback) {
  msgEl.classList.add('visible');
  msgEl.textContent = '';
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      msgEl.textContent += text[i++];
      setTimeout(typeChar, 35);
    } else {
      callback();
    }
  }
  typeChar();
}

function deleteText(callback) {
  let text = msgEl.textContent;
  let i = text.length;
  function deleteChar() {
    if (i > 0) {
      msgEl.textContent = text.slice(0, i - 1);
      i--;
      setTimeout(deleteChar, 25);
    } else {
      callback();
    }
  }
  deleteChar();
}

function typeVariants(variants, callback) {
  let idx = 0;
  function next() {
    if (idx >= variants.length) {
      callback();
      return;
    }
    typeText(variants[idx], () => {
      setTimeout(() => {
        if (idx < variants.length - 1) {
          deleteText(() => {
            idx++;
            next();
          });
        } else {
          callback();
        }
      }, 1000);
    });
  }
  next();
}

function showNode(node, done) {
  choicesEl.style.display = 'none';
  document.body.style.cursor = 'default';

  if (node.type === 'text') {
    typeText(node.text, () => {
      ready = true;
      document.body.style.cursor = 'pointer';
      done();
    });
  } else if (node.type === 'variants') {
    typeVariants(node.texts, () => {
      ready = true;
      document.body.style.cursor = 'pointer';
      done();
    });
  } else if (node.type === 'choice') {
    typeText(node.text, () => {
      showChoices(node.options);
      ready = false;
      document.body.style.cursor = 'default';
    });
  }
}

document.body.addEventListener('click', () => {
  if (!ready) return;
  ready = false;
  document.body.style.cursor = 'default';
  currentIndex++;
  playScenario();
});

function showChoices(options) {
  choicesEl.innerHTML = '';
  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.textContent = opt.text;
    btn.onclick = () => {
      choicesEl.style.display = 'none';
      if (opt.next && Array.isArray(opt.next)) {
        stack.push({ scenario, currentIndex });
        scenario = opt.next;
        currentIndex = 0;
      }
      playScenario();
    };
    choicesEl.appendChild(btn);
  });
  choicesEl.style.display = 'flex';
}

function playScenario() {
  if (currentIndex >= scenario.length) {
    if (stack.length > 0) {
      let last = stack.pop();
      scenario = last.scenario;
      currentIndex = last.currentIndex + 1;
      playScenario();
    } else {
      msgEl.classList.remove('visible');
      msgEl.classList.add('fade-out');
      setTimeout(() => {
      }, 800);
    }
    return;
  }

  showNode(scenario[currentIndex], () => {
  });
}

fetch('data/messages.json')
  .then(res => res.json())
  .then(data => {
    scenario = data.messages;
    playScenario();
  })
  .catch(() => {
    msgEl.textContent = 'Ошибка загрузки сценария';
  });
