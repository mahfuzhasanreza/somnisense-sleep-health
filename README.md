can start the server locally in the ml-service directory using the virtual environment:

cd ml-service
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8000 --reload