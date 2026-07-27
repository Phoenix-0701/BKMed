"""
Script tiện ích hỗ trợ Phương án 3 (AWS Bedrock Knowledge Bases + S3).
1. Tải toàn bộ tài liệu y khoa từ thư mục data/ lên AWS S3 Bucket.
2. (Tùy chọn) Kích hoạt tiến trình đồng bộ (Ingestion Job) trên AWS Bedrock Knowledge Base.
"""

import os
import glob
import boto3
from dotenv import load_dotenv

load_dotenv()

def sync_s3_and_bedrock(bucket_name: str, s3_prefix: str = "medical-data/"):
    aws_access_key = os.environ.get("AWS_ACCESS_KEY_ID")
    aws_secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY")
    aws_region = os.environ.get("AWS_DEFAULT_REGION", "us-east-1")
    
    if not aws_access_key or not aws_secret_key:
        print("❌ Lỗi: Chưa cấu hình AWS_ACCESS_KEY_ID và AWS_SECRET_ACCESS_KEY trong .env!")
        return

    print(f"🌍 Kết nối AWS S3 (Region: {aws_region})...")
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=aws_access_key,
        aws_secret_access_key=aws_secret_key,
        region_name=aws_region
    )

    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
    csv_files = glob.glob(os.path.join(data_dir, "*.csv")) + glob.glob(os.path.join(data_dir, "*.pdf"))

    if not csv_files:
        print(f"⚠️ Không tìm thấy file dữ liệu (.csv/.pdf) nào trong thư mục {data_dir}")
        return

    print(f"📤 Bắt đầu tải {len(csv_files)} tài liệu lên bucket '{bucket_name}' (Prefix: {s3_prefix})...")
    for file_path in csv_files:
        file_name = os.path.basename(file_path)
        s3_key = f"{s3_prefix}{file_name}"
        try:
            s3_client.upload_file(file_path, bucket_name, s3_key)
            print(f"   ✅ Đã tải lên: {file_name} -> s3://{bucket_name}/{s3_key}")
        except Exception as e:
            print(f"   ❌ Lỗi khi tải {file_name}: {str(e)}")

    print("\n🎉 Tải tài liệu lên S3 hoàn tất!")

    # Kiểm tra xem có cấu hình Bedrock KB để trigger Ingestion không
    kb_id = os.environ.get("BEDROCK_KNOWLEDGE_BASE_ID")
    ds_id = os.environ.get("BEDROCK_DATA_SOURCE_ID")
    if kb_id and ds_id:
        print(f"\n🔄 Đang kích hoạt đồng bộ (Ingestion Job) cho Bedrock Knowledge Base ({kb_id})...")
        try:
            bedrock_agent = boto3.client(
                "bedrock-agent",
                aws_access_key_id=aws_access_key,
                aws_secret_access_key=aws_secret_key,
                region_name=aws_region
            )
            res = bedrock_agent.start_ingestion_job(
                knowledgeBaseId=kb_id,
                dataSourceId=ds_id,
                description="Triggered from MedFlow sync_s3_and_bedrock script"
            )
            job_id = res["ingestionJob"]["ingestionJobId"]
            status = res["ingestionJob"]["status"]
            print(f"🚀 Kích hoạt đồng bộ thành công! Ingestion Job ID: {job_id} (Status: {status})")
        except Exception as e:
            print(f"⚠️ Không thể kích hoạt Bedrock Ingestion Job: {str(e)}")
    else:
        print("💡 Gợi ý: Thêm BEDROCK_KNOWLEDGE_BASE_ID và BEDROCK_DATA_SOURCE_ID vào .env để tự động đồng bộ sau khi upload.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Tải dữ liệu y khoa MedFlow lên AWS S3 và đồng bộ Bedrock.")
    parser.add_argument("--bucket", type=str, required=True, help="Tên AWS S3 Bucket của bạn")
    parser.add_argument("--prefix", type=str, default="medical-data/", help="Thư mục trên S3 (mặc định: medical-data/)")
    args = parser.parse_args()
    
    sync_s3_and_bedrock(args.bucket, args.prefix)
