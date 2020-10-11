import React, { Component } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class UpdateSeverity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            severity: 'Isolation Bed without Oxygen'
        }
    }
    submitSeverity = () => {
        this.setState({ saving: true });
        this.props.updatePatient({ medicalStatus: this.state.severity })
    }

    componentDidMount() {
        if (this.props.medicalStatus) this.setState({ severity: this.props.medicalStatus })
    }

    cancel=()=>{
        if(localStorage.getItem('createPopup')!=="Submit"){
            localStorage.setItem('createPopup', 'Status');
            this.props.setModalVisible('Status')
        }else{
            this.props.setModalVisible('')
        }
    }

    render() {
        const { saving, severity } = this.state
        return (
            <div>
                <div >
                    <span style={{ alignSelf: 'center', fontSize: 20, marginBottom: 25 }}>Update Severity</span>
                    <div>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="gender" style={{ flexDirection: 'row', margin: '10px' }} name="gender1" value={severity} onChange={e => this.setState({ severity: e.target.value })}>
                                <FormControlLabel value="Isolation Bed without Oxygen" control={<Radio />} label="Isolation Bed without Oxygen" />
                                <FormControlLabel value="Isolation Bed with Oxygen" control={<Radio />} label="Isolation Bed with Oxygen" />
                                <FormControlLabel value="ICU without Ventilator" control={<Radio />} label="ICU without Ventilator" />
                                <FormControlLabel value="ICU with Ventilator" control={<Radio />} label="ICU with Ventilator" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent:'space-evenly' }}>
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
                            onClick={() => { if (!saving) this.submitSeverity() }}
                        >
                            {!saving ? 'Save' : 'Please wait'}
                        </Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default UpdateSeverity;