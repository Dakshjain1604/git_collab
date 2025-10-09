from fastapi import FastAPI,File ,UploadFile
from typing import Annotated
from app.parse import content_Parse,llama_docu_parsing
import asyncio
app=FastAPI()

def main():
    print("Hello from ai-backend!")

@app.get('/')
async def read_root():
    return {"message":"hello from py backend"}

@app.post("/files/")
async def create_file(file: Annotated[bytes, File()]):
    
    return {"file_size": len(file)}



@app.post('/uploadfile')
async def upload_file(file:UploadFile=File(...)): 
    file_location=f"Uploaded_files/{file.filename}"
    with open(file_location,"wb+")as file_object:
        file_object.write(await file.read())
        # content_Parse(file_location)
        await llama_docu_parsing(file_location)
        return {"info": f"file '{file.filename}' saved at '{file_location}'"}
    
    

if __name__ == "__main__":
    main()


