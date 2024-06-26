### Reformats UBC Workday's course search list to one similar to UBC's old SSC layout.

## After:
![image](readme_images/workday_after.png)
![image](readme_images/expanded_course.png)

## Before:
![image](readme_images/workday_before.png)

# Installation
1. Download the code as a ZIP file
2. Unzip the file
3. Go to chrome://extensions/ and turn on developer mode on the top right hand corner
4. Click "Load unpacked" on the top left hand corner
5. Select the unzipped file from before

# Known issues
- Workday only renders 50 sections at once, and the extension can only see the sections Workday has rendered. If the table is incomplete, the user must scroll to the bottom of the page to force workday to fetch and render more sections.
- Multi-term courses are not displayed correctly since Workday does not properly indicate which courses span multiple terms without having to view course details.
- Some courses are placed under the "Unspecified" term. This is a result of Workday not providing course details in its original layout.