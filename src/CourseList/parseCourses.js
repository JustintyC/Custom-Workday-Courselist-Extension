// returns an array of jsons for each course
export function parseCourses(courses) {
    let out = [];
    /*
                code (& name & credits)
                /  \
              term  term
             /    \ 
          mode   mode
        /  |  \
      </> </> </>

    {
        code: ...
        name: ...
        credits: ...
        W1: {
            Lecture: [ ... ]
            Lab: [ ... ]        
        }
        W2: {
            Lecture: [ ... ]
            Lab: [ ... ]        
        }    
    }

    Assumptions: workday's courselist is ordered
    */

    // console.log(`parseCourses: courses.length = ${courses.length}`);
    courses.forEach((course) => {
        /*
        from each course HTML element, retrieve:

        from title:
        - course code (e.g. CPSC_V 100)
        - section code (e.g. CPSC_V 100-001)
        - course name (e.g. Introduction to toilet cleaning)

        from middle row:
        - delivery mode (e.g. lecture, lab)
        - section type (e.g. Open, Waitlist, etc)
        - learning type (e.g. in person, hybrid, etc)
        - credits
        - enrolled 
        - waitlist capacity (if available)

        from section details:
        - location (if available)
        - location url (if available)
        - days (e.g. Mon Wed Fri)
        - start & end time (e.g. 10:00 a.m. - 11:00 a.m.)
        - term from start & end date (e.g. 2024-09-03 - 2024-12-06 -> W1)

        from DOM:
        - url for the section
        - url for the api call for section details from workday

        */

        const promptOptions = course.querySelectorAll('div[data-automation-id="promptOption"]');

        // title
        const titleDiv = promptOptions[0];
        const title = titleDiv.textContent;
        const subject = title.split(" ")[0];
        const numbers = title.split(" ")[1].split("-")[0];
        const courseCode = `${subject} ${numbers}`;             // course code
        const courseName = title.split(" - ")[1].trim();        // course name
        const sectionCode = title.split(" - ")[0].trim();       // section code

        // middle row
        // mode
        const modeSpan = course.querySelector('span[data-automation-id="compositeSubHeaderOne"]');;
        const modeTextArr = modeSpan.textContent.split("|");
        const deliveryMode = modeTextArr[0].trim();                             // delivery mode
        const sectionType = modeTextArr[1].trim();                              // section type
        const learningType = modeTextArr[2].replace("Learning", "").trim();     // learning type
        const credits = modeTextArr[3].trim();                                  // credits
        const enrolled = modeTextArr[4].replace(" Enrolled/Capacity:", "").trim();
        let waitlist;
        try {
            waitlist = modeSpan.textContent.split("Waitlisted/Waitlist Capacity:")[1].trim();
        } catch (error) {
            waitlist = null;
        };
        
        


        // section details
        let location = null;
        let locationURL = null;
        let term;
        let days;
        let time;
        try {
            // section details text: [location] | [days] | [time] | [date range]
            // location may or may not be present            
            
            const detailsTextArr = promptOptions[1].textContent.split("|");
            if (detailsTextArr.length == 4) { // location present
                const fullLocation = detailsTextArr[0];
                location = `${fullLocation.split("-")[0]} ${fullLocation.split(" ")[2]}`;
                const locationArr = location.split(" ");
                locationURL = `https://learningspaces.ubc.ca/classrooms/${locationArr[0]}-${locationArr[1]}`;
            }
            days = detailsTextArr[detailsTextArr.length - 3].trim();
            time = detailsTextArr[detailsTextArr.length - 2].trim();
            
            /*
            term logic

            Check start and end dates. If start and end dates don't fall into the same term period,
            set term to [Start term] - [End term]. Else just the term it is in

            2025-01-06 - 2025-02-12
            */
            const range = detailsTextArr[detailsTextArr.length - 1].trim();
            function getTerm(month) {
                if (1 <= month && month <= 4) return "W2";
                if (5 <= month && month <= 6) return "S1";
                if (7 <= month && month <= 8) return "S2";
                return "W1";
            }
            
            let startMonth = parseInt(range.substring(5, 7));
            let startTerm = getTerm(startMonth);
            
            let endMonth = parseInt(range.substring(18, 20));
            let endTerm = getTerm(endMonth);

            if (startTerm !== endTerm) {
                term = `${startTerm} - ${endTerm}`;
            } else term = startTerm;
        } catch (error) {
            // section details is empty
            term = "Unspecified";
            days = "";
            time = "";
        }

        // URLs
        const urlDiv = promptOptions[0].parentElement;
        const dataAutomationId = urlDiv.getAttribute("data-automation-id");
        const daIdFirstHalf  = dataAutomationId.split("_")[1].split("$")[0];
        const daIdSecondHalf = dataAutomationId.split("_")[1].split("$")[1];
        const url = `https://wd10.myworkday.com/ubc/d/inst/1$${daIdFirstHalf}/${daIdFirstHalf}$${daIdSecondHalf}.htmld`;
        const apiCallUrl = `https://wd10.myworkday.com/ubc/inst/1$${daIdFirstHalf}/${daIdFirstHalf}$${daIdSecondHalf}.htmld`;
        
        // construct course object
        const courseObj = {
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


        // insert course into output
        if (out.length == 0 || out[out.length - 1]["code"] != courseCode) {
            out.push({ code: courseCode, name: courseName, credits: credits});
        }
        let courseJson = out[out.length - 1];

        // term
        let termJson = courseJson[term] || (courseJson[term] = {});

        // course obj
        termJson[deliveryMode] ? termJson[deliveryMode].push(courseObj) : termJson[deliveryMode] = [courseObj];
    });

    // console.log(JSON.stringify(out));
    return out;
}