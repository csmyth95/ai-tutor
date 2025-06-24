# MuinteoirAI Frontend Context
## App Pages
### Landing Page
When a user enters the site, they should be presented with a beautiful landing page. The user should see the title of the app, a short & descriptive one liner of 
what MuinteoirAI is followed by a more descriptive parapgraph of the features, a centred button to allow a user to register or to login to their account. This page 
needs to be simple, to the point and easily digestible. 

A navigation bar should have tabs to login & register for now.

### Registration
A simple page which asks the user to input minimum details required to create a page. All these user forms should be centered. The details: email, password, first name, last name. 
After inputting their details, the user should be sent an email with a 1 time verification code & if the code is successfully entered, they should be presented with a login page.
While there is no backend data, return a default user and move on to the login page.
Ensure simple verification for emails and passwords. Ensure passwords are at least 12 characters in length.

### Login
The user should be presented with the app logo and a short form to enter their email and password and a rounded button to login to the web app.
If a user forgets their password, they should be able to click a button to reset their password using their email.
Once the user logs in successfully, send them to the Summaries page.

### Summary Page
Only logged in users can reach the Summary page. The user should be presented with a search bar at the top of the page to allow for searching their PDFs, each PDF ranked from most recently uploaded to oldest. A button should be available for each PDF to create a quiz for it, along side a button to allow for deleting the summary. 

For users with no summaries, display a button to upload their first summary.

The user should be able to click on a PDF to view the summary of it fully. I should be able to display the PDF document in a modal. The modal should be responsive and allow the user to scroll through the document. The modal should also have a close button to exit the modal view. Only the first two lines of the summary should be displayed at first. A button that says show more should extend the summary panel to full length. The summary should be displayed in a simple, readable format with the title of the PDF at the top, followed by the summary text.

The user should be able to click a button to create a quiz for the PDF. 

A button should be available to delete the PDF summary. The delete button should be a simple icon button that is easy to find and use. The user should be able to click on the delete button and a confirmation modal should appear asking if they are sure they want to delete the summary. If the user confirms, the summary should be deleted and the user should be redirected back to the summaries page. When the delete button is called, send an async message to the backend document API to trigger the delete. Once the deletion is complete, drop the summary from the list of summaries and send a pop up notification to the frontend display to show the user the summary has been successfully deleted.

### Quiz Question
Create a page for a generic Quiz page including a progress bar, current question number, the question itself and a form for the user to answer the question.

## App Flow
User Flow:
Landing Page -> [Registration or Login] -> User Summary Page -> [Quiz] -> Summary Page

## UI Design
### Page Design
All pages should be simple, centered and reactive to the size of the user's UI so
whether the user is on mobile or web, the UI will resize to the frame.

### Colour Scheme
Light Green, sand & white.

## Further Improvements
### Admin Dashboard
A simple dashboard (visible only to Admin users) to show KPIs of the app including number of registered users, number of documents uploaded, summarisation success rate, number of quizzes created and over time more information to inform the enhancement of the app.

## Cursor Prompt WIP
For each of the sub headings under App Pages, build the pages using nextjs (reusable, react components) and tailwind CSS under the frontend/ai-tutor/src/app/pages folder. Use the context.md file as your guide. Take each page step by step & ask for verification from me as to whether you are on the right track
