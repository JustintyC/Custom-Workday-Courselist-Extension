export const PARSEERRORSTRING = "An error occured while fetching this field."
export const SHORTERRORSTRING = "Error";

export const workdayDomComponents = {
    // "courseListContainer": 'div.WF-N.WJYN',
    "courseListContainerParent": 'div[role="region"][aria-label="Search Results"]',
    "courseListItem": 'li[data-automation-id="compositeContainer"]',
    "expandButton": 'div[role="button"][data-automation-id="expandAll"]',
    // "barAboveList": "span.WA-N.WD-N",
}

export function grabCourseListContainer() {
    const courseListContainerParent = document.querySelector(workdayDomComponents["courseListContainerParent"]);
    if (courseListContainerParent) {
        for (const child of courseListContainerParent.children) {
            if (child.firstChild && child.firstChild.tagName.toLowerCase() === "ul") {
                return child;
            }
        }    
    }

    return null;
}

export function grabBarAboveList() {
    const courseListContainerParent = document.querySelector(workdayDomComponents["courseListContainerParent"]);
    if (courseListContainerParent) return courseListContainerParent.firstChild;

    return null;
}