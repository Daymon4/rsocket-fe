import React, { createContext } from 'react';
import {useRSocketContext} from "./hooks/useRSocketContext";

export const RSocketContext = createContext({});

export const RSocketProvider = ({ children }) => {
    const value = useRSocketContext(false);

    return (
        <RSocketContext.Provider value={value}>{children}</RSocketContext.Provider>
    )
}
