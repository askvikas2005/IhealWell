import React, { useEffect, useState } from 'react';
import HttpService from '../../Services/HttpService';
import UrlConstants from '../../UrlConst';
import { useHistory } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import ReduxService from '../../Services/redux.service';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import './Searchbar1.css'
function Searchbar1() {
    let history = useHistory();

    const [searchText, setSearchText] = useState('');
    const [spinner, setSpinner] = useState(false);
    const [patientList, setPatientList] = useState([]);

    function gotoPatient(p) {
        if (!ReduxService.trackreScreenGuard(p.patientStatus))
            return;
        localStorage.setItem('fromAddPatient', 'Yes');
        localStorage.setItem('cronaPatientId', `${p.cronaPatientId}`)
        history.push('/patienttracker')
    }

    async function searchPatient(s) {
        await setSearchText(s);
        if (searchText.length >= 2) {
            setSpinner(true)
            try {
                let body = JSON.parse(localStorage.getItem('patientSearchCriteria')) || {};
                body.searchText = searchText;
                body.userId = localStorage.getItem('userID');
                body.pageNo = 1;
                body.pageSize = 9;
                let url = UrlConstants.baseUrl + UrlConstants.getPatient;
                let response = await HttpService.posts(url).post(body);
                setSpinner(false)
                if (response.status === 200) {
                    if (response.data.status === 'SUCCESS') {
                        if (response.data.data) {
                            setPatientList(response.data.data)
                        }
                    }
                } else {
                    alert('something went wrong' + response.status);
                }
            } catch (error) {
                setSpinner(false)
                if (error.response) {
                    alert('Network Error Please Try Later');
                } else {
                    setSpinner(false)
                    alert('Please Try Later')
                }
            }

        }
    }

    async function closeSearch() {
        await setPatientList([])
        await setSearchText('')
    }

    return (
        <div className="searchBar">
            <div style={{ textAlign: 'center'}}>Todays Registered Patients</div><br></br>
            <input
                type="text"
                value={searchText}
                placeholder="Search patient by name or PRN"
                onChange={(e) => searchPatient(e.target.value)} />
            {searchText.length > 1 ?
                <CloseIcon
                    onClick={() => closeSearch()}
                    className="searchIconClass" /> :
                <SearchIcon className="searchIconClass" />
            }
            {(spinner || (patientList.length > 0)) ?
                <div className="options-class">
                    {spinner ?
                        <div style={{ textAlign: 'center' }}><CircularProgress size={24} /></div>
                        : null}
                    {(patientList.length > 0) ? <>
                        <div
                            className='closeBtn'
                            onClick={() => closeSearch()}
                        >
                            <span style={{ color: 'red', cursor: 'pointer' }}>Close Search</span>
                        </div>
                        {patientList.map((p, i) => {
                            return <div
                                className="sub-optionClass"
                                key={i}
                                onClick={() => gotoPatient(p)}
                            >
                                {p.firstName} {p.lastName}
                            </div>
                        })}
                    </> : null
                    }
                </div> : null}
            {(searchText.length > 1 && patientList.length === 0 && !spinner) ?
                <div
                    className="options-class"
                    onClick={() => closeSearch()}
                    style={{ textAlign: 'center', padding: '7px', color: 'red' }}>
                          No Records Found 
                </div>
                : null}

        </div>
    );
}
export default Searchbar1;
