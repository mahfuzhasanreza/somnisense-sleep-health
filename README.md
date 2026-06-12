1. Start the server locally in the ml-service directory using the virtual environment:

cd ml-service
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8000 --reload


2. Start the Express backend (from server directory):
cd server
npm start
Or alternatively: node index.js

3. Next.js Frontend: (port 3000)
cd client
npm run dev

Demo:
mahfuz@gmail.com
mahfuz@gmail.com