import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom"
import { Button } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Card from '@material-ui/core/Card';
import './TeleCaller.css'
import ReduxService from '../../Services/redux.service';
import UrlConstants from '../../UrlConst';
import HttpService from '../../Services/HttpService';
import CircularProgress from '@material-ui/core/CircularProgress';
import Searchbar from '../../Components/SearchBar/Searchbar.component'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';
const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));
 //const classes1 = useStyles();
class TeleCaller extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchText: '',
            gettingPatients: false,
            gettingDash: false, patientList: [],
            patientRecords: [],
            patientStatus: []
        }
  
    }
    
    componentDidMount() {
        localStorage.removeItem('fromAddPatient');
        localStorage.removeItem('cronaPatientId');
        localStorage.removeItem('patientSearchCriteria');
        this.getProfile()
    }

   
    addPatient = () => this.props.history.push('./addpatient')




    getProfile = async () => {
        let body = {
            accessToken: localStorage.getItem('accessToken'),
            userLoginID: localStorage.getItem('userLoginID')
        };
        let creadentials = {
            ...body, refreshToken: localStorage.getItem('refreshToken'), authorities: localStorage.getItem('authorities'),
        };
        ReduxService.login(creadentials);
        try {
            let url = UrlConstants.baseUrl + UrlConstants.userProfile;
            this.setState({ gettingDash: true })
            let response = await HttpService.posts(url).post(body);
            if (response.status === 200) {
                if (response.data.status === 'SUCCESS') {
                    if (response.data.data) {
                        let x = response.data.data[0];
                        let userProfile = {
                            emailID: x.emailID, firstName: x.firstName, fullName: x.fullName,
                            lastName: x.lastName, userID: x.userID, phoneMobile: x.phoneMobile,
                            practiceTeamID: x.practiceTeamID, prefix: x.prefix, profilePicURL: x.profilePicURL, orgID: x.orgID,
                        };
                        ReduxService.setProfile(userProfile);
                        localStorage.setItem('userProfile', JSON.stringify(userProfile))
                        localStorage.setItem('userID', x.userID)
                        this.getDash()
                    } else {
                        this.setState({ gettingDash: false })
                    }
                } else {
                    this.setState({ gettingDash: false })
                }
            } else {
                this.setState({ gettingDash: false })
                alert('something went wrong' + response.status);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    if (error.response.data.oauth2ErrorCode === 'invalid_token') {
                        alert('Your session is expired,please login again');
                        ReduxService.logout();
                    }
                } else { alert('Network Error Please Try Later'); }
            } else {
                this.setState({ gettingDash: false })
                console.log('88');
                console.log(error);
                alert('No Internet,Please Enable Internet');
            }
        }
    }

    getDash = async () => {
        try {
            let body = { userId: localStorage.getItem('userID') }
            let url = UrlConstants.baseUrl + UrlConstants.getDashboard;
            this.setState({ gettingDash: true })
            let response = await HttpService.posts(url).post(body);
            this.setState({ gettingDash: false })
            if (response.status === 200) {
                if (response.data.status === 'SUCCESS') {
                    if (response.data.data) {
                        console.log(response.data.data);
                        let statusCount = response.data.data.statusCount;
                        let testCount = response.data.data.testCount;
                        let patientStatus = [], patientRecords = [];
                        if (statusCount) {
                            for (const key in statusCount) {
                                if (statusCount.hasOwnProperty(key)) {
                                    let s = { status: key, count: statusCount[key] }
                                    patientStatus.push(s)
                                }
                            }
                            this.setState({ patientStatus })
                        }
                        if (testCount) {
                            for (const key in testCount) {
                                if (testCount.hasOwnProperty(key)) {
                                    let s = { status: key, count: testCount[key] }
                                    patientRecords.push(s)
                                }
                            }
                            this.setState({ patientRecords })
                        }
                    }
                }
            } else {
                alert('something went wrong' + response.status);
            }
        } catch (error) {
            this.setState({ gettingDash: false })
            if (error.response) {
                if (error.response.status === 401) {
                    alert('Your session is expired,please login again');
                    ReduxService.logout();
                } else { alert('Network Error Please Try Later'); }
            } else {
                this.setState({ gettingDash: false })
                console.log('148');
                console.log(error);
                alert('No Internet,Please Enable Internet');
            }
        }
    }


    goToPatientList = (x, forType) => {
        let searchCriteria = {
            userId: localStorage.getItem('userID'),
            [forType]: x.status,
        }
        localStorage.setItem('patientSearchCriteria', JSON.stringify(searchCriteria));
        this.props.history.push('/enrollpatient')
    }

    renderPatientRecords = (statusArray, forType) => {
        return (
            statusArray.map((x, i) => {
                return <Card key={i + forType}
                    className='dashCard'
                    onClick={() => this.goToPatientList(x, forType)}
                >
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>{x.count}</div>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>{x.status}</div>
                </Card>
            })
        )
    }
    //--------------vikas code start---------------------------
    renderPatientRecordsByHCopen = (statusArray, forType) => {
        return (
            statusArray.map((x, i) => {
                return <Card key={i + forType}
                    className='dashCard'
                    onClick={() => this.goToPatientList(x, forType)}
                >
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>{x.count}</div>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>Registerd Patients</div>
                </Card>
            })
        )
    }
    renderPatientRecordsByHCclose = () => {
        return (
                <Card className='dashCard'>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>0</div>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>Total Beds Allocated</div>
                </Card>)
        
    }
    renderPatientRecordsByHCab = () => {
        return (
                <Card className='dashCard'>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>0</div>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>Resend Form</div>
                </Card>)
        
    }
    //----------------------------------------------------------

    render() {
        const { patientRecords, patientStatus, gettingDash } = this.state;
        
        return (
            <div>
                {gettingDash ?
                    <div style={{ textAlign: 'center', margin: '50px' }}>
                        <CircularProgress />
                    </div> :
                    <React.Fragment>
                        {/* <div className="searchPt">
                            <Searchbar />
                        </div> */}
                        <div style={{ padding: 10, paddingTop: 20 }}>
                                <div className='blockPanel'>
                                    <span className="panelTitle">Search Paitent By Date</span>
                                </div>
                        </div>
                        <div className='blocksContainer1'>
                                <TextField
                                    id="date1"
                                    label="Start Date"
                                    type="date"
                                    defaultValue="2017-05-24"
                                    className={styles.TextField}
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                /> <div className='blocksContainer1'></div>
                                 <TextField
                                    id="date2"
                                    label="End Date"
                                    type="date"
                                    defaultValue="2017-05-24"
                                    className={styles.TextField}
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                />
                                
                                </div><br></br>
                                <div className='blocksContainer1'><Button variant="contained" color="primary">Search</Button></div>
                                
                        {(patientRecords.length > 0) ?
                            <div style={{ padding: 10, paddingTop: 20 }}>
                                <div className='blockPanel'>
                                    <span className="panelTitle">Tele Caller Doctor</span>
                                </div>
                                <div className='blocksContainer'>
                                    {this.renderPatientRecordsByHCopen(patientRecords, 'testStatus')}
                                    {this.renderPatientRecordsByHCclose()}
                                    {this.renderPatientRecordsByHCab()}
                                </div>
                            </div>
                            : null}
                        
                        
                    </React.Fragment>
                }
            </div>
        )
    }
}
function mapStateToprops(state) {
    return {
        userLoginID: state.userProfileReducer.userLoginID,
        searchCriteria: state.searchCriteriaReducer,
        userID: state.userProfileReducer.userID,
    };
}

const H = withRouter(TeleCaller);

const telecaller = connect(mapStateToprops)(H);
export default telecaller;