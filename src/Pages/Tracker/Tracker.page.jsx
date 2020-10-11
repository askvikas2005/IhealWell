import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import HttpService from '../../Services/HttpService';
import UrlConstants from '../../UrlConst';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MedicationComponent from '../../Components/Medication/Medication.component';
import UpdateStatus from '../../Components/UpdateForms/UpdateStatus';
import AddInvestigation from '../../Components/UpdateForms/AddInvestigation';
import UpdateSeverity from '../../Components/UpdateForms/UpdateSeverity';
import TrackerForm from '../../Components/TrackerForm/TrackerForm'
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import AddIcon from '@material-ui/icons/Add';
import './tracker.css'
import ReduxService from '../../Services/redux.service';
const useStyles = (theme) => (
    {
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }
);


class Tracker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            prescriptionModel: {},
            cronaPatientId: localStorage.getItem('cronaPatientId'), snackMessage: '', stage: 1, update: '',
            showActions: true,
            patient: {
                gender: null,
                age: null,
                cronaPatientId: localStorage.getItem('cronaPatientId'),
                userId: localStorage.getItem('userID'),
                firstName: null,
                lastName: null,
                resultDate: null,
                phoneMobile: null,
                comorbidity: null,
                prn: null,
                address: null,
                medicalStatus: null,
                patientStatus: null,
            },
            vitalCdes: [],
            symptomCdes: [],
            gettingPatient: false,
            gettingCdes: false,
            saving: false,
            savingForm: false,
            savingPatintData: false,
            title: 'Vitals'
        }
    }

    setPrescriptionModel = async precription => {
        await this.setState({ prescriptionModel: { ...this.state.prescriptionModel, ...precription } })
    }

    navigateBack = async () => {
        let nav = localStorage.getItem('fromAddPatient');
        nav ? this.props.history.push('/dashboard') :
            this.props.history.push('/patientlist')
    }

    componentDidMount = async () => {
        localStorage.removeItem('createPopup')
        let cronaPatientId = localStorage.getItem('cronaPatientId')
        this.setPrescriptionModel({ userId: localStorage.getItem('userID'), cronaPatientId })
        await this.setState({ cronaPatientId })
        this.getPatient();
        this.getCdes();
        this.getPrescription()
    }

    componentWillUnmount = async () => {
        localStorage.removeItem('fromAddPatient');
        localStorage.removeItem('cronaPatientId');
        localStorage.removeItem('createPopup')
    }

    setFormStage = async (stage) => {
        const Stage = ['Tracker', 'Vitals', 'Symptoms', 'Medication']
        await this.setState({ stage, title: Stage[stage] })
    }

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

    nextAction = async () => {
        this.setState({ showActions: true })
        await this.setState({ stage: this.state.stage + 1 })
        this.setFormStage(this.state.stage);
        // this.scrollRef.scrollTo({
        //     y: 0,
        //     animated: true,
        // });
    }
    backAction = async () => {
        this.setState({ showActions: true })
        await this.setState({ stage: this.state.stage + -1 })
        this.setFormStage(this.state.stage);
        // this.scrollRef.scrollTo({
        //     y: 0,
        //     animated: true,
        // });
    }

    getMedicineData = a => a

    getPrescription = () => {
        let url = UrlConstants.baseUrl + UrlConstants.getPrescription;
        HttpService.posts(url).post({ cronaPatientId: this.state.cronaPatientId }).then(async (res) => {
            if (res.data.status == "SUCCESS") {
                if (res.data.data) {
                    let prescriptionModel = res.data.data;
                    prescriptionModel.userLoginID = undefined;
                    prescriptionModel.userId = localStorage.getItem('userID');
                    this.setPrescriptionModel(prescriptionModel)
                }

            } else { }
        }).catch((err) => { });
    }

    callSubmit = _ => this.saveTrackers();

    saveTrackers = async () => {
        this.setState({ showActions: true })
        const { cronaPatientId, prescriptionModel } = this.state
        let entryDate = new Date().getTime()
        let cdes = [...this.state.vitalCdes, ...this.state.symptomCdes]
        let frm = []
        cdes.forEach(p => {
            let testValue = null;
            if (p.touch) {
                testValue =
                    (p.cdeInputFieldType === 'MultiInputNumberSpinner') ? `${p.temp1}/${p.temp2}` :
                        (p.cdeInputFieldType === 'BooleanToggle') ? (p.testValue === true) ? 'Yes' : 'No' :
                            p.testValue;
            }
            let x = {
                clinicalDataElementId: p.clinicalDataElementId,
                testValue,
                entryDate
            }
            frm.push(x)
        });

        if (typeof this.getMedicineData() === 'boolean')
            return;

        let body = {
            cronaPatientTestResultModel: {
                userId: localStorage.getItem('userID'),
                cronaPatientId,
                testValueList: frm
            },
            cronaPrescriptionModel: {
                ...{}, ...prescriptionModel, ...{ medicationList: this.getMedicineData() }
            }
        }



        // console.log(JSON.stringify(body.cronaPatientTestResultModel));

        let url = UrlConstants.baseUrl + UrlConstants.addCPtData;

        if (localStorage.getItem('createPopup') !== "Submit") {
            this.setCreatePopup('Severity');
            this.setModalVisible('Severity')
            return
        }




        this.setState({ savingPatintData: true })
        HttpService.posts(url).post(body).then(async ({ data }) => {
            this.setState({ savingPatintData: false })
            if (data.status === "SUCCESS") {
                await this.setState({ snackMessage: 'Patient Updated' })
                setTimeout(async () => {
                    await this.setState({ snackMessage: '' })
                    this.props.history.push('/dashboard')
                }, 1500);
            } else {
                this.setState({ snackMessage: JSON.stringify(data.status) })
                setTimeout(async () => {
                    await this.setState({ snackMessage: '' })
                }, 1000);
            }
        }).catch((err) => {
            this.setModalVisible('')
            this.setState({ savingPatintData: false });
            if (err.response) {
                if (err.response.status === 401) {
                    if (err.response.data.oauth2ErrorCode === 'invalid_token') {
                        alert('Your session is expired,please login again');
                        ReduxService.logout();
                    } else {
                        this.setState({ snackMessage: 'Error while saving ,Please try again later' })
                        setTimeout(async () => {
                            await this.setState({ snackMessage: '' })
                        }, 1000);
                    }
                } else {
                    this.setState({ snackMessage: 'Error while saving, Please try again later' })
                    setTimeout(async () => {
                        await this.setState({ snackMessage: '' })
                    }, 1000);
                }
            } else {
                alert('Error,Please Try  Again Later')
            }
        });
    }

    getCdes = () => {
        let body = { userId: localStorage.getItem('userID') }
        let url = UrlConstants.baseUrl + UrlConstants.getTestForms;
        this.setState({ gettingCdes: true })
        HttpService.posts(url).post(body).then(({ data }) => {
            this.setState({ gettingCdes: false })
            if (data.status == "SUCCESS") {
                if (data.data.vitals)
                    this.setState({ vitalCdes: data.data.vitals });
                if (data.data.symptoms)
                    this.setState({ symptomCdes: data.data.symptoms })

            } else {
                alert('No records found')
            }
        }).catch((err) => {
            this.setState({ gettingCdes: false });
            if (err.response) {
                if (err.response.status === 401) {
                    if (err.response.data.oauth2ErrorCode === 'invalid_token') {
                        alert('Your session is expired,please login again');
                        ReduxService.logout();
                    }
                }
            } else {
                alert('Server Down', 'Please Try later');
            }
        });
    }

    getPatient = async () => {
        const { cronaPatientId } = this.state;

        try {
            if (!cronaPatientId) return
            let body = {
                cronaPatientId: parseInt(cronaPatientId)
            }
            let url = UrlConstants.baseUrl + UrlConstants.getPatient;
            await this.setState({ gettingPatient: true })
            let response = await HttpService.posts(url).post(body);
            this.setState({ gettingPatient: false })
            if (response.status === 200) {
                if (response.data.status === 'SUCCESS') {
                    if (response.data.data) {
                        if (response.data.data[0])
                            await this.setState({ patient: { ...this.state.patient, ...response.data.data[0] } })
                    }
                }
            } else {
                alert('something went wrong' + response.status);
            }
        } catch (error) {
            this.setState({ gettingPatient: false })
            if (error.response) {
                if (error.response.status === 401) {
                    if (error.response.data.oauth2ErrorCode === 'invalid_token') {
                        alert('Your session is expired,please login again');
                        ReduxService.logout();
                    }
                } else { alert('Network Error Please Try Later'); }
            } else {
                this.setState({ gettingPatient: false, })
                alert('Please Try Later')
            }
        }

    }


    setModalByStatus = _ => {
        let popupStatus = localStorage.getItem('createPopup')
        if (popupStatus) {
            switch (popupStatus) {
                case 'Severity':
                    localStorage.setItem('createPopup', 'Status');
                    this.setModalVisible('Status')
                    break;
                case 'Status':
                    localStorage.setItem('createPopup', 'Submit');
                    this.setModalVisible('')
                    this.saveTrackers();
                    break;
                default:
                    this.setModalVisible('')
                    break;
            }
        } else {
            this.setModalVisible('')
        }
    }

    updatePatient = async (pdetails, nav) => {
        const { cronaPatientId } = this.state
        let url = UrlConstants.baseUrl + UrlConstants.registerPatient
        const { patient } = this.state;
        let body = { ...patient, ...pdetails }
        await this.setState({ cronaPatientId })
        body.cronaPatientId = parseInt(cronaPatientId);
        body.userId = localStorage.getItem('userID');
        this.setState({ saving: true })
        HttpService.posts(url).post(body).then(async ({ data }) => {
            this.setState({ saving: false })
            if (data.status === "SUCCESS") {
                await this.setState({ patient: { ...this.state.patient, ...pdetails } })
                this.setModalByStatus();
                this.setState({ snackMessage: 'Patient Updated' })
                setTimeout(async () => {
                    await this.setState({ snackMessage: '' })
                    if (nav) {
                        this.props.history.push('/dashboard')
                    }
                }, 1500);
            } else {
                this.setModalByStatus()
                this.setState({ snackMessage: JSON.stringify(data.status) })
                setTimeout(async () => {
                    await this.setState({ snackMessage: '' })
                }, 1000);
            }
        }).catch((err) => {
            this.setModalByStatus()
            this.setState({ saving: false });
            if (err.response) {
                if (err.response.status === 401) {
                    if (err.response.data.oauth2ErrorCode === 'invalid_token') {
                        alert('Your session is expired,please login again');
                        ReduxService.logout();
                    } else {
                        this.setState({ snackMessage: 'Patient Updated' })
                        setTimeout(async () => {
                            await this.setState({ snackMessage: '' })
                        }, 1000);
                    }
                } else {
                    this.setState({ snackMessage: 'Patient Updated' })
                    setTimeout(async () => {
                        await this.setState({ snackMessage: '' })
                    }, 1000);
                }
            } else {
                alert('Server Down,Please try later');
            }
        });
    }

    // render
    renderForm = () => {
        const { stage, vitalCdes, symptomCdes, title, prescriptionModel } = this.state
        switch (this.state.stage) {
            case 1:
            case 2:
                return <TrackerForm
                    title={title}
                    cdes={stage === 1 ? vitalCdes : symptomCdes}
                />
            case 3:
                return <MedicationComponent
                    title={title}
                    medicationList={prescriptionModel.medicationList || []}
                    getMedicineData={click => this.getMedicineData = click}
                />
            default:
                return null;
        }
    }


    renderActionButtons = () => {
        const { stage, savingForm, savingPatintData } = this.state
        return <div style={{
            width: '80%',
            marginLeft: '10%',
            padding: '10px',
            display: 'flex',
            marginBottom: '10px',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
        }}>
            {stage === 3 ?
                <Button
                    type="button"
                    variant="contained" color="primary"
                    onClick={() => { if (!savingPatintData) this.saveTrackers() }} >
                    {!savingPatintData ? 'Submit' : 'Please Wait'}
                </Button> :
                <Button
                    type="button"
                    variant="contained" color="primary"
                    onClick={() => this.nextAction()} >Next</Button>}
            {stage !== 1 ?
                <Button type="button"
                    variant="contained" color="primary"
                    onClick={() => this.backAction()}>Back</Button> : null}
        </div>
    }

    handleClose = () => { };

    render() {
        const { classes } = this.props;
        const { snackMessage, update, showActions, gettingPatient, patient } = this.state;
        return (
            <>
                {gettingPatient ? <div style={{ textAlign: 'center', margin: '20px' }}>
                    <CircularProgress />
                </div> :
                    <div style={{ backgroundColor: 'aliceblue', flex: 1 }}>
                        <div style={{ flex: 18, marginBottom: '50px' }}>
                            <div>
                                <div
                                    style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#154c66', padding: 10, justifyContent: 'center' }}>
                                    <span style={{ fontSize: 20, alignSelf: 'center', color: 'white' }}>
                                        {patient.firstName} {patient.lastName}
                                        <span style={{ fontSize: 15, color: '#96d7fa' }}>
                                            {' '} {patient.age ? patient.age + ' Years old' : null}
                                        </span>
                                        <span style={{ fontSize: 15, color: '#e3767f' }}>
                                            {' '}  {patient.gender}
                                        </span>
                                    </span>
                                </div>
                                <div
                                    style={{ marginBottom: 10 }}
                                >
                                    <div className="card">
                                        {this.renderForm()}
                                        {this.renderActionButtons()}
                                    </div>
                                </div>

                            </div>
                        </div>
                        {showActions ? <div className="actionButtons">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.setModalFromBtn('Severity')}
                            >
                                <AddIcon />  Severity
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.setModalFromBtn('Status')}
                            >
                                <AddIcon /> Status
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.setModalVisible('Investigation')}
                            >
                                <AddIcon />  Investigation
                            </Button>
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
                                            {update === 'Status' ?
                                                <UpdateStatus
                                                    status={this.state.patient.patientStatus}
                                                    updatePatient={(p, nav) => this.updatePatient(p, nav)}
                                                    setModalVisible={(p) => this.setModalVisible(p)}
                                                    callSubmit={_ => this.callSubmit()}
                                                />
                                                :
                                                update === 'Severity' ?
                                                    <UpdateSeverity
                                                        setModalVisible={(p) => this.setModalVisible(p)}
                                                        medicalStatus={this.state.patient.medicalStatus}
                                                        updatePatient={(p) => this.updatePatient(p)}
                                                    /> :
                                                    <AddInvestigation
                                                        latestInvestigationDate={patient.resultDate}
                                                        setModalVisible={(p) => this.setModalVisible(p)}
                                                        updatePatient={(p) => this.updatePatient(p)}
                                                    />
                                            }
                                        </div>
                                    </div>
                                </Fade>
                            </Modal>
                            : null}

                        <Snackbar
                            autoHideDuration={6000}
                            open={snackMessage?.length > 0}
                            message={snackMessage}
                        />

                    </div>
                }
            </>
        );
    }
}
function mapStateToprops(state) {
    return {
        userLoginID: state.userProfileReducer.userLoginID,
    };
}
export default withStyles(useStyles)(connect(mapStateToprops)(Tracker));
