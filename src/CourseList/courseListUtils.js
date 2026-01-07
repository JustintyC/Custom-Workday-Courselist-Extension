import { PARSEERRORSTRING } from "../utils";

// calls workday's api and returns advanced course info as a json
/**
 * 
 * @param {*} url 
 * @returns 
        status,
        startEndDate,
        grading,
        description,
        otherFormats,
        courseTags,
        availUnreserved,
        availReserved,
        meetingPatterns,
        instructors,
        reservedDist,
 */
export async function fetchMoreInfo(url) {
    const out = await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            let status = null;
            let startEndDate = null;
            let grading = null;
            let description = null;
            let otherFormats = null;
            let courseTags = null;
            let availUnreserved = null;
            let availReserved = null;
            let meetingPatterns = null;
            let instructors = null;
            let reservedDist = [];

            const generalInfo = data.body?.children?.[0]?.children?.[0]?.children;
            const additionalInfo = data.body?.children?.[0]?.children?.[1]?.children?.[0]?.children;
            const reservedDistArr = data.body?.children?.[1]?.sections?.[0]?.children?.[0]?.rows;

            for (let json of generalInfo) {
                switch(json.label) {
                    case "Description":
                        description = json.value?.replace(/<\/?[a-zA-Z]+>/g, "");
                        break;
                    case "Start/End Date":
                        startEndDate = json.value;
                        break;
                    case "Status":
                        status = json.instances?.[0]?.text;
                        break;
                    case "Unreserved Seats Available":
                        availUnreserved = json.value;
                        break;
                    case "Reserved Seats Available":
                        availReserved = json.value;
                        break;
                    case "Instructor Teaching":
                        const instructorsArr = json.instances;
                        if (instructorsArr) {
                            instructors = instructorsArr.map(i => i.text);
                        }
                        break;
                    default:
                        // Instructor is inside a nested panel
                        if (json.widget === "panel") {
                            const nested = json.children?.[0]?.instances;
                            if (nested) {
                                instructors = nested.map(inst => inst.text);
                            }
                        }
                        break;
                }
            }

            for (let json of additionalInfo || []) {
                switch (json.label) {
                    case "Grading Basis":
                        grading = json.instances?.map(g => g.text);
                        break;
                    case "Other Instructional Formats":
                        otherFormats = json.instances?.map(fmt => fmt.text);
                        break;
                    case "Meeting Patterns":
                        meetingPatterns = json.instances?.map(mp => mp.text);
                        break;
                    case "Course Tags":
                        courseTags = json.instances?.map(tag => tag.text);
                        break;
                    default:
                        break;
                }
            }

            if (reservedDistArr) {
                for (let i = 0; i < reservedDistArr.length - 1; i++) {
                    try {
                        const cellsMap = reservedDistArr[i].cellsMap;
                        const parsedText = `${cellsMap["203.2"].text} of ${cellsMap["203.3"].text} - ${cellsMap["203.1"].instances[0]["text"]}`;
                        reservedDist.push(parsedText);
                    } catch (error) {
                        console.error(error);
                        console.error(reservedDistArr);
                        reservedDist.push(PARSEERRORSTRING);
                    }
                }
            }

            return {
                status,
                startEndDate,
                grading,
                description,
                otherFormats,
                courseTags,
                availUnreserved,
                availReserved,
                meetingPatterns,
                instructors,
                reservedDist
            };
        });

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
    if (!courseCode) return null;
    const codeArr = courseCode.split(" ");
    const subject = codeArr[0].split("_")[0];
    const campus = codeArr[0].split("_")[1];
    const number = codeArr[1];
    const url = `https://ubcgrades.com/api/v3/course-statistics/UBC${campus}/${subject}/${number}`;

    const avg5Years = await fetch(url)
        .then(response => {
            if (!response.ok) {
                // throw new Error('Network response was not ok');
                console.error("UBCGrades response was not ok");
            }
            return response.json();
        }).then(data => {
            return data.average_past_5_yrs;

        }).catch(error => {
            // console.log('UBCGrades: ', error);
            return null;
        });
        if (avg5Years == null) return null;
    
        return Math.round(avg5Years * 100)/100;
}

export function getUBCGradesURL(courseCode) {
    if (!courseCode) return null;
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
        const iVal = termValueMap[terms[i].split("-")[0].trim()];
        while (i > 0 && termValueMap[terms[i - 1].split("-")[0].trim()] > iVal) {
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

// sort modes so that lecture is always at the front
export function sortModes(modes) {
    if (modes.length == 0) return modes;
    if (modes[0] === "Lecture") return modes;

    for (let i = 0; i < modes.length; i++) {
        if (modes[i] === "Lecture") {
            const temp = modes[i];
            modes[i] = modes[0];
            modes[0] = temp;
            break;
        }
    }
    return modes;
}