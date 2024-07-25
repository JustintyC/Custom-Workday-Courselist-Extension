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
    return <>
        <div style={{width: "100%"}}>
            <div className='moreInfoHeading'>Description</div>
            {moreInfoContent.description}
        </div>


        <h1 className='moreInfoHeading'>Instructors</h1>
        {
            moreInfoContent.instructors ? 
                moreInfoContent.instructors.map((instructor, index) => (
                    <h1 key={index}>{instructor}</h1>
                ))
                : "Unavailable"
        }    
    </>


}