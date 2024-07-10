import React from 'react';
import "./settings.css";

export default function SettingsButton({settingsMenuState}) {
  const [settingsOpen, setSettingsOpen] = settingsMenuState;

  return (
    <div>
      <button id="settingsButton" onClick={() => setSettingsOpen(!settingsOpen)}>
        <h1>List Settings</h1>
      </button>
    </div>
  );
}
