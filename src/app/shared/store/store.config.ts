import { ActionReducer, MetaReducer } from '@ngrx/store';

import { environment } from '../../../environments/environment';

function logger(reducer: ActionReducer<any>): ActionReducer<any> {
    return function (state, action) {
        const result = reducer(state, action);
        console.group(`%c ${action.type}`, 'color: green;');
        console.log('prev state', state);
        console.log('action', action);
        console.log('next state', result);
        console.groupEnd();

        return result;
    };
}

export const metaReducers: MetaReducer<any>[] = !environment.production ? [logger] : [];
