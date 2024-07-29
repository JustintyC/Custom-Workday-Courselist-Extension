import React, { useState, useEffect } from 'react'
import SettingsButton from './SettingsButton';
import { createRoot } from "react-dom/client";
import { v4 as uuidv4 } from 'uuid';
import "./settings.css";
import { grabBarAboveList } from '../utils';

export default function SettingsMenu() {
    // load user settings into states
    let settings = {};

    const [ autoOpenTerm, setAutoOpenTerm ] = useState(true);
    settings["autoOpenTerm"] = [ autoOpenTerm, setAutoOpenTerm ];
    const [ autoOpenMode, setAutoOpenMode ] = useState(true);
    settings["autoOpenMode"] = [ autoOpenMode, setAutoOpenMode ];
    const [ displayOriginalList, setDisplayOriginalList ] = useState(false);
    settings["displayOriginalList"] = [ displayOriginalList, setDisplayOriginalList ];
    const [ colourIndicators, setColourIndicators ] = useState(true);
    settings["colourIndicators"] = [ colourIndicators, setColourIndicators ];

    useEffect(() => {
        setAutoOpenTerm(getStoredSetting("autoOpenTerm", true));
        setAutoOpenMode(getStoredSetting("autoOpenMode", true));
        setDisplayOriginalList(getStoredSetting("displayOriginalList", false));
        setColourIndicators(getStoredSetting("colourIndicators", true));
    }, []);

    const [settingsOpen, setSettingsOpen] = useState(false);

    // insert the settings button 
    useEffect(() => {
        const barAboveList = grabBarAboveList();
        if (barAboveList && !barAboveList.querySelector("#listSettingsButton")) {
            const injection = document.createElement("div");
            injection.id = "listSettingsButton";
            barAboveList.append(injection);
            const root = createRoot(injection);
            root.render(<SettingsButton settingsMenuState={[settingsOpen, setSettingsOpen]}/>);
        }    
    }, []);

    

    const settingKeys = Object.keys(settings);

    // populate table with rows of 2
    const rows = [];
    for (let i = 0; i < settingKeys.length; i+=2) {
        const key1 = settingKeys[i];
        const key2 = settingKeys[i + 1];

        rows.push(
            <tr key={i}>
                <Setting key={uuidv4()} setting={key1} value={settings[key1]}/>
                {key2 && <Setting key={uuidv4()} setting={key2} value={settings[key2]}/>}
            </tr>
        );
    }

    return (
        <>
            {settingsOpen && (
                <table id="settingsMenu" style={{ display: "table" }}>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            )}
        </>
    );
}

function Setting({ setting, value }) {
    const [state, setState] = value;
  
    function handleClick() {
        setState((prevState) => {
            const newState = !prevState;
            localStorage.setItem(setting, newState);

            // signal components relying on this setting
            const event = new CustomEvent(setting, {
                detail: { enabled: newState }
            });
            window.dispatchEvent(event); 
            
            return newState;
        });


    }
  
    return (
      <td className='optionTd'>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <input 
                    type='checkbox'
                    checked={state}
                    onChange={handleClick}
                    id={setting}
            />
            {getDisplayText(setting)}    
        </div>
        
      </td>
    );
}

function getDisplayText(key) {
    switch(key) {
        case "autoOpenTerm":
            return "Expand Terms By Default";
        case "autoOpenMode":
            return "Expand Modes By Default";
        case "displayOriginalList":
            return "Display Original List";
        case "colourIndicators":
            return "Capacity Colour Indicators"
        default:
            return "";
    }
}

// returns setting stored in localStorage
// if it doesn't exist, create it with value = defaultValue then return
function getStoredSetting(key, defaultValue) {
    let storedValue = localStorage.getItem(key);
    if (storedValue === null || storedValue === undefined) {
      localStorage.setItem(key, defaultValue);
      storedValue = defaultValue;
    }
    
    // weird bool and string stuff idk js is stupid
    if (storedValue === "true") storedValue = true;
    else if (storedValue === "false") storedValue = false;

    return storedValue;
}