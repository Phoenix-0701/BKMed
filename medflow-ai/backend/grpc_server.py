import os
# os.environ['HF_ENDPOINT'] = 'https://hf-mirror.com'
import sys
import asyncio
import grpc
import socket

# CỰC KỲ QUAN TRỌNG: Vá lỗi IPv6 bị chặn (blackholed) trên Render khiến httpx bị treo (hang)
# Ép toàn bộ Python socket chỉ phân giải và kết nối qua IPv4 (AF_INET)
orig_getaddrinfo = socket.getaddrinfo
def getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = getaddrinfo_ipv4

# Force UTF-8 output and ensure it doesn't get fully buffered
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

from dotenv import load_dotenv
load_dotenv()
import psycopg

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import backend.grpc_protos.chat_pb2 as chat_pb2
import backend.grpc_protos.chat_pb2_grpc as chat_pb2_grpc

import logging

# Setup CloudWatch Logger
logger = logging.getLogger("ViMQ")
logger.setLevel(logging.INFO)

if os.environ.get("AWS_ACCESS_KEY_ID"):
    try:
        import watchtower
        import boto3
        boto3_session = boto3.Session(
            aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
            region_name=os.environ.get("AWS_DEFAULT_REGION", "us-east-1")
        )
        cw_handler = watchtower.CloudWatchLogHandler(
            boto3_client=boto3_session.client("logs"),
            log_group_name="med-chatbot",
            log_stream_name="gRPC-Server"
        )
        logger.addHandler(cw_handler)
    except ImportError:
        logger.warning("AWS credentials configured but watchtower/boto3 not installed. Defaulting to console logging.")
        logger.addHandler(logging.StreamHandler())
else:
    logger.addHandler(logging.StreamHandler())

# --- TẠM THỜI VÔ HIỆU HÓA LANGCHAIN ĐỂ TIẾT KIỆM RAM TRÊN RENDER ---
# from langchain_openai import ChatOpenAI
# from langchain.chains import create_retrieval_chain, create_history_aware_retriever
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain_core.runnables.history import RunnableWithMessageHistory
# from langchain_postgres import PostgresChatMessageHistory
#
# from langchain_aws import AmazonKnowledgeBasesRetriever
# from langchain.retrievers.contextual_compression import ContextualCompressionRetriever
# from langchain_cohere import CohereRerank
# from langfuse.langchain import CallbackHandler
#
# from backend.helper import get_openai_embeddings
# from backend.prompt import (
#     contextualize_q_prompt, 
#     router_prompt, 
#     treatment_prompt, 
#     cause_prompt, 
#     severity_prompt, 
#     diagnosis_prompt, 
#     other_prompt,
#     booking_prompt
# )

import google.generativeai as genai

load_dotenv()

# --- FIX LỖI EVENT LOOP TRÊN WINDOWS ---
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# async def build_rag_chain():
#     """Hàm khởi tạo toàn bộ bộ não AI và kết nối Database"""
#     ... (đã bị vô hiệu hóa để giải phóng RAM)
#     return conversational_rag_chain, chat_model


class LangGraphServicer(chat_pb2_grpc.LangGraphServiceServicer):
    def __init__(self):
        gemini_api_key = os.environ.get("GEMINI_API_KEY")
        if gemini_api_key:
            genai.configure(api_key=gemini_api_key)
            self.model = genai.GenerativeModel(
                'gemini-1.5-flash',
                system_instruction="Bạn là trợ lý y tế ảo của phòng khám BKMed. Hãy trả lời ngắn gọn, súc tích, chính xác và có tính chuyên môn y khoa. Trả lời bằng tiếng Việt."
            )
        else:
            self.model = None

    async def StreamChat(self, request, context):
        """Nhận request từ FastAPI và stream từng token trả về qua Gemini"""
        session_id = request.session_id
        user_message = request.message
        logger.info(f"Nhận luồng chat mới - Session: {session_id}")

        if not self.model:
            yield chat_pb2.ChatChunk(token="[Lỗi: Chưa cấu hình GEMINI_API_KEY. Vui lòng thêm GEMINI_API_KEY vào biến môi trường.]")
            return

        try:
            logger.info("Đang gọi Google Gemini API...")
            response = await self.model.generate_content_async(user_message, stream=True)
            async for chunk in response:
                if chunk.text:
                    yield chat_pb2.ChatChunk(token=chunk.text)
        except Exception as e:
            logger.error(f"Lỗi trong quá trình tạo stream chat Gemini: {e}", exc_info=True)
            yield chat_pb2.ChatChunk(token="\n\n[Lỗi hệ thống AI: Không thể tạo phản hồi. Vui lòng thử lại sau]")

async def serve():
    logger.info("Đang khởi tạo gRPC Server (Chế độ Bypass chạy Gemini API)...")
    
    server = grpc.aio.server()
    chat_pb2_grpc.add_LangGraphServiceServicer_to_server(LangGraphServicer(), server)
    
    if sys.platform == 'win32':
        server.add_insecure_port('127.0.0.1:50051')
        logger.info("gRPC LangGraph Server đang chạy tại port 50051 (TCP)...")
    else:
        socket_path = '/tmp/grpc_medflow.sock'
        if os.path.exists(socket_path):
            os.remove(socket_path)
        server.add_insecure_port(f'unix://{socket_path}')
        logger.info(f"gRPC LangGraph Server đang chạy tại {socket_path} (Unix Socket)...")
        
    await server.start()
    await server.wait_for_termination()

if __name__ == '__main__':
    # Fix cho Windows asyncio bug (chỉ có tác dụng nếu chạy trên win)
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
    if sys.stdout.encoding != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)
        
    try:
        asyncio.run(serve())
    except Exception as e:
        logger.error(f"LỖI CRASH TOÀN SERVER: {e}", exc_info=True)
        sys.exit(1)