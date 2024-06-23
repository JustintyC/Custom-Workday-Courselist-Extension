export function parseCourses(courses) {
    let tree = [];
    /*
                code
                /  \
              term  term
             /    \ 
          mode   mode
        /  |  \
      </> </> </>

    {
        code: ...
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
        // get course code, term, delivery mode (lecture, etc)
        const titleDiv = course.querySelector("div.WH1X.WP-X.WF5.WI2X.WG2X.WCVF.WOUF");
        const nameDiv = titleDiv.querySelector("div.gwt-Label.WLNO.WEMO");
        const title = nameDiv.textContent;
        const subject = title.split(" ")[0];
        const numbers = title.split(" ")[1].split("-")[0];
        const code = `${subject} ${numbers}`;

        const modeSpan = course.querySelector("span.gwt-InlineLabel.WPVF.WOUF");
        const modeText = modeSpan.textContent;
        const mode = modeText.split("|")[0].trim().replace(" ", "");

        let term;
        try {
            const detailsSpan = course.querySelector("span.WFQV.WBQV");
            const detailsText = detailsSpan.querySelector("div.gwt-Label.WLNO.WEMO").textContent;
            const range = detailsText.split("|").reverse()[0].trim();
            let startMonth = parseInt(range.substring(5, 7));
            if (1 <= startMonth && startMonth <= 4) term = "W2";
            else if (5 <= startMonth && startMonth <= 6) term = "S1";
            else if (7 <= startMonth && startMonth <= 8) term = "S2";
            else term = "W1";            
        } catch (error) {
            term = "unspecified";
        }

        // insert course into tree
        if (tree.length == 0 || tree[tree.length - 1]["code"] != code) {
            tree.push({ code: code });
        }
        let courseJson = tree[tree.length - 1];

        // term
        let termJson = courseJson[term] || (courseJson[term] = {});

        termJson[mode] ? termJson[mode].push(course) : termJson[mode] = [course];
    });

    console.log(JSON.stringify(tree));
    return tree;
}