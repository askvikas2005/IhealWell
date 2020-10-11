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
import './CallCenterDoctorUpdate1.css'
import ReduxService from '../../Services/redux.service';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import CheckBoxCdes from '../../Components/CheckBoxCdes/CheckBoxCdes';
import AutoTextField from '../../Components/Autocomplete/Autocomplete';

import Checkbox from '@material-ui/core/Checkbox';
import { AlternateEmailTwoTone } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
const useStyles = (theme) => (
    {
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }
);


class HospitalCoUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            prescriptionModel: {},
            cronaPatientId: localStorage.getItem('cronaPatientId'), snackMessage: '', stage: 1, update: '',
            showActions: true,
            cronaPatientId: localStorage.getItem('cronaPatientId'), snackMessage: '', stage: 1, update: '',
            showErr: false,
            morbArray: [
                "Diabetic", "Hypertension or Hypotension",
                "Obesity", "Cardiac Diseases", "Pulmonary Diseases", "Diabetes Meletus", "Kidney Diseases",
                "Epilepsy", "Mental Diseases", "Organ Transplant",
            ],
            symptomCdes: [],
            gettingCdes: false,
            stage: 1,
            showDatePicker: false,
            newArea: true,
            newHospital: true,
            newLab: true,
            gettingArea: false,
            gettingLab: false,
            gettingHospital: false,
            availableAreas: [],
            availableLabs: [],
            availableHospitals: [],
            availableComorbidities: [],
            otherComorbitiList: [],
            saving: false,
            errorMsg: '',
            snackMessage: '',
            patient: {
                cronaPatientId: localStorage.getItem('cronaPatientId'),
                userId: localStorage.getItem('userID'),
                medicalStatus:'TCYES|TCDYES|HNO|ANO',
                dateOfBirth: null,
                gender: "Male",
                city: 'Pune',
                age: '',
                area: '',
                state: '',
                pinCode: '',
                firstName: '',
                addressLineOne: '',
                addressLineTwo: '',
                lastName: '',
                phoneMobile: '',
                comorbidity: '',
                patientStatus: "Admitted",
                isInvestigationDone: 'false',
                investigation: 'Positive',
                oxygenSaturation: '',
                hospitalName: '',
                suggestedBed: 'Isolation Bed',
                requiredHospital: 'Government',
                suggestedByDr: 'Hospital',
                callSummary: '',
                labType: 'Government',
                labName: '',
            },
            comorbidityArray: [],
            otherComorbidities: [],
            otherComorbidity: '',

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

    setMobileNumber = (k, e, l) => {
        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
        if (onlyNums.length <= l) {
            this.setState({ patient: { ...this.state.patient, ...{ [k]: onlyNums } } })
        }
    }
    handleDateChange = async (e) => {
        await this.setState({ patient: { ...this.state.patient, ...{ dateOfBirth: e } } })
        if (e)
            if (e.toString() !== 'Invalid Date') {
                let y = moment().diff(e, 'years', false);
                if (y)
                    if (typeof y == 'number')
                        this.setState({ patient: { ...this.state.patient, ...{ age: y.toString() } } })
            }
    }
    setPatientInput = async (k, v) => {
        const { patient } = this.state;
        if (k === 'area') {
            if (v.length === 0) {
                this.setState({ availableAreas: [] })
            }
            await this.setState({ newArea: true })
        }
        if (k == 'labName') {
            if (v.length === 0) {
                this.setState({ availableLabs: [] })
            }
            await this.setState({ newLab: true })
        }
        if (k == 'hospitalName') {
            if (v.length === 0) {
                this.setState({ availableHospitals: [] })
            }
            await this.setState({ newHospital: true })
        }
        
        await this.setState({
            patient: { ...this.state.patient, ...{ [k]: v } }
        })
    }

    setHospital = async (h) => {
        await this.setPatientInput('hospitalName', h);
        await this.setState({ availableHospitals: [], newHospital: false })
    }

    setLab = async (lab) => {
        await this.setPatientInput('labName', lab);
        await this.setState({ availableLabs: [], newLab: false })
    }

    setArea = async (area) => {
        await this.setPatientInput('area', area);
        await this.setState({ availableAreas: [], newArea: false })
    }



    getAutoHospital = async () => {
        if (this.state.patient?.hospitalName?.length < 2) return;
        let url = UrlConstants.baseUrl + UrlConstants.searchArea;
        let body = { pageNo: 1, pageSize: 5, searchText: this.state.patient.hospitalName };
        this.setState({ gettingHospital: true });
        HttpService.posts(url).post(body).then(({ data }) => {
            this.setState({ gettingHospital: false })
            if (data.status === "SUCCESS") {
                if (data.data) {
                    this.setState({ availableHospitals: data.data })
                }
            }
        }).catch((err) => {
            this.setState({ gettingHospital: false });
        });
    }


    getAutoLab = async () => {
        if (this.state.patient?.labName?.length < 2) return;
        let url = UrlConstants.baseUrl + UrlConstants.searchArea;
        let body = { pageNo: 1, pageSize: 5, searchText: this.state.patient.lastName };
        this.setState({ gettingLab: true });
        HttpService.posts(url).post(body).then(({ data }) => {
            this.setState({ gettingLab: false })
            if (data.status === "SUCCESS") {
                if (data.data) {
                    this.setState({ availableLabs: data.data })
                }
            }
        }).catch((err) => {
            this.setState({ gettingLab: false });
        });
    }



    getAutoAddress = async () => {
        if (this.state.patient?.area?.length < 2) return;
        let url = UrlConstants.baseUrl + UrlConstants.searchArea;
        let body = { pageNo: 1, pageSize: 5, searchText: this.state.patient.area };
        this.setState({ gettingArea: true });
        HttpService.posts(url).post(body).then(({ data }) => {
            this.setState({ gettingArea: false })
            if (data.status === "SUCCESS") {
                if (data.data) {
                    this.setState({ availableAreas: data.data })
                }
            }
        }).catch((err) => {
            this.setState({ gettingArea: false });
        });
    }


    setComorbidity = async (otherComorbidity) => {
        if (otherComorbidity?.length < 2) {
            await this.setState({ availableComorbidities: [] })
        }
        await this.setState({ otherComorbidity })
        if (otherComorbidity.length > 2)
            await this.getAutoComorbidity();
    }

    getAutoComorbidity = async () => {
        if (this.state.otherComorbidity?.length < 2) return;
        let url = UrlConstants.baseUrl + UrlConstants.getComorbidity;
        let body = { pageNo: 1, pageSize: 5, searchText: this.state.otherComorbidity };
        this.setState({ gettingotherComorbidity: true });
        HttpService.posts(url).post(body).then(async ({ data }) => {
            this.setState({ gettingotherComorbidity: false })
            if (data.status === "SUCCESS") {
                if (data.data) {
                    this.setState({ availableComorbidities: data.data })
                }
            }
        }).catch((err) => {
            this.setState({ gettingotherComorbidity: false });
        });
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
                           //alert(JSON.stringify(response.data.data[0]))
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


    updatePatient = async (pdetails, nav) => {
        let ms ='';
        const { cronaPatientId } = this.state
        let url = UrlConstants.baseUrl + UrlConstants.registerPatient
        const { patient } = this.state;
        let body = { ...patient, ...pdetails }
        await this.setState({ cronaPatientId })
        body.cronaPatientId = parseInt(cronaPatientId);
        body.userId = localStorage.getItem('userID');
       // this.setState({ medicalStatus: patient.medicalStatus  })
       if (patient.medicalStatus =='TCYES|TCDYES|HNO|AYES') {
        if(patient.patientStatus=='Admitted')
        {
           // this.setState(patient.medicalStatus,'TCYES|TCDYES|HYES|AYES')
           //this.setState(patient.medicalStatus,'TCYES|TCDYES|HYES|AYES' )
            ms='TCYES|TCDYES|HYES|AYES';
        }else{
           // this.setState(patient.medicalStatus,'TCYES|TCDYES|HNO|AYES')
          // this.setState({  ms:'TCYES|TCDYES|HNO|AYES' })
            ms='TCYES|TCDYES|HNO|AYES';
        }
        
    }
    else{
        if(patient.patientStatus=='Admitted')
        {
       // this.setState(patient.medicalStatus,'TCYES|TCDYES|HYES|ANO')
        ms='TCYES|TCDYES|HYES|ANO'
        //this.setState({  ms:'TCYES|TCDYES|HYES|ANO' })
        }else{
           // this.setState(patient.medicalStatus,'TCYES|TCDYES|HNO|ANO')
            ms='TCYES|TCDYES|HNO|ANO';
            //this.setState({  ms:'TCYES|TCDYES|HNO|ANO' })
        }
    }
   
        body.medicalStatus=ms;
        //body.medicalStatus= this.setState({ ms});
        
        alert(JSON.stringify(body))
        this.setState({ saving: true })
        HttpService.posts(url).post(body).then(async ({ data }) => {
            this.setState({ saving: false })
            if (data.status === "SUCCESS") {
                await this.setState({ patient: { ...this.state.patient, ...pdetails } })
                
                this.setState({ snackMessage: 'Patient Updated' })
                setTimeout(async () => {
                    await this.setState({ snackMessage: '' })
                    
                        this.props.history.push('/callcenterdoctordash')
                }, 1500);
            } else {
                
                this.setState({ snackMessage: JSON.stringify(data.status) })
                setTimeout(async () => {
                    await this.setState({ snackMessage: '' })
                }, 1000);
            }
        }).catch((err) => {
            
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

    addOtherComorbidity = async (x) => {
        const { otherComorbidities, otherComorbitiList } = this.state;
        if (x) {
            otherComorbidities.push(x)
            await this.setState({
                otherComorbidities, otherComorbidity: '', availableComorbidities: []
            })
            return
        }
        if (!this.state.otherComorbidity) {
            return
        }
        otherComorbidities.push(this.state.otherComorbidity)
        otherComorbitiList.push(this.state.otherComorbidity)
        await this.setState({ otherComorbidities, otherComorbitiList, availableComorbidities: [], otherComorbidity: '' })
    }
    removeOtherComorbidity = async (i) => {
        let otherComorbitiList = this.state.otherComorbitiList;
        let otherComorbidities = this.state.otherComorbidities;
        let index = otherComorbitiList.findIndex(x => x === otherComorbidities[i]);
        if (index !== -1) {
            otherComorbitiList.splice(index, 1)
        }
        otherComorbidities.splice(i, 1)
        this.setState({ otherComorbidities, otherComorbitiList });
    }
    setOtherComorbidity = async (otherComorbidity, i) => {
        const { otherComorbidities } = this.state;
        otherComorbidities[i] = otherComorbidity
        this.setState({ otherComorbidity });
    }
    renderCoMorbility = () => {
        const { classes } = this.props;
        const { comorbidityArray, availableComorbidities, morbArray, showErr, otherComorbitiList, otherComorbidities, gettingotherComorbidity } = this.state;
        return <>
            <FormLabel className="inputStyles" component="legend"></FormLabel>
            <div style={{ margin: '10px' }}>
                {
                    morbArray.map((x, i) => {
                        return <FormControlLabel
                            key={i}
                            control={
                                <Checkbox
                                    checked={comorbidityArray.includes(x) ? true : false}
                                    onChange={this.changecomorbidityArray}
                                    name={x}
                                    color="primary"
                                />
                            }
                            label={x}
                        />

                    })
                }
            </div>
            <div>
                {otherComorbidities.length > 0 ? <div style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>
                    <div style={{ margin: '10px' }}>Other Comorbidities</div>
                    <Paper className={classes.root} component="ul">
                        {otherComorbidities.map((data, i) => {
                            return (
                                <li key={i}>
                                    <Chip
                                        className={classes.chip}
                                        label={data}
                                        onDelete={() => this.removeOtherComorbidity(i)}
                                    />
                                </li>
                            );
                        })
                        }
                    </Paper>
                </div> : null}
                <div style={{ flexDirection: 'row' }}>
                    <Autocomplete
                        id="asynchronous-demo"
                        value={this.state.otherComorbidity}
                        style={{ width: 300 }}
                        open={availableComorbidities.length > 0}
                        options={availableComorbidities}
                        onChange={async (e, newValue) => { if (newValue?.length > 1) await this.addOtherComorbidity(newValue) }}
                        getOptionLabel={(x) => x}
                        loading={gettingotherComorbidity}
                        freeSolo
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                value={this.state.otherComorbidity}
                                className="inputStyles"
                                onKeyPress={async (ev) => {
                                    if (ev.key === 'Enter') {
                                        await this.addOtherComorbidity()
                                        ev.preventDefault();
                                    }
                                }}
                                onChange={p => this.setComorbidity(p.target.value)}
                                size={'small'}
                                type='text'
                                id="OtherCo-Morbidity" label="Add Other Co-Morbidities"
                                variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {gettingotherComorbidity ? <CircularProgress color="inherit" size={20} /> : null}
                                            {/* {params.InputProps.endAdornment} */}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />
                </div>
            </div>
        </>
    }


    renderForm1 = () => {
        const { patient } = this.state;
        const { gettingPatient} = this.state;
        const { availableAreas, gettingArea,
            oxygenSaturation, 
            saving, showErr, errorMsg,
            availableLabs,
            gettingLab,
            gettingHospital,
            availableHospitals,
            symptomCdes,
            gettingCdes
        } = this.state;
        switch (this.state.stage) {
            case 1:
                return (
                    <div>
                        <form noValidate autoComplete="off">
                            <div className='card' style={{ flexDirection: 'row', alignContent: 'space-evenly' }}>
                            <FormLabel className='inputStyles' component="legend" style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#154c66', padding: 10, justifyContent: 'center',fontSize: 15, alignSelf: 'center', color: 'white'}}>Demographic Information</FormLabel>
                                <div>
                                <TextField
                                    style={{ width: '125px' }}
                                    value={patient.firstName}
                                    className="inputStyles"
                                    onChange={p => this.setPatientInput('firstName', p.target.value)}
                                    size={'small'}
                                    type='text'
                                    id="firstName" label="First Name*"
                                    error={showErr && !patient.firstName}
                                    variant="outlined" />
                                <TextField
                                    style={{ width: '125px' }}
                                    value={patient.lastName}
                                    className="inputStyles"
                                    onChange={p => this.setPatientInput('lastName', p.target.value)}
                                    size={'small'}
                                    type='text'
                                    id="lastName" label="Last Name*"
                                    error={showErr && !patient.lastName}
                                    variant="outlined" />
                                <TextField
                                    style={{ width: '185px' }}
                                    className="inputStyles"
                                    value={patient.phoneMobile}
                                    onChange={p => this.setMobileNumber('phoneMobile', p, 10)}
                                    size={'small'}
                                    type='text'
                                    id="phoneMobile" 
                                    // label={`Mobile ${patient.phoneMobile.length}/10*`}
                                    label={`Mobile`}
                                    error={showErr && (!patient.phoneMobile || patient.phoneMobile.length < 10)}
                                    variant="outlined" />
                                <MuiPickersUtilsProvider
                                    utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        style={{ width: '300px' }}
                                        className="inputStyles"
                                        size='small'
                                        id="dobpkr"
                                        label="Date Of Birth (dd/MM/yyyy)*"
                                        error={(showErr && (!patient.age && !patient.dateOfBirth)) || patient.dateOfBirth == 'Invalid Date'}
                                        format="dd/MM/yyyy"
                                        value={patient.dateOfBirth}
                                        onChange={(s) => this.handleDateChange(s)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        inputVariant="outlined"
                                    />
                                    <TextField
                                        style={{ width: '85px' }}
                                        className="inputStyles"
                                        value={patient.age}
                                        onChange={p => this.setMobileNumber('age', p, 3)}
                                        size={'small'}
                                        type='text'
                                        id="age" label={`Age`}
                                        error={showErr && ((!patient.age && !patient.dateOfBirth))}
                                        variant="outlined" />

                                </MuiPickersUtilsProvider>
                                <FormControl component="fieldset">
                                    <RadioGroup aria-label="gender" style={{ flexDirection: 'row', margin: '10px' }} name="gender1" value={patient.gender} onChange={p => this.setPatientInput('gender', p.target.value)}>
                                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                    </RadioGroup>
                                </FormControl>
                                </div>
                                <div>
                                <TextField
                                className="inputStyles"
                                value={patient.addressLineOne}
                                onChange={p => this.setPatientInput('addressLineOne', p.target.value)}
                                size={'small'}
                                multiline
                                rowsMax={4}
                                type='text'
                                id="addressLineOne" label="Address Line One"
                                variant="outlined" />
                            <TextField
                                className="inputStyles"
                                value={patient.addressLineTwo}
                                onChange={p => this.setPatientInput('addressLineTwo', p.target.value)}
                                size={'small'}
                                multiline
                                rowsMax={4}
                                type='text'
                                id="addressLineTwo" label="Address Line Two"
                                variant="outlined" />

                            
                            <AutoTextField
                                id={'area'}
                                label={'Area*'}
                                value={patient.area}
                                list={availableAreas}
                                setInput={(v) => this.setPatientInput('area', v)}
                                getApi={() => this.getAutoAddress()}
                                showErr={showErr}
                                setAutoValue={(x) => this.setArea(x)}
                                clearList={() => this.setState({ availableAreas: [] })}
                                getting={gettingArea}
                            />

                            <TextField
                                className="inputStyles"
                                value={patient.city}
                                onChange={p => this.setPatientInput('city', p.target.value)}
                                size={'small'}
                                type='text'
                                id="city" label="city"
                                variant="outlined" />
                            <TextField
                                className="inputStyles"
                                value={patient.pinCode}
                                onChange={p => this.setMobileNumber('pinCode', p, 6)}
                                size={'small'}
                                type='text'
                                //id="pinCode" label={`Pin Code ${patient.pinCode.length}/6`}
                                id="pinCode" label={`Pin Code`}
                                variant="outlined" />
                                </div>
                            </div>
                                
                            <div className='card' style={{ flexDirection: 'row', alignContent: 'stretch' }}>
                            <FormLabel className='inputStyles' component="legend" style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#154c66', padding: 10, justifyContent: 'center',fontSize: 15, alignSelf: 'center', color: 'white'}}>Investigation Information</FormLabel>
                                <div>
                                <FormControl
                                    className="inputStyles"
                                    component="fieldset">
                                        
                                    <FormLabel
                                        error={showErr && !patient.isInvestigationDone}
                                        component="legend">Is Investigation Done?*</FormLabel>
                                    <RadioGroup aria-label="Investigation"
                                        style={{ flexDirection: 'row', margin: '10px', marginBottom: '0px' }} name="gender1"

                                        value={patient.isInvestigationDone}
                                        onChange={p => this.setPatientInput('isInvestigationDone', p.target.value)}
                                    >
                                        <FormControlLabel value={'true'} control={<Radio />} label="Done" />
                                        <FormControlLabel value={'false'} control={<Radio />} label="Not Done" />
                                    </RadioGroup>
                                </FormControl>
                                {patient.isInvestigationDone == 'true' ?
                                    <React.Fragment>
                                        <FormControl
                                            className="inputStyles"
                                            component="fieldset">
                                            <FormLabel
                                                error={showErr && !patient.investigation}
                                                component="legend">Investigation*</FormLabel>
                                            <RadioGroup aria-label="Investigation"
                                                style={{ flexDirection: 'row', margin: '10px', marginBottom: '0px' }} name="investigation" value={patient.investigation}
                                                onChange={p => this.setPatientInput('investigation', p.target.value)}
                                            >
                                                <FormControlLabel value={'Positive'} control={<Radio />} label="Positive" />
                                                <FormControlLabel value={'Negative'} control={<Radio />} label="Negative" />
                                            </RadioGroup>
                                        </FormControl>


                                        <FormControl
                                            className="inputStyles"
                                            component="fieldset">
                                            <FormLabel
                                                error={showErr && !patient.labType}
                                                component="legend">Lab Type</FormLabel>
                                            <RadioGroup aria-label="Investigation"
                                                style={{ flexDirection: 'row', margin: '10px', marginBottom: '0px' }} name="labType"

                                                value={patient.labType}
                                                onChange={p => this.setPatientInput('labType', p.target.value)}
                                            >
                                                <FormControlLabel value={'Government'} control={<Radio />} label="Government" />
                                                <FormControlLabel value={'Private'} control={<Radio />} label="Private" />
                                            </RadioGroup>
                                        </FormControl>


                                        <FormControl
                                            className="inputStyles"
                                            component="fieldset">
                                            <FormLabel
                                                component="legend">Lab Name*</FormLabel>
                                            <AutoTextField
                                                id={'LabName'}
                                                label={'Lab Name'}
                                                value={patient.labName}
                                                list={availableLabs}
                                                setInput={(v) => this.setPatientInput('labName', v)}
                                                getApi={() => this.getAutoLab()}
                                                showErr={showErr}
                                                setAutoValue={(x) => this.setLab(x)}
                                                clearList={() => this.setState({ availableLabs: [] })}
                                                getting={gettingLab}
                                            />
                                        </FormControl>
                                    </React.Fragment> : null}
                                </div>
                            </div>

                            <div className='card' style={{ flexDirection: 'row', alignContent: 'stretch' }}>
                            <FormLabel className='inputStyles' component="legend" style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#154c66', padding: 10, justifyContent: 'center',fontSize: 15, alignSelf: 'center', color: 'white'}}>Oxygen Information</FormLabel>
                                <div>
                                    <TextField
                                    className="inputStyles"
                                    value={patient.oxygenSaturation}
                                    onChange={p => this.setPatientInput('oxygenSaturation', p.target.value)}
                                    size={'small'}
                                    type='text'
                                    id="oxygenSaturation" label="Oxygen Saturation"
                                    variant="outlined" />
                                </div>
                            </div>
                            <div className='card' style={{ flexDirection: 'row', alignContent: 'stretch' }}>
                            <FormLabel className='inputStyles' component="legend" style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#154c66', padding: 10, justifyContent: 'center',fontSize: 15, alignSelf: 'center', color: 'white'}}>symptoms</FormLabel>
                                <div>
                                {gettingCdes ?
                                    <div style={{ textAlign: 'center', margin: '20px' }}>
                                        <CircularProgress />
                                    </div>
                                    : <CheckBoxCdes
                                        cdes={symptomCdes}
                                    />
                                }
                            </div>
                            </div>
                            <div className='card' style={{ flexDirection: 'row', alignContent: 'stretch' }}>
                            <FormLabel className='inputStyles' component="legend" style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#154c66', padding: 10, justifyContent: 'center',fontSize: 15, alignSelf: 'center', color: 'white'}}>Co-Morbidity</FormLabel>
                                
                            <div>
                                {this.renderCoMorbility()}
                            </div>
                            </div>
                            <div className='card' style={{ flexDirection: 'row', alignContent: 'stretch' }}>
                            <FormLabel className='inputStyles' component="legend" style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#154c66', padding: 10, justifyContent: 'center',fontSize: 15, alignSelf: 'center', color: 'white'}}>Hospital summary</FormLabel>
                                
                            <div>
                                <FormControl
                                    className="inputStyles"
                                    component="fieldset">
                                    <FormLabel
                                        component="legend"></FormLabel>
                                    <RadioGroup aria-label="Investigation"
                                        style={{ flexDirection: 'row', margin: '10px', marginBottom: '0px' }} name="patientStatus"

                                        value={patient.patientStatus}
                                        onChange={p => this.setPatientInput('patientStatus', p.target.value)}
                                    >
                                        <FormControlLabel value={'Admitted'} control={<Radio />} label="Hospitalized" />
                                        <FormControlLabel value={'At_Home'} control={<Radio />} label="At Home" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <div>

                                {patient.patientStatus == 'Admitted' ?
                              
                                    <React.Fragment>
                                        <FormControl
                                            className="inputStyles"
                                            component="fieldset">
                                            <FormLabel
                                                error={showErr && !patient.requiredHospital}
                                                component="legend">Required Hospital</FormLabel>
                                            <RadioGroup aria-label="Investigation"
                                                style={{ flexDirection: 'row', margin: '10px', marginBottom: '0px' }} name="requiredHospital"

                                                value={patient.requiredHospital}
                                                onChange={p => this.setPatientInput('requiredHospital', p.target.value)}
                                            >
                                                <FormControlLabel value={'Government'} control={<Radio />} label="Government" />
                                                <FormControlLabel value={'Private'} control={<Radio />} label="Private" />
                                            </RadioGroup>
                                        </FormControl>

                                        <FormControl
                                            className="inputStyles"
                                            component="fieldset">
                                            <FormLabel
                                                component="legend">Hospital Name</FormLabel>
                                            <AutoTextField
                                                id={'hospitalName'}
                                                label={'Hospital Name'}
                                                value={patient.hospitalName}
                                                list={availableHospitals}
                                                setInput={(v) => this.setPatientInput('hospitalName', v)}
                                                getApi={() => this.getAutoHospital()}
                                                showErr={showErr}
                                                setAutoValue={(x) => this.setHospital(x)}
                                                clearList={() => this.setState({ availableHospitals: [] })}
                                                getting={gettingHospital}
                                            />
                                        </FormControl>

                                        <FormControl
                                            className="inputStyles"
                                            component="fieldset">
                                            <FormLabel
                                                component="legend">Suggested Bed</FormLabel>
                                            <RadioGroup aria-label="Suggested Bed"
                                                style={{ flexDirection: 'row', margin: '10px', marginBottom: '0px' }} name="suggestedBed"

                                                value={patient.suggestedBed}
                                                onChange={p => this.setPatientInput('suggestedBed', p.target.value)}
                                            >
                                                <FormControlLabel value={'Isolation Bed'} control={<Radio />} label="Isolation Bed" />
                                                <FormControlLabel value={'O2 Bed'} control={<Radio />} label="O2 Bed" />
                                                <FormControlLabel value={'ICU Bed'} control={<Radio />} label="ICU Bed" />
                                                <FormControlLabel value={'ICU with Ventilator Bed'} control={<Radio />} label="ICU with Ventilator Bed" />
                                            </RadioGroup>
                                        </FormControl>
                                    </React.Fragment> :
                                    <React.Fragment>
                                        <FormControl
                                            className="inputStyles"
                                            component="fieldset">
                                            <FormLabel
                                                component="legend">Suggested By Doctor</FormLabel>
                                            <RadioGroup aria-label="Suggested By Doctor"
                                                style={{ flexDirection: 'row', margin: '10px', marginBottom: '0px' }} name="suggestedBed"

                                                value={patient.suggestedByDr}
                                                onChange={p => this.setPatientInput('suggestedByDr', p.target.value)}
                                            >
                                                <FormControlLabel value={'Hospital'} control={<Radio />} label="Hospital" />
                                                <FormControlLabel value={'Home Quarantine'} control={<Radio />} label="Home Quarantine" />
                                            </RadioGroup>
                                        </FormControl>
                                    </React.Fragment>}

                            </div>

                            </div>
                            <div className='card' style={{ flexDirection: 'row', alignContent: 'stretch' }}>
                            <FormLabel className='inputStyles' component="legend" style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#154c66', padding: 10, justifyContent: 'center',fontSize: 15, alignSelf: 'center', color: 'white'}}>Ambulance summary</FormLabel>
                                
                            <div>
                                <FormControl
                                    className="inputStyles"
                                    component="fieldset">
                                    <FormLabel
                                        component="legend"></FormLabel>
                                    <RadioGroup aria-label="Investigation"
                                        style={{ flexDirection: 'row', margin: '10px', marginBottom: '0px' }} name="ambulanceStatus"

                                        value={patient.medicalStatus}
                                       // onChange={p => this.setPatientInput('medicalStatus', p.target.value)}
                                       onChange={p => this.setPatientInput('medicalStatus', p.target.value)}
                                    >
                                        {/* this.setState({ medicalStatus:'TCYES|TCDYES|HYES|ANO'}) */}
                                        <FormControlLabel value={'TCYES|TCDYES|HNO|AYES'} control={<Radio />} label="Yes" />
                                        <FormControlLabel value={'TCYES|TCDYES|HNO|ANO'} control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <div>

                                {patient.medicalStatus == 'TCYES|TCDYES|HNO|AYES' ?
                               
                                    <React.Fragment>
                                      
                                        <FormControl
                                            className="inputStyles"
                                            component="fieldset">
                                            <FormLabel
                                                error={showErr && !patient.requiredHospital}
                                                component="legend">Ambulance Type</FormLabel>
                                            <RadioGroup aria-label="Investigation"
                                                style={{ flexDirection: 'row', margin: '10px', marginBottom: '0px' }} name="ambulancetype"

                                                value={patient.medicalStatus}
                                                onChange={p => this.setPatientInput('ambulancetype', p.target.value)}
                                            >
                                                <FormControlLabel value={'BVG'} control={<Radio />} label="BVG" />
                                                <FormControlLabel value={'PMC'} control={<Radio />} label="PMC" />
                                            </RadioGroup>
                                        </FormControl>

                                        <FormControl
                                            className="inputStyles"
                                            component="fieldset">
                                            <FormLabel
                                                component="legend">Amulance summary</FormLabel>
                                            <AutoTextField
                                                id={'hospitalName'}
                                                label={'Hospital Name'}
                                                value={patient.hospitalName}
                                                list={availableHospitals}
                                                setInput={(v) => this.setPatientInput('hospitalName', v)}
                                                getApi={() => this.getAutoHospital()}
                                                showErr={showErr}
                                                setAutoValue={(x) => this.setHospital(x)}
                                                clearList={() => this.setState({ availableHospitals: [] })}
                                                getting={gettingHospital}
                                            />
                                        </FormControl>

                                        <FormControl
                                            className="inputStyles"
                                            component="fieldset">
                                            <FormLabel
                                                component="legend">Ambulance Type</FormLabel>
                                            <RadioGroup aria-label="Suggested Bed"
                                                style={{ flexDirection: 'row', margin: '10px', marginBottom: '0px' }} name="suggestedBed"

                                                value={patient.suggestedBed}
                                                onChange={p => this.setPatientInput('suggestedBed', p.target.value)}
                                            >
                                                <FormControlLabel value={'O2'} control={<Radio />} label="O2" />
                                                <FormControlLabel value={'Ventilator with Doctor'} control={<Radio />} label="Ventilator with Doctor" />
                                                <FormControlLabel value={'Normal'} control={<Radio />} label="Normal" />
                                                {/* <FormControlLabel value={'ICU with Ventilator Bed'} control={<Radio />} label="ICU with Ventilator Bed" /> */}
                                            </RadioGroup>
                                        </FormControl>
                                    </React.Fragment> :
                                    <React.Fragment>
                                        {/* <FormControl
                                            className="inputStyles"
                                            component="fieldset">
                                            <FormLabel
                                                component="legend">Suggested By Doctor</FormLabel>
                                            <RadioGroup aria-label="Suggested By Doctor"
                                                style={{ flexDirection: 'row', margin: '10px', marginBottom: '0px' }} name="suggestedBed"

                                                value={patient.suggestedByDr}
                                                onChange={p => this.setPatientInput('suggestedByDr', p.target.value)}
                                            >
                                                <FormControlLabel value={'Hospital'} control={<Radio />} label="Hospital" />
                                                <FormControlLabel value={'Home Quarantine'} control={<Radio />} label="Home Quarantine" />
                                            </RadioGroup>
                                        </FormControl> */}
                                    </React.Fragment>}

                            </div>

                            </div>
                            <div className='card' style={{ flexDirection: 'row', alignContent: 'stretch' }}>
                            <FormLabel className='inputStyles' component="legend" style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#154c66', padding: 10, justifyContent: 'center',fontSize: 15, alignSelf: 'center', color: 'white'}}>Call Center Doctor summary</FormLabel>
                             
                            <div>
                                <TextField
                                    className="inputStyles"
                                    value={patient.callSummary}
                                    onChange={p => this.setPatientInput('callSummary', p.target.value)}
                                    size={'small'}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    style={{ maxWidth: '90%' }}
                                    type='text'
                                    id="callSummary" label="Call Summary"
                                    variant="outlined" />
                            </div>
                            </div>
                            <div className='card' style={{ flexDirection: 'row', alignContent: 'stretch' }}>
                           
                            </div>
                        </form>
                    </div>
                )
            default:
                return null;
        }

    }

    handleClose = () => { };

    render() {
        const { classes } = this.props;
        const { snackMessage, update, showActions, gettingPatient, patient } = this.state;
        
        const { availableAreas, gettingArea,
            oxygenSaturation, 
            saving, showErr, errorMsg,
            availableLabs,
            gettingLab,
            gettingHospital,
            availableHospitals,
            symptomCdes,
            gettingCdes
        } = this.state;
        return (
            <>
                {gettingPatient ? <div style={{ textAlign: 'center', margin: '20px' }}>
                    <CircularProgress />
                </div> :
                    <div style={{ backgroundColor: 'aliceblue', flex: 1 }}>
                        
                          
                                    <div >
                                    <Card style={{ display: 'flex', flexDirection: 'row' }}>
                   
                   <div className='box'>
                       <FormLabel className='inputStyles' component="legend" style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#154c66', padding: 10,fontSize: 15, alignSelf: 'center', color: 'white'}}>
                           Assign To Tele Caller</FormLabel>
                   <div style={{ display: 'flex', flexDirection: 'row',padding:5,marginLeft:'5'}}>
                       <AutoTextField 
                                   id={'Assign'}
                                   label={'Search'}
                                   value={patient.area}
                                   list={availableAreas}
                                   setInput={(v) => this.setPatientInput('area', v)}
                                   getApi={() => this.getAutoAddress()}
                                   showErr={showErr}
                                   setAutoValue={(x) => this.setArea(x)}
                                   clearList={() => this.setState({ availableAreas: [] })}
                                   getting={gettingArea}
                               />
                               </div>
                               <FormLabel className='inputStyles' component="legend" style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#154c66', padding: 10,fontSize: 15, alignSelf: 'center', color: 'white'}}>
                           status</FormLabel>
                           <div>
                                <FormControl
                                    className="inputStyles"
                                    component="fieldset">
                                    <FormLabel
                                        component="legend"></FormLabel>
                                    <RadioGroup aria-label="Investigation"
                                        style={{ flexDirection: 'row', margin: '10px', marginBottom: '0px' }} name="ambulanceStatus"

                                        value={patient.medicalStatus}
                                       // onChange={p => this.setPatientInput('medicalStatus', p.target.value)}
                                       onChange={p => this.setPatientInput('medicalStatus', p.target.value)}
                                    >
                                        {/* this.setState({ medicalStatus:'TCYES|TCDYES|HYES|ANO'}) */}
                                        <FormControlLabel value={'TCYES|TCDYES|HNO|AYES'} control={<Radio />} label="Closed" />
                                        <FormControlLabel value={'TCYES|TCDYES|HNO|ANO'} control={<Radio />} label="Abandoned" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <div>
                            <FormControl
                                            className="inputStyles"
                                            component="fieldset">
                                            <FormLabel
                                                component="legend">Patient summary</FormLabel>
                                            <AutoTextField
                                                id={'hospitalName'}
                                                label={'Hospital Name'}
                                                value={patient.hospitalName}
                                                list={availableHospitals}
                                                setInput={(v) => this.setPatientInput('hospitalName', v)}
                                                getApi={() => this.getAutoHospital()}
                                                showErr={showErr}
                                                setAutoValue={(x) => this.setHospital(x)}
                                                clearList={() => this.setState({ availableHospitals: [] })}
                                                getting={gettingHospital}
                                            />
                                        </FormControl>
                                        </div>
                               <FormLabel className='inputStyles' component="legend" style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#154c66', padding: 10,fontSize: 15, alignSelf: 'center', color: 'white'}}>
                           Save Info</FormLabel>
                           <div style={{ textAlign: 'center' }}>
                                <div style={{ color: 'red' }}>{errorMsg}</div>
                                <Button type="button" variant="contained" color="primary" onClick={() => !saving && this.updatePatient(patient,'')}>{!saving ? 'Submit' : 'Please wait'}</Button>
                            </div>
                               </div>
                       <div className='box'>
                       {this.renderForm1()}
                       </div>
                   </Card>
                                    </div>
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
export default withStyles(useStyles)(connect(mapStateToprops)(HospitalCoUpdate));
