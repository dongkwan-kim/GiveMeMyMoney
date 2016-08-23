
class People extends React.Component {

    constructor() {
        super();
        this.state = {
            list: []
        };
    }

    componentWillMount() {
        this._fetchList();
    }

    render() {
        const contents = this._getList();
        return (
            <div>{contents}</div>
        )
    }

    _getList() {
        return this.state.list.map(arg => <Person name={arg} nameList={this.state.list}/>);
    }

    _fetchList() {
        var listRef = new Firebase("https://givememymoney-d0e42.firebaseio.com/users");
        listRef.on('value', function (snapshot) {

            //var arr = Object.keys(snapshot.val()).map(function (_) { return (snapshot.val()[_]) });

            this.setState({ list: snapshot.val() })
        }.bind(this));
    }
}


class Person extends React.Component {
    constructor() {
        super();
        this.state = {
            clicked: false,
            list: []
        };
    }

    componentWillMount() {
        this._fetchIndividualList();
    }

    render() {
        if (this.state.clicked) {
            let arr = this.props.nameList.map(arg => { return <option value={arg}>{arg}</option> });
            return (
                <div>
                    <button onClick={this._handleClick.bind(this) }>{this.props.name}</button>
                    <form className="pressure-form" onSubmit={this._handleSubmit.bind(this) }>
                        <label>Take Your Money Back!</label>
                        <div className="pressure-form-fields">
                            {this.state.list}
                            <select class="ui dropdown" ref={value => this._to = value} >
                                {arr}
                            </select>

                            <div class="ui input">
                                <input type="text" placeholder="money..." ref={(input) => this._amount = input}/>
                            </div>

                        </div>
                        <div className="pressure-form-actions">
                            <button type="submit">
                                Ask for my Money
                            </button>
                        </div>
                    </form>


                </div>
            );
        }
        else
            return (
                <div>
                    <button onClick={this._handleClick.bind(this) }>{this.props.name}</button>

                </div>
            );
    }

    _handleSubmit(event) {
        event.preventDefault();
        let _from = this.props.name;
        let _to = this._to.value;
        let _amount = this._amount.value;
        var ref = new Firebase("https://givememymoney-d0e42.firebaseio.com/" + _from);
        ref.update({
            [_to]: _amount
        });
    }
    _handleClick() {
        this.setState({
            clicked: !this.state.clicked
        });
    }

    _fetchIndividualList() {
        //var arr = Object.keys(snapshot.val()).map(function (_) { return (snapshot.val()[_]) });

        let listRef = new Firebase("https://givememymoney-d0e42.firebaseio.com/" + this.props.name);
        listRef.on('value', function (snapshot) {
            if (snapshot.val() != null) {
                //this.setState({ list: Object.keys(snapshot.val()).map(arg => { return { key: arg, val: snapshot.val()[arg] } }) });
                this.setState({ list: Object.keys(snapshot.val()).map(arg => { return <div><p>name: {arg}</p><p>debt: {snapshot.val()[arg]}</p></div> }) });

            }
        }.bind(this));
    }
}

ReactDOM.render(
    <People />,
    document.getElementById('my-app')
);