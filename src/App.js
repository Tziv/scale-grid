import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import React, {Component} from 'react';
import './App.css';

import ResultRenderer from './result-renderer/result-renderer';


function getColumns() {
    const cols = [];
    for (let i = 0; i < 20; i++) {
        cols.push('עמודה' + (i + 1));
    }
    return cols;
}

class App extends Component {

    constructor() {
        super();
        this.state = {
            tablesToShow: [],
            tables: [],
            ongoingScrollEvent: false
        };
        this.onScroll = this.onScroll.bind(this);
    }

    createTables() {
        const tables = [];
        for (let i = 0; i < 10; i++) {
            tables.push({
                index: i,
                columns: getColumns(),
                title: 'Table Name',
                count: 25000,
                tableKey: 'buzzy' + i
            });
        }
        return tables;
    }


    componentDidMount() {
        const tables = this.createTables();
        const tablesToShow = [tables.shift(), tables.shift(), tables.shift()];
        this.setState({tablesToShow: tablesToShow, tables: tables}, ()=> {
            new Promise(resolve=>setTimeout(resolve(), 3000))
                .then(()=>
                    window.addEventListener('scroll', this.onScroll))
        });
    }

    onScroll() {
        if (!this.state.ongoingScrollEvent && this.state.tables.length) {
            this.setState({ongoingScrollEvent: true});
            const tables = Object.assign(this.state.tables, {});
            const tablesToShow = Object.assign(this.state.tablesToShow, {});
            const {offsetHeight, clientHeight} = document.documentElement;
            if (offsetHeight - clientHeight - window.scrollY < 150) {
                const tableToAdd = tables.shift();
                tablesToShow.push(tableToAdd);
                this.setState({
                    tables: tables,
                    tablesToShow: tablesToShow
                })
            }
            this.setState({ongoingScrollEvent: false});
        }
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <div className="App"
                     style={{}}>
                    <ResultRenderer
                        tables={this.state.tablesToShow}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
