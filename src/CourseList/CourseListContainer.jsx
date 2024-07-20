import React, { useEffect, useState } from 'react'
import { parseCourses } from "./parseCourses.js";
import CourseList from "./CourseList";
import "./courseListStyles.css"
import { workdayDomComponents, grabCourseListContainer } from "../utils.js";

// contains the setting menu and new course list
export default function CourseListContainer() {

  const [ courses, setCourses ] = useState([]);
  const [ parsedCourses, setParsedCourses ] = useState([]);
  const [ displayOriginalList, setDisplayOriginalList ] = useState([false]);

  const courseListContainer = grabCourseListContainer();

  // on mount: get courses loaded by current page, set observer to start observing 
  // for DOM changes and update courselist if changes are found
  // on dismount: disconnect observer
  useEffect(() => {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
          if (mutation.type === 'childList' || mutation.type === 'subtree') {
              updateCourselist();
          }
      }
    });

    // check localstorage if user has displayOriginalList turned on and and set state to that
    const displayOriginal = localStorage.getItem("displayOriginalList") === "true";
    setDisplayOriginalList(displayOriginal);

    // set up event listener for setting changes
    window.addEventListener("displayOriginalList", (e) => {
      setDisplayOriginalList(e.detail.enabled);
    });


    function updateCourselist() {
      if (courseListContainer) {

        let foundCourses = null;
        // handle the actual list itself
        try {
            const courseList = courseListContainer.querySelector("ul");
            foundCourses = courseList.querySelectorAll(workdayDomComponents["courseListItem"]);
            // console.log(`found courses: ${foundCourses.length}`);

            // check if courses really changed before updating courses state
            if (foundCourses.length !== courses.length) {
              setCourses(foundCourses);
            } else {
              for (let i = 0; i < foundCourses.length; i++) {
                if (foundCourses[i] !== courses[i]) {
                  setCourses(foundCourses);
                  break;
                }
              }
            }

        } catch (error) {
            console.log(error);
        }
      } else {
        console.log("courseListContainer not found (CourseListContainer.jsx)");
      }
    }

    // initial fetch courses call to fill new courselist on mount
    updateCourselist();
    
    // start observing DOM
    observer.observe(courseListContainer, {
        childList: true,
        subtree: true
    });

    return (() => {
      observer.disconnect();
      window.removeEventListener("displayOriginalList", (e) => {
        setDisplayOriginalList(e.detail.enabled);
      });
    });
  }, []);

  useEffect(() => {
    setParsedCourses(() => {
      const parsed = parseCourses(courses);
      return parsed;
  });
  }, [courses]);

  // enable/disable original list when user changes displayOriginalList setting
  useEffect(() => {
    let oldCourseList;
    if (courseListContainer ) oldCourseList = courseListContainer.querySelector("ul");
    else return;

    const expandButton = document.querySelector(workdayDomComponents["expandButton"]);
    if (!displayOriginalList) {
      oldCourseList.style.display = "none";
      if (expandButton) expandButton.style.display = "none";

    } else {
      oldCourseList.style.display = "";
      if (expandButton) {
        expandButton.style.display = "";
        expandButton.style.position = "absolute";
        expandButton.style.right = "100px";
        expandButton.style.top = "0px";
      }
      
      
    }
  }, [displayOriginalList])

  return (
    <>
      { !displayOriginalList && <CourseList coursesArr={parsedCourses}/> }
    </>
  )
}

