import React, { Component } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import Button from '@material-ui/core/Button';

class UpdateStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'Admitted',
            reason: '',
            renderPicker: false,
            remarks: '',
            saving: false,
            otherReasonText: '',
            showErr: false,
            dischargeReasons: [
                { label: "Covid Test Negative", value: "Covid test negative" },
                { label: "Recovered", value: "Recovered" },
                { label: "DAMA discharged", value: "DAMA discharged" },
                { label: "Shifted to other hospital", value: "Shifted to other hospital" },
                { label: 'Shifted to other hospital- ICU Bed not available', value: 'Shifted to other hospital- ICU Bed not available' },
                { label: 'Shifted to other hospital- Ventilator not available', value: 'Shifted to other hospital- Ventilator not available' },
                { label: 'Shifted to other hospital- Patient is willing for Other hospital', value: 'Shifted to other hospital- Patient is willing for Other hospital' },
                { label: 'Other', value: 'Other' }
            ],
            deceasedReasons: [
                { label: "Due To Covid", value: "Due To Covid" },
                { label: "Due to Cardiac Diseases", value: "Due to Cardiac Diseases" },
                { label: "Due to Cardio - Respiratory Arrest", value: "Due to Cardio - Respiratory Arrest" },
                { label: "Due to Respiratory Diseases", value: "Due to Respiratory Diseases" },
                { label: 'Due to Cardiac Arrest', value: 'Due to Cardiac Arrest' },
                { label: 'Due to Pneumonia', value: 'Due to Pneumonia' },
                { label: 'Due to Multiple Organ Failure', value: 'Due to Multiple Organ Failure' },
                { label: 'Due to Obesity', value: 'Due to Obesity' },
                { label: 'Due to Uncontrolled Diabetes', value: 'Due to Uncontrolled Diabetes' },
                { label: 'Due to Renal Diseases', value: 'Due to Renal Diseases' },
                { label: 'Due to Cancer Disease', value: 'Due to Cancer Disease' },
                { label: 'Other', value: 'Other' },
            ]
        }
    }
    componentDidMount() {
        if (this.props.status) { this.setState({ status: this.props.status }) }
    }
    setStatus = async (status) => {
        await this.setState({ status, renderPicker: false, reason: '' })
        setTimeout(() => {
            this.setState({ renderPicker: false })
        }, 100);
    }

    cancel = () => {
        if (localStorage.getItem('createPopup') === 'Status') {
            localStorage.setItem('createPopup', 'Submit');
            this.props.setModalVisible('');
            this.props.callSubmit();
        } else {
            this.props.setModalVisible('')
        }
    }


    submitStatus = async () => {
        const { status, reason, otherReasonText, remarks } = this.state;
        await this.setState({ showErr: false });
        if (status !== 'Admitted')
            if (reason.length === 0) {
                await this.setState({ showErr: true });
                return
            }

        let body = { patientStatus: status, remarks }

        if (reason === 'Other') {
            if (!otherReasonText) {
                await this.setState({ showErr: true });
                return
            }
            body.reason = otherReasonText
        } else {
            body.reason = reason
        }

        this.setState({ saving: true })


        if (localStorage.getItem('createPopup') === 'Status') {
            this.props.updatePatient({ patientStatus: status, reason, remarks })
            return
        }

        this.props.updatePatient({ patientStatus: status, reason, remarks }, 'Dashboard')
    }


    handleChange = async event => {
        let reason = event.target.value;
        await this.setState({ reason })
    };

    getReasonList = () => {
        const { status, deceasedReasons, dischargeReasons } = this.state;
        return (status === 'Discharged') ? dischargeReasons : deceasedReasons
    }

    render() {
        const { status, reason, remarks, showErr, saving, otherReasonText } = this.state
        return (
            <div>
                <div style={{ margin: '10px' }} >
                    <span>Update Status</span>
                    <div>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="gender" style={{ flexDirection: 'row', margin: '10px' }} name="gender1" value={status} onChange={e => this.setStatus(e.target.value)}>
                                <FormControlLabel value="Admitted" control={<Radio />} label="Admitted" />
                                <FormControlLabel value="Discharged" control={<Radio />} label="Discharged" />
                                <FormControlLabel value="Deceased" control={<Radio />} label="Deceased" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <>
                        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                            <div>
                                <FormControl variant="outlined" size='small' fullWidth>
                                    <InputLabel id="select-reason-label">Reason*</InputLabel>
                                    <Select
                                        disabled={status === 'Admitted'}
                                        variant='outlined'
                                        label="Reason*"
                                        labelId="selectReasonId"
                                        id="selectreason"
                                        value={reason}
                                        onChange={this.handleChange}
                                    >
                                        {this.getReasonList().map(x => (
                                            <MenuItem value={x.label}>{x.value}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            {reason === 'Other' ?
                                <div style={{ marginTop: '10px' }}>
                                    <TextField
                                        fullWidth
                                        value={otherReasonText}
                                        onChange={e => this.setState({ otherReasonText: e.target.value })}
                                        size={'small'}
                                        type='text'
                                        id="reason" label="Enter other reason"
                                        variant="outlined" />
                                </div>
                                : null}

                        </div>
                    </>
                    <div style={{ marginBottom: '10px' }}>
                        <TextField
                            fullWidth
                            value={remarks}
                            onChange={e => this.setState({ remarks: e.target.value })}
                            size={'small'}
                            type='text'
                            id="remarks" label="Enter Remarks"
                            variant="outlined" />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        {(showErr && reason.length === 0) ? <span style={{ fontSize: 14, color: 'red', alignSelf: 'center' }}>Please select reason</span> : null}
                        {(showErr && reason === 'Other' && !otherReasonText) ? <span style={{ fontSize: 14, color: 'red', alignSelf: 'center' }}>Please enter other reason</span> : null}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button
                            variant="contained"
                            color='primary'
                            onClick={() => this.cancel()}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color='primary'
                            onClick={() => { if (!saving) this.submitStatus() }}
                        >
                            {!saving ? 'Save' : 'Please wait'}
                        </Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default UpdateStatus;