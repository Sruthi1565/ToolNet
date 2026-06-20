import { createContext, useReducer, useEffect } from 'react';

export const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_RENTAL':
      return [...state, action.payload];
    
    case 'UPDATE_RENTAL':
      return state.map(rental =>
        rental._id === action.payload._id
          ? {
              ...rental,
              rentalDays: action.payload.rentalDays,
              cost: action.payload.cost,
              toolName:action.payload.toolName,
              toolId: action.payload.toolId,
            }
          : rental
      );

    case 'REMOVE_RENTAL':
      return state.filter(rental => rental._id !== action.payload);

    case 'SET_RENTALS':
      return action.payload;

    case 'CLEAR_CART':
      return [];
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const initialState = JSON.parse(localStorage.getItem('cart') || '[]');
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
