import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    }
})

const BUCKET = process.env.R2_BUCKET_NAME!

export async function putObject(key: string, body: Buffer, contentType: string) {
    await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }))
}

export async function getObject(key: string): Promise<Buffer> {
    const response = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))
    const bytes = await response.Body!.transformToByteArray()
    return Buffer.from(bytes)
}

export async function getObjectStream(
    key: string
): Promise<{ stream: ReadableStream<Uint8Array>; contentLength?: number; contentType?: string }> {
    const response = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))
    return {
        stream: response.Body!.transformToWebStream(),
        contentLength: response.ContentLength,
        contentType: response.ContentType
    }
}

export async function deleteObject(key: string) {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}
