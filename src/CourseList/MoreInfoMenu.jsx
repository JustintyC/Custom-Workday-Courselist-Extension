import React from 'react'

export default function MoreInfoMenu({moreInfoContent}) {
    return <div className="moreInfoMenu">
        {Object.keys(moreInfoContent).length > 0 ? 
        <DisplayContent moreInfoContent={ moreInfoContent }/>
        : "Loading..."}
    </div>;
}

/*
return {
    status: status,
    startEndDate: startEndDate,
    grading: grading,
    description: description,
    otherFormats: otherFormats,
    courseTags: courseTags,
    availUnreserved: availUnreserved,
    availReserved: availReserved,
    meetingPatterns: meetingPatterns,
    instructors: instructors,
    reservedDist: reservedDist,
    notes: notes
};
*/


function DisplayContent({moreInfoContent}) {
    const [
        parsedDescription,
        parsedPrereqs,
        parsedCoreqs,
        parsedEquiv
    ] = parseDescription(moreInfoContent.description);


    return <>
        <div style={{width: "100%"}}>
            <div className='moreInfoHeading'>Description</div>
            <p>{parsedDescription}</p>
            {parsedPrereqs && 
                <>
                    {parsedPrereqs}<br/>
                </>
            }
            {parsedCoreqs && 
                <>
                    {parsedCoreqs}<br/>
                </>
            }
            {parsedEquiv && 
                <>
                    {parsedEquiv}<br/>
                </>
            }
        </div>

        <div>
            <h1 className='moreInfoHeading'>Instructors</h1>
            {
                moreInfoContent.instructors ? 
                    moreInfoContent.instructors.map((instructor, index) => (
                        <h1 key={index}>{instructor}</h1>
                    ))
                    : "Unavailable"
            }
        </div>


    </>


}

function parseDescription(description) {
    const parsedDescription = description.split(/(?=Corequisite:|Equivalency:|Prerequisite:)/i)[0].trim();

    const prereqsMatch = description.split("Prerequisite:")[1];
    const parsedPrereqs = prereqsMatch 
        ? `Prerequisites: ${prereqsMatch.split(/(?=Corequisite:|Equivalency:)/i)[0].trim()}` 
        : null;

    const coreqsMatch = description.split("Corequisite:")[1];
    const parsedCoreqs = coreqsMatch 
        ? `Corequisites: ${coreqsMatch.split(/(?=Prerequisite:|Equivalency:)/i)[0].trim()}` 
        : null;

    const equivMatch = description.split("Equivalency:")[1];
    const parsedEquiv = equivMatch 
        ? `Equivalent: ${equivMatch.split(/(?=Prerequisite:|Corequisite:)/i)[0].trim()}` 
        : null;

    return [
        parsedDescription,
        parsedPrereqs,
        parsedCoreqs,
        parsedEquiv
    ];
}