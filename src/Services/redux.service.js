import store from '../Redux/store';
import profileActions from '../Redux/actionTypes/profileActions.types';
import { setUserCredentials, setUserProfile } from '../Redux/actions/userProfileActions';

const ReduxService = {
    async logout() {
        await localStorage.clear();
        store.dispatch({ type: profileActions.removeUserProfile });
    },
    async login(creadentials) {
        store.dispatch(setUserCredentials(creadentials))
    },
    async setProfile(item) {
        store.dispatch(setUserProfile(item))
    },
    trackreScreenGuard(status){
        if (status==='Deceased'||status==='Discharged') {
            return false;
        }
        return true;
    }
}

export default ReduxService;