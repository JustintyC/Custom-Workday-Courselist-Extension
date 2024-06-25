import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

/*
{
    code: ...
    name: ...
    W1: {
        Lecture: [ ... ]
        Lab: [ ... ]        
    }
    W2: {
        Lecture: [ ... ]
        Lab: [ ... ]        
    }    
}

Code                            <- Course
| W1                            <- Term
| | Lecture                     <- Mode
| | | </>
| | | </>
| | Lab                         <- Mode
| | | </>
| | | </>
| W2                            <- Term
| | Lecture                     <- Mode
| | | </>
| | | </>
| | Lab             
| | | </>
| | | </>
Code
| ...


*/

export default function CourseList({ coursesArr }) {
    return (coursesArr.map((courseJson) => {
        return <Course key={uuidv4()} courseJson={courseJson}/>
    })
  );
}

function Course({courseJson}) {
    const [ visible, setVisibilty ] = useState(false);

    const terms = Object.keys(courseJson).slice(2);

    return (
        <>
            <button className="CodeButton" onClick={() => setVisibilty(!visible)}>
                {`${courseJson["code"]} - ${courseJson["name"]}`}
            </button>
            
            <div style={{ display: visible ? 'block' : 'none' }}>
                {
                    terms.map((term) => {
                        return <Term key={uuidv4()} termJson={courseJson[term]} term={term}/>;
                    })
                }
            </div>
            
        </>
    );
}

function Term({termJson, term}) {
    const [ visible, setVisibilty ] = useState(false);

    const modes = Object.keys(termJson);

    return (
        <>
            <button className="TermButton" onClick={() => setVisibilty(!visible)}>
                {term}
            </button>

            <div style={{ display: visible ? 'block' : 'none' }}>
                {
                    modes.map((mode) => {
                        return <Mode key={uuidv4()} modeArr={termJson[mode]} mode={mode}/>;
                    })
                }    
            </div>            
        </>
    );
}

function Mode({modeArr, mode}) {
    const [ visible, setVisibilty ] = useState(false);

    return (
        <>
            <button className="ModeButton" onClick={() => setVisibilty(!visible)}>
                {mode}
            </button>
        
            <div style={{ display: visible ? 'block' : 'none' }}>
                <h1>he he</h1>
            </div>
        </>
    )
}