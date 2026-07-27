# MedFlow AI Module 🏥🤖

An intelligent, cloud-native medical triage and clinical decision support microservice designed for the **MedFlow** healthcare ecosystem. Powered by **AWS Bedrock Knowledge Bases** and high-performance **gRPC streaming**, this module delivers real-time symptom analysis, severity classification, and department triage for patients and healthcare providers.

---

## ✨ Key Features

- **24/7 AI Medical Triage Assistant**: Analyzes patient symptoms in real-time, providing structured guidance on preliminary first-aid, possible causes, emergency severity warnings, and initial department routing (e.g., Cardiology, Neurology, Endocrinology).
- **Managed RAG Engine via AWS Bedrock**: Leverages **Amazon Bedrock Knowledge Bases** with hybrid retrieval over extensive medical datasets hosted on **Amazon S3**. Eliminates local vector database overhead and ensures highly relevant, medically grounded responses.
- **Vietnamese Medical Question Answering (ViMQ)**: Tailored specifically for Vietnamese clinical terminology and healthcare contexts using fine-tuned embedding models and specialized system prompts.
- **High-Performance gRPC Microservice**: Built with Protocol Buffers (`triage.proto`) and gRPC running on port `50051` for low-latency, bi-directional streaming communication with the Next.js frontend and Node.js backend services.
- **Automated Data Ingestion**: Built-in pipeline scripts to automatically sync local medical datasets to S3 and trigger Bedrock Knowledge Base ingestion jobs via `boto3`.

---

## 🛠️ Technology Stack

- **Language**: Python 3.10+
- **RPC Framework**: gRPC (`grpcio`, `grpcio-tools`, `protobuf`)
- **AI & RAG Orchestration**: `langchain`, `langchain-aws`, `langchain-community`
- **Cloud Infrastructure**: AWS Bedrock Knowledge Bases, Amazon S3, AWS IAM (`boto3`)
- **Machine Learning & NLP**: `torch`, `transformers`, `sentence-transformers`, `faiss-cpu`

---

## 📁 Directory Structure

```text
medflow-ai/
├── backend/
│   └── grpc_server.py           # Core gRPC server handling triage requests & RAG execution
├── src/
│   ├── triage_pb2.py            # Generated gRPC message classes from protobuf
│   ├── triage_pb2_grpc.py       # Generated gRPC client/server stubs from protobuf
│   ├── helper.py                # Embedding initializers and utilities
│   ├── prompt.py                # Structured medical triage system prompts & templates
│   └── upload_to_s3_bedrock.py  # Automation script to sync datasets to S3 and trigger KB ingestion
├── ViMQ_Model/                  # Local model weights and configurations for Vietnamese Medical Q&A
├── .env                         # Environment variables and AWS configuration (git-ignored)
└── requirements.txt             # Python dependencies
```

> [!NOTE]  
> **Data Repository Policy**: Raw medical CSV/JSON datasets (e.g., `CancerQA.csv`, `MedicalQuestionAnswering.csv`) are stored in Amazon S3 and indexed directly by AWS Bedrock Knowledge Base. They are excluded from this Git repository to maintain a lightweight codebase.

---

## 🚀 Getting Started

### 1. Prerequisites

- Python 3.10 or higher installed.
- An AWS Account with enabled access to Amazon Bedrock (Titan Embeddings / Claude models) and an S3 bucket.
- A configured Bedrock Knowledge Base and Data Source.

### 2. Environment Configuration

Create a `.env` file inside the `medflow-ai/` directory with the following variables:

```env
# AWS Credentials & Region
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_DEFAULT_REGION=us-east-1

# AWS Bedrock Knowledge Base Configuration
BEDROCK_KNOWLEDGE_BASE_ID=your_knowledge_base_id
BEDROCK_DATA_SOURCE_ID=your_data_source_id
S3_BUCKET_NAME=your_s3_bucket_name

# Optional API Keys for Fallback / LLM Generation
OPENAI_API_KEY=your_openai_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Installation & Local Running

#### Option A: One-Click Start (Windows)
From the root directory of the MedFlow repository, run the automation script:
```cmd
.\start_ai.bat
```
*This script automatically creates a virtual environment (`venv`), installs dependencies from `requirements.txt`, and launches the gRPC server.*

#### Option B: Manual Setup
1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the gRPC server:
   ```bash
   python backend/grpc_server.py
   ```
The server will start listening for incoming RPC connections on port `50051`.

---

## 🔄 Data Ingestion & KB Sync

If you have new medical datasets to index into the RAG engine:
1. Place your `.csv` or `.json` files in a local folder (e.g., `data/`).
2. Run the ingestion automation script:
   ```bash
   python src/upload_to_s3_bedrock.py
   ```
This script will automatically upload the files to your target S3 bucket and trigger an asynchronous **StartIngestionJob** on AWS Bedrock to synchronize your vector embeddings.

---

## 📄 License

This module is part of the MedFlow healthcare platform and is intended for educational and clinical decision-support research purposes. Always consult a licensed healthcare professional for official medical diagnoses and emergencies.
