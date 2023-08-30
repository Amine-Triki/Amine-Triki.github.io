let section = document.querySelector(".Skill");
let spans = document.querySelectorAll(".progress span");

window.onscroll = function () {
  if (window.scrollY >= section.offsetTop - 550) {
    spans.forEach((span) => {
      span.style.width = span.dataset.width;
    });
  }
};

let year = new Date().getFullYear();
document.getElementById("Rights").innerHTML = `${year} &copy Amine Triki || All Rights Reserved`;