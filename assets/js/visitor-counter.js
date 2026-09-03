(() => {
    const card = document.querySelector('#visitor-card');
    if (!card) return;

    const siteCode = card.dataset.goatcounterCode;
    if (!siteCode) return;

    const total = document.querySelector('#visitor-total');
    const today = document.querySelector('#visitor-today');
    if (!total || !today) return;

    const counterUrl = `https://${siteCode}.goatcounter.com/counter/TOTAL.json`;
    const storageKey = 'songwon03-visitor-stats';
    const date = new Date();
    const localDate = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');

    let savedCounts = {};

    try {
        savedCounts = JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
        // Visitor statistics are still available when browser storage is blocked.
    }

    const setCount = (element, count) => {
        if (count !== null && count !== undefined) {
            element.textContent = count;
        }
    };

    setCount(total, savedCounts.total);
    setCount(today, savedCounts.today);

    const getCount = async (url) => {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error('Unable to load visitor count');
        const data = await response.json();
        if (data.count === null || data.count === undefined) {
            throw new Error('Visitor count was unavailable');
        }
        return data.count;
    };

    const refreshCount = (element, url, key) => {
        getCount(url)
            .then((count) => {
                setCount(element, count);
                savedCounts[key] = count;
                try {
                    localStorage.setItem(storageKey, JSON.stringify(savedCounts));
                } catch {
                    // Showing the live count does not depend on browser storage.
                }
            })
            .catch(() => {
                // Keep the most recently saved count if the counter is temporarily unavailable.
            });
    };

    // Fetch independently: a temporary failure for today's count must not hide the total.
    refreshCount(total, counterUrl, 'total');
    refreshCount(today, `${counterUrl}?start=${localDate}`, 'today');
})();
