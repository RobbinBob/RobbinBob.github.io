class dropdown extends HTMLElement {
    content;
    button;
    image;

    toggleFold(dropdown) {
        var isExpanded = dropdown.content.style.height && dropdown.content.style.height !== "0px";   
        dropdown.content.style.height = isExpanded ? "0" : dropdown.content.scrollHeight + "px";
        dropdown.image.classList.toggle("rotated", !isExpanded);
    }

    connectedCallback() { 
        if(document.readyState === "loading") { 
            document.addEventListener("DOMContentLoaded", () => {
            // Store the starting html because we will need to add it to the collapsible div later
            var containedHTML = this.innerHTML;
            var toggleString = this.getAttribute("title") ?? "View fold";
    
            this.innerHTML = `
            <div class="collapsible">
                <button class="collapsible-toggle">
                    <img class="toggle-img" src="/src/images/Arrow.png" alt="Toggle fold">
                    <div id="rectangle" class="toggle-bar" style="order: 1"></div>
                    <p class="toggle-header">${toggleString}</p>
                    <div id="rectangle" class="toggle-bar" style="order: 3"></div>
                </button>
                <div class="collapsible-content">${containedHTML}</div>
            </div>
            <style>
                .toggle-img { 
                    order: 0;
                    width: 18px;
                    height: 18px;
                    flex: 0 1 auto;
                    align-self: auto;
                    rotate: 90deg;
                    transition: rotate 0.5s;
                }
                .toggle-img.rotated { 
                    rotate: 180deg;
                }
                .toggle-bar { 
                    order: 1;
                    height: 1px;
                    flex: 1 1 25px;
                    align-self: center;
                    background-color: #ffffff;
                }
                .toggle-header { 
                    order: 2;
                    flex: 0 1 auto;
                    height: 100%;
                    align-self: center;
                    font-size: 14px;
                    color: #ffffff;
                    white-space: nowrap;
                    overflow: hidden;
                }
                .collapsible-toggle {
                    width: 100%;
                    height: 18px;
                    color: transparent;
                    background-color: transparent;
                    outline: none;
                    border: none;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-contents: center;
                    align-contents: stretch;
                    align-items: baseline;
                }
                .collapsible-toggle:hover { 
                    background-color: transparent;
                    outline: none;
                    border: none;
                }
                .collapsible-content { 
                    padding-left: 18px;
                    padding-right: 18px;
                    display: block;
                    overflow: hidden;
                    height: 0px;
                    transition: height ${this.getAttribute("speed") ?? '0.2s'};
                }
                .collapsible-content.expanded { 
                    height: auto;
                }
                .collapsible { 
                    box-sizing: border-box;
                    color: #f1f1f1;
                    width: 100%;
                    border: none;
                    text-align: left;
                    outline: none;
                    font-size: 15px;
                }
            </style>
            `;

            this.content = this.querySelector(".collapsible-content");
            this.button = this.querySelector(".collapsible-toggle");
            this.image = this.querySelector(".toggle-img");
    
            if(this.content == null) { 
                console.log("Couldnt find content");
                return;
            }
            if(this.button == null) {
                console.log("Couldnt find button");
                return;
            }
            if(this.button == null) { 
                console.log("Couldnt find image");
                return;
            }
    
            if(this.button != null) {
                this.button.addEventListener("click", () => { this.toggleFold(this); });
            }
            });
        }
    }
}
customElements.define('custom-dropdown', dropdown);