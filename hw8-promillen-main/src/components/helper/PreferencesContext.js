import {createContext, useState} from "react";

export const PreferencesContext = createContext();

export const PreferencesProvider = ({children}) => {
    const [preferences, setPreferences] = useState({});
    
    return (
        <PreferencesContext.Provider value={{preferences, setPreferences}}> 
            {children}
        </PreferencesContext.Provider>
    );
};

export default PreferencesContext;