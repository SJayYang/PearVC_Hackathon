from openai import OpenAI
from typing_extensions import override
from openai import AssistantEventHandler

OPENAI_API_KEY = "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"
client = OpenAI(api_key=OPENAI_API_KEY, default_headers={"OpenAI-Beta": "assistants=v2"})
 
assistant = client.beta.assistants.create(
  name="Financial Analyst Assistant",
  instructions="You are an expert philosopher. Use this knowledge to answer questions about the readings I give you.",
  model="gpt-3.5-turbo",
  tools=[{"type": "file_search"}],
)

# Create a vector store caled "Financial Statements"
vector_store = client.beta.vector_stores.create(name="Test Demo")
 
# Ready the files for upload to OpenAI 
file_paths = ["1996 Van Harvey on Barth's Romans.pdf"]
file_streams = [open(path, "rb") for path in file_paths]
 
# Use the upload and poll SDK helper to upload the files, add them to the vector store,
# and poll the status of the file batch for completion.
file_batch = client.beta.vector_stores.file_batches.upload_and_poll(
  vector_store_id=vector_store.id, files=file_streams
)
 
# You can print the status and the file counts of the batch to see the result of this operation. 
print(file_batch.status)
print(file_batch.file_counts)

assistant = client.beta.assistants.update(
  assistant_id=assistant.id,
  tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}},
)

# Upload the user provided file to OpenAI
message_file = client.files.create(
  file=open("1996 Van Harvey on Barth's Romans.pdf", "rb"), purpose="assistants"
)
 
# Create a thread and attach the file to the message
thread = client.beta.threads.create(
  messages=[
  ]
)
 
# The thread now has a vector store with that file in its tool resources.

new_message = client.beta.threads.messages.create(
    thread.id,
    role="user",
    content="Can you summarize the reading?",
    attachments=[{"file_id": message_file.id, "tools": [{"type": "file_search"}]}]
)

run = client.beta.threads.runs.create_and_poll(
    thread_id=thread.id, assistant_id=assistant.id
)

messages = list(client.beta.threads.messages.list(thread_id=thread.id, run_id=run.id))
message_content = messages[-1].content[0].text

print(message_content.value)

new_message = client.beta.threads.messages.create(
    thread.id,
    role="user",
    content="What was one problem with your previous summary?",
    attachments=[{"file_id": message_file.id, "tools": [{"type": "file_search"}]}]
)

run = client.beta.threads.runs.create_and_poll(
    thread_id=thread.id, assistant_id=assistant.id
)

messages = list(client.beta.threads.messages.list(thread_id=thread.id, run_id=run.id))
message_content = messages[-1].content[0].text

print(message_content.value)