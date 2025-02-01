class c extends HTMLElement{constructor(){super();const e=this.attachShadow({mode:"open"}),s=document.createElement("img");s.src=this.getAttribute("src")||"",s.alt=this.getAttribute("alt")||"";const t=document.createElement("style");t.textContent=`
            img {
                width: 100%;
                height: auto;
                display: block;
            }
        `,e.appendChild(t),e.appendChild(s)}static get observedAttributes(){return["src","alt"]}attributeChangedCallback(e,s,t){var a;const o=(a=this.shadowRoot)==null?void 0:a.querySelector("img");o&&s!==t&&(e==="src"?o.src=t:e==="alt"&&(o.alt=t))}}export{c as default};
