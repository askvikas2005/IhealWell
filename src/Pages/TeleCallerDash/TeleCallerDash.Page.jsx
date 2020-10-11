import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom"
import { Button } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Card from '@material-ui/core/Card';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';
import './TeleCallerDash.css'
import ReduxService from '../../Services/redux.service';
import UpdateSeverity from '../../Components/UpdateForms/UpdateSeverity';
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
import registerpatientmodal from './RegisterPaitentModal';
import { Close } from '@material-ui/icons';
import PatientListM from './PatientListM';
const useStyles = (theme) => (
    {
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }
);
const headerT='';
 //--------------------------------modal-------------
 
 //--------------------------------------------------

class TeleCallerDash extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            searchText: '',
            gettingPatients: false,
            gettingDash: false, patientList: [],
            patientRecords: [],
            patientStatus: [],
            headerT:'Welcome To Tele caller DashBoard.....Please Click On Summery...',
            update: ''
        }
  
    }
    //---------modal function-----------------------------
    setCreatePopup = popup => {
        localStorage.setItem('createPopup', popup);
    }

    setModalFromBtn = update => {
        localStorage.setItem('createPopup','Submit');
        this.setModalVisible(update)
    }

    setModalVisible = update => {
        this.setState({ update })
    }
    handleClose = () => { };
    setModalByStatus = _ => {
        let popupStatus = localStorage.getItem('createPopup')
        if (popupStatus) {
            switch (popupStatus) {
                case 'renderTotalEnrolledPatient':
                    localStorage.setItem('createPopup', 'renderTotalEnrolledPatient');
                    this.setModalVisible('renderTotalEnrolledPatient')
                    break;
                case 'renderTodaysRegisteredpatient':
                    localStorage.setItem('createPopup', 'renderTodaysRegisteredpatient');
                    this.setModalVisible('renderTodaysRegisteredpatient')
                    this.props.history.push('/patienttracker')
                    break;
                case 'renderClosedorder':
                    localStorage.setItem('createPopup', 'renderClosedorder');
                    this.setModalVisible('renderClosedorder')
                    break;
                case 'renderAbandonedOrder':
                        localStorage.setItem('createPopup', 'renderAbandonedOrder');
                        this.setModalVisible('renderAbandonedOrder')
                        break;
                case 'renderChangesuggestion':
                        localStorage.setItem('createPopup', 'renderChangesuggestion');
                        this.setModalVisible('renderChangesuggestion')
                        break;
                case 'renderBedAllocatedbyDoctor':
                        localStorage.setItem('createPopup', 'renderBedAllocatedbyDoctor');
                        this.setModalVisible('renderBedAllocatedbyDoctor')
                        break;
                case 'renderAmbulanceOrder':
                        localStorage.setItem('createPopup', 'renderAmbulanceOrder');
                        this.setModalVisible('renderAmbulanceOrder')
                        break;
                case 'renderOpen':
                        localStorage.setItem('createPopup', 'renderOpen');
                        this.setModalVisible('renderOpen')
                        break;
                case 'renderWithoutAmbulance':
                        localStorage.setItem('createPopup', 'renderWithoutAmbulance');
                        this.setModalVisible('renderWithoutAmbulance')
                        break;
                default:
                    //this.setModalVisible('')
                    break;
            }
        } else {
            this.setModalVisible('')
        }
    }
    //---------------------------------------------------
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
        //this.props.history.push('/searchpaitentbystatus')
    }
    goTodayPatientList = (x, forType) => {
        let searchCriteria = {
            userId: localStorage.getItem('userID'),
            [forType]: x.status,
        }
        localStorage.setItem('patientSearchCriteria', JSON.stringify(searchCriteria));
        //this.props.history.push('/enrollpatient')
        this.props.history.push('/searchpaitentbystatus1')
    }
    addPatient = (x, forType) => {
        let searchCriteria = {
            userId: localStorage.getItem('userID'),
            [forType]: x.status,
        }
        localStorage.setItem('patientSearchCriteria', JSON.stringify(searchCriteria));
        this.props.history.push('/tellecalleraddpatient')
    }
    addPatientI = () => {
        
        this.props.history.push('/tellecalleraddpatient')
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
   
    renderTotalEnrolledPatient = (statusArray, forType) => {
        return (
            statusArray.map((x, i) => {
                return <Card key={i + forType}
                    className='dashCard'
                    onClick={() => this.goToPatientList(x, forType)}
                    //onClick={() => this.setModalVisible('renderTodaysRegisteredpatient')}
                >
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>{x.count}</div>
                     {/* <div style={{ alignSelf: 'center', fontSize: 20 }}>Total Enrolled Patient</div>  */}
            <div style={{ alignSelf: 'center', fontSize: 20 }}>{x.status}</div> 
                </Card>
            })
        )
    }
    
    renderTodaysRegisteredpatient = (statusArray, forType) => {
        return (
            <Card  className='dashCard'
                     onClick={() => this.goTodayPatientList(statusArray, forType)}>
            <div style={{ alignSelf: 'center', fontSize: 20 }}>-</div>
            <div style={{ alignSelf: 'center', fontSize: 20 }}>Todays Registered Patient</div>
            </Card>
            // statusArray.map((x, i) => {
    
            //     return <Card key={i + forType}
            //         className='dashCard'
            //         onClick={() => this.goTodayPatientList(x, forType)}
            //         //onClick={() => this.setModalVisible('renderTodaysRegisteredpatient')}
            //     >
            //         <div style={{ alignSelf: 'center', fontSize: 20 }}>{x.count}</div>
            //          {/* <div style={{ alignSelf: 'center', fontSize: 20 }}>Total Enrolled Patient</div>  */}
            // <div style={{ alignSelf: 'center', fontSize: 20 }}>Todays Registered Patient</div> 
            //     </Card>
            // })
        )
        
    }
    renderAddpatient = (statusArray, forType) => {
        return (
            statusArray.map((x, i) => {
                return <Card key={i + forType}
                    className='dashCard'
                    onClick={() => this.addPatient(x, forType)}
                    //onClick={() => this.setModalVisible('renderTodaysRegisteredpatient')}
                >
                    {/* <div style={{ alignSelf: 'center', fontSize: 20 }}>{x.count}</div> */}
                     {/* <div style={{ alignSelf: 'center', fontSize: 20 }}>Total Enrolled Patient</div>  */}
            <div style={{ alignSelf: 'center', fontSize: 20 }}>Add Patient</div> 
                </Card>
            })
        )
        
    }
    renderClosedorder = () => {
        return (
                <Card className='dashCard' onClick={() => this.setModalVisible('renderClosedorder')}>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>0</div>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>Close Order</div>
                </Card>)
        
    }
    renderAbandonedOrder = () => {
        return (
                <Card className='dashCard' onClick={() => this.setModalVisible('renderAbandonedOrder')}>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>0</div>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>Abandoned Order</div>
                </Card>)
        
    }
    renderBedAllocatedbyDoctor  = () => {
        return (
                <Card className='dashCard' onClick={() => this.setModalVisible('renderBedAllocatedbyDoctor')}>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>0</div>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>Bed Allocated by Doctor</div>
                </Card>)
        
    }
    renderAmbulanceOrder = () => {
        return (
                <Card className='dashCard' onClick={() => this.setModalVisible('renderAmbulanceOrder')}>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>0</div>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>Ambulance Order</div>
                </Card>)
        
    }
    renderWithoutAmbulance = () => {
        return (
                <Card className='dashCard' onClick={() => this.setModalVisible('renderWithoutAmbulance')}>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>0</div>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>Without Ambulance</div>
                </Card>)
        
    }
    renderChangesuggestion  = () => {
        return (
                <Card className='dashCard' onClick={() => this.setModalVisible('renderChangesuggestion')}>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>0</div>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>Change suggestion</div>
                </Card>)
        
    }
    
    renderOpen  = () => {
        return (
                <Card className='dashCard' onClick={() => this.setModalVisible('renderOpen')}>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>0</div>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>Open</div>
                </Card>)
        
    }
    renderClose  = () => {
        return (
                <Card className='dashCard' onClick={() => this.setModalVisible('renderClose')}>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>0</div>
                    <div style={{ alignSelf: 'center', fontSize: 20 }}>Close</div>
                </Card>)
        
    }
    
    MenuOne = () => {
        return (
               this.setState({ headerT: 'Tale caller Summary' })
        )
    }
    MenuTwo = () => {
        return (
            this.setState({ headerT: 'Hospital Summary' })
        )
    }
    MenuThree = () => {
        return (
            this.setState({ headerT: 'Call Center Doctor Summary' })
        )
    }
    MenuFour = () => {
        return (
            this.setState({ headerT: 'Ambulance Summary' })
        )
    }
    //----------------------------------------------------------

    render() {
        const { patientRecords, patientStatus, gettingDash,update} = this.state;
        const { classes } = this.props;
        const switchView = () => {

            switch(this.state.headerT) 
            {
        
              case "Tale caller Summary":   
              return <div className='blocksContainer'>
              {/* {this.renderAddpatient(patientRecords, 'testStatus')} */}
              {this.renderTotalEnrolledPatient(patientRecords, 'testStatus')}
              {this.renderTodaysRegisteredpatient(patientRecords, 'testStatus')}
              </div>;
              case "Hospital Summary":   
              return <div className='blocksContainer'>
              {this.renderClosedorder()}
              {this.renderAbandonedOrder()}
              </div>;
              case "Call Center Doctor Summary":   
              return <div className='blocksContainer'>
              {this.renderBedAllocatedbyDoctor()}
              {this.renderAmbulanceOrder()}
              {this.renderWithoutAmbulance()}
              {this.renderChangesuggestion()}
              </div>;
              case "Ambulance Summary":   
              return <div className='blocksContainer'>
              {this.renderOpen()}
              {this.renderClose()}
              </div>;
              default: 
              return <h2></h2>
            }
          }
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
                                <div className='blocksContainer'>
                                    
                                <Button variant="contained" color="primary" onClick={()=>this.MenuOne()}>Tale caller Summary</Button>
                                <Button variant="contained" color="primary" onClick={()=>this.MenuTwo()}>Hospital Summary</Button>
                                <Button variant="contained" color="primary" onClick={()=>this.MenuThree()}>Call Center Doctor Summary</Button>
                                <Button variant="contained" color="primary" onClick={()=>this.MenuFour()}>Ambulance Summary</Button>
                                </div>
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
                        <span className="blocksContainer1">{this.state.headerT}</span>
                        <span className="blocksContainer1"></span>
                                </div>
                                <div className='blocksContainer'>
              {/* {this.renderAddpatient(patientRecords, 'testStatus')} 
              {this.renderTotalEnrolledPatient(patientRecords, 'testStatus')}
              {this.renderTodaysRegisteredpatient(patientRecords, 'testStatus')} */}
              </div>
                                { switchView() }
                            </div>
                            : null}
                        {update.length > 0 ?
                            <Modal
                                aria-labelledby="transition-modal-title"
                                aria-describedby="transition-modal-description"
                                className={classes.modal}
                                open={update.length > 0}
                                onClose={() => this.setState({ update: '' })}
                                closeAfterTransition
                                // BackdropComponent={Backdrop}
                                BackdropProps={{ timeout: 500, }}
                            >
                                <Fade in={update.length > 0}>
                                    <div
                                        style={{
                                            backgroundColor: 'white',
                                            justifyContent: 'center',
                                            padding: '10px'
                                        }}>
                                        <div
                                        >
                                            {
                                            update === 'renderTotalEnrolledPatient' ?
                                            <PatientListM
                                               setModalVisible={(p) => this.setModalVisible(p)}
                                               //updatePatient={(p) => this.updatePatient(p)}
                                               
                                               />
                                            :
                                            update === 'renderTodaysRegisteredpatient' ?
                                               //<div>renderTodaysRegisteredpatient</div> 
                                               <PatientListM
                                               setModalVisible={(p) => this.setModalVisible(p)}
                                               //updatePatient={(p) => this.updatePatient(p)}
                                               
                                               />
                                            :
                                            update === 'renderClosedorder' ?
                                                <div>renderClosedorder</div>
                                            :
                                            update === 'renderAbandonedOrder' ?
                                                <div>renderAbandonedOrder</div>
                                            :    
                                            update === 'renderBedAllocatedbyDoctor' ?
                                                <div>renderBedAllocatedbyDoctor</div> 
                                            :
                                            update === 'renderAmbulanceOrder' ?
                                                 <div>renderAmbulanceOrder</div>
                                            :
                                             update === 'renderWithoutAmbulance' ?
                                                 <div>renderWithoutAmbulance</div>
                                            :
                                            update === 'renderChangesuggestion' ?
                                               <div>renderChangesuggestion</div> 
                                            :
                                            update === 'renderOpen' ?
                                                <div>renderOpen</div>
                                            :
                                            update === 'renderClose' ?
                                                <div>renderClose</div>
                                            :<div/>
                                            }
                                        </div>
                                    </div>
                                </Fade>
                            </Modal>
                            : null}

<Button
                            fullWidth={false}
                            color='primary'
                            style={{
                                position: "fixed",
                                bottom: 20, right: 20,
                                background: '#2196f3',
                                borderRadius: '50%',
                                minWidth: '60px',
                                maxWidth: '60px',
                                minHeight: '60px',
                                maxHeight: '60px'
                            }}
                            onClick={() => this.addPatientI()}
                        >
                            <PersonAddIcon style={{ color: 'white', fontSize: '35px' }} />
                        </Button>
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


//const H = withRouter(TeleCallerDash);

//const telecaller = connect(mapStateToprops)(H);
export default withStyles(useStyles)(connect(mapStateToprops)(TeleCallerDash));
//export default telecaller;