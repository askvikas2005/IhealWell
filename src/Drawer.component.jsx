import React, { useState, Suspense, Component } from 'react';
import clsx from 'clsx';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import { Route, Switch as RouteSwitch, Router, Redirect, withRouter } from 'react-router-dom';
import { createHashHistory } from "history";

import HomeIcon from '@material-ui/icons/Home';
import { makeStyles } from '@material-ui/core/styles';
import './Drawer.css'
import GuardService from './Services/loginGuard';
import { connect } from 'react-redux';
import ReduxService from './Services/redux.service';
import { withStyles } from '@material-ui/core/styles';
import DashboardPage from './Pages/Dashboard/Dashboard.page';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PatientListPage from './Pages/PatientList/PatientList.Page';
import TrackerPage from './Pages/Tracker/Tracker.page';
import HospitalCoordinator from './Pages/Hc/HospitalCoordinator'
import TeleCaller from './Pages/TeleCaller/TeleCaller.Page';
import EnrollPatient from './Pages/EnrollPatient/EnrollPatient.Page';
import AddPatientHospital from './Pages/AddPatientHospital/AddPatientHospital.page';
import SearchHospital from './Pages/SearchHospital/SearchHospital.Page';
import TeleCallerDash from './Pages/TeleCallerDash/TeleCallerDash.Page';
import RegisterPaitentModal from './Pages/TeleCallerDash/RegisterPaitentModal';
import PatientTracker from './Pages/TeleCallerDash/PatientTracker';
import SearchPaitentByStatus from './Pages/TeleCallerDash/SearchPaitentByStatus';
import SearchPaitentByStatus1 from './Pages/TeleCallerDash/SearchPaitentByStatus1';
import SearchPaitentByStatus2 from './Pages/TeleCallerDash/SearchPaitentByStatus2';
import TelleCallerAddPatient from './Pages/TeleCallerDash/TelleCallerAddPatient.page';
import CallCenterDoctorDash from './Pages/TeleCallerDash/CallCenterDoctorDash.Page';
import TelleCallerUpdatePatient from './Pages/TeleCallerDash/TelleCallerUpdatePatient.Page';
import CallCenterDoctorUpdate from './Pages/TeleCallerDash/CallCenterDoctorUpdate';
import CallCenterDoctorUpdate1 from './Pages/TeleCallerDash/CallCenterDoctorUpdate1';
import AmbulanceDash from './Pages/TeleCallerDash/AmbulanceDash';
import AmbulancePatient from './Pages/TeleCallerDash/AmbulancePatient';
import HospitalCoUpdate from './Pages/TeleCallerDash/HospitalCoUpdate';
import AmbuDash from './Pages/TeleCallerDash/AmbuDash';
const AddPatientPage = React.lazy(() => import('./Pages/AddPatient/AddPatient.page'));
const AddPatientFromCC = React.lazy(()=>import('./Pages/CallCenter/Callcenter.page'));
const LoginPage = React.lazy(() => import('./Pages/Auth/Login.page'));


//const HospitalCoordinator = React.lazy(() => import('./Pages/Hc/HospitalCoordinator.page'));

const styles = { list: { width: 250, }, fullList: { width: 'auto', } }
const pathTitleMap = {
    '/dashboard': 'Dashboard',
    '/addpatient': 'Add Patient',
    '/addpatientcc': 'Add Patient',
    '/patientlist': 'Patient List',
    '/tracker': 'Tracker',
    '/hospitalcoordinator': 'HospitalCoordinator',
    '/telecaller': 'TeleCaller',
    '/enrollpatient': 'EnrollPatient',
    '/addpatienthospital': 'AddPatientHospital',
    '/searchhospital': 'SearchHospital',
    '/telecallerdash': 'TeleCallerDash',
    '/registerpaitentmodal': 'RegisterPaitentModal',
    '/patienttracker': 'PatientTracker',
    '/searchpaitentbystatus': 'SearchPaitentByStatus',
    '/searchpaitentbystatus1': 'SearchPaitentByStatus1',
    '/searchpaitentbystatus2': 'SearchPaitentByStatus2',
    '/tellecalleraddpatient': 'TelleCallerAddPatient',
    '/callcenterdoctordash': 'CallCenterDoctorDash',
    '/tellecallerupdatepatient': 'TelleCallerUpdatePatient',
    '/callcenterdoctorupdate': 'CallCenterDoctorUpdate',
    '/callcenterdoctorupdate1': 'CallCenterDoctorUpdate1',
    '/ambulancedash': 'AmbulanceDash',
    '/ambulancepatient': 'AmbulancePatient',
    '/ambudash': 'AmbuDash',
    '/hospitalcoupdate': 'HospitalCoUpdate'
    
}

class Header extends Component {
    render() {
        return (<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{pathTitleMap[this.props.location.pathname]}</span>)
    }
}


const customHistory = createHashHistory();

const HeaderComponent = withRouter(Header);


class RightHeader extends Component {
    navigate = (path) => this.props.history.push(path)
    render() {
        return (<Button onClick={() => this.navigate('/dashboard')}><HomeIcon style={{ color: 'white' }} /></Button>)
    }
}

const RightHeaderComponent = withRouter(RightHeader);






class SideList extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    logout = _ => ReduxService.logout();

    navigate = path => this.props.history.push(path)
    

    render() {
        const { userLoginID, classes, fullName, emailID, } = this.props;
        const listu =localStorage.getItem('userType');
        let comp;

            if (listu=='TELECALLER') {

            comp = <div>
                <ListItem classes={{ root: classes.listHovers }}
                            button
                            onClick={() => this.navigate('/telecallerdash')}>
                            <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                            <ListItemText primary={'Tele Caller'} />
                        </ListItem>
                        
                        {/* <ListItem classes={{ root: classes.listHovers }}
                            button
                            onClick={() => this.navigate('/callcenterdoctordash')}>
                            <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                            <ListItemText primary={'Call Center Doctor'} />
                        </ListItem>
                        <ListItem classes={{ root: classes.listHovers }}
                            button
                            onClick={() => this.navigate('/hospitalcoordinator')}>
                            <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                            <ListItemText primary={'Hospital Coordinator'} />
                        </ListItem>
                        <ListItem classes={{ root: classes.listHovers }}
                            button
                            onClick={() => this.navigate('/ambudash')}>
                            <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                            <ListItemText primary={'Ambulance Coordinator'} />
                        </ListItem> */}
            </div>

            } else  if (listu=='CALL CENTRE DOCTOR') {

                comp = <div>
                    <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/callcenterdoctordash')}>
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Call Center Doctor'} />
                            </ListItem>
                            {/* <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/callcenterdoctordash')}>
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Call Center Doctor'} />
                            </ListItem>
                            <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/hospitalcoordinator')}>
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Hospital Coordinator'} />
                            </ListItem>
                            <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/ambudash')}>
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Ambulance Coordinator'} />
                            </ListItem> */}
            
                </div>
    
    
            }else  if (listu=='HOSPITAL COORDINATOR') {

                comp = <div>
                    <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/hospitalcoordinator')}>
                                    {/* onClick={() => this.navigate('/searchpatientbystatus2')}> */}
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Hospital Coordinator'} />
                            </ListItem>
                            {/* <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/callcenterdoctordash')}>
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Call Center Doctor'} />
                            </ListItem>
                            <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/hospitalcoordinator')}>
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Hospital Coordinator'} />
                            </ListItem>
                            <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/ambudash')}>
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Ambulance Coordinator'} />
                            </ListItem> */}
            
                </div>
            }else  if (listu=='AMBULANCE COORDINATOR') {

                comp = <div>
                    <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/ambudash')}>
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Ambulance Coordinator'} />
                            </ListItem>
                            {/* <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/callcenterdoctordash')}>
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Call Center Doctor'} />
                            </ListItem>
                            <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/hospitalcoordinator')}>
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Hospital Coordinator'} />
                            </ListItem>
                            <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/ambudash')}>
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Ambulance Coordinator'} />
                            </ListItem> */}
            
                </div>
            }
        return (
            <React.Fragment>
                {userLoginID ?
                
                    <React.Fragment>
                        <ListItem>
                            <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', width: '100%' }}>
                                <div style={{ fontSize: '20px', color: '#2196F3' }}>{fullName}</div>
                                <div>{emailID}</div>
                            </div>
                        </ListItem>
                        <ListItem
                            button
                            onClick={() => this.navigate('/dashboard')}>
                            <ListItemIcon>{<DashboardIcon />}</ListItemIcon>
                            <ListItemText primary={'Dashboard'} />
                        </ListItem>
                        <React.Fragment>
                             { listu=="TELECALLER" ?
                            <div>
                            <ListItem classes={{ root: classes.listHovers }}
                            button
                            onClick={() => this.navigate('/telecallerdash')}>
                            <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                            <ListItemText primary={'Tele Caller'} />
                        </ListItem>
                            </div>
                            :null}
                            
                            { listu=="CALL CENTRE DOCTOR" ?
                            <div>
                           <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/callcenterdoctordash')}>
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Call Center Doctor'} />
                            </ListItem>
                            </div>
                            :null}
                            { listu=="HOSPITAL COORDINATOR" ?
                            <div>
                           <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/hospitalcoordinator')}>
                                    {/* onClick={() => this.navigate('/searchpatientbystatus2')}> */}
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Hospital Coordinator'} />
                            </ListItem>
                            </div>
                            :null}
                            { listu=="AMBULANCE COORDINATOR" ?
                            <div>
                           <ListItem classes={{ root: classes.listHovers }}
                                button
                                onClick={() => this.navigate('/ambudash')}>
                                <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                                <ListItemText primary={'Ambulance Coordinator'} />
                            </ListItem>
                            </div>
                            :null}
                         </React.Fragment>
                        {/* <ListItem classes={{ root: classes.listHovers }}
                            button
                            onClick={() => this.navigate('/addpatient')}>
                            <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                            <ListItemText primary={'Add Patient'} />
                        </ListItem>
                        <ListItem classes={{ root: classes.listHovers }}
                            button
                            onClick={() => this.navigate('/addpatientcc')}>
                            <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
                            <ListItemText primary={'Add Patient CC'} />
                        </ListItem> */}
                        
                        {/* {comp} */}
                        <ListItem classes={{ root: classes.listHovers }}
                            button
                            onClick={() => this.logout()}>
                            <ListItemIcon>{<ExitToAppIcon />}</ListItemIcon>
                            <ListItemText primary={'LogOut'} />
                        </ListItem>
                    </React.Fragment>
                    : null}
            </React.Fragment>
        )
    }
}

function reduxState(state) {
    return {
        userLoginID: state.userProfileReducer.userLoginID,
        emailID: state.userProfileReducer.emailID,
        fullName: state.userProfileReducer.fullName,
    }
}

const S = withStyles(styles)(withRouter(SideList));

const SideMenu = connect(reduxState)(S)

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest}
        render={props => GuardService.isLogin() ? <Component {...props} /> : <Redirect to={{ pathname: "/login" }} />}
    />
);

function DrawerComponent({ userLoginID, ...props }) {

    const useStyles = makeStyles({ list: { width: 250, }, fullList: { width: 'auto', } });

    const classes = useStyles();
    const [state, setState] = useState({ left: false });

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
        setState({ left: open });
    };

    const list = () => (
        <div>
            <Divider />
            <div
                className={clsx(classes.list)}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <List>
                    <SideMenu />
                </List>
            </div>
        </div>
    );
    return (
        <Router basename={'/critical'} history={customHistory}>
            <React.Fragment key={'left'}>
                {userLoginID ? <div style={{ display: 'flex', alignItems: 'center', background: '#2195f3', color: 'white', height: '50px' }}>
                    <div style={{ flex: 1 }}><Button onClick={toggleDrawer(true)}><MenuIcon style={{ color: 'white' }} /></Button></div>
                    <div style={{ flex: 8, textAlign: 'center' }}><HeaderComponent /></div>
                    <div style={{ flex: 1 }}>
                        <RightHeaderComponent />
                    </div>
                </div>
                    : null}
                <Suspense fallback={<div className='loadingDiv'>loading....</div>}>
                    <RouteSwitch>
                        <Route exact path={'/'} component={LoginPage} />
                        <Route exact path={'/login'} component={LoginPage} />
                        <PrivateRoute exact path={'/dashboard'} component={DashboardPage} />
                        <PrivateRoute exact path={'/addpatient'} component={AddPatientPage} />
                        <PrivateRoute exact path={'/addpatientcc'} component={AddPatientFromCC} />
                        <PrivateRoute exact path={'/patientlist'} component={PatientListPage} />
                        <PrivateRoute exact path={'/tracker'} component={TrackerPage} />
                        <PrivateRoute exact path={'/hospitalcoordinator'} component={HospitalCoordinator} />
                        <PrivateRoute exact path={'/telecaller'} component={TeleCaller} />
                        <PrivateRoute exact path={'/enrollpatient'} component={EnrollPatient} />
                        <PrivateRoute exact path={'/addpatienthospital'} component={AddPatientHospital} />
                        <PrivateRoute exact path={'/searchhospital'} component={SearchHospital} />
                        <PrivateRoute exact path={'/telecallerdash'} component={TeleCallerDash} />
                        <PrivateRoute exact path={'/registerpaitentmodal'} component={RegisterPaitentModal} />
                        <PrivateRoute exact path={'/patienttracker'} component={PatientTracker} />
                        <PrivateRoute exact path={'/searchpaitentbystatus'} component={SearchPaitentByStatus} />
                        <PrivateRoute exact path={'/searchpaitentbystatus1'} component={SearchPaitentByStatus1} />
                        <PrivateRoute exact path={'/searchpaitentbystatus2'} component={SearchPaitentByStatus2} />
                        <PrivateRoute exact path={'/tellecalleraddpatient'} component={TelleCallerAddPatient} />
                        <PrivateRoute exact path={'/callcenterdoctordash'} component={CallCenterDoctorDash} />
                        <PrivateRoute exact path={'/tellecallerupdatepatient'} component={TelleCallerUpdatePatient} />
                        <PrivateRoute exact path={'/callcenterdoctorupdate'} component={CallCenterDoctorUpdate} />
                        <PrivateRoute exact path={'/callcenterdoctorupdate1'} component={CallCenterDoctorUpdate1} />
                        <PrivateRoute exact path={'/ambulancedash'} component={AmbulanceDash} />
                        <PrivateRoute exact path={'/ambulancepatient'} component={AmbulancePatient} />
                        <PrivateRoute exact path={'/hospitalcoupdate'} component={HospitalCoUpdate} />
                        <PrivateRoute exact path={'/ambudash'} component={AmbuDash} />
                        
                        
                    </RouteSwitch>
                </Suspense>

                <SwipeableDrawer
                    anchor={'left'}
                    open={state['left']}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    {list(props)}
                </SwipeableDrawer>
            </React.Fragment>
        </Router>
    );
}

function matchStateToProps(state) {
    return {
        userLoginID: state.userProfileReducer.userLoginID,
    };
}


export default connect(matchStateToProps)(DrawerComponent)

