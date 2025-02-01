class ImageComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const img = document.createElement("img");
    img.src = this.getAttribute("src") || "";
    img.alt = this.getAttribute("alt") || "";

    const style = document.createElement("style");
    style.textContent = `
            img {
                width: 100%;
                height: auto;
                display: block;
            }
        `;

    shadow.appendChild(style);
    shadow.appendChild(img);
  }

  static get observedAttributes() {
    return ["src", "alt"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    const img = this.shadowRoot?.querySelector("img");
    if (img && oldValue !== newValue) {
      if (name === "src") {
        img.src = newValue;
      } else if (name === "alt") {
        img.alt = newValue;
      }
    }
  }
}

export default ImageComponent;
