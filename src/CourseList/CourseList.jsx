import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        // check localstorage if user has autoOpenTerm turned on and and set visible state to that
        const autoOpen = localStorage.getItem("autoOpenTerm") === "true";
        setVisibility(autoOpen);

        // set up event listener for setting changes
        window.addEventListener("autoOpenTerm", (e) => {
            setVisibility(e.detail.enabled);
        });

        return () => {
            window.removeEventListener("autoOpenTerm", (e) => {
                setVisibility(e.detail.enabled);
            });
        }
    }, []);

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

    useEffect(() => {
        // check localstorage if user has autoOpenMode turned on and and set visible state to that
        const autoOpen = localStorage.getItem("autoOpenMode") === "true";
        setVisibility(autoOpen);

        // set up event listener for setting changes
        window.addEventListener("autoOpenMode", (e) => {
            setVisibility(e.detail.enabled);
        });

        return () => {
            window.removeEventListener("autoOpenMode", (e) => {
                setVisibility(e.detail.enabled);
            });
        }
    }, []);

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
    "enrolled": enrolled,
    "waitlist": waitlist,
    "term": term,
    "days": days,
    "time": time,
    "url": url            
}

*/

function Section({ section }) {
    const [colourIndicators, setColourIndicators] = useState(true);

    useEffect(() => {
        // check localStorage if the user has colourIndicators turned on and set state to that
        const useColourIndicators = localStorage.getItem("colourIndicators") === "true";
        setColourIndicators(useColourIndicators);

        // set up event listener for setting changes
        window.addEventListener("colourIndicators", (e) => {
            setColourIndicators(e.detail.enabled);
        });

        return () => {
            window.removeEventListener("colourIndicators", (e) => {
                setColourIndicators(e.detail.enabled);
            });
        };
    }, []);

    function enrollmentColour(enrolled, waitlist) {
        const colours = ["#8CFF8D", "#FFF769", "#FFC294", "#FF9494"];

        const [current, total] = enrolled.split('/').map(Number);
        let percentFilled = (current / total) * 100;
        if (total == 0) percentFilled = 100;
        let dangerLevel = 0;

        if (percentFilled >= 100) {
            dangerLevel = 3;
        } else if (percentFilled >= 80) {
            dangerLevel = 2;
        } else if (percentFilled >= 50) {
            dangerLevel = 1;
        } else {
            dangerLevel = 0;
        }

        // if waitlist is filling up bump up colour by 1 level
        if (waitlist) {
            const [wlcurrent, wltotal] = waitlist.split('/').map(Number);
            if (wlcurrent > 0) dangerLevel++;
        }

        if (dangerLevel > 3) dangerLevel = 3;
        return colours[dangerLevel];
    }

    return (
        <tr className="SectionChild">
            <td className="SectionChildTd td_long">
                <div className="SectionChild_courseNameCell">
                    <div className="AddButtonGoHere" id={section.sectionCode}></div>
                    <div className="SectionChildTd_courseName">
                        <a href={section.url} target="_blank" rel="noopener noreferrer">
                            {section.sectionCode}
                        </a>
                    </div>
                </div>
            </td>
            <td className="SectionChildTd td_long">
                <div
                    className={colourIndicators ? "enrollmentColourDiv" : ""}
                    style={{ backgroundColor: colourIndicators ? enrollmentColour(section.enrolled, section.waitlist) : "" }}
                >
                    {section.waitlist ? (
                        <>
                            <span>Enrolled: {section.enrolled}</span>
                            <br />
                            WL: {section.waitlist}
                        </>
                    ) : (
                        <span>Enrolled: {section.enrolled}</span>
                    )}
                </div>
            </td>
            <td className="SectionChildTd td_short">{section.learningType}</td>
            <td className="SectionChildTd td_short">{section.days}</td>
            <td className="SectionChildTd td_long">{section.time}</td>
        </tr>
    );
}
