import React from 'react'
import { parseCourses } from "./parseCourses.js";

export default function CourselistContainer({ courses }) {
  if (courses === null) return (
    <></>
  )
  parseCourses(courses);

  return (
    <div>
      <h1>hi</h1>
    </div>
  )
}
