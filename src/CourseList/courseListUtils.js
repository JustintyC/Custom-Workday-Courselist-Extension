
// calls workday's api and returns advanced course info as a json
export async function fetchMoreInfo(url) {
    const out = await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            /*
            contains:
            - academic period (doesn't show multi-term courses)
            - status (open/closed/waitlist)
            - start/end date (use this to find multi-term courses)
            - grading basis (credit/d/fail, graded)
            - description, which contains
                - prereqs
            - other instructional formats (labs/discussions)

            */
            const firstArr = data["body"]["children"][0]["children"][0]["children"];            
            
            let status = null;
            let startEndDate = null;
            let grading = null;
            let description = null;
            let otherFormats = null;

            for (let json of firstArr) {
                switch(json.label) {
                    case "Status":
                        status = json.instances && json.instances[0] && json.instances[0].text;
                        break;
                    case "Start/End Date":
                        startEndDate = json.value;
                        break;
                    case "Grading Basis":
                        grading = json.instances && json.instances.map(instance => instance.text);
                        break;
                    case "Description":
                        description = json.value.replace(/<\/?[a-zA-Z]+>/g, "");
                        break;
                    case "Other Instructional Formats":
                        otherFormats = json.instances && json.instances.map(instance => instance.text);
                        break;
                    default:
                        break;
                }
            }

            /*
            contains:
            - instructors
            - course tags (course level, credit/d/fail, etc)
            - detailed seat info
                - avaiable unreserved seats
                - available reserved seats
                - reserved seats distribution
            - full meeting pattern text
            - notes

            */
            const secondArr = data["body"]["children"][0]["children"][1]["children"];

            let courseTags = null;
            let availUnreserved = null;
            let availReserved = null;
            let meetingPatterns = null;
            let instructors = null;
            let reservedDist = null;
            let notes = null;

            for (let json of secondArr) {
                switch (json.label) {
                    case "Course Tags":
                        courseTags = json.instances && json.instances.map(instance => instance.text);
                        break;
                    case "Available Unreserved Seats":
                        availUnreserved = json.value;
                        break;
                    case "Available Reserved Seats":
                        availReserved = json.value;
                        break;
                    case "Meeting Patterns":
                        meetingPatterns = json.instances && json.instances.map(instance => instance.text);
                        break;
                    case "Notes":
                        notes = json.value.replace(/<\/?[a-zA-Z]+>/g, "");
                        break;
                    default: // 2 options not identifiable by label: instructors and reserved seats distribution
                        if (json.widget && json.widget === "panel") {
                            // instructors: only json with widget = panel
                            const instructorsArr = json.children?.[0]?.children?.[0]?.instances;
                            if (instructorsArr) {
                                instructors = instructorsArr.map(instructorJson => instructorJson.text);
                            }
                        } else if (json.propertyName.includes("Reserved_Capacity_Line_Student")) {
                            // reserved seats distribution: propertyName = wd:Student_Course_Section_Component__Nonsingular_--IS
                            reservedDist = json.instances && json.instances.map(instance => instance.text);
                        }

                        break;
                }
            }
            
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
        })
        .catch(error => {
            console.error('Error: ', error);
        });

    // console.log(out);
        
    return out;
}

export function parseDescription(description) {
    if (!description) return ["Description unavailable", null, null, null];
    const parsedDescription = description.split(/(?=Corequisite:|Equivalency:|Prerequisite:)/i)[0].trim();

    const prereqsMatch = description.split("Prerequisite:")[1];
    const parsedPrereqs = prereqsMatch 
        ? prereqsMatch.split(/(?=Corequisite:|Equivalency:)/i)[0].trim()
        : null;

    const coreqsMatch = description.split("Corequisite:")[1];
    const parsedCoreqs = coreqsMatch 
        ? coreqsMatch.split(/(?=Prerequisite:|Equivalency:)/i)[0].trim()
        : null;

    const equivMatch = description.split("Equivalency:")[1];
    const parsedEquiv = equivMatch 
        ? equivMatch.split(/(?=Prerequisite:|Corequisite:)/i)[0].trim()
        : null;

    return [
        parsedDescription,
        parsedPrereqs,
        parsedCoreqs,
        parsedEquiv
    ];
}

export async function fetchUBCGrades(courseCode) {
    const codeArr = courseCode.split(" ");
    const subject = codeArr[0].split("_")[0];
    const campus = codeArr[0].split("_")[1];
    const number = codeArr[1];
    const url = `https://ubcgrades.com/api/v3/course-statistics/UBC${campus}/${subject}/${number}`;

    const avg5Years = await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            return data.average_past_5_yrs;

        }).catch(error => {
            console.error('Error: ', error);
            return null;
        });
        if (avg5Years == null) return null;
    
        return Math.round(avg5Years * 100)/100;
}

export function getUBCGradesURL(courseCode) {
    const codeArr = courseCode.split(" ");
    const subject = codeArr[0].split("_")[0];
    const campus = codeArr[0].split("_")[1];
    const number = codeArr[1];
    return `https://ubcgrades.com/statistics-by-course#UBC${campus}-${subject}-${number}`;
}

// sort terms in this order: W1, W2, S1, S2
// insertion sort because input size is small its fine
export function sortTerms(terms) {
    const termValueMap = {
        W1: 1,
        W2: 2,
        S1: 3,
        S2: 4
    }

    // slides terms[i] to correct position
    function slide(i) {
        const iVal = termValueMap[terms[i]];
        while (i > 0 && termValueMap[terms[i - 1]] > iVal) {
            const temp = terms[i];
            terms[i] = terms[i - 1];
            terms[i - 1] = temp;
            i--;
        }
    }

    for (let i = 1; i < terms.length; i++) {
        slide(i);
    }

    return terms;
}