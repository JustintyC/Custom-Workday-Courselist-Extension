
// calls workday's api and returns advanced course info as a json
export async function fetchMoreInfo(url) {
    console.log("b");
    const instructors = await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            const hasInstructorArray = data["body"]["children"][0]["children"][1]["children"];
            const hasInstructorJson = hasInstructorArray.find(json => json.widget === "panel") || null;
            
            if (hasInstructorJson) {
                const instructorsArr = hasInstructorJson.children?.[0]?.children?.[0]?.instances;
                
                if (instructorsArr) {
                    const instructorsNameArr = instructorsArr.map(instructorJson => instructorJson["text"]);
                    return instructorsNameArr;    
                }   
            }
                return null;
        })
        .catch(error => {
            console.error('Error: ', error);
        });

    const event = new CustomEvent("menuRequest", {
        detail: { instructors: instructors }
    });
    window.dispatchEvent(event);
        
    return {
        instructors: instructors
    };
}

