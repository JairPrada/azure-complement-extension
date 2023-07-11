setTimeout(() => {
    function copyToClipBoard(texto) {
        const temporalElement = document.createElement('textarea');
        temporalElement.value = texto;
        document.body.appendChild(temporalElement);
        temporalElement.select();
        document.execCommand('copy');
        document.body.removeChild(temporalElement);
        alert("Copiado")
    }
    const variablesSection = document.querySelector("#lib-vg-header-variables");
    const variables = document.querySelectorAll("pre");
    var fileEnv = "";
    variables.forEach((element, index) => {
        if (index % 2 == 0) {
            fileEnv += element.textContent;
        } else {
            fileEnv += ` = ${element.textContent}
`;
        }
    });
    function copyInfo() {
        copyToClipBoard(fileEnv);
    }
    if (variablesSection) {
        variablesSection.style = "display:flex; width:100%; justify-content:space-between"
        variablesSection.addEventListener("click", copyInfo)
        variablesSection.innerHTML += `
        <div style="display:flex; margin:0px 10px; cursor:pointer; justify-content:center; align-items:center">
            <i role="presentation" aria-hidden="true" class="ms-CommandBarItem-icon itemIcon_278ff396 ms-CommandBarItem-iconColor itemIconColor_278ff396 vss-PivotBar--commandBar-icon vss-Icon vss-Icon--bowtie bowtie-edit-copy root-45"></i>
        </div>
        `;
    }
}, 3000)
