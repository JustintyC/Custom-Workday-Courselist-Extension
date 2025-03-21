import React, { useState, useEffect, memo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MoreInfoMenu from './MoreInfoMenu';
import { 
    fetchMoreInfo, 
    parseDescription, 
    fetchUBCGrades, 
    getUBCGradesURL, 
    sortTerms,
    sortModes } from "./courseListUtils.js";

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
    const [avg, setAvg] = useState(null);
    const [dCreditFail, setDCreditFail] = useState(null);

    let terms = Object.keys(courseJson).slice(4);
    terms = sortTerms(terms);
    const UBCGradesURL = getUBCGradesURL(courseJson.code);

    async function toggleDescriptionMenu() {
        if (descriptionMenu) {
            setDescriptionMenu(false);
            return;
        }
        setDescriptionMenu(true);
        if (description != "Loading...") return;
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
        setDCreditFail(moreInfo.grading && moreInfo.grading.includes("Credit/D/Fail"));
        setAvg("Loading...");

        const avg5Years = await fetchUBCGrades(courseJson.code);
        if (avg5Years == "" || avg5Years == null) setAvg("N/A");
        else setAvg(avg5Years);
    }


    return (
        <>
            <div className="CodeButtonDiv">
                <div style={{width: "100%", display: "flex"}}>
                    <button className="CodeButton" onClick={() => {
                        setVisibility(!visible);
                        if (descriptionMenu && visible) toggleDescriptionMenu();
                    }}>
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
                        <p>{description}</p>
                        {prereqs && (
                            <p style={{marginTop: "5px"}}>
                                <span style={{fontWeight: "Bold"}}>Prerequisites: </span>
                                {prereqs}
                            </p>
                        )}
                        {coreqs && (
                            <p style={{marginTop: "5px"}}>
                                <span style={{fontWeight: "Bold"}}>Corequisites: </span>
                                {coreqs}
                            </p>
                        )}
                        {equiv && (
                            <p style={{marginTop: "5px"}}>
                                <span style={{fontWeight: "Bold"}}>Equivalent: </span>
                                {equiv}
                            </p>
                        )}
                        {avg && (
                            <p style={{marginTop: "5px"}}>
                                <span style={{fontWeight: "Bold"}}>Average (past 5 years): </span>
                                {avg}
                                <a href={UBCGradesURL} target="_blank" rel="noopener noreferrer"
                                style={{textDecoration: "None"}} title="UBCGrades">
                                    🔗
                                </a>
                            </p>
                        )}
                        {dCreditFail != null && (
                            <p style={{marginTop: "5px"}}>
                                <span style={{fontWeight: "Bold"}}>Credit/D/Fail: </span>
                                {dCreditFail ? "Yes" : "No"}
                            </p>   
                        )}
                        
                    </div>    
                )}
                
            </div>
            

            {visible && (
                <div style={{ display: "block" }}>
                    {
                        terms.map((term, idx) => {
                            return <Term key={idx} termJson={courseJson[term]} term={term} />;
                        })
                    }
                </div>
            )}
        </>
    );
}

const Term = memo(function Term({ termJson, term }) {
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

    let modes = Object.keys(termJson);
    modes = sortModes(modes);

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
});

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
                                        <a href={section.url} target="_blank" rel="noopener noreferrer"
                                        title="View Course Section">
                                            {section.sectionCode}
                                        </a>
                                    </div>
                                    <button className="moreInfoButton" onClick={async () => {
                                        if (moreInfoMenu) setMoreInfoMenu(false);
                                        else {
                                            setMoreInfoMenu(true);
                                            if (Object.keys(moreInfoContent).length > 0) return;
                                            try {
                                                const content = await fetchMoreInfo(section.apiCallUrl);
                                                setMoreInfoContent(content);        
                                            } catch (e) {
                                                alert("An error occured receiving course information from Workday. Please contact the developer.");
                                            }
                                            
                                        }                                        
                                    }} title="Toggle Section Info">i</button>
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
                                            <span>WL: {section.waitlist}</span>
                                        </>
                                    ) : (
                                        <span>Enrolled: {section.enrolled}</span>
                                    )}
                                </div>
                            </td>
                            <td className="SectionChildTd td_med">
                                <span>{section.learningType}</span><br/>
                                <span>
                                    <a href={section.locationURL} target="_blank" rel="noopener noreferrer"
                                    title="View Location">
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
