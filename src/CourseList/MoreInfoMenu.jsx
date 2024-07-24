import React from 'react'

export default function MoreInfoMenu({moreInfoContent}) {
    return <div className="moreInfoMenu">
        {Object.keys(moreInfoContent).length > 0 ? 
        
        <DisplayContent moreInfoContent={ moreInfoContent }/>
        
        
        : "Loading..."}
    
    
    </div>;
}

function DisplayContent({moreInfoContent}) {
    return <>
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