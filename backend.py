from openai import OpenAI
from typing_extensions import override

OPENAI_API_KEY = "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"
client = OpenAI(api_key=OPENAI_API_KEY, default_headers={"OpenAI-Beta": "assistants=v2"})

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

