// run npx webpack --config webpack.config.js to build project into dist 

import React from "react";
import { createRoot } from "react-dom/client";
import CourseListContainer from "./CourseList/CourselistContainer";
import SettingsMenu from "./Settings/SettingsMenu";
import BottomMenu from "./CourseList/BottomMenu.jsx";
import { workdayDomComponents, grabCourseListContainer }  from "./utils.js";

console.log("better courselist: content.js loaded");

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
    const courseListContainer = grabCourseListContainer();
    if (courseListContainer) {
        // inject react element if it"s not there yet
        const check = document.getElementById("react-root");
        if (!check) {
            // disconnect observer to prevent an infinite loop while injecting element
            disconnectObserver();

            // create a new element before the first child of the course list's parent
            const injection = document.createElement("div");
            injection.id = "react-root";
            const target = document.querySelector(workdayDomComponents["courseListContainerParent"]);
            target.insertBefore(injection, target.childNodes[1]);

            // create a react root at the new element
            const container = document.getElementById("react-root");
            const root = createRoot(container);

            // render custom container in root
            root.render(<CourseListContainer/>);


            // second root for settings menu
            const check2 = document.getElementById("settings-root");
            if (!check2) {
                const injection2 = document.createElement("div");
                injection2.id = "settings-root";
                target.insertBefore(injection2, target.childNodes[1]);

                const container2 = document.getElementById("settings-root");
                const root2 = createRoot(container2);

                root2.render(<SettingsMenu/>);
            }

            // third root for bottom of screen menu
            const check3 = document.getElementById("bottomMenu-root");
            if (!check3) {
                const body = document.querySelector("body");
                const injection3 = document.createElement("div");
                injection3.id = "bottomMenu-root";
                body.prepend(injection3);

                const container3 = document.getElementById("bottomMenu-root");
                const root3 = createRoot(container3);

                root3.render(<BottomMenu/>);
            }
            

            reconnectObserver();
        }
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