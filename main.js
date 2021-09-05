const observer = new IntersectionObserver(entries => {
    entries.forEach((e) => {
        const table = e.target.getElementsByClassName("articleTable")[0];

        if(e.isIntersecting) {
            table.classList.add("articleTD-animate");
            return;
        }

        if (e.boundingClientRect.top >! 0) {
            //Below
            table.classList.remove("articleTD-animate");
        }
    })
})

const articles = document.getElementsByClassName("article");

for(let i = 0; i < articles.length; i++) {
    observer.observe(articles[i]);
}