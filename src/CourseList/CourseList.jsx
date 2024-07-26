import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MoreInfoMenu from './MoreInfoMenu';
import { fetchMoreInfo, parseDescription } from "./courseListUtils.js";

export default function CourseList({ coursesArr }) {
    return (coursesArr.map((courseJson) => {
        return <Course key={uuidv4()} courseJson={courseJson} />
    })
    );
}

function Course({ courseJson }) {
    const [visible, setVisibility] = useState(false);
    const [descriptionMenu, setDescriptionMenu] = useState(false);
    const [description, setDescription] = useState("Loading...");
    const [prereqs, setPrereqs] = useState(null);
    const [coreqs, setCoreqs] = useState(null);
    const [equiv, setEquiv] = useState(null);

    const terms = Object.keys(courseJson).slice(4);

    async function toggleDescriptionMenu() {
        setDescriptionMenu(!descriptionMenu);
        const moreInfo = await fetchMoreInfo(courseJson.sampleApi);
        const [
            parsedDescription,
            parsedPrereqs,
            parsedCoreqs,
            parsedEquiv
        ] = parseDescription(moreInfo.description);
        setDescription(parsedDescription);
        setPrereqs(parsedPrereqs);
        setCoreqs(parsedCoreqs);
        setEquiv(parsedEquiv);
    }


    return (
        <>
            <div className="CodeButtonDiv">
                <div style={{width: "100%", display: "flex"}}>
                    <button className="CodeButton" onClick={() => setVisibility(!visible)}>
                        <span style={{color: "#CFD4D7", marginRight: "10px"}}>{visible? "▼" : "▶"}</span>
                        {`${courseJson["code"]} - ${courseJson["name"]} | ${courseJson["credits"]}`}
                    </button>
                    <button className="DescriptionButton" onClick={toggleDescriptionMenu}
                    style={descriptionMenu ? {borderBottom: "0.5px solid #CFD4D7"} : {}}
                    title="Toggle course description">
                        {descriptionMenu ? "✖" : "?"}
                    </button>    
                </div>
                
                {descriptionMenu && (
                    <div className="DescriptionBox">
                        {description}
                        {prereqs && (
                            <><br/><p style={{marginTop: "5px"}}>{prereqs}</p></>
                        )}
                        {coreqs && (
                            <><br/><p style={{marginTop: "5px"}}>{coreqs}</p></>
                        )}
                        {equiv && (
                            <><br/><p style={{marginTop: "5px"}}>{equiv}</p></>
                        )}
                    </div>    
                )}
                
            </div>
            

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
    "location": location,
    "locationURL": locationURL,
    "term": term,
    "days": days,
    "time": time,
    "url": url,
    "apiCallUrl": apiCallUrl          
}

*/

function Section({ section }) {
    const [colourIndicators, setColourIndicators] = useState(true);
    const [ moreInfoMenu, setMoreInfoMenu ] = useState(false);
    const [ moreInfoContent, setMoreInfoContent ] = useState({});

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
            <table style={{ display: "table", width: "100%"}}>
                <tr>
                    <table style={{ display: "table", width: "100%"}}>
                        <tr>
                            <td className="SectionChildTd td_long">
                                <div className="SectionChild_courseNameCell">
                                    <div className="AddButtonGoHere" id={section.sectionCode}></div>
                                    
                                    <div className="SectionChildTd_courseName">
                                        <a href={section.url} target="_blank" rel="noopener noreferrer">
                                            {section.sectionCode}
                                        </a>
                                    </div>
                                    <button className="moreInfoButton" onClick={async () => {
                                        if (moreInfoMenu) setMoreInfoMenu(false);
                                        else {
                                            setMoreInfoMenu(true);
                                            const content = await fetchMoreInfo(section.apiCallUrl);
                                            setMoreInfoContent(content);    
                                        }                                        
                                    }}>i</button>
                                </div>
                            </td>
                            <td className="SectionChildTd td_med">
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
                            <td className="SectionChildTd td_med">
                                <span>{section.learningType}</span><br/>
                                <span>
                                    <a href={section.locationURL} target="_blank" rel="noopener noreferrer">
                                        {section.location}
                                    </a>
                                </span>
                            </td>
                            <td className="SectionChildTd td_short">{section.days}</td>
                            <td className="SectionChildTd td_long">{section.time}</td>        
                        </tr>
                    </table>
                </tr>


                {moreInfoMenu && 
                    <tr>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button onClick={() => setMoreInfoMenu(false)} style={{
                                border: "none",
                                font: "14px Arial, sans-serif",
                                fontWeight: "bold",
                                backgroundColor: "transparent",
                                cursor: "pointer"
                            }}>✖</button>
                            <MoreInfoMenu moreInfoContent={moreInfoContent}/>    
                        </div>
                        
                    </tr>
                }
                
            </table>
        </tr>
    );
}
