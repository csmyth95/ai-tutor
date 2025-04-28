# Backend ExpressJS Service
## Main Goals
### Summarise PDF
#### LLM Context
Using an open source LLM from huggingface, create an API route to summarise a PDF document and return the output in the API response. The API route will receive the
full PDF and a user ID. Secure the API route. The user must be logged in to be able to upload a PDF. Describe any limitations of taking a full PDF in an API. 
Do you recommend a better approach?
Store the full PDF in AWS S3 using an AWS S3 sdk. Ensure that the PDF is tied to a specific user ID and stored in a logical folder structure and a unique name for easy retrieval.
Store the summary in Postgres using the Sequelize package. Generate a unique ID for the document as a hash of the userID, the document PDF name. This ID should be stored in Postgres
but also be the same as what is used to store the document in AWS S3.

#### LLM Plan
Implementation Plan
* Authentication Middleware: Ensure that the user is logged in and authorized to upload PDFs.
* Receive and Parse PDF: The API accepts the PDF and a userID via a POST request.
* Store in AWS S3: Use the AWS S3 SDK to store the PDF securely in a user-specific folder structure.
* Summarize the PDF: Use HuggingFace's transformers library to summarize the content.
* Store Metadata in PostgreSQL: Store the summary and metadata, including the unique ID, user ID, and file path in AWS S3.
* Secure Access: Tie the data to a specific user and implement appropriate security measures.
