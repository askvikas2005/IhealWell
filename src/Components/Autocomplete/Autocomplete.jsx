import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import './Autocomplete.css'
function AutoTextField({
    label,
    id,
    value,
    list,
    setInput,
    getApi,
    showErr,
    setAutoValue, clearList, getting
}) {

    return (
        <div className="autocompleteClass">
            <TextField
                className="inputStyles"
                value={value}
                onChange={async p => {
                    await setInput(p.target.value)
                    getApi()
                }}
                size={'small'}
                type='text'
                id={id}
                label={label}
                error={showErr && !value}
                variant="outlined" />
            {(list.length > 0 || getting) ? <div className="autoOPtions">
                {list.length > 0 ?
                    <div>
                        {getting ? <div>loading</div> :
                            <div
                                onClick={() => clearList()}
                                className='CloseButton'>
                                Close Search
                                                </div>
                        }
                        {
                            list.map((x, i) =>
                                <div
                                    className="optionClass"
                                    onClick={() => setAutoValue(x)}
                                    key={i}>
                                    {x}
                                </div>
                            )
                        }
                    </div>
                    : null}
            </div> : null}
        </div>

    );
}
export default AutoTextField;
