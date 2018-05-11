import React, {Component} from 'react';
import Toggle from 'material-ui/Toggle';

export default class ColumnDisplaySwitch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggled: props.isToggled
        };
        this.onToggle = this.onToggle.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({isToggled: newProps.isToggled});

    }

    onToggle = (event, isInputChecked) => {
        this.setState({isToggled: isInputChecked}, ()=> {
            this.props.columnSwitchToggled(this.props.columnNumber, isInputChecked);
        });
    };

    render() {
        return(<Toggle
            onToggle={this.onToggle}
            toggled={this.state.isToggled}
        />);
    }
}