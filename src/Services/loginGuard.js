import ReduxService from './redux.service';

const GuardService = {
    isLogin() {
        if (!localStorage.getItem('userLoginID'))
            return false
        ReduxService.login({ userLoginID: localStorage.getItem('userLoginID') })
        return true
    },
}
export default GuardService;