import React, {PureComponent} from 'react';
import $ from 'jquery';
import './scale-grid.css';
import './component-styles/th.css';
import './component-styles/td.css';
import './component-styles/tr.css';
import './component-styles/table.css';
import './component-styles/tbody.css';
import './component-styles/thead.css';
import ScaleGridToolbar from './scale-grid__toolbar';
import {getSingleElement} from './dom-utils';
import {createTableRows, createTableHeadersWithId} from './table-utils';

export default class ScaleGrid extends PureComponent {
    constructor() {
        super();
        this.state = {
            rows: [],
            isLocked: false,
            isFetchingRows: false,
            columnsHidden: new Set(),
            scrollEventOngoing: false,
            isColumnDisplayToggleActive: false
        };
        this.onScroll = this.onScroll.bind(this);
        this.onLockClicked = this.onLockClicked.bind(this);
        this.onExportToXLClicked = this.onExportToXLClicked.bind(this);
        this.createGhostRow = this.createGhostRow.bind(this);
        this.hideColumns = this.hideColumns.bind(this);
    }

    componentDidMount() {
        this.setState({isFetchingRows: true});
        this.props.getMoreRows(0, this.props.index, this.props.columns)
            .then(rows => {
                this.setState({
                    rows: rows,
                    isFetchingRows: false
                });
            })
    }


    hideColumns() {
        const columnsHidden = Object.assign(this.state.columnsHidden, {});
        columnsHidden.forEach(columnNumber=> {
            $(`#thead${this.props.tableKey}`).find(`th:nth-child( ${columnNumber} )`).hide();
            $(`#tbody${this.props.tableKey}`).find(`td:nth-child( ${columnNumber} )`).hide();
        });
    }

    render() {
        const cols = this.props.columns.map((column, index) => {
            return <col key={index}/>
        });
        return (
            <div className="scale-grid__container">
                <ScaleGridToolbar
                    count={this.props.count}
                    title={this.props.title}
                    columns={this.props.columns}
                    isLocked={this.state.isLocked}
                    onLockClicked={this.onLockClicked}
                    isLoading={this.state.isFetchingRows}
                    columnsHidden={this.state.columnsHidden}
                    onExportToXLClicked={this.onExportToXLClicked}
                    onColumnsToDisplayChosen={this.onColumnsToDisplayChosen}
                />
                <div className="scale-grid__table-container" onScroll={this.onScroll}>
                    <table dir="rtl" className="scale-grid__thead-table" id={'thead'+this.props.tableKey}>
                        <colgroup>
                            {cols}
                        </colgroup>
                        <thead className="scale-grid__thead">
                        <tr className="scale-grid__tr">
                            {createTableHeadersWithId(this.props.columns, this.props.tableKey)}
                        </tr>
                        {this.createGhostRow()}
                        </thead>
                    </table>
                    <table dir="rtl" className="scale-grid__table" id={'tbody'+this.props.tableKey}>
                        <colgroup>
                            {cols}
                        </colgroup>
                        <tbody className="scale-grid__tbody"

                        >
                        {createTableRows(this.state.rows, this.props.columns)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    onScroll = (event) => {
        if (!this.state.scrollEventOngoing) {
            this.setState({scrollEventOngoing: true});
            if (!this.state.isLocked) {
                const {scrollTop, scrollLeft, offsetHeight, scrollHeight, classList} = event.target;
                if (classList.value === 'scale-grid__table-container') {
                    getSingleElement('.scale-grid__thead').scrollLeft = scrollLeft;
                    if (scrollHeight - offsetHeight - scrollTop < 150) {
                        this.setState({isFetchingRows: true});
                        const currentRowCount = this.state.rows.length;
                        this.props.getMoreRows(currentRowCount, this.props.index, this.props.columns).then((rows) => {
                            this.setState({
                                rows: this.state.rows.concat(rows),
                                isFetchingRows: false,
                                scrollEventOngoing: false
                            }, ()=> this.hideColumns());
                        })
                    }
                }
            }
            this.setState({scrollEventOngoing: false});
        }
    };

    createGhostRow() {
        const trStyle = {
            height: 0,
            visibility: 'hidden'
        };
        return (
            <tr style={trStyle}>
                {this.props.columns.map((column, index) => <td key={index}/>)}
            </tr>
        )
    }



    onColumnsToDisplayChosen = (columnsChanged) => {
        const columnsHidden = Object.assign(this.state.columnsHidden, {});
        columnsChanged.forEach(columnNumber => {
            if (columnsHidden.has(columnNumber)) {
                columnsHidden.delete(columnNumber);
                $(`#tbody${this.props.tableKey}`).find(`td:nth-child( ${columnNumber} )`).show();
                $(`#thead${this.props.tableKey}`).find(`th:nth-child( ${columnNumber} )`).show();
            } else {
                columnsHidden.add(columnNumber);
                $(`#thead${this.props.tableKey}`).find(`th:nth-child( ${columnNumber} )`).hide();
                $(`#tbody${this.props.tableKey}`).find(`td:nth-child( ${columnNumber} )`).hide();
            }
            // $('td:nth-child(2),th:nth-child(2)').hide();

            // const tbodyQuery = `#tbody${this.props.tableKey} td:nth-child( ${columnNumber} )`;
            // const theadQuery = `#thead${this.props.tableKey} th:nth-child( ${columnNumber} )`;
            // console.log(tbodyQuery);
            // const tableCells = getElements(tbodyQuery);
            // const tableHeaders = getElements(theadQuery);
            // tableCells.forEach(td => toggleElementDisplay(td, 'table-cell'));
            // tableHeaders.forEach(th => toggleElementDisplay(th, 'table-cell'));
        });
        this.setState({columnsHidden: columnsHidden});
    };

    onExportToXLClicked = (event) => {
        console.log('export to excel please the app+table: ' + this.props.tableKey + ' ' + this.props.title + ' with ' + this.props.count + ' rows.');
        event.preventDefault();
    };


    onLockClicked = (event) => {
        event.preventDefault();
        this.setState({isLocked: !this.state.isLocked});
    };
}