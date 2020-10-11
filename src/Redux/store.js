import { createStore ,
    // applyMiddleware
} from 'redux';
import rootReducer from './reducers';
// import logger from 'redux-logger';
// const middlewares = [logger];
// export default store = createStore(rootReducer,applyMiddleware(...middlewares));
export default createStore(rootReducer);
