// run npx webpack --config webpack.config.js to build project into dist 

import React from "react";
import { createRoot } from "react-dom/client";
import CourseListContainer from "./CourseList/CourselistContainer";

console.log("contents.js loaded");

// global observer
const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === "childList" || mutation.type === "subtree") {
            handleDOMChanges();
        }
    }
});

function handleDOMChanges() {
    // find the div that contains the course list
    const courseListContainer = document.querySelector("div.WB-N.WFYN");
    if (courseListContainer) {
        // inject react element if it"s not there yet
        const check = document.getElementById("react-root");
        if (!check) {
            // disconnect observer to prevent an infinite loop while injecting element
            disconnectObserver();

            // create a new element before the first child of the container
            const injection = document.createElement("div");
            injection.id = "react-root";
            const target = document.querySelector("div.WEYN.WJYN.WF5");
            target.insertBefore(injection, target.childNodes[1]);

            // create a react root at the new element
            const container = document.getElementById("react-root");
            const root = createRoot(container);

            // render custom container in root
            root.render(<CourseListContainer/>);

            reconnectObserver();            
        }
    } else {
        console.log("Course list container not found");
    }
}

function disconnectObserver() {
    observer.disconnect();
}

// reconnects observer
function reconnectObserver() {
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}




function observeDom() {
    // initial call 
    handleDOMChanges();

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

observeDom();
