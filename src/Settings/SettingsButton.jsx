import React from 'react';
import "./settings.css";

export default function SettingsButton({settingsMenuState}) {
  const [settingsOpen, setSettingsOpen] = settingsMenuState;

  return (
    <button id="settingsButton" onClick={() => setSettingsOpen((prevState) => {
      return !prevState;
    })}>
      <h1>List Settings</h1>
    </button>
  );
}
