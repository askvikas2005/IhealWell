import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom"

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = { f: '' }
    }

    check = () => {
        const { history } = this.props
        history.push('/test')
    }

    render() {
        return (
            <div>
                {this.props.userLoginID}
                {this.state.f}
                <button onClick={() => this.check()}>OOk</button>
            </div>
        )
    }
}
function mapStateToprops(state) {
    return {
        userLoginID: state.userProfileReducer.userLoginID,
        searchCriteria: state.searchCriteriaReducer,
    };
}

const H = withRouter(Home);

const HomePage = connect(mapStateToprops)(H);
export default HomePage;