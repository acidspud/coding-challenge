import { FETCH_ITEM_LIST } from '@/actions/actionTypes'

export function itemListReducer(state = [], action) {

    switch (action.type) {
    case FETCH_ITEM_LIST: {
        return action.payload
    }
    default: {
        return state
    }
    }
}
