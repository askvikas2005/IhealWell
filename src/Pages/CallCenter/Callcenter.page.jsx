import 'date-fns';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom"
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import './Callcenter.css'
import Checkbox from '@material-ui/core/Checkbox';
import ReduxService from '../../Services/redux.service';
import UrlConstants from '../../UrlConst';
import HttpService from '../../Services/HttpService';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Snackbar from '@material-ui/core/Snackbar';
import moment from 'moment'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import AutoTextField from '../../Components/Autocomplete/Autocomplete';
import CheckBoxCdes from '../../Components/CheckBoxCdes/CheckBoxCdes';

const useStyles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
    },

});
class AddPatientCC extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
                dateOfBirth: null,
                dummy:'TCYES|TCDNO|HNO|ANO',
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
        }
    }

    componentDidMount() {
        localStorage.removeItem('cronaPatientId');
        this.getCdes()
    }


    getCdes = () => {
        let body = { userId: localStorage.getItem('userID') }
        let url = UrlConstants.baseUrl + UrlConstants.getTestForms;
        this.setState({ gettingCdes: true })
        HttpService.posts(url).post(body).then(({ data }) => {
            this.setState({ gettingCdes: false })
            if (data.status == "SUCCESS") {
                if (data.data.symptoms)
                    this.setState({ symptomCdes: data.data.symptoms })
            } else {
                alert('No records found')
            }
        }).catch((err) => {
            this.setState({ gettingCdes: false });
        });
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

    changecomorbidityArray = (v) => {
        const { comorbidityArray } = this.state;
        let i = comorbidityArray.findIndex(x => x === v.target.name)
        i === -1 ? comorbidityArray.push(v.target.name) : comorbidityArray.splice(i, 1)
        this.setState({ comorbidityArray })
    }


    setMobileNumber = (k, e, l) => {
        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
        if (onlyNums.length <= l) {
            this.setState({ patient: { ...this.state.patient, ...{ [k]: onlyNums } } })
        }
    }

    setPatientInput = async (k, v) => {
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

    gotoPatient = async (cronaPatientId) => {
        localStorage.setItem('fromAddPatient', `yes`);
        localStorage.setItem('cronaPatientId', `${cronaPatientId}`)
        this.props.history.push('/tracker')
    }

    checkValidation = () => {
        const { firstName, lastName, phoneMobile, area, dateOfBirth, age } = this.state.patient
        const { comorbidityArray } = this.state
        if (!(firstName && lastName && phoneMobile && area && (dateOfBirth || age))) {
            this.setState({ errorMsg: 'Please fill all * marked fields', showErr: true })
            setTimeout(() => {
                this.setState({ errorMsg: '' })
            }, 2000);
            return false
        }
        if (phoneMobile.length !== 10) {
            this.setState({ errorMsg: 'Please enter valid mobile number', showErr: true })
            setTimeout(() => {
                this.setState({ errorMsg: '' })
            }, 2000);
            return false
        }
        return true
    }
    savePatient = async () => {
        if (!this.checkValidation()) return;
        const { otherComorbidities, newArea } = this.state;
        let url = UrlConstants.baseUrl + UrlConstants.registerPatient
        let frm = [], entryDate = new Date().getTime()
        let cdes = [...this.state.symptomCdes].forEach(p => {
            let testValue = null;
            if (p.touch) {
                testValue = ((p.cdeInputFieldType === 'BooleanToggle') && (p.testValue === true)) ? 'Yes' : 'No'
            }
            let x = {
                clinicalDataElementId: p.clinicalDataElementId,
                testValue,
                entryDate
            }
            frm.push(x)
        });

        let body = { ...this.state.patient }
        body.testValueList = frm

        body.comorbidity = this.state.comorbidityArray.join('|')
        if (this.state.otherComorbidity) {
            await this.addOtherComorbidity()
            body.comorbidity = body.comorbidity + `|${this.state.otherComorbidity}`
        }
        if (otherComorbidities.length > 0) {
            body.comorbidity = body.comorbidity + '|' + otherComorbidities.join('|')
        }

        if (body.isInvestigationDone !== 'true') {
            body.investigation = undefined;
        } else {
            body.isInvestigationDone = true;
        }

        if (body.patientStatus !== 'Admitted') {
            body.hospitalName = undefined;
            body.requiredHospital = undefined;
            body.suggestedBed = undefined;
        } else {
            body.suggestedByDr = undefined
        }





        body.otherComorbitiList = this.state.otherComorbitiList;
        body.userId = JSON.parse(localStorage.getItem('userProfile')).userID;
        body.newArea = newArea;
        //alert('console');
        //console.log(body)
        //console.log(JSON.stringify(body));
       // return
        this.setState({ saving: true, showErr: false })
        HttpService.posts(url).post(body).then(({ data }) => {
            this.setState({ saving: false })
            if (data.status === "SUCCESS") {
                if (data.data.cronaPatientId) {
                    // this.setState({ snackMessage: 'Patient registration successful' })
                    this.gotoPatient(data.data.cronaPatientId)
                    // this.resetPatient()
                } else {
                    alert('Error')
                }
            } else {
                alert(JSON.stringify(data.status))
            }
        }).catch((err) => {
            this.setState({ saving: false });
            if (err.response) {
                if (err.response.status === 401) {
                    if (err.response.data.oauth2ErrorCode === 'invalid_token') {
                        alert('Your session is expired,please login again');
                        ReduxService.logout();
                    }
                }
            } else {
                // Alert.alert('No Internet', 'Please Enable Internet', [{ text: 'Retry', onPress: () => this.savePatient() }]);
            }
        });
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
            <FormLabel className="inputStyles" component="legend">Co-Morbidity</FormLabel>
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


    renderForm = () => {
        const { patient } = this.state;
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
                            <FormLabel className='inputStyles' component="legend">Demographic Information</FormLabel>
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
                                    id="phoneMobile" label={`Mobile ${patient.phoneMobile.length}/10*`}
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

                            {/* <div className="autocompleteClass">
                                <TextField
                                    className="inputStyles"
                                    value={patient.area}
                                    onChange={async p => {
                                        await this.setPatientInput('area', p.target.value)
                                        this.getAutoAddress()
                                    }}
                                    size={'small'}
                                    type='text'
                                    id="area" label="Area*"
                                    error={showErr && !patient.area}
                                    variant="outlined" />
                                {(availableAreas.length > 0 || gettingArea) ? <div className="autoOPtions">
                                    {availableAreas.length > 0 ?
                                        <div>
                                            {gettingArea ? <div>loading</div> :
                                                <div
                                                    onClick={() => this.setState({ availableAreas: [] })}
                                                    style={{ minWidth: '190px', background: 'white', textAlign: 'center' }}>
                                                    Close Search
                                                </div>
                                            }
                                            {
                                                availableAreas.map((x, i) =>
                                                    <div
                                                        className="optionClass"
                                                        onClick={() => this.setArea(x)}
                                                        key={i}>
                                                        {x}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        : null}
                                </div> : null}
                            </div> */}


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
                                id="pinCode" label={`Pin Code ${patient.pinCode.length}/6`}
                                variant="outlined" />
                            <>
                            </>
                            <div style={{ flexDirection: 'row', alignContent: 'stretch' }}>
                                <div style={{ flex: 1 }}>
                                </div>
                            </div>



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


                            <div>
                                'Symptomes'
                                {gettingCdes ?
                                    <div style={{ textAlign: 'center', margin: '20px' }}>
                                        <CircularProgress />
                                    </div>
                                    : <CheckBoxCdes
                                        cdes={symptomCdes}
                                    />
                                }
                            </div>

                            <div>
                                {this.renderCoMorbility()}
                            </div>
                            <div>
                                <FormControl
                                    className="inputStyles"
                                    component="fieldset">
                                    <FormLabel
                                        component="legend">Patient Status*</FormLabel>
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

                            {/* <div>
                                <FormControl
                                    className="inputStyles"
                                    component="fieldset">
                                    <FormLabel
                                        error={showErr && !patient.medicalStatus}
                                        component="legend">Severity*</FormLabel>
                                    <RadioGroup aria-label="Severity" style={{ flexDirection: 'row', margin: '10px', marginBottom: '0px' }} name="gender1" value={patient.medicalStatus} onChange={p => this.setPatientInput('medicalStatus', p.target.value)}>
                                        <FormControlLabel value="Isolation Bed without Oxygen" control={<Radio />} label="Isolation Bed without Oxygen" />
                                        <FormControlLabel value="Isolation Bed with Oxygen" control={<Radio />} label="Isolation Bed with Oxygen" />
                                        <FormControlLabel value="ICU without Ventilator" control={<Radio />} label="ICU without Ventilator" />
                                        <FormControlLabel value="ICU with Ventilator" control={<Radio />} label="ICU with Ventilator" />
                                    </RadioGroup>
                                </FormControl>
                            </div> */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: 'red' }}>{errorMsg}</div>
                                <Button type="button" variant="contained" color="primary" onClick={() => !saving && this.savePatient()}>{!saving ? 'Save' : 'Please wait'}</Button>
                            </div>
                        </form>
                    </div>
                )
            default:
                return null;
        }

    }


    render() {
        return (
            <div>
                <Card style={{ width: '90%', marginLeft: '5%', marginTop: '50px' }}>
                    {this.renderForm()}
                </Card>
                <Snackbar
                    autoHideDuration={2000}
                    open={this.state.snackMessage?.length > 0}
                    message={this.state.snackMessage}
                />
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

const H = withRouter(AddPatientCC);

const AddPatientFromCC = connect(mapStateToprops)(H);

export default withStyles(useStyles)(AddPatientFromCC);