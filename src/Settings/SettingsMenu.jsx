import React, { useState, useEffect } from 'react'
import SettingsButton from './SettingsButton';
import { createRoot } from "react-dom/client";
import { v4 as uuidv4 } from 'uuid';

export default function SettingsMenu() {
    // load user settings into states
    let settings = {};

    const [ autoOpenTerm, setAutoOpenTerm ] = useState(false);
    settings["autoOpenTerm"] = [ autoOpenTerm, setAutoOpenTerm ];
    const [ autoOpenMode, setAutoOpenMode ] = useState(false);
    settings["autoOpenMode"] = [ autoOpenMode, setAutoOpenMode ];

    useEffect(() => {
        setAutoOpenTerm(getStoredSetting("autoOpenTerm", false));
        setAutoOpenMode(getStoredSetting("autoOpenMode", false));
    }, []);


    const [settingsOpen, setSettingsOpen] = useState(false);

    // insert the settings button 
    const target = document.querySelector("div.WEYN.WJYN.WF5");
    const barAboveList = target.querySelector("span.WMYN.WPYN");
    if (barAboveList && barAboveList.firstElementChild.id != "BetterCourselistSettings") {
        const injection = document.createElement("div");
        injection.id = "BetterCourselistSettings";
        barAboveList.append(injection);
        const root = createRoot(injection);
        root.render(<SettingsButton settingsMenuState={[settingsOpen, setSettingsOpen]}/>);
    }

    const settingKeys = Object.keys(settings);

    
    return (
    <>
        {settingsOpen && (
            <table style={{ display: "table" }}>
                <tbody>
                    {
                        settingKeys.map((key) => {
                            return <Setting key={uuidv4()} setting={key} value={settings[key]}/>
                        })
                    }    
                </tbody>
            </table>
        )}
    </>
    )
}

function Setting({ setting, value }) {
    const [state, setState] = value;
  
    function handleClick() {
        setState((prevState) => {
            const newState = !prevState;
            localStorage.setItem(setting, newState);
            return newState;
        });
    }
  
    return (
      <tr>
        <span>
          {`${setting}: `}
          <button onClick={handleClick}>{state.toString()}</button>
        </span>
      </tr>
    );
}

// returns setting stored in localStorage
// if it doesn't exist, create it with value = defaultValue then return
function getStoredSetting(key, defaultValue) {
    let storedValue = localStorage.getItem(key);
    if (storedValue === null || storedValue === undefined) {
      localStorage.setItem(key, defaultValue);
      storedValue = defaultValue;
    }
    console.log(`${key}: ${storedValue}`);
    
    // weird bool and string stuff idk js is stupid
    if (storedValue === "true") storedValue = true;
    else if (storedValue === "false") storedValue = false;

    return storedValue;
}