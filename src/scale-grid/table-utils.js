import React from 'react'

export function createTableRows(rows, columns) {
    return rows.map((row, index) => {
        return (
            <tr className="scale-grid__tr" key={'row' + index}>
                {createTableCells(row, index, columns)}
            </tr>
        )
    })
}

export function createTableHeaders(columns) {
    return columns.map((column, index) => {
        return (
            <th className="scale-grid__th scale-grid-cell-defaults" key={'col' + index}>
                <div className="scale-grid__text__content">{column}</div>
            </th>
        )
    })
}

export function createTableHeadersWithId(columns, tableKey) {
    return columns.map((column, index) => {
        return (
            <th id={tableKey + column} className="scale-grid__th scale-grid-cell-defaults" key={'col' + index}>
                <div className="scale-grid__text__content">{column}</div>
            </th>
        )
    })
}

function createTableCells(row, rowIndex, columns) {
    return columns.map((column, index) => {
        return (
            <td className="scale-grid__td scale-grid-cell-defaults" key={'row ' + rowIndex + ' col' + index}>
                <div className="scale-grid__text__content">{row[column]}</div>
            </td>
        )
    })
}

export function createCols(columnCount) {
    const arr = [];
    for (let i = 0; i < columnCount; i++) {
        arr.push(<col width="161"/>);
    }
    return arr;
}