import { combineReducers } from 'redux'
import { sessionReducer } from '@/reducers/session'
import { itemListReducer } from '@/reducers/item'

const rootReducer = combineReducers({
    session: sessionReducer,
    itemList: itemListReducer
})

export default rootReducer
