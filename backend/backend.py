from openai import OpenAI
from typing_extensions import override
import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel 

app = FastAPI()

app.add_middleware( #Initialize middleware connections
   CORSMiddleware,
   allow_origins=["*"],
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY, default_headers={"OpenAI-Beta": "assistants=v2"})

class JobDescription(BaseModel):
    job_description: str

@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

    try:
        return JSONResponse(status_code=200, content={"message": "PDF processed successfully."})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Error processing the file", "details": str(e)})
    finally:
        await file.close()

@app.post("/api/create-assistant")
async def create_assistant(job_description: JobDescription):
    assistant = client.beta.assistants.create(
        name="Interview Assistant",
        instructions="You are interviewing me for a job with the following job description: " + job_description.job_description,
        model="gpt-3.5-turbo",
        tools=[{"type": "file_search"}],
    )

    vector_store = client.beta.vector_stores.create(name="Resume")

    assistant = client.beta.assistants.update(
        assistant_id=assistant.id,
        tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}},
    )

    thread = client.beta.threads.create(
        messages=[]
    )

    return assistant, thread

'''
def create_assistant(job_description, resume_path):
    assistant = client.beta.assistants.create(
        name="Interview Assistant",
        instructions="You are interviewing me for a job with the following job description: " + job_description,
        model="gpt-3.5-turbo",
        tools=[{"type": "file_search"}],
    )

    vector_store = client.beta.vector_stores.create(name="Resume")
    file_paths = [resume_path]
    file_streams = [open(path, "rb") for path in file_paths]

    file_batch = client.beta.vector_stores.file_batches.upload_and_poll(
        vector_store_id=vector_store.id, files=file_streams
    )   

    print(file_batch.status)
    print(file_batch.file_counts)

    assistant = client.beta.assistants.update(
        assistant_id=assistant.id,
        tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}},
    )

    message_file = client.files.create(
        file=open(resume_path, "rb"), purpose="assistants"
    )   

    thread = client.beta.threads.create(
        messages=[]
    )

    return assistant, message_file, thread
'''

def get_response(user_message, thread, message_file, assistant):
    new_message = client.beta.threads.messages.create(
        thread.id,
        role="user",
        content=user_message + ". Given this response, as an interviewer, how would you respond and what is a follow-up question you would ask? Please just state a response to the interviewee's statement, the question, and nothing else.",
        attachments=[{"file_id": message_file.id, "tools": [{"type": "file_search"}]}]
    )

    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id, assistant_id=assistant.id
    )

    messages = list(client.beta.threads.messages.list(thread_id=thread.id, run_id=run.id))
    message_content = messages[-1].content[0].text      
    response = message_content.value
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)