import './result-renderer.css';
import React, {Component} from 'react';
import ScaleGrid from '../scale-grid/index';

export default class ResultRenderer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tables: props.tables
        }
    }


    componentWillReceiveProps(newProps) {
        this.setState({tables: newProps.tables});
    }

    render() {
        const grids = this.state.tables.map((table, index) => {
            return(this.createGrid(table, index));
        });
        return(
            <div
                className="result-renderer"
            >
                {grids}
            </div>);
    }

    createGrid(table, index) {
        return <ScaleGrid
            key={index}
            index={index}
            title={table.title}
            count={table.count}
            columns={table.columns}
            tableKey={table.tableKey}
            getMoreRows={this.getMoreRows}
        />
    }

    getMoreRows (currentRowCount, tableIndex, columns) {
        const rows = [];
        return new Promise(resolve => {
            for (let i=0; i< 15; i++) {
                rows.push(getRow(i+currentRowCount, columns));
            }
            resolve(rows);
        });
    }
}

function getRow(currentRowCount, columns) {
    let row = {};
    for (let i = 0; i < columns.length; i++) {
        row[columns[i]] = 'שורה ' + (currentRowCount + 1) + ' ' + columns[i]
    }
    return row;
}

