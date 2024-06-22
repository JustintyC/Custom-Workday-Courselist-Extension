// run npx webpack --config webpack.config.js to build project into dist 

import React from 'react';
import { createRoot } from 'react-dom/client';
import CourselistContainer from './CourselistContainer';

console.log("contents.js loaded");

// global observer
const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
            handleDOMChanges();
        }
    }
});

function handleDOMChanges() {
    // handle the div that contains the course list
    const courseListContainer = document.querySelector('div.WB-N.WFYN');
    if (courseListContainer) {
        // inject react element if it's not there yet
        const check = document.getElementById("react-root");
        if (!check) {
            // disconnect observer to prevent an infinite loop while injecting element
            disconnectObserver();

            // create a new element before the first child of the container
            const injection = document.createElement("div");
            injection.id = "react-root";
            courseListContainer.prepend(injection);

            // create a react root at the new element
            const container = document.getElementById("react-root");
            const root = createRoot(container);

            // render custom container in root
            root.render(<CourselistContainer />);

            reconnectObserver();            
        }

        // handle the actual list itself
        const courseList = courseListContainer.querySelector("ul");
        if (courseList) {
            const courses = courseList.querySelectorAll("li");
            console.log(courses.length);
            courses.forEach((course) => {
                try {
                    const titleDiv = course.querySelector("div.WH1X.WP-X.WF5.WI2X.WG2X.WCVF.WOUF");
                    const nameDiv = titleDiv.querySelector("div.gwt-Label.WLNO.WEMO");
                    console.log(nameDiv.textContent);
                } catch (error) {
                    // console.log(error);
                }
            });
        } else {
            console.log("No course list found");
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
