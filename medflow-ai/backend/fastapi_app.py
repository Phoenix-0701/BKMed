# fastapi_app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import grpc
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import backend.grpc_protos.chat_pb2 as chat_pb2
import backend.grpc_protos.chat_pb2_grpc as chat_pb2_grpc

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def grpc_stream_generator(session_id: str, message: str):
    """Mở luồng gRPC và yield dữ liệu chuẩn SSE, có bắt lỗi"""
    try:
        grpc_host = os.environ.get("GRPC_HOST", "localhost")
        async with grpc.aio.insecure_channel(f'{grpc_host}:50051') as channel:
            stub = chat_pb2_grpc.LangGraphServiceStub(channel)
            request = chat_pb2.ChatRequest(session_id=session_id, message=message)
            
            import json
            async for chunk in stub.StreamChat(request):
                encoded_token = json.dumps(chunk.token)
                yield f"data: {encoded_token}\n\n"
    
    except Exception as e:
        # IN LỖI RA TERMINAL 2 ĐỂ BẠN BIẾT ĐƯỜNG DEBUG
        print(f"LỖI KẾT NỐI gRPC: {e}") 
        # Bắn lỗi lên màn hình Chainlit cho user thấy
        yield f"data: [Lỗi hệ thống Backend: Không thể xử lý yêu cầu]\n\n"
            
@app.get("/api/chat")
async def chat_endpoint(session_id: str, message: str):
    # Trả về StreamingResponse thay vì JSON thông thường
    return StreamingResponse(
        grpc_stream_generator(session_id, message), 
        media_type="text/event-stream"
    )

# Chạy server bằng lệnh: uvicorn fastapi_app:app --port 8000

from pydantic import BaseModel
class TriageRequest(BaseModel):
    session_id: str

@app.post("/api/triage/generate")
async def generate_triage(req: TriageRequest):
    import psycopg
    from psycopg.rows import dict_row
    from langchain_openai import ChatOpenAI
    from langchain_core.prompts import ChatPromptTemplate
    import json
    
    DB_URI = os.environ.get('DB_URI')
    try:
        async with await psycopg.AsyncConnection.connect(DB_URI, autocommit=True) as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute("SELECT message FROM chat_history WHERE session_id = %s ORDER BY id ASC", (req.session_id,))
                rows = await cur.fetchall()
                if not rows:
                    return {"symptomsSummary": "Không có lịch sử", "severity": "GREEN", "recommendedSpecialty": "N/A", "aiReport": "Bệnh nhân không chia sẻ triệu chứng."}
                
                chat_text = "\n".join([row["message"] for row in rows])
                
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Dựa vào lịch sử chat sau của bệnh nhân, hãy tạo một báo cáo tóm tắt y khoa (AI Report). Trả về ĐÚNG chuẩn JSON với các key sau (Không thêm markup ```json):\n"
                       "- symptomsSummary: tóm tắt triệu chứng (1-2 câu)\n"
                       "- severity: đánh giá mức độ khẩn cấp (CHỈ ĐƯỢC CHỌN 1 TRONG 3: GREEN, YELLOW, RED)\n"
                       "- recommendedSpecialty: chuyên khoa đề xuất (nếu có)\n"
                       "- aiReport: báo cáo chuyên môn chi tiết dành cho bác sĩ khám (tầm 3-4 câu)"),
            ("human", "Lịch sử chat:\n{chat_text}\n\nJSON Output:")
        ])
        chain = prompt | llm
        result = await chain.ainvoke({"chat_text": chat_text})
        
        content = result.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        data = json.loads(content)
        return data
        
    except Exception as e:
        print(f"LỖI TRIAGE: {e}")
        return {"symptomsSummary": "Lỗi", "severity": "GREEN", "recommendedSpecialty": "N/A", "aiReport": str(e)}