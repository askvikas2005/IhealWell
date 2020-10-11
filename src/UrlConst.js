const UrlConstants = {
      loginUrl: 'http://52.41.70.107:8080/IHW/oauth',
    
     baseUrl1: 'http://44.235.184.166:8080/IHW/rest/',

   // loginUrl: 'https://api.ihealwell.in/IHW/oauth',
    baseUrl: 'https://api.ihealwell.in/IHW/rest/',
    authUrl: 'user/authority/all',

    userProfile:'user/profile',
    getPatient:'get/crona/patient',
    addCPtData:'add/crona/patient/data',
    searchMedicine:'search/medicine',
    getTestForms:'get/crona/patient/test/form',
    saveTestForm:'add/crona/patient/testResult',
    registerPatient:'register/cronaPatient',
    getDashboard:'get/crona/dashboard',
    checkForUpdate: 'appversion/get',
    getPrescription:'get/crona/presription/data',
    searchArea:'search/crona/patient/area',
    getComorbidity:'get/comorbidity',
    //getDoctor:'practiceTeamMembers',
    getDoctor:'get/crona/doctors',
    updateHistory:'update/cronaOrder/history',
    getHistory:'get/crona/order',

}
export default UrlConstants;