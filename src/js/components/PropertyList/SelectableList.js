let SelectableList = MakeSelectable(List);

class SelectableList extends Component {

	componentWillMount() {
		this.setState({
			selectedIndex: this.props.defaultValue
		});
	}

	handleRequestChange(index) {
		this.setState({
			selectedIndex: index
		});
	}

	render() {
		return (
			<ComposedComponent
				value={this.state.selectedIndex}
				onChange={this.handleRequestChange}
				>
				{this.props.children}
			</ComposedComponent>
		);
	}
}

SelectableList.propTypes = {
	children: PropTypes.node.isRequired,
	defaultValue: PropTypes.number.isRequired
};

export default SelectableList;
