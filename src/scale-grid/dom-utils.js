export function getElements(selector, context) {
    return (context || document).querySelectorAll(selector);
}

export function getSingleElement(selector, context) {
    return (context || document).querySelector(selector);
}

export function toggleElementDisplay(el, visibleDisplayValue) {
    const display = (window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle).display;
    if (display === 'none') el.style.display = visibleDisplayValue;
    else el.style.display = 'none';
}

export function jumpToColumn(columnName, tableKey) {
    getSingleElement(`th#${tableKey+columnName}`).scrollIntoView({behavior: "smooth", inline: "center"});
}