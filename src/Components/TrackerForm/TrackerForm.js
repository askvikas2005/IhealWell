import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import './trackerStyles.css'
export class TrackerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() { }

    componentWillUnmount() {
    }

    model = [];
    getModel = () => { return this.model; }

    toggleSwitch(e) {
        e.testValue = !e.testValue;
        e.touch = true;
        this.setState({});
    }

    textInput(e, text) { e.testValue = text; e.touch = true; this.setState({}); }

    numberInput(e, val) {
        var count = val.replace(/[^.]/g, "").length; e.touch = true;
        if (count <= 1) e.testValue = val; this.setState({});
    }

    selectDropDown(e, val) {
        e.testValue = val;
        e.touch = true;
        this.setState({});
    }

    multiInputNumber(e, val, temp) {
        var count = val.replace(/[^.]/g, "").length; e.touch = true;
        switch (temp) {
            case '1':
                if (count <= 1) e.temp1 = val; this.setState({});
                break;
            case '2':
                if (count <= 1) e.temp2 = val; this.setState({});
                break;
            default:
                break;
        }
    }
    renderForm = () => {
        this.model = this.props?.cdes || [];

        if (this.props.model?.length == 0) {
            return (
                <div><span>Not Available</span></div>
            )
        }

        let UIelements = this.model.map((e, i) => {
            let key = e.clinicalDataElementId; let cdeShortDescription = e.cdeShortDescription; let type = e.cdeInputFieldType;
            return (
                <div className="cdeDiv" key={key}>
                    {(type != 'BooleanToggle') ? <div className="cdeDesc">
                        <span>{cdeShortDescription} <span style={{ fontSize: 16, color: '#333' }}>{e.cdeUnit}</span></span>
                    </div> : null}

                    <div className="cdeValue">
                        {(type === 'TextInput') &&
                            <TextField

                                value={e.testValue}
                                className="inputStyles"
                                onChange={v => this.textInput(e, v.target.value)}
                                size={'small'}
                                type='text'
                                // id="PRN" 
                                label={`Enter ${cdeShortDescription}`}
                                variant="outlined" />
                        }
                        {(type === 'BooleanToggle') &&
                            <FormControlLabel
                                key={i}
                                control={
                                    <Checkbox
                                        checked={e.testValue}
                                        onChange={() => this.toggleSwitch(e)}
                                        name={e}
                                        color="primary"
                                    />
                                }
                                label={cdeShortDescription}
                            />

                        }
                        {(type === 'NumberSpinner') &&
                            <TextField

                                value={e.testValue?.toString()}
                                className="inputStyles"
                                onChange={ev => this.numberInput(e, ev.target.value)}
                                size={'small'}
                                type='text'
                                // id="PRN" 
                                label={`Enter ${cdeShortDescription}`}
                                variant="outlined" />
                        }
                        {(type === 'MultiInputNumberSpinner') &&
                            < div style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TextField

                                    value={e.temp1?.toString()}
                                    className="inputStyles"
                                    onChange={ev => this.multiInputNumber(e, ev.target.value, '1')}
                                    size={'small'}
                                    type='text'
                                    // id="PRN" 
                                    label={`${e.placeHolderOne || 'Input'}`}
                                    variant="outlined" />
                                <div style={{ justifyContent: 'center', display: 'inline-block', alignItems: 'center' }}><span style={{ fontSize: 17, color: '#32a6a8' }}>/</span></div>
                                <TextField

                                    value={e.testValue?.toString()}
                                    className="inputStyles"
                                    onChange={ev => this.multiInputNumber(e, ev.target.value, '2')}
                                    size={'small'}
                                    type='text'
                                    // id="PRN" 
                                    label={`${e.placeHolderTwo || 'Input'}`}
                                    variant="outlined" />
                            </div>
                        }
                    </div>
                </div>

            );
        });
        return UIelements
    }
    render() {
        return (
            <div>
                {/* <Card style={{ width: '90%', marginLeft: '5%',paddingLeft:'10px', marginTop: '10px' }}> */}
                    <div style={{ textAlign: 'center' }}>
                        <h3>{this.props.title}</h3>
                    </div>
                    {this.renderForm()}
                {/* </Card> */}
            </div>
        )
    }
}

export default TrackerForm;
