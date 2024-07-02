import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function CourseList({ coursesArr }) {
    return (coursesArr.map((courseJson) => {
        return <Course key={uuidv4()} courseJson={courseJson} />
    })
    );
}

function Course({ courseJson }) {
    const [visible, setVisibility] = useState(false);

    const terms = Object.keys(courseJson).slice(3);

    return (
        <>
            <button className="CodeButton" onClick={() => setVisibility(!visible)}>
                {`${courseJson["code"]} - ${courseJson["name"]} | ${courseJson["credits"]}`}
                <span className="arrow">{visible? "▼" : "◀"}</span>
            </button>

            {visible && (
                <div style={{ display: "block" }}>
                    {
                        terms.map((term) => {
                            return <Term key={uuidv4()} termJson={courseJson[term]} term={term} />;
                        })
                    }
                </div>
            )}
        </>
    );
}

function Term({ termJson, term }) {
    const [visible, setVisibility] = useState(false);

    const modes = Object.keys(termJson);

    return (
        <>
            <button className="TermButton" onClick={() => setVisibility(!visible)}>
                {`${visible? "▼" : "▶"} ${term}`}
            </button>

            {visible && (
                <div style={{ display: "block" }}>
                    {
                        modes.map((mode) => {
                            return <Mode key={uuidv4()} modeArr={termJson[mode]} mode={mode} />;
                        })
                    }
                </div>                
            )}
        </>
    );
}

function Mode({ modeArr, mode }) {
    const [visible, setVisibility] = useState(false);

    return (
        <>
            <button className="ModeButton" onClick={() => setVisibility(!visible)}>
                {`${visible? "▼" : "▶"} ${mode}`}
            </button>

            {visible && (
                <table className="SectionsTable" style={{ display: "table" }}>
                    <tbody className="SectionsTableBody">
                        {modeArr.map((section) => {
                            return <Section key={uuidv4()} section={section} />;
                        })}
                    </tbody>
                </table>                
            )}
        </>
    )
}
/*
const section = {
    "courseCode": courseCode,
    "sectionCode": sectionCode,
    "courseName": courseName,
    "deliveryMode": deliveryMode,
    "sectionType": sectionType,
    "learningType": learningType,
    "credits": credits,
    "term": term,
    "days": days,
    "time": time,
    "url": url
}
*/

function Section({ section }) {
    return (
        <tr className="SectionChild">
            <td className="SectionChildTd_long">
                <div className="SectionChild_courseNameCell">
                    <div className="AddButtonGoHere" id={section.sectionCode}></div>
                    <div className="SectionChildTd_courseName">
                        <a href={section.url} target="_blank" rel="noopener noreferrer">
                            {section.sectionCode}
                        </a>
                    </div>                     
                </div>               
            </td>
            <td className="SectionChildTd_short">{section.sectionType}</td>
            <td className="SectionChildTd_short">{section.learningType}</td>
            <td className="SectionChildTd_short">{section.days}</td>
            <td className="SectionChildTd_long">{section.time}</td>
        </tr>
    );
}
