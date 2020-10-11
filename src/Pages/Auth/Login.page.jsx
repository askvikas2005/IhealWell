import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import HttpService from '../../Services/HttpService';
import ReduxService from '../../Services/redux.service';
import UrlConstants from '../../UrlConst';
import CircularProgress from '@material-ui/core/CircularProgress';
import pmcLogo from '../../assets/pmcLogo.png'
import ihealWellLogo from '../../assets/logo.png'

function Login() {
    let history = useHistory();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [spinner, setSpinner] = useState(false);

    useEffect(() => { if (localStorage.getItem('userLoginID')) { history.push('/dashboard') } }, []);

    function dologin() {
        if (password.length > 0 && username.length > 0) {
            let token="add3bf9b-0851-4692-9ef0-286d84fe7d29";
           //let token="502321b7-08c0-4aab-8080-dcdca9c10ed6";
            let oauthUrl = `${UrlConstants.loginUrl}/token?grant_type=password&username=${username.toLowerCase()}&password=${password}`;
            //add3bf9b-0851-4692-9ef0-286d84fe7d29
            let config = { 'Content-Type': 'application/json', Authorization: 'Basic aGNhcHA6aGNhcHA=', };
            setSpinner(true)
            HttpService.auth(oauthUrl, config).Login().then(res => {
               //alert(JSON.stringify(res))
                if (res.status === 200) {
                    
                    let authAllBody = { userLoginID: username.toLowerCase(), accessToken: token, };
                    //let authAllBody = { userLoginID: username.toLowerCase(), accessToken: token, };
                   
                    //let configHeader = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + res.data.value };
                    let configHeader = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };
                    let authUrl = UrlConstants.baseUrl + UrlConstants.authUrl;
                    
                    HttpService.auth(authUrl, configHeader).authAll(authAllBody).then(response => {
                        //alert(JSON.stringify(response))
                        if (response.status === 200) {
                            
                            if (response.data.data !== null && response.data.data !== '') {
                                let authObj = response.data.data;
                                //alert(JSON.stringify(response.data.data))
                                if (authObj.authorities) {
                                    let authorities = authObj.authorities[0];
                                    let userType = authObj.userType;
                                    if (authorities) {
                                        if (authorities !== 'ROLE_hcpatient') {
                                           // localStorage.setItem('accessToken', res.data.value)
                                           localStorage.setItem('accessToken', token)
                                            localStorage.setItem('refreshToken', token)
                                            localStorage.setItem('userLoginID', username.toLowerCase())
                                            localStorage.setItem('authorities', authorities)
                                            localStorage.setItem('userType', userType)
                                            HttpService.setNewToken()
                                            setSpinner(false)
                                            let creadentials = {
                                                userLoginID: username.toLowerCase(), accessToken: token,
                                               // refreshToken: res.data.refreshToken.value,
                                               refreshToken: token,
                                                authorities: authorities,
                                            };
                                            ReduxService.login(creadentials);
                                            
                                            history.push('/dashboard');
                                        }
                                       
                                    }
                                } else { alert('Error,User not authorised'); }
                            } else { alert('Error,Invalid User'); }
                        } else { alert('Error,Something went wrong'); }
                        setSpinner(false)
                    }).catch(error => {
                        if (error.response) {
                            if (error.response.status === 401) { alert('Error,Header Null'); }
                            else { alert('Error,Something went wrong'); }
                        } else if (error.request) {
                            alert('Error,Server Error');
                        } else {
                            if (error.response.data.oauth2ErrorCode === 'invalid_token') {
                                                 alert('invalid_token');
                                //                 ReduxService.logout();
                                           }
                            alert('Error,Something went wrong'); }
                        setSpinner(false)
                    });
                } else {
                    setUsername(''); setPassword(''); setSpinner(false)
                }
            }).catch(err => {
                if (err.response) {
                    if (err.response.status === 400) {
                        alert('Error,Invalid Credentials');
                    } else {
                        alert('Error,Network Error Please Try Later');
                    }
                } else if (err.request) {
                    console.log('login');
                    console.log(err);
                    alert('No Internet,Please Enable Internet and try again');
                }
                setSpinner(false)
            });
        }
    }


    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Card style={{ width: '600px' }}>
                <CardContent>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}><img width='130' height='130' src={pmcLogo} alt="PMC" /></div>
                        <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}><img width='130' height='130' src={ihealWellLogo} alt="iHealWell" /></div>
                    </div>
                    <div style={{ textAlign: 'center', color: '#1976d2', fontSize: 24, margin: '10px' }}>
                        iHealWell Patient Care
                    </div>

                    <div style={{ textAlign: 'center' }}>


                        <form noValidate autoComplete="off">
                            <div style={{ margin: '12px' }}>
                                <TextField
                                    value={username}
                                    onChange={(u) => setUsername(u.target.value)}
                                    size={'small'}
                                    id="loginIdCritical" label="Enter Username"
                                    variant="outlined" />
                            </div>
                            <div style={{ margin: '12px', marginBottom: '0px' }}>
                                <TextField
                                    value={password}
                                    onChange={(p) => setPassword(p.target.value)}
                                    size={'small'}
                                    type='password'
                                    id="passwordCritical" label="Enter Password"
                                    variant="outlined" />
                            </div>
                        </form>
                    </div>
                </CardContent>
                <CardActions style={{ justifyContent: 'center' }}>
                    <Button
                        onClick={() => !spinner && dologin()}
                        variant="contained" color="primary" size="small">
                        {spinner ? <CircularProgress size={21} color="secondary" /> : 'LogIn'}
                    </Button>
                </CardActions>
                <div style={{ textAlign: 'center', color: '#1976d2', fontSize: 14, margin: '10px' }}>
                    In association with Pune Municipal Corporation
                    </div>
            </Card>
        </div>
    );
}
export default Login;
