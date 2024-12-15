class spacer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<div style="width: calc(100% - 50px); height: 2px; background-color:rgb(99, 99, 99);"></div>';
        this.setAttribute('style', 'width: 100%; margin-top: 5px; margin-bottom: 5px');
        this.setAttribute('class', 'flex-container-row-nowrap-center-center');
    }
}
customElements.define('custom-spacer', spacer);