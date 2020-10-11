import 'date-fns';
import React, { Component } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import moment from 'moment'
import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
class AddInvestigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            result: "Negative",
            showDatePicker: false,
            resultDate: new Date(),
            today: new Date(),
        }
    }


    submitInvestigation = () => {
        const { result, resultDate } = this.state
        this.setState({ saving: true });
        this.props.updatePatient({ result: (result === 'Negative') ? false : true, resultDate })
    }

    changeDate = (e) => {
        this.setState({ resultDate: e })
    }
    componentDidMount() {
    }

    render() {
        const { saving, result, showDatePicker, resultDate, today } = this.state
        return (
            <div style={{ flex: 1, justifyContent: 'center', minWidth: '400px', padding: '20px' }}>
                <div>
                    <span style={{ alignSelf: 'center', fontSize: 20, marginBottom: 25 }}>Add Investigation</span>
                    {this.props.latestInvestigationDate ? 
                    <div style={{ alignSelf: 'center', fontSize: 20, marginBottom: 25 }}>
                        <span style={{ fontSize: 17 }}>Last Investigation Date{' '}</span>
                        {moment(new Date(this.props.latestInvestigationDate)).format('DD MMM yyyy')}</div> : null}
                    <div>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="gender" style={{ flexDirection: 'row', margin: '10px' }} name="gender1" value={result} onChange={e => this.setState({ result: e.target.value })}>
                                <FormControlLabel value="Negative" control={<Radio />} label="Negative" />
                                <FormControlLabel value="Positive" control={<Radio />} label="Positive" />
                            </RadioGroup>
                        </FormControl>

                        <div >
                            <div
                                onClick={() => this.setState({ showDatePicker: true })}
                            >
                                <MuiPickersUtilsProvider
                                    utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        size='small'
                                        fullWidth
                                        id="dobpkr"
                                        label="Investigation Date (dd/MM/yy) "
                                        format="dd/MM/yyyy"
                                        value={resultDate}
                                        maxDate={today}
                                        onChange={(s) => this.changeDate(s)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        inputVariant="outlined"
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                        </div>

                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={() => this.props.setModalVisible('')}
                        >Cancel
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={() => { if (!saving) this.submitInvestigation() }}
                        >
                            {!saving ? 'Save' : 'Please wait'}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddInvestigation;