import profileActions from '../actionTypes/profileActions.types';

const userProfileState = {
  userLoginID: null,
  accessToken: null,
  refreshToken: null,
  firstName: null,
  emailID: null,
  type: null,
  orgID: null,
  dob: null,
  practiceTeamID: null,
  primaryUser: null,
  userID: null,
  prefix: null,
  fullName: null,
  lastName: null,
  phoneMobile: null,
  profilePicURL: null,
  authorities: null,
};

export default ((state = userProfileState, action) => {
  switch (action.type) {
    case profileActions.setUserProfile:
      return { ...state, ...action.payload };
    case profileActions.removeUserProfile:
      return userProfileState;
    case profileActions.setCreadentials:
      return { ...state, ...action.payload };
    default:
      return { ...state }
  }
}
);
