class ContainerComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const div = document.createElement("div");

    const style = document.createElement("style");
    style.textContent = `
            div {
                max-width: 100%;
                height: auto;
            }
        `;

    const slot = document.createElement("slot");

    shadow.appendChild(style);
    div.appendChild(slot);
    shadow.appendChild(div);
  }
}

export default ContainerComponent;
