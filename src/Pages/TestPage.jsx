import React, { Component } from 'react';
import { connect } from 'react-redux';

class Test extends Component {
    constructor(props) {
        super(props)
        this.state = {f:''}
    }

    render() {
        return (
            <div>
                {this.props.userLoginID}
                {this.state.f}
                <button onClick={()=>this.setState({f:'sss'})}> OOkkk</button>
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

const TestPage = connect(mapStateToprops)(Test);
export default TestPage;