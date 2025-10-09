from PyPDF2 import PdfReader

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
