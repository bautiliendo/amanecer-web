import { CartAction, CartProduct } from "../types";

export const cartInitialState: CartProduct[] = JSON.parse(window.localStorage.getItem('cart') || '[]');

export const updateLocalStorage = (state: CartProduct[]): void => {
    window.localStorage.setItem('cart', JSON.stringify(state));
}

export const cartReducer = (state: CartProduct[], action: CartAction): CartProduct[] => {
    const { type: actionType, payload: actionPayload } = action;

    switch (actionType) {
        case 'ADD_TO_CART': {
            const { _id } = actionPayload
            const productInCartIndex = state.findIndex(item => item._id === _id)
            //chequea si está en el cart
            if (productInCartIndex >= 0) {
                const newState = structuredClone(state)
                newState[productInCartIndex].quantity += 1
                updateLocalStorage(newState);
                return newState
            }
            //si no está, entonces:
            const newState = [
                ...state,
                {
                    ...actionPayload, //product
                    quantity: 1
                }
            ]

            updateLocalStorage(newState);
            return newState;
        }
        case 'REMOVE_FROM_CART': {
            const { _id } = actionPayload;
            const productInCartIndex = state.findIndex(item => item._id === _id)
            //chequear si ya está en el cart
            const newState = structuredClone(state)
            if (newState[productInCartIndex].quantity > 1) {
                newState[productInCartIndex].quantity -= 1
                updateLocalStorage(newState);
                return newState
            }
            return newState
        }

        case 'REMOVE_ITEM_FROM_CART': {
            const { _id } = actionPayload;
            const newState = state.filter(item => item._id !== _id);
            updateLocalStorage(newState)
            return newState
        }
        case 'CLEAR_CART': {
            updateLocalStorage([]);
            return [];
        }

    }

    return state
}