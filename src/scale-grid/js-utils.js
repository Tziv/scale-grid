export function getIteratorValues(iterator) {
    let done = false;
    const valueList = [];
    while (!done) {
        const next = iterator.next();
        done = next.done;
        if (!done) {
            valueList.push(next.value);
        }
    }
    return valueList;
}