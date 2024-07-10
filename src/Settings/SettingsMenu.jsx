import React, { useState } from 'react'
import SettingsButton from './SettingsButton';
import { createRoot } from "react-dom/client";

export default function SettingsMenu() {
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

    
    return (
    <>
        {settingsOpen && (
            <div>
                <h1>u ikygxdfv</h1>
            </div>
        )}
    </>
    )
}
