class IndexComponent extends HTMLElement {
    constructor() {
        super();

        // Create a shadow root
        const shadow = this.attachShadow({ mode: 'open' });

        // Create a container div
        const container = document.createElement('div');
        container.setAttribute('class', 'demo');

        // Create a button
        const button = document.createElement('button');
        button.textContent = `Remote Count is: ${this.getAttribute('count')}`;

        // Append the button to the container
        container.appendChild(button);

        // Append the container to the shadow root
        shadow.appendChild(container);

        // Add styles to the shadow root
        const style = document.createElement('style');
        style.textContent = `
            .demo {
                padding: 22px 24px;
                box-shadow: 0 3px 12px rgba(0, 0, 0, .07), 0 1px 4px rgba(0, 0, 0, .07);
                transition: background-color .5s ease;
            }

            .demo button {
                background-color: #f1f1f1;
                transition: background-color .5s;
                padding: 5px 12px;
                border: 1px solid rgba(60, 60, 60, .29);
                border-radius: 8px;
                font-size: 0.9em;
                font-weight: 600;
                cursor: pointer;
                height: 36px;
            }
        `;
        shadow.appendChild(style);

        // Initial count value
        this.count = parseInt(this.getAttribute('count'), 10);

        // Button click event
        button.addEventListener('click', () => {
            this.count++;
            button.textContent = `Remote Count is: ${this.count}`;
        });
    }
}

// Define the new element
customElements.define('h5lc-java-script-demo-remote', IndexComponent);