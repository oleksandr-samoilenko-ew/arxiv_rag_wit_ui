# Fullstack Rag with UI

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)]()
[![Maintaner](https://img.shields.io/static/v1?label=Oleksandr%20Samoilenko&message=Maintainer&color=red)](mailto:oleksandr.samoilenko@extrawest.com)
[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)]()
![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)
![GitHub release](https://img.shields.io/badge/release-v1.0.0-blue)


https://github.com/user-attachments/assets/6848aeac-587c-49bc-ae17-46f011bd0508


## About

Arxiv RAG (Retriever-Augmented Generation) is a sophisticated web application and API designed for generating notes and answering questions on Arxiv papers using advanced AI technologies. The application leverages Large Language Models (LLMs) to process and understand scientific papers, providing users with insightful summaries and answers to complex queries. The Unstructured API is utilized for parsing and chunking PDFs, allowing for efficient handling and analysis of large documents. Additionally, Supabase is employed to manage the PostgreSQL database, which is integral for storing document embeddings and performing efficient queries.

The primary aim of Fullstack RAG is to facilitate easier access to and understanding of scientific literature, empowering researchers, students, and enthusiasts to quickly glean important information from vast amounts of data.

## Features

-   **PDF Text Extraction and Analysis**: Utilizing the Unstructured API, Arxiv RAG can parse and chunk PDF documents into manageable pieces, enabling thorough analysis of scientific papers.
-   **Insight Generation with OpenAI**: The application leverages OpenAI's powerful language models to generate insightful summaries and responses. These models are fine-tuned to understand the context of scientific literature, providing accurate and meaningful insights.

-   **Data Management with Supabase**: Supabase, an open-source Firebase alternative, is used to manage the PostgreSQL database. This database stores the parsed document data, embeddings, and question-answer pairs, enabling efficient querying and retrieval of information.

-   **Embeddings and Document Matching**: Arxiv RAG uses embeddings to represent documents in a high-dimensional space, allowing for efficient similarity searches. This is crucial for retrieving relevant information based on user queries.

-   **Question Answering System**: The application includes a robust question-answering system that can handle complex queries about the content of Arxiv papers. By leveraging the stored embeddings and context from the documents, the system provides accurate and contextually relevant answers.

## Setup

### Prerequisites

-   Node.js
-   Yarn package manager
-   Supabase account
-   Unstructured API key

### Environment Configuration

Create a `.env.development.local` file in the `./api` directory with the following content:

```
UNSTRUCTURED_API_KEY=
OPENAI_API_KEY=
SUPABASE_PRIVATE_KEY=
SUPABASE_URL=
PORT=
UNSTRUCTURED_API_URL=
```

### Database Setup in Supabase

Execute the following SQL commands in your Supabase project to set up the required database structure:

```sql
-- Enable the pgvector extension
create extension vector;

-- Create tables for storing Arxiv papers, embeddings, and question answering data
CREATE TABLE arxiv_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  paper TEXT,
  arxiv_url TEXT,
  notes JSONB[],
  name TEXT
);

CREATE TABLE arxiv_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  content TEXT,
  embedding vector,
  metadata JSONB
);

CREATE TABLE arxiv_question_answering (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  question TEXT,
  answer TEXT,
  followup_questions TEXT[],
  context TEXT
);

-- Create a function for document matching
create function match_documents (
  query_embedding vector(1536),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id UUID,
  content text,
  metadata jsonb,
  embedding vector,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    embedding,
    1 - (arxiv_embeddings.embedding <=> query_embedding) as similarity
  from arxiv_embeddings
  where metadata @> filter
  order by arxiv_embeddings.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

### Supabase Type Generation

Add your project ID to the Supabase generate types script in package.json:

```json
{
    "gen:supabase:types": "touch ./src/generated.ts && supabase gen types typescript --schema public > ./src/generated.ts --project-id <YOUR_PROJECT_ID>"
}
```

## Running the Application

### Build the API Server

```shell
yarn build
```

### Start the API Server

```shell
yarn start:api
```

### Start the Web Server

```shell
yarn start:web
```
