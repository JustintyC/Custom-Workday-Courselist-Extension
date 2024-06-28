import React, { useEffect, useState } from 'react'
import { parseCourses } from "./parseCourses.js";
import CourseList from "./CourseList";
import "./courseListStyles.css"

export default function CourseListContainer() {

  const [ courses, setCourses ] = useState([]);
  const [ parsedCourses, setParsedCourses ] = useState([]);

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

    function updateCourselist() {
      const courseListContainer = document.querySelector('div.WB-N.WFYN');
      if (courseListContainer) {

        let foundCourses = null;
        // handle the actual list itself
        try {
            const courseList = courseListContainer.querySelector("ul");
            foundCourses = courseList.querySelectorAll("li.WLUF.WC0N.WF5.WCWF");
            // console.log(foundCourses.length);

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

            courseList.style.display = "none"; // comment this line out to show original course list
        } catch (error) {
            console.log(error);
        }
      }       
    }

    // initial fetch courses call to fill new courselist on mount
    updateCourselist();
    
    // start observing DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    return (() => {
      observer.disconnect();
    });
  }, [courses]);


  useEffect(() => {
    setParsedCourses(parseCourses(courses));
  }, [courses]);

  return (
    <>
      <CourseList coursesArr={parsedCourses}/>
    </>
  )
}
