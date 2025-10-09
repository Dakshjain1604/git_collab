from PyPDF2 import PdfReader
from dotenv import load_dotenv
from llama_cloud_services import LlamaParse
load_dotenv()
import os


def content_Parse(file):
    # decoded_content=contents.decode('utf-8')
    reader=PdfReader(file)
    number_of_pages=len(reader.pages)
    page=reader.pages[0]
    text=page.extract_text()
    print(text)
    file_path = "my_data.txt"
    with open(file_path, 'w') as file:
        file.write(text)



api_key=os.getenv("LLAMA_CLOUD_API_KEY")
parser=LlamaParse(
    api_key=api_key,
    num_workers=4,
    verbose=True,
    language="en",
)



async def llama_docu_parsing(file_location):
    try:
        result = await parser.aparse(file_location)
        docs = result.get_text_documents(split_by_page=False)
        # if docs is a list, join text
        if isinstance(docs, list):
            text = "\n".join([d.text if hasattr(d, "text") else str(d) for d in docs])
        else:
            text = str(docs)
        file_path = "my_data3.txt"
        with open(file_path, 'w') as file:
            file.write(text)
        print(f"File written to {file_path}")
    except Exception as e:
        print(f"pasing failed :{e}")

        

