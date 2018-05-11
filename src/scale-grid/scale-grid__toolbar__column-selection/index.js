import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import './scale-grid__toolbar__column-selection.css';
import ColumnDisplaySwitch from '../scale-grid-column-switch';

export default class ScaleGridColumnSelection extends Component {
    constructor() {
        super();
        this.state = {
            isOpen: false,
            columnsToChange: new Set(),
            currentSwitchesToHide: new Set(),
            lastSavedColumnsHidden: new Set()
        };

        this.onToggle = this.onToggle.bind(this);
        this.onCancelClicked = this.onCancelClicked.bind(this);
        this.onConfirmClicked = this.onConfirmClicked.bind(this);
        this.createListItemFromColumn = this.createListItemFromColumn.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.createListItemsFromHeaders = this.createListItemsFromHeaders.bind(this);
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            isOpen: newProps.isOpen
        });
    }

    onCancelClicked = () => {
        const pendingChanges = Object.assign(this.state.columnsToChange, {});
        const switchesToHide = Object.assign(this.state.currentSwitchesToHide, {});
        pendingChanges.forEach(columnNumber => {
            if (switchesToHide.has(columnNumber)) {
                switchesToHide.delete(columnNumber);
            } else {
                switchesToHide.add(columnNumber);
            }
        });

        this.setState({
            columnsToChange: new Set(),
            currentSwitchesToHide: switchesToHide
        }, () => {
            this.props.closeColumnSelection();
        });
    };

    onConfirmClicked = () => {
        this.props.updateColumnsAppearance(this.state.columnsToChange);
        this.setState({
            columnsToChange: new Set(),
            lastSavedColumnsHidden: this.state.currentSwitchesToHide
        }, () => {
            this.props.closeColumnSelection();
        });
    };

    createListItemsFromHeaders(columns) {
        return columns.map(this.createListItemFromColumn);
    }

    createListItemFromColumn(column, index) {
        const isHidden = this.state.currentSwitchesToHide.has(index + 1);
        return (
            <ListItem
                className={'column-list-item'}
                style={style.listItemStyle}
                innerDivStyle={style.listItemStyle}
                key={this.props.title + column}
                nestedListStyle={style.listItemStyle}
                rightToggle={
                    <ColumnDisplaySwitch
                        columnNumber={index + 1}
                        columnSwitchToggled={this.onToggle}
                        isToggled={!isHidden}
                    />}
                primaryText={column}
            />
        );
    }

    onToggle = (columnNumber, isSwitchedOn) => {
        const currentSwitchesToHide = Object.assign(this.state.currentSwitchesToHide, {});
        if (!isSwitchedOn) {
            currentSwitchesToHide.add(columnNumber);
        } else {
            currentSwitchesToHide.delete(columnNumber);
        }
        const columnsToChange = Object.assign(this.state.columnsToChange, {});
        if (columnsToChange.has(columnNumber)) {
            columnsToChange.delete(columnNumber);
        } else {
            columnsToChange.add(columnNumber);
        }
        this.setState({
            currentSwitchesToHide: currentSwitchesToHide,
            columnsToChange: columnsToChange
        })
    };


    render() {
        const actions = [
            <FlatButton
                label="שמור שינויים"
                primary={true}
                onClick={this.onConfirmClicked}
            />,
            <FlatButton
                label="סגור ללא שינויים"
                onClick={this.onCancelClicked}
            />];

        return (
            <Dialog
                modal={true}
                actions={actions}
                open={this.state.isOpen}
                autoScrollBodyContent={true}
                titleStyle={style.titleStyle}
                contentStyle={style.contentStyle}
                title={"בחר עמודות להצגה בטבלה " + this.props.title}
                actionsContainerStyle={style.actionsContainerStyle}>
                <List className={'column-selection__column-name-list'}>
                    {this.createListItemsFromHeaders(this.props.columns)}
                </List>
            </Dialog>
        )
    }
}

const style = {
    titleStyle: {
        direction: 'rtl'
    },
    actionsContainerStyle: {
        textAlign: 'left'
    },
    contentStyle: {
        textAlign: 'right'
    },
    listItemStyle: {
        display: 'inline-block'
    }
};