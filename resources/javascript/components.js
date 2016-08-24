
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
            let arr = this.props.nameList.map((arg, index) => { return (<option value={index}>{arg}</option>) });
            return (
                <div>
                    <button className="ui primary button container" onClick={this._handleClick.bind(this) }>{this.props.name}</button>
                    <div className="ui segment">
                        {this.state.list}
                    </div>
                    <form className="pressure-form" onSubmit={this._handleSubmit.bind(this) }>
                        <select className="ui dropdown" ref={value => this._to = value} >
                            <option value="">Name</option>
                            {arr}
                        </select>
                        <div className="ui action input">
                            <input type="text" placeholder="money..." ref={(input) => this._amount = input}/>
                            <div className="ui button" type="submit">
                                Send
                            </div>
                        </div>
                    </form>


                </div>
            );
        }
        else
            return (
                <div>
                    <button className="ui basic button container" onClick={this._handleClick.bind(this) }>{this.props.name}</button>

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

    _handleDeleteClick() {
        let _from = this.props.name;
        let _to = this._to.value;
        let _amount = this._amount.value;
        let ref = new Firebase("https://givememymoney-d0e42.firebaseio.com/" + _from);
        ref.update({
            [_to]: 0
        });
        ref = new Firebase("https://givememymoney-d0e42.firebaseio.com/" + _to);
        ref.update({
            [_from]: 0
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
                        arg => {
                            return (
                                <div className="ui segment">
                                    <i className="large remove circle icon"></i>
                                    <div classname="content">
                                        name: {arg}, debt: {data[arg]}</div>
                                </div>
                                )}),
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