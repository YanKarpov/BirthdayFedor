const msgEl = document.getElementById("message");
const choicesEl = document.getElementById("choices");

class ScenarioPlayer {
  constructor(scenario) {
    this.scenario = scenario;
    this.stack = [];
    this.currentIndex = 0;
    this.ready = false;

    document.body.addEventListener("click", () => {
      if (!this.ready) return;
      this.ready = false;
      document.body.style.cursor = "default";
      this.next();
    });
  }

  typeText(text) {
    msgEl.classList.add("visible");
    msgEl.textContent = "";
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        msgEl.textContent += text[i++];
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, 35);
    });
  }

  deleteText() {
    return new Promise((resolve) => {
      let text = msgEl.textContent;
      let i = text.length;
      const interval = setInterval(() => {
        msgEl.textContent = text.slice(0, i - 1);
        i--;
        if (i <= 0) {
          clearInterval(interval);
          resolve();
        }
      }, 25);
    });
  }

  async typeVariants(variants) {
    for (let i = 0; i < variants.length; i++) {
      await this.typeText(variants[i]);
      if (i < variants.length - 1) {
        await new Promise((r) => setTimeout(r, 1000));
        await this.deleteText();
      }
    }
  }

  showChoices(options) {
    choicesEl.innerHTML = "";
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.textContent = opt.text;
      btn.onclick = async () => {
        choicesEl.style.display = "none";
        if (opt.next && Array.isArray(opt.next)) {
          this.stack.push({
            scenario: this.scenario,
            currentIndex: this.currentIndex,
          });
          this.scenario = opt.next;
          this.currentIndex = 0;
          await this.showNode(this.scenario[this.currentIndex]);
        } else {
          await this.next();
        }
      };
      choicesEl.appendChild(btn);
    });
    choicesEl.style.display = "flex";
  }

  async showNode(node) {
    choicesEl.style.display = "none";
    document.body.style.cursor = "default";

    if (node.type === "text") {
      await this.typeText(node.text);
      this.ready = true;
      document.body.style.cursor = "pointer";
    } else if (node.type === "variants") {
      await this.typeVariants(node.texts);
      this.ready = true;
      document.body.style.cursor = "pointer";
    } else if (node.type === "choice") {
      await this.typeText(node.text);
      this.showChoices(node.options);
      this.ready = false;
      document.body.style.cursor = "default";
    }
  }

  async next() {
    this.currentIndex++;
    if (this.currentIndex >= this.scenario.length) {
      if (this.stack.length > 0) {
        const last = this.stack.pop();
        this.scenario = last.scenario;
        this.currentIndex = last.currentIndex + 1;
        await this.showNode(this.scenario[this.currentIndex]);
      } else {
        msgEl.classList.remove("visible");
        msgEl.classList.add("fade-out");
        setTimeout(() => {}, 800);
        this.ready = false;
      }
      return;
    }
    await this.showNode(this.scenario[this.currentIndex]);
  }

  async start() {
    this.currentIndex = 0;
    await this.showNode(this.scenario[this.currentIndex]);
  }
}

fetch("data/messages.json")
  .then((res) => res.json())
  .then((data) => {
    const player = new ScenarioPlayer(data.messages);
    player.start();
  })
  .catch(() => {
    msgEl.textContent = "Ошибка загрузки сценария";
  });

const bgMusic = document.getElementById("bg-music");

let musicStarted = false;

document.body.addEventListener("click", () => {
  if (!musicStarted) {
    bgMusic.volume = 0.3; 
    bgMusic.play().catch(() => {}); 
    musicStarted = true;
  }
});
