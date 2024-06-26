// returns an array of jsons for each course
export function parseCourses(courses) {
    let out = [];
    /*
                code (& name)
                /  \
              term  term
             /    \ 
          mode   mode
        /  |  \
      </> </> </>

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

    Assumptions: workday's courselist is ordered
    */


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

        from section details:
        - days (e.g. Mon Wed Fri)
        - start & end time (e.g. 10:00 a.m. - 11:00 a.m.)
        - term from start & end date (e.g. 2024-09-03 - 2024-12-06 -> W1)

        from DOM:
        - url for the section

        */

        // title
        const titleDiv = course.querySelector("div.WH1X.WP-X.WF5.WI2X.WG2X.WCVF.WOUF");
        const nameDiv = titleDiv.querySelector("div.gwt-Label.WLNO.WEMO");
        const title = nameDiv.textContent;
        const subject = title.split(" ")[0];
        const numbers = title.split(" ")[1].split("-")[0];
        const courseCode = `${subject} ${numbers}`;             // course code
        const courseName = title.split(" - ")[1].trim();        // course name
        const sectionCode = title.split(" - ")[0].trim();       // section code

        // middle row
        // mode
        const modeSpan = course.querySelector("span.gwt-InlineLabel.WPVF.WOUF");
        const modeTextArr = modeSpan.textContent.split("|");
        const deliveryMode = modeTextArr[0].trim().replace(" ", "");            // delivery mode
        const sectionType = modeTextArr[1].trim();                              // section type
        const learningType = modeTextArr[2].replace("Learning", "").trim();     // learning type

        // section details
        let term;
        let days;
        let time;
        try {
            const detailsSpan = course.querySelector("span.WFQV.WBQV");
            const detailsTextArr = detailsSpan.querySelector("div.gwt-Label.WLNO.WEMO").textContent.split("|");
            days = detailsTextArr[1].trim();
            time = detailsTextArr[2].trim();
            
            /*
            term logic

            Check start and end dates. If start and end dates don't fall into the same term period,
            set term to [Start term] - [End term]. Else just the term it is in

            2025-01-06 - 2025-02-12
            */
            const range = detailsTextArr[3].trim();
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

        // URL
        const urlDiv = course.querySelector("div.WKNO.WEMO.WOMO");
        const dataAutomationId = urlDiv.getAttribute("data-automation-id");
        const daIdFirstHalf  = dataAutomationId.split("_")[1].split("$")[0];
        const daIdSecondHalf = dataAutomationId.split("_")[1].split("$")[1];
        const url = `https://wd10.myworkday.com/ubc/d/inst/1$${daIdFirstHalf}/${daIdFirstHalf}$${daIdSecondHalf}.htmld`;

        // construct course object
        const courseObj = {
            "courseCode": courseCode,
            "sectionCode": sectionCode,
            "courseName": courseName,
            "deliveryMode": deliveryMode,
            "sectionType": sectionType,
            "learningType": learningType,
            "term": term,
            "days": days,
            "time": time,
            "url": url            
        }


        // insert course into output
        if (out.length == 0 || out[out.length - 1]["code"] != courseCode) {
            out.push({ code: courseCode, name: courseName });
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