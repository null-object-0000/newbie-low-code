class a extends HTMLElement{constructor(){super();const t=this.attachShadow({mode:"open"}),e=document.createElement("div"),n=document.createElement("style");n.textContent=`
            div {
                max-width: 100%;
                height: auto;
            }
        `;const o=document.createElement("slot");t.appendChild(n),e.appendChild(o),t.appendChild(e)}}export{a as default};
