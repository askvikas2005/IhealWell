import React, { Component } from 'react';
import { connect } from 'react-redux';
import UrlConstants from '../../UrlConst';
import HttpService from '../../Services/HttpService';
import ReduxService from '../../Services/redux.service';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import './PatientListM.css'
import Searchbar1 from './Searchbar1.component'

class PatientListM extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchText: '',
            patientList: [],
            listType: {},
            isFinished: false,
            pageNo: 1,
            getting: false,
            columns: [
                { id: 'firstName', label: 'First Name', minWidth: 170 },
                { id: 'lastName', label: 'Last Name', minWidth: 170 },
                {
                    id: 'density',
                    label: 'Density',
                    minWidth: 170,
                    align: 'right',
                    format: (value) => value.toFixed(2),
                },
            ]
        }
    }




    componentDidMount = () => {
        localStorage.removeItem('fromAddPatient');
        localStorage.removeItem('cronaPatientId');
        let listType = JSON.parse(localStorage.getItem('patientSearchCriteria'));
        this.setState({ listType })
        this.startFlow();
        document.addEventListener('scroll', this.trackScrolling);

    }
    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
    }

    startFlow = async () => {
        this.setState({
            searchText: '', patientList: [], isFinished: false, pageNo: 1, getting: false
        })
        localStorage.removeItem('cronaPatientId');
        this.getpatientList()
    }

    isBottom(el) { return el.getBoundingClientRect().bottom <= window.innerHeight; }

    trackScrolling = () => {
        const wrappedElement = document.getElementById('header');
        if (this.isBottom(wrappedElement))
            if (!this.state.getting)
                this.loadMore();
    };

    getpatientList = async () => {
        try {
            let body = JSON.parse(localStorage.getItem('patientSearchCriteria'))
            if (this.state.searchText.length > 2) {
                body.searchText = this.state.searchText
            } else {
                body.searchText = undefined
            }
            body.pageNo = this.state.pageNo;
            body.pageSize = 30;
            let url = UrlConstants.baseUrl + UrlConstants.getPatient;
            this.setState({ getting: true })
            let response = await HttpService.posts(url).post(body);
            this.setState({ getting: false })
            if (response.status === 200) {
                if (response.data.status === 'SUCCESS') {
                    if (!response.data.data) this.setState({ isFinished: true });
                    if (response.data.data.length < body.pageSize - 1) { this.setState({ isFinished: true }) }
                    if (response.data.data) {
                        this.setState({ patientList: [...this.state.patientList, ...response.data.data] })
                    }
                }
            } else {
                alert('something went wrong' + response.status);
            }
        } catch (error) {
            this.setState({ getting: false })
            if (error.response) {
                if (error.response.status === 401) {
                    if (error.response.data.oauth2ErrorCode === 'invalid_token') {
                        alert('Your session is expired,please login again');
                        ReduxService.logout();
                    }
                } else { alert('Network Error Please Try Later'); }
            } else {
                this.setState({ getting: false, })
               // alert('Please Try Later')
            }
        }
    }

    gotoPatient = patient => {
        if (!ReduxService.trackreScreenGuard(patient.patientStatus))
            return;
        localStorage.removeItem('fromAddPatient');
        localStorage.setItem('cronaPatientId', `${patient.cronaPatientId}`)
        this.props.history.push('/tracker')
    }

    searchPatient = async (searchText) => {
        await this.setState({ searchText })
        if (searchText.length > 2) {
            await this.setState({ patientList: [], pageNo: 1 })
            if (!this.state.getting) this.getpatientList();
        }
    }

    loadMore() {
        let pageNo = this.state.pageNo + 1;
        if (!this.state.isFinished)
            this.setState({ pageNo }, () => { this.getpatientList() })
    }

    render() {
        const { patientList, getting, columns, listType } = this.state;
        return (
            <div style={{ flex: 1, backgroundColor: 'aliceblue' }}>
                <div style={{ textAlign: 'center', margin: '10px' }}>
                    {/* {listType.status || listType.testStatus} Patients */}
                </div>
                <div className="searchPt">
                    <Searchbar1 />
                </div>

                <div style={{ flex: 1, padding: 10, paddingTop: 0 }}>
                    {
                        (!getting && patientList.length === 0) ?
                            <span style={{ alignSelf: 'center', padding: 10, color: 'red' }}>No Records Found</span> : null
                    }
                    <div id="header" style={{ marginLeft: '10%', width: '80%' }}>
                        {(patientList.length > 0 ?
                            patientList.map(p => {
                                return <div
                                    className="patientCard"
                                    onClick={() => this.gotoPatient(p)}
                                    key={p.cronaPatientId}>
                                    <div className="patientNameCard">
                                        <div className="patientName">{p.firstName + ' ' + p.lastName}</div>
                                        <div className="mobile">{p.phoneMobile}</div>
                                    </div>
                                    <div className="patientNameCard">
                                        {p.age ? <div className="dob">{p.age} Years old</div> : null}
                                        <div className="gender">{p.gender}</div>
                                    </div>
                                    <div className="medicalStatus">
                                        <div>
                                            {p.medicalStatus ? <span className="dob">Severity:</span> : ''}{' '}{p.medicalStatus}
                                        </div>
                                        {/* <div>
                                            {p.comorbidity ? <span className="dob">Comorbidities:</span> : ''}
                                            {p.comorbidity.split('|').map((c, i) => {
                                                return <span>{c}{','}</span>
                                            })}
                                        </div> */}
                                    </div>
                                    <div className="nextDiv">
                                        <NavigateNextIcon />
                                    </div>
                                </div>
                            })
                            : null)}
                    </div>
                    {
                        getting ?
                            <div style={{ textAlign: 'center' }}>
                                <CircularProgress color="inherit" size={20} />
                            </div>
                            : null
                    }
                </div>
            </div>
        );
    }
}
function mapStateToprops(state) {
    return {
        userLoginID: state.userProfileReducer.userLoginID,
    };
}

export default connect(mapStateToprops)(PatientListM);
