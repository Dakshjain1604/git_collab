from fastapi import FastAPI,File ,UploadFile

from typing import Annotated

app=FastAPI()

def main():
    print("Hello from ai-backend!")


@app.get('/')
async def read_root():
    return {"message":"hello from py backend"}




if __name__ == "__main__":
    main()
