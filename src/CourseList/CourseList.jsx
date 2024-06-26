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

    const terms = Object.keys(courseJson).slice(2);

    return (
        <>
            <button className="CodeButton" onClick={() => setVisibility(!visible)}>
                {`${courseJson["code"]} - ${courseJson["name"]}`}
            </button>

            <div style={{ display: visible ? 'block' : 'none' }}>
                {
                    terms.map((term) => {
                        return <Term key={uuidv4()} termJson={courseJson[term]} term={term} />;
                    })
                }
            </div>
        </>
    );
}

function Term({ termJson, term }) {
    const [visible, setVisibility] = useState(false);

    const modes = Object.keys(termJson);

    return (
        <>
            <button className="TermButton" onClick={() => setVisibility(!visible)}>
                {term}
            </button>

            <div style={{ display: visible ? 'block' : 'none' }}>
                {
                    modes.map((mode) => {
                        return <Mode key={uuidv4()} modeArr={termJson[mode]} mode={mode} />;
                    })
                }
            </div>
        </>
    );
}

function Mode({ modeArr, mode }) {
    const [visible, setVisibility] = useState(false);

    return (
        <>
            <button className="ModeButton" onClick={() => setVisibility(!visible)}>
                {mode}
            </button>

            <table className="SectionsTable" style={{ display: visible ? 'table' : 'none' }}>
                <tbody className="SectionsTableBody">
                    {modeArr.map((section) => {
                        return <Section key={uuidv4()} section={section} />;
                    })}
                </tbody>
            </table>
        </>
    )
}



function Section({ section }) {
    return (
        <tr className="SectionChild">
            <td className="SectionChildTd">
                <a href={section.url} target="_blank" rel="noopener noreferrer">
                    {section.sectionCode}
                </a>
            </td>
            <td className="SectionChildTd">{section.sectionType}</td>
            <td className="SectionChildTd">{section.learningType}</td>
            <td className="SectionChildTd">{section.days}</td>
            <td className="SectionChildTd">{section.time}</td>
        </tr>
    );
}
