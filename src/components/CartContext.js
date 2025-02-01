import { createContext, useReducer, useEffect } from 'react';

export const CartContext = createContext();

const cartReducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case 'ADD_RENTAL':
      // Add a new rental to the cart
      return [...state, action.payload];
    
    case 'UPDATE_RENTAL':
      console.log(action.payload);
      // Update an existing rental
      return state.map(rental =>
        rental._id === action.payload._id
          ? {
              ...rental,
              rentalDays: action.payload.rentalDays,
              cost: action.payload.cost,
              toolName:action.payload.toolName,
              toolId: action.payload.toolId, // Retain full tool object
            }
          : rental
      );

    case 'REMOVE_RENTAL':
      // Remove a rental from the cart
      return state.filter(rental => rental._id !== action.payload);

    case 'SET_RENTALS':
      return action.payload;

    case 'CLEAR_CART':
      // Clear the cart
      return [];
    
    default:
      return state; // Return current state for any unknown action
  }
};

export const CartProvider = ({ children }) => {
  const initialState = JSON.parse(localStorage.getItem('cart')) || [];
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    // Sync cart state with local storage
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
