import './scale-grid__toolbar.css';
import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Lock from 'material-ui/svg-icons/action/lock';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import ScaleGridColumnSelection from '../scale-grid__toolbar__column-selection';

export default class ScaleGridToolbar extends Component {
    constructor() {
        super();
        this.state = {
            isLocked: false,
            isLoading: false,
            isColumnSelectionModalOpen: false,
            isColumnDisplayToggleActive: false
        };
        this.onCloseColumnSelectionClicked = this.onCloseColumnSelectionClicked.bind(this);
    }

    onOpenColumnSelectionClicked = () => {
        this.setState({isColumnSelectionModalOpen: true});
    };

    onCloseColumnSelectionClicked = () => {
        this.setState({isColumnSelectionModalOpen: false});
    };

    componentWillReceiveProps(newProps) {
        this.setState({
            isLocked: newProps.isLocked,
            isLoading: newProps.isLoading
        });
    }

    render() {
        let loadingIndicator, lockedIndicator = null;
        if (this.state.isLoading) {
            loadingIndicator =
                <div className="loading-indicator__container">
                    <RefreshIndicator
                        size={40}
                        left={70}
                        top={0}
                        status="loading"
                        style={style.loading}
                    />
                </div>
        }

        if (this.state.isLocked) {
            lockedIndicator =
                <div className="lock-indicator__container">
                    <IconButton
                        tooltip="פתח נעילת טבלה"
                        tooltipPosition="top-center"
                        onClick={this.props.onLockClicked}>
                        <Lock/>
                    </IconButton>
                </div>
        } else {
            lockedIndicator =
                <div className="lock-indicator__container">
                    <IconButton
                        tooltip="נעל טבלה"
                        tooltipPosition="top-center"
                        onClick={this.props.onLockClicked}
                    >
                        <LockOpen/>
                    </IconButton>
                </div>
        }

        return (
            <Toolbar>
                <ToolbarGroup firstChild={true}>
                    {lockedIndicator}
                <RaisedButton
                    label="ייצא לאקסל"
                    onClick={this.props.onExportToXLClicked}
                    style={style.button}
                    icon={<FileDownload/>}
                />
                </ToolbarGroup>
                <ToolbarGroup firstChild={true}>
                    {loadingIndicator}
                </ToolbarGroup>
                <ToolbarGroup>
                    <RaisedButton
                    label="בחר עמודות"
                    primary={true}
                    onClick={this.onOpenColumnSelectionClicked}
                    style={style.button}
                    />
                    <ScaleGridColumnSelection
                        title={this.props.title}
                        columns={this.props.columns}
                        columnsHidden={this.props.columnsHidden}
                        isOpen={this.state.isColumnSelectionModalOpen}
                        closeColumnSelection={this.onCloseColumnSelectionClicked}
                        updateColumnsAppearance={this.props.onColumnsToDisplayChosen}
                        />
                    <div className="table-details">
                        <span className="table-details__row-count">
                            ({this.props.count})
                        </span>
                        <span className="table-details__table-title action-link">
                            {this.props.title}
                        </span>
                    </div>
                </ToolbarGroup>
            </Toolbar>
        )
    }
}

const style = {
    loading: {
        display: 'inline-block',
        position: 'relative',
        paddingTop: '4px',
        paddingBottom: '4px'
    },
    lockIcon: {
        width: 48,
        height: 48
    },
    button: {
        margin: 12
    },
    autoComplete: {
        direction: 'rtl',
        position: 'relative',
        marginBottom: 15
    }
};