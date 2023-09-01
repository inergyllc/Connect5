class Pager {
    constructor(current, pageSize, total) {
        this.current = current;
        this.pageSize = pageSize;
        this.total = total;
    }

    PutOnPage() {
        const totalPages = Math.ceil(this.total / this.pageSize);
        const navLinksElem = document.querySelector('.nav-links');

        // Remove existing page-numbers
        navLinksElem.querySelectorAll('.page-numbers:not(.prev):not(.next)').forEach(el => el.remove());

        const startPage = Math.max(this.current, 1);
        const endPage = Math.min(startPage + 4, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            const pageElem = document.createElement('a');
            pageElem.className = 'page-numbers';
            pageElem.textContent = i.toString();
            pageElem.href = '';
            if (i === this.current) {
                pageElem.classList.add('current');
                pageElem.removeAttribute('href');
            }
            pageElem.addEventListener('click', this.managePager.bind(this));
            navLinksElem.insertBefore(pageElem, navLinksElem.querySelector('.next'));
        }

        navLinksElem.querySelector('.prev').style.display = (this.current === 1) ? 'none' : '';
        navLinksElem.querySelector('.next').style.display = (this.current === totalPages) ? 'none' : '';
    }

    managePager(event) {
        event.preventDefault();
        const clickedPage = parseInt(event.target.textContent);
        this.current = clickedPage;
        this.PutOnPage();
    }
}

export default Pager;