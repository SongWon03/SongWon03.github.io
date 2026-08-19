(() => {
    const card = document.querySelector('#visitor-card');
    if (!card) return;

    const siteCode = card.dataset.goatcounterCode;
    if (!siteCode) return;

    const total = document.querySelector('#visitor-total');
    const today = document.querySelector('#visitor-today');
    const counterUrl = `https://${siteCode}.goatcounter.com/counter/TOTAL.json`;
    const date = new Date();
    const localDate = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');

    const getCount = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Unable to load visitor count');
        return response.json();
    };

    Promise.all([
        getCount(counterUrl),
        getCount(`${counterUrl}?start=${localDate}`),
    ])
        .then(([totalData, todayData]) => {
            total.textContent = totalData.count;
            today.textContent = todayData.count;
        })
        .catch(() => {
            card.classList.add('visitor-card-unavailable');
        });
})();
