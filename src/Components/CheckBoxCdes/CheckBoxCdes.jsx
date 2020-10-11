import React, { Component } from 'react'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import './CheckBoxCdes.css'
export class CheckBoxCdes extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    model = [];

    getModel = () => { return this.model; }

    toggleSwitch(e) {
        e.testValue = !e.testValue;
        e.touch = true;
        this.setState({});
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
                    </div>
                </div>

            );
        });
        return UIelements
    }
    render() {
        return (
            <div className='flexCdes'>
                    {/* <div style={{ textAlign: 'center' }}>
                        <h3>{this.props.title}</h3>
                    </div> */}
                    {this.renderForm()}
            </div>
        )
    }
}

export default CheckBoxCdes;
