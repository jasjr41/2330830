const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJqYXNzdWpyNDFAZ21haWwuY29tIiwiZXhwIjoxNzgwNDc2ODQ5LCJpYXQiOjE3ODA0NzU5NDksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIyNjMzZmFkYy0wZDFiLTQwYjEtOTMwYi0yZWFkYTkxYjAyMzYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJqYXNraXJhdCBzaW5naCIsInN1YiI6ImM5MGYwN2EwLTEyNjYtNDQyMy1hYjliLWY1ZjEzYzhmYzBkNiJ9LCJlbWFpbCI6Imphc3N1anI0MUBnbWFpbC5jb20iLCJuYW1lIjoiamFza2lyYXQgc2luZ2giLCJyb2xsTm8iOiIyMzMwODMwIiwiYWNjZXNzQ29kZSI6Im53d3NLeCIsImNsaWVudElEIjoiYzkwZjA3YTAtMTI2Ni00NDIzLWFiOWItZjVmMTNjOGZjMGQ2IiwiY2xpZW50U2VjcmV0IjoiUUp3cFVZS3pHcGptYWhRSCJ9.rXsiCslerVVDCe2_Q38jAmAAyYrBNADUobfTR-z1OW8"; 

export async function Log(
  stack: string,
  level: string,
  pkg: string,
  message: string
): Promise<void> {
  try {
    const response = await fetch(
      "http://4.224.186.213/evaluation-service/logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          stack,
          level,
          package: pkg,
          message,
        }),
      }
    );
    const data = await response.json();
    console.log(`[${level.toUpperCase()}] [${pkg}] ${message}`, data);
  } catch (err) {
    console.error("Logging failed:", err);
  }
}