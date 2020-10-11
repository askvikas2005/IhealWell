import profileActions from '../actionTypes/profileActions.types';

export const setUserProfile = item => ({
  type: profileActions.setUserProfile,
  payload: item
});

export const removeUserProfile = _ => ({
  type: profileActions.removeUserProfile,
});

export const setUserCredentials = item =>({
  type:profileActions.setCreadentials,
  payload:item
});
