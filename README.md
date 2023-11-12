# Movie Whisperer
### 🎬 Get movie recommendations based in a prompt 🎬

![Image](static/movie-whisperer.jpg)

### How it works
Movie Whisperer uses **SvelteKit, Langchain, PGVector** and **Transformers** to build a **movies database** that can be **queried using vector similarity search**.

⚠ Movies from TMDB's API **must** be preprocessed using a text embeddings model and inserted into the database ⚠

### Demo 
**Feel free** to use this [test server](https://movies.puntaserver.com) to do your searches but please, **be responsible**, **do not flood it with requests** since the **text embeddings model used** for retrieval **can be quite power hungry**.

### How to run it locally

#### Put your **TMDB API key** and **DB connection** string in a **.env** file

```
DATABASE_URL="postgresql://user:password@localhost:5432/movie-whisperer?schema=public"
APP_SECRET_KEY="example"
TMDB_API_KEY="yourapikeyhere"
```

#### Install dependencies

```bash
npm install
```

#### Apply migrations to your database

```bash
npx prisma migrate dev
```

#### Run the app

```bash
npm run dev
```

### Run using docker compose

You can **run the app using my docker image** used in the **docker-compose.prod.yml** file. It is very important to **put your TMDB API key in the docker compose file**.

### Feed the movies database

Use the `POST /api/auth/register` and `POST /api/auth/login` to **create an admin account** (only the **first account** created **has the admin role**)

Use the `POST /api/process` endpoint to **start processing movies**, then you can use the `GET /api/process/status` to **check the remaining movies** to be processed.