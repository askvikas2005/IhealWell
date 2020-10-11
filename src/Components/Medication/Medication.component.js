import React, { Component } from 'react';
import { connect } from 'react-redux';
import HttpService from '../../Services/HttpService';
import UrlConstants from '../../UrlConst';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';

import './Medication.css'
class Medication extends Component {
    constructor(props) {
        super(props)
        this.state = {
            medicationList: [],
            showErr: '',
            notValid: false,
            searchedMedicines: [],
            searchingMedicine: false,
            // type: '',
            dosage: '',
            medicineDTO: { medicineID: '', medicineName: '', }
        }
    }


    componentDidMount() {
        this.props.getMedicineData(this.returnMedicine);
        this.setState({ medicationList: this.props.medicationList })
    }

    componentWillUnmount() {
    }


    returnMedicine = () => {
        if (this.state.medicineDTO?.medicineName?.length > 0) {
            this.setState({ showErr: 'Please Press Add Button' })
            setTimeout(() => {
                this.setState({ showErr: '' })
            }, 1500);
            return false
        }
        return this.state.medicationList
    };

    removeMedicine = i => {
        const { medicationList } = this.state;
        console.log(medicationList[i].cronaPrescriptionMedicationId);
        if (medicationList[i].cronaPrescriptionMedicationId) {
            medicationList[i].disabled = true;
        } else {
            medicationList.splice(i, 1)
        }
        this.setState({ medicationList })
    }

    addAgain = i => {
        const { medicationList } = this.state;
        medicationList[i].disabled = false;
        this.setState({ medicationList })
    }

    editMedicine = async (medicine, i) => {
        console.log(medicine);
        const { medicationList } = this.state
        await this.setState({
            medicineDTO: {
                ...this.state.medicineDTO,
                ...{
                    medicineName: medicine.medicineDTO.name,
                    medicineID: medicine.medicineDTO.medicineID || null
                },
                disabled: false,
                cronaPrescriptionMedicationId: medicine.cronaPrescriptionMedicationId || null,
            },
            // type: medicine.type,
            dosage: medicine.dosage
        })
        medicationList.splice(i, 1)
        this.setState({ medicationList })
    }

    addMedicine = async _ => {
        const { medicationList, dosage, medicineDTO } = this.state

        let medicineDTONew = { ...{}, ...medicineDTO }
        medicineDTONew.name = medicineDTO.medicineName;

        if (!medicineDTO.medicineName) {
            await this.setState({ notValid: true })
            return
        }
        // if (!type) {
        //     await this.setState({ notValid: true })
        //     return
        // }

        let d = dosage.split('-');
        if (!d[0]) d[0] = 0;
        if (!d[1]) d[1] = 0;
        if (!d[2]) d[2] = 0;
        if (!d[3]) d[3] = 0;
        let x = {
            medicineDTO: medicineDTONew,
            cronaPrescriptionMedicationId: medicineDTONew.cronaPrescriptionMedicationId || null,
            dosage: d.join('-'),
            // type,
             name: medicineDTO.medicineName
        }
        medicationList.push(x)

        await this.setState({
            // type: '',
             dosage: '',
            notValid: false,
            medicineDTO: {
                medicineID: null,
                medicineName: '',
            },
            medicationList
        })
    }

    setInputval = (k, v) => this.setState({ [k]: v })
    setMedicineName = async medicineName => {
        await this.setState({
            medicineDTO: {
                ...this.state.medicineDTO,
                ...{
                    medicineName, medicineID: null
                },
                cronaPrescriptionMedicationId: null
            }
        })

        if (medicineName.length > 2) {
            this.searchMedicine(medicineName)
        } else {
            this.setState({ searchedMedicines: [] });
        }

    }


    setMedicineDto = m => {
        this.setState({
            medicineDTO: {
                medicineName: m.name,
                medicineID: m.medicineID
            },
            // type: m.dosageForm,
            searchedMedicines: []
        })
    }

    searchMedicine = () => {
        let body = {
            pageNo: 1, pageSize: 9, searchText: this.state.medicineDTO.medicineName
        }

        let Url = UrlConstants.baseUrl + UrlConstants.searchMedicine;
        this.setState({ searchingMedicine: true });
        HttpService.posts(Url).post(body).then(({ data }) => {
            this.setState({ searchingMedicine: false })
            if (data.status === "SUCCESS") {
                if (data.data)
                    this.setState({ searchedMedicines: data.data });
            }
        }).catch((err) => {
            this.setState({ searchingMedicine: false });
        });
    }


    setDosagesInput = (v, i) => {
        if (v.length > 3)
            return
        v = v.replace(/[^0-9]/g, '');
        let dosage = this.state.dosage.split('-')
        dosage[i] = v;
        dosage = dosage.join('-')
        this.setState({ dosage })
    }

    renderDosagesInput = () => {
        const { dosage } = this.state;
        return <div style={{ flexDirection: 'row', justifyContent: 'space-around', padding: '10px' }}>
            <TextField
                style={{ width: '95px', margin: '5px' }}
                value={dosage.split('-')[0] || ''}
                className="inputStyles"
                onChange={v => this.setDosagesInput(v.target.value, 0)}
                size={'small'}
                type='text'
                id="Morning" label="Morning"
                variant="outlined" />
            <TextField
                style={{ width: '95px', margin: '5px' }}
                value={dosage.split('-')[1] || ''}
                className="inputStyles"
                onChange={v => this.setDosagesInput(v.target.value, 1)}
                size={'small'}
                type='text'
                id="Afternoon" label="Afternoon"
                variant="outlined" />
            <TextField
                style={{ width: '95px', margin: '5px' }}
                value={dosage.split('-')[2] || ''}
                className="inputStyles"
                onChange={v => this.setDosagesInput(v.target.value, 2)}
                size={'small'}
                type='text'
                id="Evening" label="Evening"
                variant="outlined" />
            <TextField
                style={{ width: '95px', margin: '5px' }}
                value={dosage.split('-')[3] || ''}
                className="inputStyles"
                onChange={v => this.setDosagesInput(v.target.value, 3)}
                size={'small'}
                type='text'
                id="Night" label="Night"
                variant="outlined" />
        </div>
    }

    render() {
        const { medicineDTO, showErr, notValid, dosage, medicationList, searchingMedicine, searchedMedicines } = this.state;
        return (
            <div>
                <div style={{ textAlign: 'center' }}>
                    <h3>{this.props.title}</h3>
                </div>
                <div>
                    <div className="medications">
                        {medicationList.map((x, i) => {
                            return <div
                                key={i}
                                className="medicines">
                                <div style={{ flex: 8 }}>
                                    <div style={{ color: 'white' }}>{x.medicineDTO.medicineName || x.medicineDTO.name}</div>
                                    <div style={{ color: 'white' }}>Dosage:{x.dosage}</div>
                                </div>
                                <div className="editBtns">
                                    {x.disabled ?
                                        (x.cronaPrescriptionMedicationId) ? <span style={{ paddingRight: '10px', paddingLeft: '10px' }} onClick={() => this.addAgain(i)}>
                                            <span style={{ color: 'white' }}>
                                                <CachedIcon style={{ color: 'white' }} />
                                            </span>
                                        </span> : null
                                        :
                                        <span style={{ paddingRight: '10px', paddingLeft: '10px' }} onClick={() => this.removeMedicine(i)}>
                                            <span style={{ color: 'white' }}>
                                                <DeleteIcon style={{ color: 'white' }} />
                                            </span>
                                        </span>}
                                    {!x.disabled ? <span style={{ paddingRight: '10px' }} onClick={() => this.editMedicine(x, i)}>
                                        <EditIcon style={{ color: 'white' }} />
                                    </span> : null
                                    }
                                </div>
                            </div>
                        })}
                    </div>
                </div>
                <div className='medicineBlock'>
                    <div className="inputBlock">
                        <div className="autocompleteClass">
                            <TextField
                                error={notValid && !medicineDTO.medicineName}
                                style={{ width: '315px', margin: '5px' }}
                                value={medicineDTO.medicineName}
                                className="inputStyles"
                                onChange={v => this.setMedicineName(v.target.value)}
                                size={'small'}
                                type='text'
                                variant="outlined"
                                id="medicineName"
                                label="Medicine Name*"
                            />
                            {(searchingMedicine || (searchedMedicines.length > 0)) ?
                                <div className="autoOPtions">
                                    {searchingMedicine ?
                                        <div style={{ minWidth: '190px', background: 'white', textAlign: 'center' }}><CircularProgress size={24} /></div>
                                        : null}
                                    {(searchedMedicines.length > 0) ? <>
                                        <div
                                            style={{ padding: 10, paddingTop: 0, borderRadius: 1 }}
                                            onClick={() => this.setState({ searchedMedicines: [] })}>
                                            <span style={{ color: 'red' }}>Close Search</span>
                                        </div>
                                        {searchedMedicines.map((m, i) => {
                                            return <div
                                                className="optionClass"
                                                key={i}
                                                style={{ padding: 6, margin: 3, borderRadius: 5, borderWidth: 1, borderColor: '#333' }}
                                                onClick={() => this.setMedicineDto(m)}
                                            >
                                                {m.name}
                                            </div>
                                        })}
                                    </> : null
                                    }
                                </div> : null}

                        </div>

                        {/* <TextField
                            style={{ width: '85px', margin: '5px' }}
                            value={type}
                            error={notValid && !type}
                            className="inputStyles"
                            onChange={v => this.setInputval('type', v.target.value)}
                            size={'small'}
                            type='text'
                            id="Type" label="Type*"
                            variant="outlined" /> */}

                    </div>
                    {this.renderDosagesInput()}
                </div>
                <div style={{ textAlign: 'center' }}>
                    {showErr.length > 0 ? <span style={{ alignSelf: 'center', color: 'red', paddingBottom: 10 }}>{showErr}</span> : null}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div
                        className="addMedicine"
                        onClick={() => this.addMedicine()}>
                        <span style={{ color: 'white', fontSize: 18 }}>Add</span>
                    </div>
                </div>
            </div>
        );
    }
}
function mapStateToprops(state) { return { userLoginID: state.userProfileReducer.userLoginID }; }
export default connect(mapStateToprops)(Medication);