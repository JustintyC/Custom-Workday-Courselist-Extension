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
    const multiTerm = isMultiTerm(moreInfoContent.startEndDate);
    const processedMeetingPatterns = processMeetingPatterns(moreInfoContent.meetingPatterns);

    return <>
        {/* <div style={{width: "100%"}}>
            <div className='moreInfoHeading'>Description</div>
            <p>{parsedDescription}</p>
            {parsedPrereqs && <>{parsedPrereqs}<br/></>}
            {parsedCoreqs && <>{parsedCoreqs}<br/></>}
            {parsedEquiv && <>{parsedEquiv}<br/></>}
        </div> */}

        <div style={{display: "flex", width: "100%"}}>
            <div style={{width: "50%"}}>
                <span className='moreInfoHeading'>Instructors:</span><br/>
                {
                    moreInfoContent.instructors ? 
                        moreInfoContent.instructors.map((instructor, index) => (
                            <>
                                <span key={index}>{instructor}</span><br/>
                            </>
                            
                        ))
                        : <>Unavailable<br/></>
                }
                
                <span className='moreInfoHeading'>Meeting pattern:</span><br/>
                {
                    processedMeetingPatterns.length > 0 ?
                        processedMeetingPatterns.map((pattern, index) => 
                            <><span key={index}>{pattern}</span><br/></>
                        )
                        : <>Unavailable<br/></>
                }
                
                {multiTerm && <>
                    <span className='moreInfoHeading'>This is a multi-term course:</span><br/>
                    {moreInfoContent.startEndDate}<br/>
                </>}

                {!multiTerm && <>
                    <span className='moreInfoHeading'>Start/End date:</span><br/>
                    {moreInfoContent.startEndDate}<br/>
                </>}

            </div>

            <div style={{width: "50%"}}>
                <span className="moreInfoHeading">Available unreserved: </span>
                {moreInfoContent.availUnreserved != null ? 
                moreInfoContent.availUnreserved : "Unavailable"}
                <br/>

                <span className="moreInfoHeading">Available reserved: </span>
                {moreInfoContent.availReserved != null ? 
                moreInfoContent.availReserved : "Unavailable"}
                <br/>

                <span className="moreInfoHeading">Reserved seats info: </span>
                {
                    moreInfoContent.reservedDist ? 
                    moreInfoContent.reservedDist.map((item, index) => {
                        let parsedItem = item.replaceAll("- reserved for Students In -", "-")
                        .replaceAll("- (Vancouver)", "").replaceAll("- (Okanagan)", "")
                        .replaceAll("(Vancouver)", "").replaceAll("(Okanagan)", "")
                        .replaceAll(" , ", ", ");

                        return <>
                            <br/><span key={index} style={{marginTop: "5px"}}>{parsedItem}</span>
                        </> 
                    })
                    : "Unavailable"
                }
            </div>
        </div>

        


    </>


}

function isMultiTerm(startEndDate) {
    const startMonth = parseInt(startEndDate.split(" - ")[0].split("-")[1]);
    const endMonth   = parseInt(startEndDate.split(" - ")[1].split("-")[1]);

    if (1 <= startMonth && startMonth <= 4) return !(1 <= endMonth && endMonth <= 4);
    if (5 <= startMonth && startMonth <= 6) return !(5 <= endMonth && endMonth <= 6);
    if (7 <= startMonth && startMonth <= 8) return !(7 <= endMonth && endMonth <= 8);
    if (9 <= startMonth && startMonth <= 12) return !(9 <= endMonth && endMonth <= 12);
    return false;
}

function processMeetingPatterns(patterns) {
    if (!patterns) return [];

    let tracker = new Set();

    const out = patterns.map((pattern) => {
        const patternArr = pattern.split("|");
        const day = patternArr[patternArr.length - 3].trim();
        const time = patternArr[patternArr.length - 2].trim();
        const patternStr = `${day} - ${time}`;
        
        if (!tracker.has(patternStr)) {
            tracker.add(patternStr);
            return patternStr;
        } else return null;
    }).filter(Boolean);

    return out;
}