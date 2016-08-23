
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
            totalDebt: 0,
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
                        <p>total: {this.state.totalDebt}</p>
                        {this.state.list}
                        <select className="ui dropdown" ref={value => this._to = value} >
                            <p>\nGive money to</p>
                            {arr}
                        </select>
                        <div class="ui input">
                            <input className="ui input" type="text" placeholder="money..." ref={(input) => this._amount = input}/>
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
        ref = new Firebase("https://givememymoney-d0e42.firebaseio.com/" + _to);
        ref.update({
            [_from]: _amount
        });
    }
    _handleClick() {
        this.setState({
            clicked: !this.state.clicked
        });
    }



    _fetchIndividualList() {
        let listRef = new Firebase("https://givememymoney-d0e42.firebaseio.com/" + this.props.name);
        listRef.on('value', function (snapshot) {
            if (snapshot.val() != null) {
                let data = snapshot.val();
                let keys = Object.keys(data);
                let debt = 0;
                for (var key in data) {
                    debt += Number(data[key]);
                }

                this.setState({
                    list: keys.map(
                        arg => { return <div><p>name: {arg}, debt: {data[arg]}</p></div> }),
                    totalDebt: debt
                });

            }
        }.bind(this));
    }


}

ReactDOM.render(
    <People />,
    document.getElementById('my-app')
);