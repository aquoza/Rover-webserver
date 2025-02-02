document.addEventListener("DOMContentLoaded",initTabs);

function initTabs(){
    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tab-content")

    tabs.forEach(function(tab){
        tab.addEventListener("click", function (){
            const content = document.getElementById(this.dataset.tab);
            tabs.forEach(tab => tab.classList.remove('active'));

            contents.forEach(content=>content.classList.remove('active'));

            content.classList.add("active");
            this.classList.add("active");

        });
    });
}